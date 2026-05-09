import axios from "axios"

const API = axios.create({
  baseURL: "https://keystrike-backend.onrender.com/api"
})

// Automatically attach token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token")
    if (token) req.headers.Authorization = `Bearer ${token}`
    return req
})

export const signup = (data) => API.post("/auth/signup", data)
export const login = (data) => API.post("/auth/login", data)
export const saveResult = (data) => API.post("/results", data)
export const getMyResults = () => API.get("/results/me")
export const getLeaderboard = () => API.get("/results/leaderboard")