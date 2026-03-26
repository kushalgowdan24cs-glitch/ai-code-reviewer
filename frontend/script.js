// ===== Configuration =====
const API_URL = "http://localhost:3000/analyze";

// ===== Main Function =====
async function analyzeCode() {
  const code = document.getElementById("codeInput").value.trim();
  const language = document.getElementById("langSelect").value;

  // Validate input
  if (!code) {
    showError("Please paste some code before analyzing.");
    return;
  }

  // UI: loading state
  setLoading(true);
  hideError();
  hideResults();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    displayResults(data);

  } catch (err) {
    showError(`Error: ${err.message}. Make sure your backend server is running on port 3000.`);
  } finally {
    setLoading(false);
  }
}

// ===== Display Results =====
function displayResults(data) {
  const { issues, suggestions, improved_code, score, grade, summary } = data;

  // Summary bar
  const summaryEl = document.getElementById("summaryText");
  if (summaryEl && summary) summaryEl.textContent = summary;

  // Score
  const scoreEl = document.getElementById("scoreValue");
  const gradeEl = document.getElementById("gradeValue");
  if (scoreEl) scoreEl.textContent = score || "–";
  if (gradeEl) gradeEl.textContent = grade || "–";

  // Issues — grouped by type with colored badges
  const issuesList = document.getElementById("issuesList");
  issuesList.innerHTML = "";
  if (issues && issues.length > 0) {
    issues.forEach(issue => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="issue-badge ${getBadgeClass(issue.type)}">${issue.type}</span>
        <span class="issue-line">Line ${issue.line}</span> — ${issue.message}`;
      issuesList.appendChild(li);
    });
  } else {
    issuesList.innerHTML = "<li>No issues found ✅ Great code!</li>";
  }

  // Suggestions
  const suggestionsList = document.getElementById("suggestionsList");
  suggestionsList.innerHTML = "";
  if (suggestions && suggestions.length > 0) {
    suggestions.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      suggestionsList.appendChild(li);
    });
  } else {
    suggestionsList.innerHTML = "<li>No suggestions.</li>";
  }

  // Improved code
  const improvedCode = document.getElementById("improvedCode");
  if (improved_code) {
    improvedCode.textContent = improved_code;
    highlightCode();
    document.getElementById("improvedCard").classList.remove("hidden");
  } else {
    document.getElementById("improvedCard").classList.add("hidden");
  }

  document.getElementById("resultsSection").classList.remove("hidden");
}

function getBadgeClass(type) {
  const map = {
    "Bug": "badge-bug",
    "Security": "badge-security",
    "Performance": "badge-performance",
    "Formatting": "badge-formatting",
    "Exception Handling": "badge-exception",
    "Naming": "badge-naming",
    "Complexity": "badge-complexity",
    "Unused Code": "badge-unused",
    "Best Practice": "badge-best",
  };
  return map[type] || "badge-default";
}
// ===== UI Helpers =====
function setLoading(isLoading) {
  const btn = document.getElementById("analyzeBtn");
  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");

  btn.disabled = isLoading;
  btnText.classList.toggle("hidden", isLoading);
  btnLoader.classList.toggle("hidden", !isLoading);
}

function showError(msg) {
  const box = document.getElementById("errorBox");
  box.textContent = msg;
  box.classList.remove("hidden");
}

function hideError() {
  document.getElementById("errorBox").classList.add("hidden");
}

function hideResults() {
  document.getElementById("resultsSection").classList.add("hidden");
}
// Re-run Prism highlight after content is injected
function highlightCode() {
  const block = document.getElementById("improvedCode");
  const lang = document.getElementById("langSelect").value;
  block.className = `language-${lang}`;
  Prism.highlightElement(block);
}

// Copy improved code to clipboard
function copyCode() {
  const code = document.getElementById("improvedCode").textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector(".copy-btn");
    btn.textContent = "Copied ✅";
    setTimeout(() => btn.textContent = "Copy", 2000);
  });
}