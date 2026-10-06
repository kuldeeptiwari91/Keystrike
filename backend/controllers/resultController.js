import Result from "../models/Result.js"

export const saveResult = async (req, res) => {
  try {
    const { wpm, accuracy, timeTaken } = req.body

    // 1. Check if wpm, accuracy, or timeTaken are missing
    if (wpm === undefined || accuracy === undefined || timeTaken === undefined) {
      return res.status(400).json({ message: "All result fields (wpm, accuracy, timeTaken) are required" })
    }

    // Convert inputs to numbers just in case they were sent as strings
    const numberWpm = Number(wpm)
    const numberAccuracy = Number(accuracy)
    const numberTimeTaken = Number(timeTaken)

    // 2. Validate datatype is a number
    if (isNaN(numberWpm) || isNaN(numberAccuracy) || isNaN(numberTimeTaken)) {
      return res.status(400).json({ message: "Invalid payload: fields must be numeric values" })
    }

    // 3. Security check to avoid cheating / leaderboard manipulation
    // Max WPM check: no human can type 250 WPM on standard tests, so flag it as cheating
    if (numberWpm < 0 || numberWpm > 250) {
      return res.status(400).json({ message: "Invalid WPM score: WPM must be between 0 and 250" })
    }

    // Accuracy validation check: must be a percentage between 0% and 100%
    if (numberAccuracy < 0 || numberAccuracy > 100) {
      return res.status(400).json({ message: "Invalid accuracy score: accuracy must be between 0 and 100" })
    }

    // Time validation check: must be one of the standard options (15, 30, 60, 120 seconds)
    const allowedTimes = [15, 30, 60, 120]
    if (!allowedTimes.includes(numberTimeTaken)) {
      return res.status(400).json({ message: "Invalid test duration: time must be 15, 30, 60, or 120 seconds" })
    }

    // Create a new result in the database
    const result = await Result.create({
      userId: req.user.id,
      wpm: numberWpm,
      accuracy: numberAccuracy,
      timeTaken: numberTimeTaken
    })

    // Return the newly created result
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