# ⌨️ KeyStrike

A full-stack typing speed test application built with React, Node.js, Express, and MongoDB.
Test your typing speed, track your progress, and compete on the global leaderboard.

🔗 **Live Demo:** [keystrike-typing.vercel.app](https://keystrike-typing.vercel.app)

---

## 🚀 Features

- ⚡ Real-time WPM and accuracy calculation
- 🔐 User authentication with JWT (Register / Login)
- 📊 Personal dashboard with best WPM, avg WPM & accuracy
- 🏆 Global leaderboard — top 10 fastest typists
- 💾 All results saved to MongoDB
- 📈 Visual typing analytics progression chart using Recharts
- 📱 Responsive design with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js, Helmet |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
keystrike/
  ├── frontend/          # React + Vite app
  │   └── src/
  │       ├── pages/     # Home, Login, Register, Dashboard, Leaderboard
  │       ├── components/# Navbar, TypingBox
  │       ├── context/   # AuthContext, ThemeContext
  │       └── services/  # Axios API calls
  ├── backend/           # Express REST API
  │   ├── models/        # User, Result schemas
  │   ├── routes/        # auth, results routes
  │   └── middleware/    # JWT auth middleware
  └── README.md
```

---

## ⚙️ Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/keystrike.git
cd keystrike
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in `/backend`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/home.png)

### Leaderboard
![Leaderboard](./screenshots/leaderboard.png)

### Typing Test in Action
![Typing Test](./screenshots/typing_test.png)

### User Dashboard Analytics
![Dashboard Chart](./screenshots/dashboard.png)

---

## 🧠 Technical Challenges & Solutions

### Solving the React Stale-Closure Timer Pitfall
One of the key engineering challenges during development was implementing the typing test countdown timer in React. 

Since React state updates are asynchronous, a standard `setInterval` callback captures a **stale closure** of the states (such as `completedWords` and `currentInput`) at the moment the timer is created. As a result, when the timer completes, it computes the final typing statistics using stale, empty initial values instead of the user's real-time input.

**The Solution:**
We resolved this by utilizing mutable React `useRef` hooks to keep track of the active state values (`wordsListRef`, `completedWordsRef`, `wordIndexRef`, `currentInputRef`, `userRef`). These references are updated synchronously on every keystroke. The timer's tick handler reads directly from the `.current` fields of these refs, ensuring it always accesses the most up-to-date values to calculate and save the final score accurately without triggering unnecessary re-renders.

---

## 📄 License

MIT License — feel free to fork and build on it!
