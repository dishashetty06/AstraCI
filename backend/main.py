"""
main.py  ←  CLI entry point (no HTTP server)

Use this when you want to run the workflow directly from the terminal
without spinning up the FastAPI server.

    python main.py

All settings are read from environment variables (or .env file).
"""

import config
from payload_generator import (
    generate_shell_script,
    get_default_ci_yml,
    get_default_test_content,
)
from docker_runner import run_in_container


def main() -> None:
    # Fail fast if required env vars are missing
    config.validate_required()

    print(f"[main] Repo  : {config.REPO_URL}")
    print(f"[main] Branch: {config.BRANCH}")
    print(f"[main] Image : {config.DOCKER_IMAGE}\n")

    shell_script = generate_shell_script(
        repo_url=config.REPO_URL,
        branch=config.BRANCH,
        container_clone_dir=config.CONTAINER_CLONE_DIR,
        ci_yml_content=get_default_ci_yml(),
        test_content=get_default_test_content(),
    )

    logs = run_in_container(
        shell_script=shell_script,
        access_token=config.GIT_TOKEN,
        image=config.DOCKER_IMAGE,
        timeout=config.CONTAINER_TIMEOUT,
        stream_to_stdout=True,
    )

    print("\n=== CONTAINER LOGS ===")
    print(logs)
    print("[main] Done.")


if __name__ == "__main__":
    main()
