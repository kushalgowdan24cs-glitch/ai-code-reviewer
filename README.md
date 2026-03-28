# ⬡ CodeSense AI — Intelligent Code Reviewer

> A full-stack AI-powered web application that analyzes source code and provides detailed feedback including bug detection, code improvements, security vulnerabilities, time complexity analysis, and more.

**Built by:** Kushal Gowda N  
**Institution:** RNS Institute of Technology, Bengaluru  
**Department:** Computer Science Engineering (2024 Batch)  
**Project Duration:** 2 Weeks  

---

## 🎯 Project Overview

CodeSense AI is a web application where developers can paste any source code and receive instant AI-generated feedback covering 9 different analysis categories. The application features user authentication, review history, time complexity visualization, PDF report generation, and a clean dark-themed UI.

---

## 🚀 Live Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Register/Login with JWT tokens + Forgot Password via OTP |
| 🤖 **AI Code Analysis** | 9-category deep code review powered by OpenRouter AI |
| 🐛 **Bug Detection** | Identifies logic errors, wrong operators, incorrect conditions |
| 📐 **Formatting Check** | Indentation, spacing, style consistency issues |
| ⚠️ **Exception Handling** | Missing try/catch, null checks, edge cases |
| 🔒 **Security Analysis** | SQL injection, XSS, unsafe inputs, exposed secrets |
| ⚡ **Performance** | Unnecessary loops, memory leaks, inefficient operations |
| 📈 **Time Complexity** | Big-O analysis with interactive Chart.js graph |
| 🏆 **Code Score** | Quality score out of 100 with grade (A+ to F) |
| ✨ **Improved Code** | AI-generated optimized version with syntax highlighting |
| 📄 **PDF Report** | Professional downloadable PDF with all analysis results |
| 🕘 **Review History** | Save, search, filter, and delete past reviews |
| 📋 **Copy Code** | One-click copy of improved code to clipboard |

---

## 🧩 Tech Stack

### Frontend
- **HTML5, CSS3, Vanilla JavaScript** — No framework, clean and fast
- **Prism.js** — Syntax highlighting for improved code
- **Chart.js** — Time complexity graph visualization
- **jsPDF** — Client-side PDF report generation
- **Google Fonts** — Syne + JetBrains Mono

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database for reviews and users
- **JWT (jsonwebtoken)** — Secure authentication
- **bcryptjs** — Password hashing
- **Nodemailer** — OTP email for forgot password
- **dotenv** — Environment variable management
- **cors** — Cross-origin resource sharing
- **nodemon** — Development auto-restart

### AI Integration
- **OpenRouter API** — Gateway to multiple AI models
- **Model:** `openrouter/auto` — Auto-selects best available free model

### Design
- **Figma** — UI/UX wireframes and screen designs (4 screens)

---

## 🏗️ Project Architecture

```
3-Tier Architecture:
┌─────────────┐     HTTP/REST      ┌─────────────┐     Mongoose      ┌─────────────┐
│  Frontend   │ ◄────────────────► │   Backend   │ ◄───────────────► │  MongoDB    │
│  (HTML/JS)  │                    │ (Node/Express│                   │  (Atlas)    │
└─────────────┘                    └─────────────┘                   └─────────────┘
                                          │
                                          │ OpenRouter API
                                          ▼
                                   ┌─────────────┐
                                   │   AI Model  │
                                   │(openrouter) │
                                   └─────────────┘
```

---

## 📁 Folder Structure

```
ai-code-reviewer/
├── frontend/
│   ├── index.html          ← Main code reviewer page
│   ├── login.html          ← Login / Register page
│   ├── history.html        ← Review history page
│   ├── style.css           ← All styles
│   └── script.js           ← Frontend logic + API calls
│
├── backend/
│   ├── server.js           ← Express server entry point
│   ├── config/
│   │   └── db.js           ← MongoDB connection
│   ├── models/
│   │   ├── User.js         ← User schema
│   │   └── Review.js       ← Review schema
│   ├── routes/
│   │   ├── auth.js         ← /auth routes
│   │   ├── analyze.js      ← /analyze routes
│   │   └── history.js      ← /history routes
│   ├── controllers/
│   │   ├── authController.js      ← Auth request/response
│   │   ├── analyzeController.js   ← Analyze request/response
│   │   ├── historyController.js   ← History request/response
│   │   └── passwordController.js  ← Password reset request/response
│   ├── services/
│   │   ├── authService.js         ← Register/Login logic
│   │   ├── analyzeService.js      ← AI analysis + DB save logic
│   │   ├── historyService.js      ← DB query logic
│   │   ├── passwordService.js     ← OTP + reset logic
│   │   └── otpService.js          ← OTP generation + email
│   └── middleware/
│       └── authMiddleware.js      ← JWT protect middleware
│
├── .env                    ← Environment variables (not in git)
├── .env.example            ← Template for .env
├── .gitignore
└── package.json
```

---

## 🔐 API Endpoints

### Auth Routes (`/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/forgot-password` | Send OTP to email | No |
| POST | `/auth/reset-password` | Reset with OTP | No |

### Analyze Routes (`/analyze`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/analyze` | Analyze code with AI | Yes |

### History Routes (`/history`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/history` | Get all user reviews | Yes |
| GET | `/history/:id` | Get single review | Yes |
| DELETE | `/history/:id` | Delete a review | Yes |
| PUT | `/history/:id` | Update review title | Yes |

---

## 🧠 AI Analysis Categories

The AI analyzes code across **9 categories:**

1. **Bug** — Logic errors, wrong operators, incorrect conditions
2. **Formatting** — Indentation, spacing, style inconsistencies
3. **Exception Handling** — Missing try/catch, null checks, edge cases
4. **Security** — SQL injection, XSS, unsafe inputs, exposed secrets
5. **Performance** — Unnecessary loops, memory leaks, inefficient operations
6. **Naming** — Poor variable/function names, inconsistent conventions
7. **Complexity** — Overly complex logic that can be simplified
8. **Unused Code** — Dead code, unused variables, unnecessary imports
9. **Best Practice** — Language-specific conventions not followed

Each issue returns: `{ type, line, message }` with color-coded badges in the UI.

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- OpenRouter account (free)
- Gmail account with App Password

### 1. Clone the repository
```bash
git clone https://github.com/kushalgowdan24cs-glitch/ai-code-reviewer.git
cd ai-code-reviewer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```env
PORT=3000
OPENROUTER_API_KEY=sk-or-v1-your_key_here
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-code-reviewer
JWT_SECRET=your_super_secret_key_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 4. Start the backend server
```bash
npm run dev
```

### 5. Open the frontend
Open `frontend/login.html` in your browser.

> **Note:** Use Live Server extension in VS Code for best experience.

---

## 🎨 UI Screens (Figma Design)

All 4 screens were designed in Figma before implementation:

| Screen | Description |
|--------|-------------|
| **Screen 1** | Login / Register with tab switcher |
| **Screen 2** | Main code reviewer with editor |
| **Screen 3** | Results page with score, issues, graph |
| **Screen 4** | Review history with table + filters |

Figma File: [AI Code Reviewer UI Design](https://www.figma.com/design/jnD66IpmDvy4ZXBOkCSXCI/AI-Code-Reviewer---UI-Design)

---

## 🗓️ Development Timeline

| Day | Task Completed |
|-----|---------------|
| Day 1 | Project setup + Frontend UI |
| Day 2 | Git setup + Mock testing |
| Day 3 | AI Integration (OpenRouter) |
| Day 4 | Prism.js syntax highlighting + Copy button |
| Day 5 | Figma wireframes — all 4 screens |
| Day 6 | Backend refactored → services/ layer + 9-category AI analysis |
| Day 7 | MongoDB Atlas connected + Review model + History API |
| Day 8 | JWT Login/Register + protected routes |
| Day 9 | Login/Register UI + auth connected to frontend |
| Day 10 | Code Score + Time Complexity graph (Chart.js) |
| Day 11 | Professional PDF Report download (jsPDF) |
| Day 12 | History page + Figma designs implemented |
| Day 13 | Bug fixes + OTP forgot password + spinner + UX improvements |
| Day 14 | Documentation + README + Final Git push |

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- JWT tokens expire in **7 days**
- All sensitive routes protected with **authMiddleware**
- Reviews are **user-scoped** (users can only see their own reviews)
- `.env` file excluded from git via `.gitignore`
- OTP expires in **10 minutes**

---

## 📊 Database Schema

### User Collection
```js
{
  name:      String (required),
  email:     String (required, unique),
  password:  String (hashed),
  createdAt: Date
}
```

### Review Collection
```js
{
  userId:       ObjectId (ref: User),
  language:     String,
  code:         String,
  issues:       [{ type, line, message }],
  suggestions:  [String],
  improved_code: String,
  score:        Number (0-100),
  grade:        String,
  summary:      String,
  time_complexity: { original, improved, original_label, improved_label, explanation },
  createdAt:    Date
}
```

---

## 🚀 Future Enhancements

- [ ] Multi-language syntax highlighting (Python, Java, C++)
- [ ] Real-time collaborative code review
- [ ] GitHub integration — review PRs directly
- [ ] VS Code extension
- [ ] Team/organization accounts
- [ ] Code review streaks and gamification
- [ ] Export reviews to GitHub Gist

---

## 👨‍💻 Author

**Kushal Gowda N**  
B.E. Computer Science Engineering  
RNS Institute of Technology, Bengaluru  
GitHub: [@kushalgowdan24cs-glitch](https://github.com/kushalgowdan24cs-glitch)  
Email: kushalgowdan24cs@rnsit.ac.in

---

## 📄 License

This project is developed as part of the RNS Institute of Technology academic project curriculum.

---

*Built with ❤️ using Node.js, MongoDB, and OpenRouter AI*
