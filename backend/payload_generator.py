"""
payload_generator.py

Responsible for producing the two dynamic payloads injected into the container:

  1. generate_shell_script()  – the /bin/sh script the container runs
  2. get_default_ci_yml()     – the default GitHub Actions workflow YAML
  3. get_default_test_content() – the bundled sample Playwright spec

The core bash logic and the YAML content are intentionally left untouched
from the original monolith; only the Python wrapping has been refactored.
"""

import textwrap


# ─── Public API ──────────────────────────────────────────────────────────────

def generate_shell_script(
    repo_url: str,
    branch: str,
    container_clone_dir: str,
    ci_yml_content: str,
    test_content: str,
) -> str:
    """
    Build the shell script that runs inside the Alpine container.

    Parameters
    ----------
    repo_url            : Full HTTPS GitHub URL (e.g. https://github.com/owner/repo)
    branch              : Target branch to push to
    container_clone_dir : Absolute path inside the container where the repo is cloned
    ci_yml_content      : Complete text of .github/workflows/ci.yml
    test_content        : Complete text of the Playwright spec file

    Returns
    -------
    A ready-to-execute /bin/sh script string (no outer quoting needed).
    """
    safe_ci_yml = ci_yml_content.rstrip()
    safe_test = test_content.strip()

    # NOTE: The heredoc delimiters (<<'YML'  <<'TEST') are single-quoted so the
    # shell does NOT expand variables inside them — the Python f-string handles
    # the substitution at the Python level before the script is handed to Docker.
    script = textwrap.dedent(f"""\
set -euo pipefail
export GIT_TERMINAL_PROMPT=0

REPO_URL="{repo_url}"
CLONE_DIR="{container_clone_dir}"
BRANCH="{branch}"

# parse owner/repo and ensure .git suffix
repo_path="${{REPO_URL#https://github.com/}}"
if [ -z "$repo_path" ]; then
  echo "Invalid REPO_URL: $REPO_URL" >&2
  exit 2
fi
case "$repo_path" in
  *.git) auth_path="$repo_path" ;;
  *) auth_path="${{repo_path}}.git" ;;
esac

AUTH_URL="https://x-access-token:$GIT_TOKEN@github.com/$auth_path"

echo ">>> cloning $REPO_URL into $CLONE_DIR"
git clone "$AUTH_URL" "$CLONE_DIR" || {{ echo "clone failed"; exit 3; }}

cd "$CLONE_DIR"

# ensure target branch exists locally (checkout or create)
if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH"
fi

# remove token from stored remote config (so it isn't persisted)
git remote set-url origin "https://github.com/$auth_path"

mkdir -p .github/workflows
mkdir -p tests

# add sample test (heredoc quoted to avoid expansions)
cat > tests/example.spec.ts <<'TEST'
{safe_test}
TEST

# write workflow file (heredoc quoted)
cat > .github/workflows/ci.yml <<'YML'
{safe_ci_yml}
YML

echo ">>> files present:"
ls -la .github || true
ls -la tests || true

# stage files
git add .github/workflows/ci.yml tests/example.spec.ts

echo ">>> staged files:"
git diff --cached --name-only || true

# If there are staged changes, commit with inline identity (no global config required)
if git diff --cached --quiet; then
  echo ">>> No changes to commit. Skipping."
else
  echo ">>> committing with inline identity..."
  git -c user.name="CI Bot (container)" -c user.email="ci-bot@example.com" \\
      commit -m "Add CI workflow and Playwright test (container automation)" || {{ echo "commit failed"; exit 4; }}

  echo ">>> commit created:"
  git log -n 3 --oneline

  echo ">>> pushing to remote..."
  git push "https://x-access-token:$GIT_TOKEN@github.com/$auth_path" "HEAD:$BRANCH" || {{ echo "push failed"; exit 5; }}

  echo ">>> push succeeded"
fi

echo ">>> final remote HEAD (verify):"
git ls-remote "https://x-access-token:$GIT_TOKEN@github.com/$auth_path" HEAD || true

echo "Container job complete."
""")
    return script


def get_default_ci_yml() -> str:
    """
    Return the default GitHub Actions CI YAML (Playwright + Vercel deploy).
    This is kept byte-for-byte identical to the original monolith's CI_YML.
    """
    return textwrap.dedent("""\
name: CI + Playwright + Deploy to Vercel

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup NodeJS
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install App Dependencies
        run: npm install

      - name: Install Playwright & Browsers
        run: |
          npm install --no-save @playwright/test
          npx playwright install --with-deps

      # NEW FIX: Generate the Playwright config dynamically in the CI environment
      - name: Create Playwright Config
        run: |
          cat << 'EOF' > playwright.config.ts
          import { defineConfig, devices } from '@playwright/test';
          export default defineConfig({
            testDir: './tests',
            fullyParallel: true,
            reporter: 'html',
            use: {
              baseURL: 'http://localhost:5173',
              trace: 'on-first-retry',
            },
            projects: [
              {
                name: 'chromium',
                use: { ...devices['Desktop Chrome'] },
              },
            ],
            webServer: {
              command: 'npx vite --port 5173',
              url: 'http://localhost:5173',
              reuseExistingServer: !process.env.CI,
              timeout: 120 * 1000,
            },
          });
          EOF

      - name: Run Playwright Tests
        run: npx playwright test

      - name: Upload Playwright Report
        if: ${{ always() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npm i -g vercel
          vercel pull --yes --environment=production --token=$VERCEL_TOKEN
          vercel build --prod --token=$VERCEL_TOKEN
          vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
""")


def get_default_test_content() -> str:
    """
    Return the bundled sample Playwright spec (TypeScript).
    Identical to the inline literal from the original monolith.
    """
    return textwrap.dedent("""\
import { test, expect } from '@playwright/test';

test.describe('Todo App Basic Functionality', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should add a task', async ({ page }) => {
    await page.getByPlaceholder('Enter a task..').fill('Buy milk');
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.locator('ol > li')).toContainText(['Buy milk']);
  });

  test('should delete a task', async ({ page }) => {
    await page.getByPlaceholder('Enter a task..').fill('Temp task');
    await page.getByRole('button', { name: 'Add' }).click();

    // Delete the newly added task (last item)
    const lastDeleteButton = page.getByRole('button', { name: 'Delete task' }).last();
    await lastDeleteButton.click();

    await expect(page.locator('ol > li')).not.toContainText(['Temp task']);
  });

  test('should move tasks up and down', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Select items by index
    const firstItem = page.locator('ol > li').nth(0);
    const secondItem = page.locator('ol > li').nth(1);

    // Move second item UP (☝️)
    await secondItem.getByRole('button', { name: 'Up' }).click();

    // After moving up → second item should now be first
    const newFirst = page.locator('ol > li').nth(0);
    await expect(newFirst.locator('.text')).toHaveText(/Eat breakfast|Do cp|Take a shower/);

    // Move the item DOWN (👇)
    await newFirst.getByRole('button', { name: 'Down' }).click();

    const newSecond = page.locator('ol > li').nth(1);
    await expect(newSecond.locator('.text')).toHaveText(/Eat breakfast|Do cp|Take a shower/);
  });

});
""")
