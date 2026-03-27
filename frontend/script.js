// ===== Configuration =====
const API_URL = "http://localhost:3000/analyze";


// ===== Main Function =====
async function analyzeCode() {
  const token = localStorage.getItem("token");

  const code = document.getElementById("codeInput").value.trim();
  const language = document.getElementById("langSelect").value;

  if (!token) {
    showError("Please login first.");
    return;
  }
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
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // ← this line MUST be here
      },
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
// ===== Badge class helper =====
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

// ===== Display Results =====
function displayResults(data) {
  const { issues, suggestions, improved_code } = data;

  // Issues
  // Issues — with colored badges
const issuesList = document.getElementById("issuesList");
issuesList.innerHTML = "";
if (issues && issues.length > 0) {
  issues.forEach(issue => {
    const li = document.createElement("li");

    // Handle both object format {type, line, message} AND plain string format
    if (typeof issue === "object" && issue !== null) {
      li.innerHTML = `<span class="issue-badge ${getBadgeClass(issue.type)}">${issue.type || "Issue"}</span>
        <span class="issue-line"> Line ${issue.line || "N/A"}</span> — ${issue.message || ""}`;
    } else {
      li.textContent = issue;
    }

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
    document.getElementById("improvedCard").classList.remove("hidden");
  } else {
    document.getElementById("improvedCard").classList.add("hidden");
  }

  document.getElementById("resultsSection").classList.remove("hidden");
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
function logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "login.html";
            
        }