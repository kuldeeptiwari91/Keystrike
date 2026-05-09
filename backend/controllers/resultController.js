import Result from "../models/Result.js"

export const saveResult = async (req, res) => {
  try {
    const { wpm, accuracy, timeTaken } = req.body

    const result = await Result.create({
      userId: req.user.id,
      wpm,
      accuracy,
      timeTaken
    })

    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)

    res.json(results)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Result.aggregate([
      {
        $group: {
          _id: "$userId",
          bestWpm: { $max: "$wpm" },
          bestAccuracy: { $max: "$accuracy" }
        }
      },
      { $sort: { bestWpm: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          username: "$user.username",
          bestWpm: 1,
          bestAccuracy: 1
        }
      }
    ])

    res.json(leaderboard)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}