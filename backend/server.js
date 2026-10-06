import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

import authRoutes from "./routes/authRoutes.js"
import resultRoutes from "./routes/resultRoutes.js"

// Load env variables
dotenv.config()

const app = express()

// 1. Configure Helmet for security headers to keep the app secure
app.use(helmet())

// 2. Configure CORS to only allow our React app to connect
const allowedOrigins = [
  "https://keystrike-typing.vercel.app", // production vercel frontend
  "http://localhost:5173" // local frontend for development
]

app.use(cors({
  origin: (origin, callback) => {
    // If there is no origin (like mobile apps, postman, curl) we can allow it
    if (!origin) return callback(null, true)
    
    // If the origin is in our allowed list, we let it connect
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true)
    } else {
      // If it is not allowed, reject with a CORS error
      return callback(new Error("CORS policy blocks connection from this origin"), false)
    }
  },
  credentials: true
}))

// 3. Enable JSON body parsing
app.use(express.json())

// 4. Set up Rate Limiting to prevent DDOS / API spamming
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply the rate limiter only to all API routes
app.use("/api/", apiLimiter)

// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection error:", err))

// Define Routes
app.use("/api/auth", authRoutes)
app.use("/api/results", resultRoutes)

// Main root endpoint
app.get("/", (req, res) => {
    res.send("KeyStrike API running")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))