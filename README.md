# <p align="center"><img src="https://img.shields.io/badge/CODEARENA-%23FF5C00.svg?style=for-the-badge&logo=codeforces&logoColor=black" alt="CodeArena Logo" width="300"/></p>

<p align="center">
  <strong>An Elite Competitive Programming & Algorithmic Battleground</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MERN_Stack-React_|_Node.js-blue.svg?style=flat-square" alt="Stack"/>
  <img src="https://img.shields.io/badge/Docker_Sandbox-Judge0-orange.svg?style=flat-square" alt="Sandbox"/>
  <img src="https://img.shields.io/badge/AI_Tutor-Google_Gemini-violet.svg?style=flat-square" alt="AI"/>
  <img src="https://img.shields.io/badge/Token_Blacklist-Redis-red.svg?style=flat-square" alt="Redis"/>
</p>

---

## ⚡ Introduction

**CodeArena** is a high-performance, responsive web-based competitive programming arena designed for developers to sharpen their algorithmic skills. Featuring a sleek, dark cyber-aesthetic inspired by *LeetCode* and *Codeforces*, CodeArena leverages premium sandbox virtualization and real-time AI contextual assistance to evaluate user submissions and suggest optimal guidelines.

---

## 🏆 Key Features

- 💻 **Dynamic Coding Workspace**: Real-time multi-language editor supported by Monaco Editor with advanced layout, word-wrap, and autocomplete.
- ⚙️ **Virtual Sandboxed Execution**: Powered by **Judge0 Batch API** for low-latency isolated execution of user code against visible and hidden test suites.
- 🔮 **Instant Evaluation Verdicts**: Rapid-response compiler statuses including `ACCEPTED`, `WRONG ANSWER`, `RUNTIME ERROR (RE)`, and time/memory analytics.
- 🤖 **Contextual AI Coach**: Context-aware **Google Gemini AI Tutor** integration capable of giving step-by-step mathematical guidelines and hints *without* revealing full raw code.
- 📊 **Developer Stats Dashboard**: Sleek progress charts mapping solved/total problems, Easy/Medium/Hard breakdown, and recent submission histories.
- 👑 **Global Competitive Leaderboards**: High-tech gamified ranking system indexing all registered coders using Custom Streaks Tiers (*Grandmaster*, *Master*, *Expert*, *Specialist*, *Pupil*).
- 🛡️ **Premium Security Core**: JWT cookie-based session management backed by **Redis blacklisting** for immediate, secure logout control.
- 🎬 **Video Editorial Streams**: Mapped video walkthroughs with localized custom media controllers for seamless logic study.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Redux Toolkit (Session Persistence), Tailwind CSS (Cyber Aesthetic)
- **Backend**: Node.js, Express.js (REST APIs), WebSockets (Real-time updates)
- **Databases**: MongoDB (Atlas Cloud indexing), Redis (Upstash memory storage for JWT blocks)
- **Virtualization**: Judge0 sandboxed API (RAPID Execution Model)
- **Intelligence**: Google Gemini-1.5-Flash (Contextual system instruction)

---

## 🚀 Local Installation & Setup

Follow these simple steps to run CodeArena locally:

### 1. Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- A **MongoDB Atlas** database account
- An **Upstash Redis** memory store account
- A **RapidAPI / Judge0** developer key

---

### 2. Clone and Setup Workspace
```bash
# Clone the repository
git clone https://github.com/your-username/codearena.git
cd codearena
```

---

### 3. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template and fill in configurations:
   ```bash
   cp .env.example .env
   ```
   Modify `.env` to supply your respective credential strings:
   ```env
   PORT=3000
   DB_CONNECT_STRING=mongodb+srv://<username>:<password>@cluster.mongodb.net/codearena
   JWT_KEY=your-jwt-secure-random-bytes
   REDIS_PASS=your-upstash-redis-password
   JUDGE0_KEY=your-rapidapi-judge0-key
   GEMINI_KEY=your-google-gemini-api-key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### 4. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_BASE_URL` points to your backend instance:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```
4. Start the Vite React SPA:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to: `http://localhost:5173`

---

## ☁️ Deployment Configurations

### 1. Frontend Deployment (Vercel)
The frontend project is packaged with routing rewrite handlers to seamlessly support Single Page App routing path fallbacks.
- **Service**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Configuration**: `vercel.json` (already pre-built)
- **Environment Variables**: Add `VITE_API_BASE_URL` pointing to your deployed backend URL.

### 2. Backend Deployment (Render)
- **Service**: Web Service
- **Build Command**: `npm install`
- **Start Command**: `node src/index.js`
- **Environment Variables**: Populate all keys listed in your backend `.env.example`.

### 3. Database Deployment (MongoDB Atlas & Upstash Redis)
- **MongoDB**: Create a free Cluster on MongoDB Atlas and set IP access to `0.0.0.0/0` (or Render's outbound IPs). Use the connection string in your backend configurations.
- **Redis**: Connect Upstash Redis via the Upstash Console. Populate your Node.js Redis controller configuration with the Upstash connection credential.

---

## 🔗 Live Demonstration

*Live Arena Link*: **[Live Demo Placeholder](https://codearena-deploy.vercel.app)**
