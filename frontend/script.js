// ===== Configuration =====
const API_URL = "http://localhost:3000/analyze";
const HISTORY_API = "http://localhost:3000/history";

// ===== On Page Load =====
window.onload = () => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw || userRaw === "null") {
    window.location.href = "login.html";
    return;
  }

  try {
    const user = JSON.parse(userRaw);
    if (user && user.name) {
      document.getElementById("userAvatar").textContent = user.name.charAt(0).toUpperCase();
      document.getElementById("sidebarUserName").textContent = user.name;
      document.getElementById("userChip").textContent = user.name;
    }
  } catch (e) { }

  // ✅ ADD THIS BLOCK HERE
  document.getElementById("confirmDeleteBtn").onclick = async () => {
    if (!deleteId) return;

    const token = localStorage.getItem("token");

    await fetch(`${HISTORY_API}/${deleteId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    closeModal();
    loadSidebarHistory();
  };

  document.getElementById("confirmRenameBtn").onclick = async () => {
    if (!renameId) return;

    const newName = document.getElementById("renameInput").value.trim();
    if (!newName) return alert("Enter a valid name");

    const token = localStorage.getItem("token");

    await fetch(`${HISTORY_API}/${renameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title: newName })
    });

    closeRenameModal();
    loadSidebarHistory();
  };

  loadSidebarHistory();
};

// ===== Sidebar Toggle =====
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// ===== New Review (clear form + scroll up) =====
function newReview() {
  document.getElementById("codeInput").value = "";
  document.getElementById("resultsSection").classList.add("hidden");
  document.getElementById("errorBox").classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("codeInput").focus();
}

// ===== Load Sidebar History =====
async function loadSidebarHistory() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(HISTORY_API, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return;

    const reviews = await res.json();
    renderSidebarHistory(reviews);
  } catch (err) {
    // Silently fail — sidebar history is non-critical
  }
}

function renderSidebarHistory(reviews) {
  const list = document.getElementById("sidebarHistoryList");
  if (!reviews || reviews.length === 0) {
    list.innerHTML = '<li class="history-item-empty">No reviews yet</li>';
    return;
  }

  list.innerHTML = reviews.slice(0, 15).map(r => {
    const date = new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    const lang = r.language || "code";
    const score = r.score != null ? `${r.score}/100` : "—";
    const summary = r.summary ? r.summary.slice(0, 40) + (r.summary.length > 40 ? "…" : "") : lang;
    return `
<li class="history-item">
  <div onclick="openReview('${r._id}')" style="flex:1; cursor:pointer;">
    <div class="history-item-title">${summary}</div>
    <div class="history-item-meta">${lang} · ${score} · ${date}</div>
  </div>

  <div class="history-actions">
    <button class="menu-btn" onclick="toggleMenu(event, '${r._id}')">⋮</button>

    <div class="history-menu hidden" id="menu-${r._id}">
  <button onclick="renameReview('${r._id}')">✏️ Rename</button>
  <button onclick="deleteReview('${r._id}')">🗑️ Delete</button>
</div>
  </div>
</li>
`;
  }).join("");
}

async function openReview(id) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${HISTORY_API}/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return;
    const data = await res.json();

    // Prefill the code input
    document.getElementById("codeInput").value = data.code || "";

    // Display the results
    displayResults(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) { /* ignore */ }
}

// ===== Main Analyze Function =====
async function analyzeCode() {
  const token = localStorage.getItem("token");
  const code = document.getElementById("codeInput").value.trim();
  const language = document.getElementById("langSelect").value;

  if (!token) { showError("Please login first."); return; }
  if (!code) { showError("Please paste some code before analyzing."); return; }

  setLoading(true);
  hideError();
  hideResults();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data = await response.json();
    displayResults(data);

    // Refresh sidebar history after new review
    loadSidebarHistory();

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

// ===== Time Complexity Chart =====
let complexityChartInstance = null;

function renderComplexityChart(tc) {
  const card = document.getElementById("complexityCard");

  if (!tc) { card.classList.add("hidden"); return; }
  card.classList.remove("hidden");

  // Update Big-O labels
  document.getElementById("origComplexity").textContent = tc.original || "O(?)";
  document.getElementById("impComplexity").textContent = tc.improved || "O(?)";
  document.getElementById("origLabel").textContent = tc.original_label || "Original Code";
  document.getElementById("impLabel").textContent = tc.improved_label || "Improved Code";
  document.getElementById("complexityExplanation").textContent = tc.explanation || "";

  // Map Big-O notation → growth data points
  function toValues(notation) {
    const n = [1, 2, 4, 8, 16, 32];
    if (!notation) return n.map(x => x);
    const s = notation.toLowerCase();
    if (s.includes("1")) return n.map(() => 1);
    if (s.includes("log")) return n.map(x => +(Math.log2(x) || 0.1).toFixed(2));
    if (s.includes("n²") || s.includes("n^2") || s.includes("n2"))
      return n.map(x => x * x);
    if (s.includes("n log") || s.includes("nlog"))
      return n.map(x => +(x * (Math.log2(x) || 0.1)).toFixed(2));
    if (s.includes("2^n")) return n.map(x => Math.pow(2, x));
    return n.map(x => x); // default O(n)
  }

  // Destroy old chart
  if (complexityChartInstance) {
    complexityChartInstance.destroy();
    complexityChartInstance = null;
  }

  const ctx = document.getElementById("complexityChart").getContext("2d");
  complexityChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["n=1", "n=2", "n=4", "n=8", "n=16", "n=32"],
      datasets: [
        {
          label: `Original ${tc.original || ""}`,
          data: toValues(tc.original),
          borderColor: "#ff6b6b",
          backgroundColor: "rgba(255,107,107,0.07)",
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#ff6b6b",
          pointRadius: 4,
        },
        {
          label: `Improved ${tc.improved || ""}`,
          data: toValues(tc.improved),
          borderColor: "#00e5a0",
          backgroundColor: "rgba(0,229,160,0.07)",
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#00e5a0",
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#e2e8f0",
            font: { family: "JetBrains Mono", size: 11 },
          },
        },
        tooltip: {
          backgroundColor: "#13161e",
          borderColor: "#2a2f3d",
          borderWidth: 1,
          titleColor: "#00e5a0",
          bodyColor: "#e2e8f0",
        },
      },
      scales: {
        x: {
          ticks: { color: "#6b7280", font: { family: "JetBrains Mono", size: 10 } },
          grid: { color: "#2a2f3d" },
        },
        y: {
          ticks: { color: "#6b7280", font: { family: "JetBrains Mono", size: 10 } },
          grid: { color: "#2a2f3d" },
          beginAtZero: true,
        },
      },
    },
  });
}

// ===== Display Results =====
function displayResults(data) {
  const { issues, suggestions, improved_code, score, grade, summary } = data;

  // Score Banner
  if (score != null) {
    document.getElementById("scoreCircle").textContent = score;
    document.getElementById("scoreGrade").textContent = `Grade: ${grade || "—"}`;
    document.getElementById("scoreSummary").textContent = summary || "";

    // Color the circle based on score
    const circle = document.getElementById("scoreCircle");
    if (score >= 80) circle.style.borderColor = "#00e5a0", circle.style.color = "#00e5a0";
    else if (score >= 50) circle.style.borderColor = "#ffd166", circle.style.color = "#ffd166";
    else circle.style.borderColor = "#ff6b6b", circle.style.color = "#ff6b6b";
  }

  // Issues
  const issuesList = document.getElementById("issuesList");
  issuesList.innerHTML = "";
  if (issues && issues.length > 0) {
    issues.forEach(issue => {
      const li = document.createElement("li");
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
    if (window.Prism) Prism.highlightElement(improvedCode);
  } else {
    document.getElementById("improvedCard").classList.add("hidden");
  }

  // Time Complexity Graph
  renderComplexityChart(data.time_complexity);
  document.getElementById("resultsSection").classList.remove("hidden");
}

// ===== Copy Code =====
function copyCode() {
  const code = document.getElementById("improvedCode").textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector(".copy-btn");
    btn.textContent = "Copied!";
    setTimeout(() => btn.textContent = "Copy", 1800);
  });
}

// ===== UI Helpers =====
function setLoading(isLoading) {
  const btn = document.getElementById("analyzeBtn");
  document.getElementById("btnText").classList.toggle("hidden", isLoading);
  document.getElementById("btnLoader").classList.toggle("hidden", !isLoading);
  btn.disabled = isLoading;
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

// ===== Logout =====
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function toggleMenu(e, id) {
  e.stopPropagation();
  document.querySelectorAll(".history-menu").forEach(m => m.classList.add("hidden"));
  document.getElementById(`menu-${id}`).classList.toggle("hidden");
}
let renameId = null;

function renameReview(id) {
  renameId = id;
  document.getElementById("renameModal").classList.remove("hidden");

  // clear old value
  document.getElementById("renameInput").value = "";
}

function closeRenameModal() {
  document.getElementById("renameModal").classList.add("hidden");
  renameId = null;
}

let deleteId = null;

function deleteReview(id) {
  deleteId = id;
  document.getElementById("deleteModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("deleteModal").classList.add("hidden");
  deleteId = null;
}

document.getElementById("confirmDeleteBtn").onclick = async () => {
  if (!deleteId) return;

  const token = localStorage.getItem("token");

  await fetch(`${HISTORY_API}/${deleteId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  closeModal();
  loadSidebarHistory();
};
