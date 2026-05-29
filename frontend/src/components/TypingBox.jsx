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
  const wpmRef = useRef(0)
  const accuracyRef = useRef(100)

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
    <div
      className="w-full h-screen overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
      onClick={() => !isFinished && inputRef.current?.focus()}
    >
      <div className="w-full max-w-6xl">
        {!isFinished ? (
          <div className="space-y-16">
            {/* Stats Bar - Minimal & Clean */}
            <div className="flex items-center justify-center gap-8 text-2xl font-mono">
              <div className="flex items-baseline gap-2">
                <span className="text-yellow-500 dark:text-yellow-400 font-bold">{wpm}</span>
                <span className="text-sm text-gray-400 dark:text-gray-500">wpm</span>
              </div>

              <div className="w-px h-8 bg-gray-300 dark:bg-gray-700"></div>

              <div className="flex items-baseline gap-2">
                <span className="text-green-500 dark:text-green-400 font-bold">{accuracy}%</span>
                <span className="text-sm text-gray-400 dark:text-gray-500">acc</span>
              </div>

              <div className="w-px h-8 bg-gray-300 dark:bg-gray-700"></div>

              <div className="flex items-baseline gap-2">
                <span className={`font-bold transition-colors ${timeLeft <= 10
                    ? "text-red-500 dark:text-red-400"
                    : "text-blue-500 dark:text-blue-400"
                  }`}>
                  {timeLeft}
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500">sec</span>
              </div>
            </div>

            {/* Typing Area - Bigger Text */}
            <div
              className="relative select-none"
              style={{
                fontSize: '36px',
                lineHeight: '1.9',
                letterSpacing: '0.02em'
              }}
            >
              <div className="font-mono text-left max-w-5xl mx-auto">
                {sampleText.split("").map((char, index) => {
                  let colorClass = "text-gray-400 dark:text-gray-600"
                  let bgClass = ""

                  if (index < typed.length) {
                    if (typed[index] === char) {
                      colorClass = "text-gray-800 dark:text-gray-200"
                    } else {
                      colorClass = "text-red-500 dark:text-red-400"
                      bgClass = "bg-red-100 dark:bg-red-900/20 rounded"
                    }
                  }

                  const isCursor = index === typed.length

                  return (
                    <span
                      key={index}
                      className={`relative ${colorClass} ${bgClass} transition-colors duration-100`}
                    >
                      {isCursor && (
                        <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-yellow-500 dark:bg-yellow-400 animate-pulse"></span>
                      )}
                      {char}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Restart Button */}
            <div className="flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  restart()
                }}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-lg
                  bg-gray-200 dark:bg-gray-800 
                  hover:bg-gray-300 dark:hover:bg-gray-700
                  text-gray-700 dark:text-gray-300
                  font-medium text-sm
                  transition-all duration-200
                  border border-transparent
                  hover:border-gray-300 dark:hover:border-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>restart</span>
              </button>
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="text-center space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-12">
              Test Complete!
            </h2>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  WPM
                </div>
                <div className="text-6xl font-bold font-mono text-yellow-500 dark:text-yellow-400">
                  {wpm}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Accuracy
                </div>
                <div className="text-6xl font-bold font-mono text-green-500 dark:text-green-400">
                  {accuracy}%
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </div>
                <div className="text-6xl font-bold font-mono text-blue-500 dark:text-blue-400">
                  {timeTaken}s
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <button
                onClick={restart}
                className="px-8 py-3 rounded-lg
                  bg-yellow-500 hover:bg-yellow-400
                  text-gray-900 font-semibold
                  transition-all duration-200
                  shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30
                  hover:scale-105 active:scale-95"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        maxLength={sampleText.length}
        className="absolute opacity-0 pointer-events-none"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  )
}

export default TypingBox