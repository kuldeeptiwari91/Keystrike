import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Signup Controller for user registration
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body

        // 1. Check if username, email, or password is empty
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Trim the inputs to remove any extra spaces
        const cleanUsername = username.trim()
        const cleanEmail = email.trim().toLowerCase()

        // 2. Validate username length (between 3 and 15 characters)
        if (cleanUsername.length < 3 || cleanUsername.length > 15) {
            return res.status(400).json({ message: "Username must be between 3 and 15 characters long" })
        }

        // 3. Username pattern check: only letters, numbers, and underscores
        const usernameRegex = /^[a-zA-Z0-9_]+$/
        if (!usernameRegex.test(cleanUsername)) {
            return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores" })
        }

        // 4. Validate email pattern using standard email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({ message: "Please provide a valid email address" })
        }

        // 5. Validate password length (minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        // Check if user already exists in the database with that email or username
        const existingUser = await User.findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this username or email" })
        }

        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create the user in MongoDB
        const user = await User.create({
            username: cleanUsername,
            email: cleanEmail,
            password: hashedPassword
        })

        // Return token and user info
        res.status(201).json({
            token: generateToken(user._id),
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// Login Controller for user sign-in
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // 1. Check if email or password fields are empty
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const cleanEmail = email.trim().toLowerCase()

        // Find user by email in database
        const user = await User.findOne({ email: cleanEmail })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // Send login success response
        res.json({
            token: generateToken(user._id),
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}