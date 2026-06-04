import { useState, useRef, useCallback } from "react";

// ─── Icons (inline SVG components) ───────────────────────────────────────────

const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
    <path d="M8 0a8 8 0 110 16A8 8 0 018 0zM1.5 8a6.5 6.5 0 1013 0 6.5 6.5 0 00-13 0zm4.879-2.773l4.264 2.559a.25.25 0 010 .428l-4.264 2.559A.25.25 0 016 10.559V5.442a.25.25 0 01.379-.215z" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
    <path d="M8.75 1.75a.75.75 0 00-1.5 0V7H2.75a.75.75 0 000 1.5H7.25v5.25a.75.75 0 001.5 0V8.5h4.5a.75.75 0 000-1.5H8.75V1.75z" />
    <path d="M1 12.5A1.5 1.5 0 002.5 14h11a1.5 1.5 0 001.5-1.5v-2.25a.75.75 0 00-1.5 0v2.25h-11v-2.25a.75.75 0 00-1.5 0v2.25z" />
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    {open ? (
      <path d="M8 2C4.42 2 1.34 4.13.08 7.19a.5.5 0 000 .62C1.34 10.87 4.42 13 8 13s6.66-2.13 7.92-5.19a.5.5 0 000-.62C14.66 4.13 11.58 2 8 2zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm0-5.5a2 2 0 100 4 2 2 0 000-4z" />
    ) : (
      <path d="M.143 2.31a.75.75 0 011.047-.167l14.5 10.5a.75.75 0 11-.88 1.214l-2.248-1.628C11.346 12.67 9.792 13 8 13 4.42 13 1.34 10.87.08 7.81a.5.5 0 010-.62 9.14 9.14 0 012.162-2.949L.31 3.357A.75.75 0 01.143 2.31zM8 6.5a1.5 1.5 0 00-.832.253L9.749 8.34A1.5 1.5 0 008 6.5zm-2.22 3.21A1.5 1.5 0 0010 8.001l-2.22-1.607A1.5 1.5 0 005.78 9.71zM8 4C5.68 4 3.7 5.14 2.38 6.74L5.5 8.98a3 3 0 014-.059l1.595 1.154A5 5 0 008 4z" />
    )}
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
    <path d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
    <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" className="animate-spin">
    <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" opacity="0.3" />
    <path d="M8 1.5A6.5 6.5 0 012.036 12.25a.75.75 0 01.928-1.184A5 5 0 108 3a.75.75 0 010-1.5z" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
    <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 019 4.25V1.5H3.75zm6.75.062V4.25c0 .138.112.25.25.25h2.688a.252.252 0 00-.011-.013L10.513 1.573a.248.248 0 00-.013-.011z" />
  </svg>
);

const RepoIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
  </svg>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const styles = {
    idle: "bg-[#30363d] text-[#8b949e] border-[#30363d]",
    running: "bg-[#388bfd26] text-[#388bfd] border-[#388bfd40]",
    success: "bg-[#1f6feb26] text-[#3fb950] border-[#3fb95040]",
    error: "bg-[#f8514926] text-[#f85149] border-[#f8514940]",
  };
  const labels = {
    idle: "Ready",
    running: "Running",
    success: "Completed",
    error: "Failed",
  };
  const dots = {
    idle: "bg-[#8b949e]",
    running: "bg-[#388bfd] animate-pulse",
    success: "bg-[#3fb950]",
    error: "bg-[#f85149]",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {labels[status]}
    </span>
  );
};

// ─── Log Output Component ─────────────────────────────────────────────────────

const LogOutput = ({ logs, status }) => {
  const endRef = useRef(null);

  const colorLine = (line) => {
    if (line.startsWith(">>>")) return "text-[#388bfd]";
    if (line.toLowerCase().includes("error") || line.toLowerCase().includes("failed")) return "text-[#f85149]";
    if (line.toLowerCase().includes("success") || line.toLowerCase().includes("complete")) return "text-[#3fb950]";
    if (line.startsWith("+")) return "text-[#3fb950]";
    if (line.startsWith("-")) return "text-[#f85149]";
    return "text-[#c9d1d9]";
  };

  return (
    <div className="rounded-md border border-[#30363d] overflow-hidden font-mono text-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2 text-[#8b949e]">
          <span className="text-[10px] uppercase tracking-widest font-semibold">Output</span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Log body */}
      <div className="bg-[#0d1117] p-4 h-72 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-[#484f58]">
            <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor" className="opacity-30">
              <path d="M1.5 1.75V13.5h13.75a.75.75 0 010 1.5H.75a.75.75 0 01-.75-.75V1.75a.75.75 0 011.5 0zM16 6.25l-3.5 3.5-2-2-3 3 .75.75 3-3 2 2 4.25-4.25L16 6.25z" />
            </svg>
            <span className="text-[11px]">Waiting for workflow to run…</span>
          </div>
        ) : (
          <div className="space-y-0.5">
            {logs.map((line, i) => (
              <div key={i} className={`leading-5 ${colorLine(line)}`}>
                <span className="select-none text-[#484f58] mr-3">{String(i + 1).padStart(3, " ")}</span>
                {line || " "}
              </div>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

// ─── Drop Zone ────────────────────────────────────────────────────────────────

const DropZone = ({ testContent, onTestContentChange }) => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("upload"); // "upload" | "paste"

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => onTestContentChange(e.target.result);
    reader.readAsText(file);
    setActiveTab("paste");
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  return (
    <div className="space-y-2">
      {/* Tab switcher */}
      <div className="flex text-sm border-b border-[#30363d]">
        {["upload", "paste"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize text-xs font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab
                ? "border-[#f78166] text-[#c9d1d9]"
                : "border-transparent text-[#8b949e] hover:text-[#c9d1d9]"
            }`}
          >
            {tab === "upload" ? "Upload .txt" : "Paste / Edit"}
          </button>
        ))}
      </div>

      {activeTab === "upload" ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-3
            border-2 border-dashed rounded-md p-8 cursor-pointer
            transition-all duration-150
            ${dragging
              ? "border-[#388bfd] bg-[#388bfd10]"
              : "border-[#30363d] bg-[#010409] hover:border-[#484f58] hover:bg-[#161b22]"}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.ts,.js,.spec.ts,.spec.js"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div className="text-[#8b949e]"><FileIcon /></div>
          {fileName ? (
            <div className="text-center">
              <p className="text-sm text-[#3fb950] font-medium">{fileName}</p>
              <p className="text-xs text-[#8b949e] mt-1">File loaded — switch to "Paste / Edit" to review</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-[#c9d1d9]">
                Drop your <code className="bg-[#30363d] px-1 py-0.5 rounded text-[#79c0ff]">.txt</code> test file here
              </p>
              <p className="text-xs text-[#484f58] mt-1">or click to browse • also accepts .ts / .spec.ts</p>
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={testContent}
          onChange={(e) => onTestContentChange(e.target.value)}
          placeholder={`// Paste your Playwright test here, e.g.\nimport { test, expect } from '@playwright/test';\n\ntest('example', async ({ page }) => {\n  await page.goto('http://localhost:5173');\n  await expect(page).toHaveTitle(/App/);\n});`}
          rows={12}
          spellCheck={false}
          className="
            w-full bg-[#010409] border border-[#30363d] rounded-md
            px-4 py-3 text-sm font-mono text-[#c9d1d9] placeholder-[#484f58]
            focus:outline-none focus:border-[#388bfd] focus:ring-1 focus:ring-[#388bfd40]
            resize-y transition-colors
          "
        />
      )}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [repoUrl, setRepoUrl]         = useState("");
  const [token, setToken]             = useState("");
  const [showToken, setShowToken]     = useState(false);
  const [testContent, setTestContent] = useState("");
  const [branch, setBranch]           = useState("main");
  const [status, setStatus]           = useState("idle"); // idle | running | success | error
  const [logs, setLogs]               = useState([]);
  const [errorMsg, setErrorMsg]       = useState("");

  const isValid = repoUrl.startsWith("https://github.com/") && token.trim().length > 0;

  const appendLog = (line) => setLogs((prev) => [...prev, line]);

  const handleSubmit = async () => {
    if (!isValid || status === "running") return;

    setStatus("running");
    setLogs([]);
    setErrorMsg("");
    appendLog(`[client] Submitting workflow to CI Injector API…`);
    appendLog(`[client] Repo: ${repoUrl}  Branch: ${branch}`);
    appendLog(`[client] Test payload: ${testContent.trim().length > 0 ? "custom" : "default bundled spec"}`);
    appendLog("");

    try {
      const body = {
        repo_url: repoUrl.trim(),
        access_token: token.trim(),
        branch: branch.trim() || "main",
        ...(testContent.trim() && { test_content: testContent.trim() }),
      };

      const res = await fetch("http://localhost:8000/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || `HTTP ${res.status}`);
      }

      // Split server logs into lines and append them
      const serverLines = (data.logs || "").split("\n");
      serverLines.forEach((l) => appendLog(l));
      appendLog("");
      appendLog("✓ " + data.message);
      setStatus("success");

    } catch (err) {
      appendLog("");
      appendLog(`✗ Error: ${err.message}`);
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}>

      {/* ── Top nav ── */}
      <nav className="border-b border-[#30363d] bg-[#161b22]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#c9d1d9]">
            <GitHubIcon />
            <span className="text-sm font-semibold text-[#c9d1d9]">CI</span>
            <span className="text-[#484f58]">/</span>
            <span className="text-sm font-semibold text-[#c9d1d9]">injector</span>
            <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#1f6feb] text-white rounded-full">beta</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#8b949e]">
            <a href="#" className="hover:text-[#c9d1d9] transition-colors">Docs</a>
            <a href="#" className="hover:text-[#c9d1d9] transition-colors">API</a>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#388bfd] to-[#8957e5] flex items-center justify-center text-white text-[10px] font-bold">U</div>
          </div>
        </div>
      </nav>

      {/* ── Page header ── */}
      <div className="border-b border-[#30363d] bg-[#161b22]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#e6edf3]">Run Workflow</h1>
              <p className="text-sm text-[#8b949e] mt-1">
                Inject a Playwright test suite and GitHub Actions CI pipeline into any repository — powered by Docker.
              </p>
            </div>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left column: inputs ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Repository */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden">
              <div className="px-5 py-3 border-b border-[#30363d] flex items-center gap-2">
                <RepoIcon />
                <span className="text-sm font-semibold text-[#e6edf3]">Repository</span>
              </div>
              <div className="p-5 space-y-4">

                {/* Repo URL */}
                <div>
                  <label className="block text-xs font-medium text-[#8b949e] mb-1.5 uppercase tracking-wider">
                    Repository URL
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#484f58] text-xs pointer-events-none">
                      https://github.com/
                    </span>
                    <input
                      type="text"
                      value={repoUrl.replace("https://github.com/", "")}
                      onChange={(e) => setRepoUrl("https://github.com/" + e.target.value)}
                      placeholder="owner/repository"
                      className="
                        w-full bg-[#010409] border border-[#30363d] rounded-md
                        pl-36 pr-4 py-2 text-sm text-[#c9d1d9] placeholder-[#484f58]
                        focus:outline-none focus:border-[#388bfd] focus:ring-1 focus:ring-[#388bfd40]
                        transition-colors
                      "
                    />
                  </div>
                  {repoUrl && !repoUrl.startsWith("https://github.com/") && (
                    <p className="text-xs text-[#f85149] mt-1.5 flex items-center gap-1">
                      <AlertIcon /> Must start with https://github.com/
                    </p>
                  )}
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-xs font-medium text-[#8b949e] mb-1.5 uppercase tracking-wider">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="main"
                    className="
                      w-full bg-[#010409] border border-[#30363d] rounded-md
                      px-4 py-2 text-sm text-[#c9d1d9] placeholder-[#484f58]
                      focus:outline-none focus:border-[#388bfd] focus:ring-1 focus:ring-[#388bfd40]
                      transition-colors
                    "
                  />
                </div>
              </div>
            </div>

            {/* Authentication */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden">
              <div className="px-5 py-3 border-b border-[#30363d] flex items-center gap-2">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                  <path d="M4 13H2.5A1.5 1.5 0 011 11.5v-9A1.5 1.5 0 012.5 1h9A1.5 1.5 0 0113 2.5V4h-1.5V2.5h-9v9H4V13zM15 5.5A1.5 1.5 0 0013.5 4h-7A1.5 1.5 0 005 5.5v7A1.5 1.5 0 006.5 14h7a1.5 1.5 0 001.5-1.5v-7zm-1.5 0v7h-7v-7h7z" />
                </svg>
                <span className="text-sm font-semibold text-[#e6edf3]">Authentication</span>
              </div>
              <div className="p-5">
                <label className="block text-xs font-medium text-[#8b949e] mb-1.5 uppercase tracking-wider">
                  Personal Access Token
                </label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    autoComplete="off"
                    className="
                      w-full bg-[#010409] border border-[#30363d] rounded-md
                      px-4 py-2 pr-10 text-sm text-[#c9d1d9] placeholder-[#484f58]
                      focus:outline-none focus:border-[#388bfd] focus:ring-1 focus:ring-[#388bfd40]
                      transition-colors
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#484f58] hover:text-[#8b949e] transition-colors"
                  >
                    <EyeIcon open={showToken} />
                  </button>
                </div>
                <p className="text-xs text-[#484f58] mt-2">
                  Requires <code className="text-[#79c0ff]">repo</code> scope. Never stored — sent once to the local API.
                </p>
              </div>
            </div>

            {/* Test cases */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden">
              <div className="px-5 py-3 border-b border-[#30363d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                    <path d="M1.75 2.5a.25.25 0 000 .5h12.5a.25.25 0 000-.5H1.75zM1.5 6.75a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H2.25a.75.75 0 01-.75-.75zm.75 3.75a.25.25 0 000 .5h12.5a.25.25 0 000-.5H2.25z" />
                  </svg>
                  <span className="text-sm font-semibold text-[#e6edf3]">Playwright Tests</span>
                </div>
                {!testContent.trim() && (
                  <span className="text-[10px] text-[#8b949e] bg-[#30363d] px-2 py-0.5 rounded-full">using default spec</span>
                )}
              </div>
              <div className="p-5">
                <DropZone testContent={testContent} onTestContentChange={setTestContent} />
              </div>
            </div>

            {/* Error banner */}
            {status === "error" && errorMsg && (
              <div className="flex items-start gap-3 bg-[#f8514910] border border-[#f8514940] rounded-md px-4 py-3 text-sm text-[#f85149]">
                <span className="mt-0.5 flex-shrink-0"><AlertIcon /></span>
                <div>
                  <p className="font-semibold mb-0.5">Workflow failed</p>
                  <p className="text-xs text-[#ffa198]">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!isValid || status === "running"}
              className={`
                w-full flex items-center justify-center gap-2
                px-4 py-2.5 rounded-md text-sm font-semibold
                border transition-all duration-150
                ${!isValid || status === "running"
                  ? "bg-[#21262d] border-[#30363d] text-[#484f58] cursor-not-allowed"
                  : "bg-[#238636] border-[#2ea043] text-white hover:bg-[#2ea043] active:bg-[#238636] shadow-sm"
                }
              `}
            >
              {status === "running" ? (
                <>
                  <SpinnerIcon />
                  Running workflow…
                </>
              ) : status === "success" ? (
                <>
                  <CheckIcon />
                  Run again
                </>
              ) : (
                <>
                  <PlayIcon />
                  Run Workflow
                </>
              )}
            </button>
          </div>

          {/* ── Right column: output + info ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Log output */}
            <LogOutput logs={logs} status={status} />

            {/* Workflow steps info panel */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden">
              <div className="px-5 py-3 border-b border-[#30363d]">
                <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">What happens</span>
              </div>
              <div className="p-4">
                {[
                  ["Pull Docker image", "alpine/git:latest"],
                  ["Clone repository", "via PAT auth"],
                  ["Inject Playwright spec", "→ tests/example.spec.ts"],
                  ["Inject CI workflow", "→ .github/workflows/ci.yml"],
                  ["Commit & push", "CI Bot identity"],
                  ["GitHub Actions triggers", "on push to branch"],
                ].map(([step, detail], i) => (
                  <div key={i} className="flex items-start gap-3 py-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#30363d] text-[#8b949e] text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs text-[#c9d1d9] font-medium">{step}</p>
                      <p className="text-[11px] text-[#484f58] font-mono">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick tip */}
            <div className="flex gap-3 text-xs bg-[#161b22] border border-[#30363d] rounded-md px-4 py-3">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" className="text-[#e3b341] flex-shrink-0 mt-0.5">
                <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
              <p className="text-[#8b949e]">
                Make sure your PAT has <code className="text-[#79c0ff]">repo</code> write access and the Docker daemon is running locally before submitting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
