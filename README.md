# 🚀 AstraCI : Cross-repository CI/CD Orchestrator

![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Node](https://img.shields.io/badge/node-22.x-green)
![Docker](https://img.shields.io/badge/docker-required-2496ED)

An automated CI/CD orchestration platform that eliminates pipeline setup friction. This full-stack tool allows developers to instantly inject a customized Playwright testing suite and a GitHub Actions deployment pipeline into any repository with a single click.

By offloading the git operations and file generation into an isolated Docker container, AstraCI achieves an **85% reduction in setup time** for cross-repository validation while maintaining strict security boundaries.

---

## ✨ Key Features

- **Zero-Touch Pipeline Injection:** Automatically provisions `.github/workflows/ci.yml` and `tests/example.spec.ts` into target repositories.
- **Isolated Execution Engine:** Uses ephemeral `alpine/git` Docker containers to securely handle cloning, committing, and pushing via Personal Access Tokens (PAT).
- **Dynamic Playwright Config:** Generates tailored Playwright and Vite configurations directly within the target environment without requiring manual user setup.
- **Real-Time Log Streaming:** Streams live container `stdout` directly to the frontend UI, providing instant developer feedback.
- **GitHub-Native UI:** Features a sleek, dark-mode React interface designed to feel instantly familiar to developers.

---

## 🛠️ Tech Stack

**Backend:**

- Python 3.10+
- FastAPI & Uvicorn
- Docker SDK for Python
- Pydantic

**Frontend:**

- React 18
- Vite
- Tailwind CSS

---

## 🚀 Getting Started

### Prerequisites

Before running the orchestrator locally, ensure you have the following installed:

- **Docker Desktop** (Must be actively running in the background)
- **Node.js 22.x** (Required for Vite compatibility)
- **Python 3.10+**

### 1. Backend Setup

Navigate to the backend directory, create a virtual environment, and start the FastAPI server.

```bash
cd backend
python -m venv venv

# Activate the virtual environment
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python api.py
```
The backend will start on http://localhost:8000.

2. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and start the Vite development server.

```bash
cd frontend
npm install
npm run dev
```
The UI will be accessible at http://localhost:5173.

How to use?
1. Open http://localhost:5173 in your browser.
2. Enter the target Repository URL (e.g., https://github.com/owner/repo).
3. Securely provide a GitHub Personal Access Token (PAT) with repo scope.
4. (Optional) Upload a .txt file containing your custom Playwright test suite, or use the default bundled tests.
5. Click Run Workflow and watch the live logs as the Docker container injects your pipeline!

⚠️ Security Note: 
Your GitHub Personal Access Token is never stored on the server or logged to the console. It is passed securely to the Docker container as an environment variable, and the container automatically strips it from the local git config before performing any commits.

