import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { saveResult } from "../services/api"

const sampleText = "the quick brown fox jumps over the lazy dog and the cat sat on the mat while the dog barked at the birds flying over the fence near the old wooden house by the river where children played every summer afternoon without a care in the world"
const TIME_LIMIT = 60

function TypingBox() {
  const [typed, setTyped] = useState("")
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [timeTaken, setTimeTaken] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const inputRef = useRef(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)
  const wpmRef = useRef(0)         // fix stale closure on timer save
  const accuracyRef = useRef(100)  // fix stale closure on timer save

  const { user } = useAuth()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  useEffect(() => {
    if (startTime && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setTimeTaken(TIME_LIMIT)
            setIsFinished(true)
            if (user) {
              saveResult({
                wpm: wpmRef.current,
                accuracy: accuracyRef.current,
                timeTaken: TIME_LIMIT,
              })
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [startTime, isFinished, user])

  const handleChange = (e) => {
    if (isFinished) return
    const value = e.target.value

    if (!startTimeRef.current && value.length === 1) {
      const now = Date.now()
      startTimeRef.current = now
      setStartTime(now)
    }

    setTyped(value)

    if (startTimeRef.current) {
      const minutes = (Date.now() - startTimeRef.current) / 60000
      const wordsTyped = value.trim() ? value.trim().split(" ").length : 0
      const nextWpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0
      wpmRef.current = nextWpm
      setWpm(nextWpm)
    }

    const correct = value.split("").filter((char, i) => char === sampleText[i]).length
    const nextAccuracy = Math.round((correct / value.length) * 100) || 100
    accuracyRef.current = nextAccuracy
    setAccuracy(nextAccuracy)

    if (value.length >= sampleText.length) {
      clearInterval(timerRef.current)
      const seconds = Math.round((Date.now() - startTimeRef.current) / 1000)
      setTimeTaken(seconds)
      setIsFinished(true)
      if (user) {
        saveResult({
          wpm: wpmRef.current,
          accuracy: accuracyRef.current,
          timeTaken: seconds,
        })
      }
    }
  }

  const restart = () => {
    setTyped("")
    setStartTime(null)
    startTimeRef.current = null
    wpmRef.current = 0
    accuracyRef.current = 100
    setWpm(0)
    setAccuracy(100)
    setTimeLeft(TIME_LIMIT)
    setTimeTaken(0)
    setIsFinished(false)
    setTimeout(() => inputRef.current.focus(), 0)
  }

  return (
    <div className="max-w-3xl w-full px-6" onClick={() => inputRef.current.focus()}>

      {!isFinished && (
        <div className="flex gap-12 justify-center mb-8 text-center">
          <div>
            <div className="text-4xl font-mono text-yellow-500 dark:text-yellow-400">{wpm}</div>
            <div className="text-sm text-gray-500 mt-1">WPM</div>
          </div>
          <div>
            <div className="text-4xl font-mono text-green-500 dark:text-green-400">{accuracy}%</div>
            <div className="text-sm text-gray-500 mt-1">Accuracy</div>
          </div>
          <div>
            <div className={`text-4xl font-mono ${timeLeft <= 10 ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-gray-500 mt-1">Time Left</div>
          </div>
        </div>
      )}

      {isFinished ? (
        <div className="text-center">
          <div className="text-2xl text-gray-900 dark:text-white mb-6">Test Complete!</div>
          <div className="flex gap-12 justify-center mb-8 text-center">
            <div>
              <div className="text-4xl font-mono text-yellow-500 dark:text-yellow-400">{wpm}</div>
              <div className="text-sm text-gray-500 mt-1">WPM</div>
            </div>
            <div>
              <div className="text-4xl font-mono text-green-500 dark:text-green-400">{accuracy}%</div>
              <div className="text-sm text-gray-500 mt-1">Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-mono text-blue-500 dark:text-blue-400">{timeTaken}s</div>
              <div className="text-sm text-gray-500 mt-1">Time Taken</div>
            </div>
          </div>
          <button
            onClick={restart}
            className="px-6 py-3 bg-yellow-400 text-gray-950 font-bold rounded-lg hover:bg-yellow-300 transition"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="text-2xl font-mono tracking-wide leading-relaxed">
            {sampleText.split("").map((char, index) => {
              let color = "text-gray-400 dark:text-gray-500"
              if (index < typed.length) {
                color = typed[index] === char
                  ? "text-gray-900 dark:text-white"
                  : "text-red-500"
              }
              const isCursor = index === typed.length
              return (
                <span
                  key={index}
                  className={`${color} ${isCursor ? "border-l-2 border-yellow-400 animate-pulse" : ""}`}
                >
                  {char}
                </span>
              )
            })}
          </div>
          <input
            ref={inputRef}
            value={typed}
            onChange={handleChange}
            maxLength={sampleText.length}
            className="opacity-0 absolute"
          />
        </>
      )}
    </div>
  )
}

export default TypingBox