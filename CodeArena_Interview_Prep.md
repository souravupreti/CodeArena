# CodeArena – AI-Powered DSA Learning Platform
## Interview Preparation & Revision Notes

---

### 1. Project Overview & Problem Solved
**CodeArena** is a full-stack engineering platform that provides a professional environment for practicing Data Structures and Algorithms (DSA).

**The Problem it Solves:** 
Traditional DSA platforms often lack personalized mentorship and visual learning. CodeArena bridges this gap by integrating an **AI Tutor (Gemini)** for instant doubt resolution and **Video Editorials** for visual understanding, all within a real-time code execution environment.

**End-to-End Flow:**
1. **Frontend (React)**: User writes code in the Monaco Editor and submits it.
2. **State Management (Redux)**: Handles authentication and user state globally via `authSlice`.
3. **Backend (Node/Express)**: Receives the code, checks permissions using `userMiddleware` (JWT), and interfaces with external APIs.
4. **Execution (Judge0)**: The backend sends code to Judge0 for secure execution against hidden test cases using batch requests.
5. **Database (MongoDB)**: Stores user progress, problems, and submission history using Mongoose schemas.
6. **AI Support (Gemini)**: Provides context-aware hints based on the current problem metadata and user's code.

---

### 2. Technical Deep Dive

#### 🔐 Authentication (JWT + Redis)
- **Mechanism**: Uses JWT stored in `httpOnly` cookies for secure sessions.
- **Redis Integration**: Implements a **Token Blacklist** mechanism. When a user logs out, their token is stored in Redis until its expiration time. This prevents "zombie sessions" where a stolen token remains valid after logout.

#### 💻 Code Execution (Judge0)
- **Workflow**: Uses the **Judge0 Batch API**. Instead of sending test cases one by one, CodeArena sends all cases in a single batch request, significantly reducing latency.
- **Wait Logic**: Implements a promise-based polling mechanism (`waiting` function) to wait for execution results efficiently.

#### 🤖 AI Integration (Gemini)
- **Context Awareness**: The backend sends the **Problem Title, Description, Test Cases, and User's Code** to Gemini as a system instruction.
- **Role Consistency**: Configured to act strictly as a "DSA Tutor," refusing to discuss non-DSA topics to maintain the platform's focus.

#### 📊 Database Design
- **Indices**: Implemented unique indices on `emailId` and structured indices for `submission` lookups.
- **Cleanup**: Uses Mongoose `post` hooks on user deletion to automatically clean up all related submissions (Cascading deletes).

---

### 3. Basic Interview Questions

**Q: Explain your project in 1 minute.**
> "CodeArena is an AI-powered DSA platform built on the MERN stack. It allows users to solve coding problems in a professional Monaco editor, evaluate their solutions using the Judge0 API, and get real-time assistance from a Gemini-powered AI tutor. I also implemented a Redis-based logout system for better security and a video editorial section for visual learning."

**Q: What is your tech stack and why?**
> "I chose the **MERN stack** for its flexibility and massive community support. I used **Tailwind CSS 4** for premium UI, **Redux Toolkit** for predictable state management, and **Redis** specifically for token blacklisting—a standard production-grade security practice."

**Q: How does the code submission flow work?**
> "When a user submits, the frontend calls the `/submission/submit/:id` endpoint. The backend retrieves the hidden test cases, sends them as a batch to **Judge0**, polls for the result, updates the database, and returns the 'Accepted' or 'Failed' status to the client."

---

### 4. Intermediate Questions (Architecture & Trade-offs)

**Q: Why use Redis for Logout? Why not just clear the cookie?**
> "Clearing a cookie on the client side doesn't invalidate the JWT itself. If someone has intercepted that token, they can still use it until it expires. By using **Redis**, we maintain a 'denylist' on the server. During every request, our middleware checks Redis; if the token is there, we reject the request even if the JWT is technically still valid."

**Q: How do the frontend and backend interact securely?**
> "We use **CORS** configuration to restrict requests to our authorized origin. We also use **Cookies with Credentials** to ensure the JWT is never accessible to client-side JavaScript, protecting against XSS."

**Q: What trade-offs did you make during development?**
> "I used an external API (Judge0) for code execution instead of building a custom sandbox. While building a custom Docker-based runner would give more control, using Judge0 allowed me to focus on the **AI tutoring logic** and **real-time UI feedback**, which added more unique value to the project."

---

### 5. Advanced Questions (Scalability & Security)

**Q: How would you handle 100,000 Concurrent Users?**
> "1. **Database**: Implement MongoDB sharding for horizontal scaling.
2. **Caching**: Use Redis to cache the 'Problem List' to avoid hitting MongoDB for every homepage visit.
3. **Queueing**: Use a message queue like **RabbitMQ** to process code submissions asynchronously if the Judge0 API hits its rate limits."

**Q: How did you protect against common API attacks?**
> "I used **Validation Middleware** (validator.js) to sanitize inputs. I also implemented **System Instructions** for the AI to prevent 'Prompt Injection' attacks. For the video section, I used **Cloudinary Signed Uploads** so that users can't upload unauthorized files to my storage."

---

### 6. Debugging & Edge Cases

- **Q: What if Judge0 is down?**
  - "I would implement a timeout mechanism and a 'Service Temporarily Unavailable' UI state. I could also implement a local fallback runner for basic languages if the primary API is offline."
- **Q: What if the database crashes during a save?**
  - "I would use **Mongoose Transactions** to ensure that 'Problem Solved' status and 'Submission Record' are updated together or not at all (Atomic operations)."

---

### 7. 2-Minute Detailed Project Walkthrough (Interview Ready)

"Hello! I built **CodeArena**, which is a specialized platform for DSA enthusiasts. The core innovation here is the **context-aware AI assistance**. 

On the frontend, I used **React 19** with **Monaco Editor** to give users a VS-Code-like experience. For state, I used **Redux Toolkit** which handles everything from user auth to submission results.

The backend is where the heavy lifting happens. I built a robust **Node.js/Express** server that handles secure authentication with **JWT and Redis**. One of the technical highlights is the **Judge0 integration**—I implemented batch submission logic to evaluate multiple test cases simultaneously, making the 'Submit' button respond much faster than traditional sequential evaluation.

I also integrated the **Google Gemini API** not just as a side-chat, but as a tutor that knows exactly what problem you are solving and what code you've written. If you're stuck on a 'Linked List' problem, the AI won't just give you the answer; it analyzes your specific code and gives hints based on the test cases you're failing.

For the visual learners, I added a **Video Editorial** feature. Admin can upload video solutions which are securely hosted on **Cloudinary**. This creates a complete learning loop: Practice -> AI Assistance -> Visual Tutorial."

---

### 8. HR Questions

**Q: Why did you build this project?**
> "I wanted to combine my passion for DSA with modern AI capabilities. Most platforms feel lonely; I wanted to build something that feels like having a senior engineer sitting next to you while you code."

**Q: What was the biggest bug you faced?**
> "Handling the **unique indices in MongoDB** for array fields. I discovered that a unique index on an array (like `problemSolved`) is global across the collection, which caused signup collisions. Solving this taught me a lot about database indexing and schema design."

**Q: What’s your favorite part of the code?**
> "The **Gemini prompt engine**. Designing the system instruction to make the AI act like a tutor rather than a solution-generator was a fun challenge in prompt engineering."
