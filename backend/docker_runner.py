"""
docker_runner.py

Handles all Docker SDK interaction:
  - Pulling / reusing the container image
  - Creating, starting, streaming, and removing the container
  - Returning the full log output or raising on non-zero exit

No bash logic lives here; the script is received as a plain string argument
from payload_generator.generate_shell_script().
"""

import time
import docker
from docker.models.containers import Container


# ─── Public API ──────────────────────────────────────────────────────────────

def run_in_container(
    shell_script: str,
    access_token: str,
    image: str = "alpine/git:latest",
    timeout: int = 300,
    stream_to_stdout: bool = True,
) -> str:
    """
    Spin up a Docker container, execute *shell_script* inside it, and return
    the combined stdout+stderr log string.

    Parameters
    ----------
    shell_script      : The complete /bin/sh script to execute (built by payload_generator)
    access_token      : GitHub PAT injected as the GIT_TOKEN env variable
    image             : Docker image to use (must have /bin/sh and git)
    timeout           : Seconds before the container is force-killed
    stream_to_stdout  : If True, prints each log chunk live as the container runs

    Returns
    -------
    Full combined log string on success.

    Raises
    ------
    RuntimeError  : Container timed out, or exited with a non-zero status code.
    docker.errors.DockerException : Docker daemon unreachable or other SDK error.
    """
    client = docker.from_env()

    if stream_to_stdout:
        print(f"[docker_runner] Pulling / reusing image: {image}")

    container: Container = client.containers.create(
        image=image,
        entrypoint=["/bin/sh", "-c"],
        command=[shell_script],
        environment={"GIT_TOKEN": access_token},
        tty=False,
        stdin_open=False,
        detach=True,
        working_dir="/",
    )

    try:
        container.start()
        logs = _stream_logs(container, timeout=timeout, stream_to_stdout=stream_to_stdout)
        _assert_exit_zero(container, logs)
        return logs

    finally:
        _safe_remove(container)


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _stream_logs(container: Container, timeout: int, stream_to_stdout: bool) -> str:
    """Stream container logs until the process exits or *timeout* is reached."""
    chunks: list[str] = []
    start = time.time()

    for raw_chunk in container.logs(stream=True, stdout=True, stderr=True, follow=True):
        text = raw_chunk.decode("utf-8", errors="replace")
        chunks.append(text)

        if stream_to_stdout:
            print(text, end="", flush=True)

        if time.time() - start > timeout:
            container.kill()
            raise RuntimeError(
                f"Container exceeded the {timeout}s timeout and was forcibly killed."
            )

    return "".join(chunks)


def _assert_exit_zero(container: Container, logs: str) -> None:
    """Raise RuntimeError if the container exited with a non-zero status."""
    result = container.wait()
    code: int = result.get("StatusCode", -1)
    if code != 0:
        raise RuntimeError(
            f"Container exited with status {code}.\n\n--- Logs ---\n{logs}"
        )


def _safe_remove(container: Container) -> None:
    """Best-effort container cleanup; swallows all errors."""
    try:
        container.remove(force=True)
    except Exception:
        pass
