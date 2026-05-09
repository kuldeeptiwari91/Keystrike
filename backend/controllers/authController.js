import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) return res.status(400).json({ message: "User already exists" })

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ username, email, password: hashedPassword })

        res.status(201).json({
            token: generateToken(user._id),
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Invalid credentials" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

        res.json({
            token: generateToken(user._id),
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}