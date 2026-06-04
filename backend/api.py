"""
api.py  ←  main entry point (FastAPI server)

Starts a lightweight REST API that the React frontend calls.
The single POST /api/run endpoint wires together:
  config  →  payload_generator  →  docker_runner

Run with:
    uvicorn api:app --host 0.0.0.0 --port 8000 --reload

or via the CLI helper at the bottom:
    python api.py
"""

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl, field_validator

import config
from payload_generator import (
    generate_shell_script,
    get_default_ci_yml,
    get_default_test_content,
)
from docker_runner import run_in_container


# ─── App setup ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="CI Injector API",
    description="Clones a GitHub repo, injects Playwright tests + Actions YAML, and pushes — all inside Docker.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request / Response schemas ───────────────────────────────────────────────

class RunRequest(BaseModel):
    repo_url: str
    access_token: str
    branch: str = "main"

    # Optional overrides — if omitted the defaults from payload_generator are used
    ci_yml: str | None = None
    test_content: str | None = None

    @field_validator("repo_url")
    @classmethod
    def must_be_github(cls, v: str) -> str:
        if not v.startswith("https://github.com/"):
            raise ValueError("repo_url must start with https://github.com/")
        return v.strip()

    @field_validator("access_token")
    @classmethod
    def token_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("access_token must not be empty")
        return v.strip()


class RunResponse(BaseModel):
    success: bool
    logs: str
    message: str


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    """Simple liveness probe."""
    return {"status": "ok"}


@app.post("/api/run", response_model=RunResponse)
def run_workflow(payload: RunRequest):
    """
    Main endpoint.  Accepts repo info + optional YAML / test overrides,
    builds the container script, and runs it via Docker.

    The frontend POSTs JSON:
    {
        "repo_url":      "https://github.com/owner/repo",
        "access_token":  "ghp_...",
        "branch":        "main",             // optional
        "ci_yml":        "name: CI ...",     // optional
        "test_content":  "import { test }…"  // optional (from .txt upload)
    }
    """
    ci_yml = payload.ci_yml or get_default_ci_yml()
    test_content = payload.test_content or get_default_test_content()

    shell_script = generate_shell_script(
        repo_url=payload.repo_url,
        branch=payload.branch,
        container_clone_dir=config.CONTAINER_CLONE_DIR,
        ci_yml_content=ci_yml,
        test_content=test_content,
    )

    try:
        logs = run_in_container(
            shell_script=shell_script,
            access_token=payload.access_token,
            image=config.DOCKER_IMAGE,
            timeout=config.CONTAINER_TIMEOUT,
            stream_to_stdout=True,   # also prints live logs to server console
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {exc}") from exc

    return RunResponse(
        success=True,
        logs=logs,
        message="Workflow injected and pushed successfully.",
    )


# ─── CLI entry-point ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=False,
    )
