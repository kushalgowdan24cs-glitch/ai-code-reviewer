# CodeSense AI — Project Documentation
## RNS Institute of Technology | CSE Department | 2024 Batch

---

**Student Name:** Kushal Gowda N  
**USN:** 1RN24CS___  
**Project Title:** CodeSense AI — Intelligent Code Reviewer  
**Guide:** [Mentor Name]  
**Submission Date:** March 2026  

---

## 1. Problem Understanding

### Problem Statement
Developers — especially students and beginners — often write code with hidden bugs, poor practices, security vulnerabilities, and inefficient algorithms without realizing it. Code reviews by senior developers are time-consuming and not always available.

### Current Challenges
- No instant feedback tool for code quality
- Manual code review is slow and expensive
- Students have no way to learn best practices interactively
- No centralized tracking of code quality over time

### Expected Outcome
- Users can paste any code and get instant AI feedback
- System detects bugs, formatting issues, security problems, and more
- Users receive an improved version of their code
- Time complexity is visualized with a graph
- All reviews are saved and searchable in history

---

## 2. Requirement Analysis

### User Roles

**Unregistered User:**
- Can view login/register page only

**Registered User:**
- Register and login securely
- Paste code and analyze with AI
- View results: issues, suggestions, improved code, score, complexity graph
- Download PDF report
- View, search, filter review history
- Delete past reviews
- Reset password via OTP

### Core Features
- JWT-based Authentication (Register/Login/Forgot Password)
- AI Code Analysis (9 categories)
- Code Score (0–100) with Grade
- Time Complexity Analysis with Chart.js graph
- Syntax Highlighted Improved Code
- PDF Report Download
- Review History with Search + Filter + Pagination
- Collapsible Sidebar with Recent Reviews

---

## 3. UI/UX Design (Figma)

**Figma File:** https://www.figma.com/design/jnD66IpmDvy4ZXBOkCSXCI/AI-Code-Reviewer---UI-Design

### Screens Designed
| Screen | Description |
|--------|-------------|
| Screen 1 | Login / Register with tab switcher |
| Screen 2 | Main Reviewer — code editor + analyze button |
| Screen 3 | Results — score, issues, suggestions, improved code, complexity graph |
| Screen 4 | Review History — table with filters, pagination, delete |

### Design Guidelines Followed
- Dark theme with consistent color variables
- JetBrains Mono for code, Syne for UI text
- Accent color: #00e5a0 (green)
- Surface colors for depth hierarchy
- Color-coded issue badges for quick scanning

---

## 4. System Architecture Design

### Architecture: 3-Tier

```
Frontend (HTML/CSS/JS)
        ↓ HTTP REST API
Backend (Node.js + Express)
        ↓ Mongoose ODM
Database (MongoDB Atlas)
        
Backend also calls:
        ↓ OpenRouter API
AI Model (openrouter/auto)
        ↓ Nodemailer
Email Service (Gmail SMTP)
```

### Data Flow
```
User pastes code → Frontend sends POST /analyze with JWT
→ authMiddleware verifies token
→ analyzeController receives request
→ analyzeService builds AI prompt
→ OpenRouter API returns JSON analysis
→ analyzeService saves to MongoDB
→ Response sent to frontend
→ displayResults() renders all sections
```

### Example API Calls
```
POST /auth/register     → Create account
POST /auth/login        → Get JWT token
POST /analyze           → Analyze code (protected)
GET  /history           → Get user's reviews (protected)
DELETE /history/:id     → Delete review (protected)
POST /auth/forgot-password → Send OTP
POST /auth/reset-password  → Reset with OTP
```

---

## 5. Database Design

### Users Collection
```
Field       Type        Constraints
─────────────────────────────────
_id         ObjectId    Auto
name        String      Required
email       String      Required, Unique
password    String      Hashed (bcrypt)
createdAt   Date        Default: now
```

### Reviews Collection
```
Field           Type        Constraints
───────────────────────────────────────
_id             ObjectId    Auto
userId          ObjectId    Ref: User
language        String      Required
code            String      Required
issues          Array       [{type, line, message}]
suggestions     Array       [String]
improved_code   String
score           Number      0-100
grade           String      A+ to F
summary         String
time_complexity Object      {original, improved, labels, explanation}
createdAt       Date        Default: now
```

### Relationships
- One User → Many Reviews (one-to-many)
- Reviews are user-scoped (userId field)

---

## 6. Technology Selection

### Frontend
- **HTML5 + CSS3 + Vanilla JavaScript** — No framework needed for MVP; fast and simple
- **Prism.js** — Industry-standard syntax highlighting library
- **Chart.js** — Powerful, lightweight charting library
- **jsPDF** — Client-side PDF generation without server dependency

### Backend
- **Node.js + Express.js** — Fast, non-blocking I/O; ideal for API servers
- **MongoDB + Mongoose** — Flexible schema for varied AI responses; free Atlas tier

### Authentication
- **JWT** — Stateless, scalable, industry standard
- **bcryptjs** — Secure one-way password hashing

### AI
- **OpenRouter** — Free gateway to multiple AI models; no billing required
- **Model: openrouter/auto** — Auto-selects best available model

### Selection Rationale
MERN-like stack chosen for: fast development, JavaScript throughout, free tier availability, and industry relevance.

---

## 7. Development (Coding Phase)

### Backend Structure (Services Pattern)
```
routes/          → URL routing only
controllers/     → Request/Response handling only  
services/        → All business logic
models/          → Database schemas
middleware/      → JWT protection
config/          → DB connection
```

### AI Prompt Design
The prompt instructs the AI to:
- Analyze 9 specific code quality categories
- Return ONLY valid JSON (no markdown)
- Include issue type, line number, and message
- Generate improved code
- Calculate score 0-100 with grade
- Analyze time complexity with Big-O notation

### Key Implementation Decisions
- Token stored in localStorage (MVP approach)
- OTP stored in memory with 10-min expiry (suitable for MVP)
- openrouter/auto model auto-selects best free model
- Chart.js renders complexity curves mathematically (not from AI data)

---

## 8. Testing

### API Testing (Thunder Client)
| Endpoint | Method | Expected | Result |
|----------|--------|----------|--------|
| `/` | GET | 200 OK | ✅ |
| `/auth/register` | POST | 201 Created | ✅ |
| `/auth/login` | POST | 200 + token | ✅ |
| `/analyze` | POST (no token) | 401 | ✅ |
| `/analyze` | POST (with token) | 200 + analysis | ✅ |
| `/history` | GET (no token) | 401 | ✅ |
| `/history` | GET (with token) | 200 + reviews | ✅ |

### Frontend Testing
| Feature | Test | Result |
|---------|------|--------|
| Auth guard | Open index.html without login | Redirect to login ✅ |
| Register | Create new account | Token saved, redirect ✅ |
| Login | Correct credentials | Redirect to dashboard ✅ |
| Logout | Click logout | Clear token, redirect ✅ |
| Analyze | Paste code + click analyze | Results displayed ✅ |
| Score | After analysis | Circle with color ✅ |
| Issues | After analysis | Colored badges ✅ |
| Graph | After analysis | Chart.js renders ✅ |
| PDF | Click download | PDF downloaded ✅ |
| History | Open history page | Reviews listed ✅ |
| Delete | Click delete | Review removed ✅ |
| Forgot PW | Click forgot password | OTP sent to email ✅ |

---

## 9. Documentation & Demo Preparation

### Git Repository
- **URL:** https://github.com/kushalgowdan24cs-glitch/ai-code-reviewer
- **Branch:** main
- **Commits:** 14+ commits (one per day)
- **Account:** Institutional email (kushalgowdan24cs@rnsit.ac.in)

### How to Run (Demo Steps)
1. `git clone https://github.com/kushalgowdan24cs-glitch/ai-code-reviewer`
2. `cd ai-code-reviewer && npm install`
3. Create `.env` with all keys
4. `npm run dev` → server starts on port 3000
5. Open `frontend/login.html` in browser
6. Register → Paste code → Analyze → See results → Download PDF

### Demo Script
1. Show Login page → Register new account
2. Paste buggy JavaScript code
3. Click Analyze → show loading spinner
4. Walk through: Score circle → Issues with badges → Suggestions → Improved code
5. Show Time Complexity graph → explain Big-O
6. Click Download PDF → open the report
7. Go to History → show search/filter
8. Show sidebar with recent reviews
9. Click Logout → show redirect to login

---

*Documentation prepared following RNS Institute of Technology Project Development Guidelines*
