import { useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { saveResult } from "../services/api"

// ── Word pool ──────────────────────────────────────────────────────────────
const WORD_POOL = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with",
  "he","as","you","do","at","this","but","his","by","from","they","we","say","her",
  "she","or","an","will","my","one","all","would","there","their","what","so","up",
  "out","if","about","who","get","which","go","me","when","make","can","like","time",
  "no","just","him","know","take","people","into","year","your","good","some","could",
  "them","see","other","than","then","now","look","only","come","its","over","think",
  "also","back","after","use","two","how","our","work","first","well","way","even",
  "new","want","because","any","these","give","day","most","great","between","need",
  "large","often","hand","high","place","hold","free","real","life","few","north",
  "open","seem","together","next","white","children","walk","example","ease","paper",
  "group","always","music","those","both","mark","book","letter","until","mile",
  "river","car","feet","care","second","enough","plain","girl","usual","young","ready",
  "above","ever","red","list","though","feel","talk","bird","soon","body","dog",
  "family","direct","leave","song","measure","door","product","black","short","class",
  "wind","question","happen","complete","ship","area","half","rock","order","fire",
  "south","problem","piece","since","top","whole","king","space","heard","best","hour",
  "better","true","during","hundred","five","remember","step","early","west","ground",
  "interest","reach","fast","sing","listen","warm","common","bring","explain","dry",
  "language","shape","deep","clear","filled","heat","full","hot","check","object",
  "rule","among","power","town","fine","drive","road","farm","pull","draw","voice",
  "light","dark","rain","water","air","earth","sky","sun","moon","star","cloud","snow",
  "tree","leaf","flower","grass","stone","wall","floor","roof","window","table","chair",
  "lamp","pen","phone","key","bag","shoe","hat","coat","shirt","dress","play","run",
  "jump","swim","read","write","eat","sleep","walk","talk","love","help","stop","start",
  "open","close","push","pull","find","lose","try","fail","win","grow","cut","break",
]

function generateWords(count = 150) {
  return Array.from({ length: count }, () =>
    WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]
  )
}

// ── Constants ──────────────────────────────────────────────────────────────
const TIME_MODES = [15, 30, 60, 120]
const LINE_HEIGHT = 52 // px — must match CSS line-height

// ── Stats helpers ──────────────────────────────────────────────────────────
function computeStats(completed, curInput, curWord, elapsed) {
  let correctChars = 0, totalChars = 0
  completed.forEach(({ word, typed }) => {
    const len = Math.min(word.length, typed.length)
    for (let i = 0; i < len; i++) {
      if (typed[i] === word[i]) correctChars++
    }
    totalChars += typed.length
  })
  if (curWord && curInput.length > 0) {
    for (let i = 0; i < curInput.length; i++) {
      if (curInput[i] === curWord[i]) correctChars++
    }
    totalChars += curInput.length
  }
  const correctWords = completed.filter(w => w.typed === w.word).length
  const minutes = Math.max(elapsed, 1) / 60
  return {
    wpm:           Math.round(correctWords / minutes),
    accuracy:      totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100,
    correctWords,
    incorrectWords: completed.length - correctWords,
    timeTaken:     elapsed,
  }
}

// ── Component ──────────────────────────────────────────────────────────────
function TypingBox() {
  const [words,          setWords]          = useState(() => generateWords())
  const [wordIndex,      setWordIndex]      = useState(0)
  const [currentInput,   setCurrentInput]   = useState("")
  const [completedWords, setCompletedWords] = useState([])
  const [timeMode,       setTimeMode]       = useState(60)
  const [timeLeft,       setTimeLeft]       = useState(60)
  const [started,        setStarted]        = useState(false)
  const [finished,       setFinished]       = useState(false)
  const [result,         setResult]         = useState(null)

  // Refs used inside timer/event callbacks to avoid stale closures
  const inputRef           = useRef(null)
  const wordsContainerRef  = useRef(null)
  const cursorRef          = useRef(null)
  const timerRef           = useRef(null)

  const wordsListRef       = useRef(words)
  const completedWordsRef  = useRef([])
  const wordIndexRef       = useRef(0)
  const currentInputRef    = useRef("")
  const timeModeRef        = useRef(60)
  const userRef            = useRef(null)

  const { user } = useAuth()
  // keep this ref updated so the timer callback can always see the latest user value
  useEffect(() => { userRef.current = user }, [user])

  // auto-focus the hidden input when the page loads so the user can start typing right away
  useEffect(() => { inputRef.current?.focus() }, [])

  // ── Scroll: keep cursor in view (3-line window) ─────────────────────────
  useEffect(() => {
    const cursor    = cursorRef.current
    const container = wordsContainerRef.current
    if (!cursor || !container) return
    const cursorTop = cursor.offsetTop
    const scrollTop = container.scrollTop
    const relative  = cursorTop - scrollTop
    if (relative >= LINE_HEIGHT * 2) {
      // scroll the word display up so the cursor never goes below the second line
      container.scrollTop = cursorTop - LINE_HEIGHT
    }
  }, [wordIndex, currentInput])

  // ── Reset ────────────────────────────────────────────────────────────────
  const doReset = useCallback((newMode) => {
    // stop any running timer before resetting so it doesn't keep ticking in the background
    clearInterval(timerRef.current)
    const mode     = newMode ?? timeModeRef.current
    const newWords = generateWords()

    wordsListRef.current      = newWords
    completedWordsRef.current = []
    wordIndexRef.current      = 0
    currentInputRef.current   = ""
    timeModeRef.current       = mode

    setWords(newWords)
    setWordIndex(0)
    setCurrentInput("")
    setCompletedWords([])
    setTimeMode(mode)
    setTimeLeft(mode)
    setStarted(false)
    setFinished(false)
    setResult(null)

    setTimeout(() => {
      inputRef.current?.focus()
      if (wordsContainerRef.current) wordsContainerRef.current.scrollTop = 0
    }, 0)
  }, [])

  // pressing Tab restarts the test instantly without needing to click any button
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Tab") { e.preventDefault(); doReset() } }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [doReset])

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!started || finished) return
    // this runs every 1 second and counts down the timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // time is up — stop the timer and calculate the final score
          clearInterval(timerRef.current)
          const elapsed = timeModeRef.current
          const stats   = computeStats(
            completedWordsRef.current,
            currentInputRef.current,
            wordsListRef.current[wordIndexRef.current],
            elapsed
          )
          setResult(stats)
          setFinished(true)
          // only save the result to the database if someone is actually logged in
          if (userRef.current) {
            saveResult({ wpm: stats.wpm, accuracy: stats.accuracy, timeTaken: stats.timeTaken })
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [started, finished])

  // ── Input handler ────────────────────────────────────────────────────────
  const handleInput = (e) => {
    if (finished) return
    const value = e.target.value

    // start the timer the moment the user types their very first character
    if (!started && value.length > 0) setStarted(true)

    // if the user pressed space, they finished typing the current word
    if (value.endsWith(" ")) {
      const typed = value.trim()
      if (!typed) { setCurrentInput(""); currentInputRef.current = ""; return }

      const newEntry    = { word: wordsListRef.current[wordIndexRef.current], typed }
      const newCompleted = [...completedWordsRef.current, newEntry]

      completedWordsRef.current = newCompleted
      wordIndexRef.current      = wordIndexRef.current + 1
      currentInputRef.current   = ""

      setCompletedWords(newCompleted)
      setWordIndex(prev => prev + 1)
      setCurrentInput("")
      return
    }

    currentInputRef.current = value
    setCurrentInput(value)
  }

  // ── Live stats ───────────────────────────────────────────────────────────
  const elapsed   = timeMode - timeLeft
  const liveStats = started
    ? computeStats(completedWords, currentInput, words[wordIndex], Math.max(elapsed, 1))
    : null

  // ── Results screen ───────────────────────────────────────────────────────
  if (finished && result) {
    return (
      <div
        className="results-fade flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 76px)" }}
      >
        <div className="w-full max-w-lg px-8 flex flex-col items-center text-center">

          {/* Primary stats — centered side by side */}
          <div className="flex items-end justify-center gap-20 mb-10 w-full">
            <BigStat label="wpm"      value={result.wpm} />
            <BigStat label="accuracy" value={`${result.accuracy}%`} />
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: "var(--color-sub)", opacity: 0.25, marginBottom: 24, width: "100%" }} />

          {/* Secondary stats — evenly spaced */}
          <div className="flex justify-center gap-10 mb-12 w-full">
            <SmallStat label="time"            value={`${result.timeTaken}s`} />
            <SmallStat label="correct words"   value={result.correctWords} />
            <SmallStat label="incorrect words" value={result.incorrectWords} color="var(--color-error)" />
          </div>

          {/* Restart button — centered */}
          <RestartButton onClick={() => doReset()} />

          {/* nudge guests to log in so their results get saved */}
          {!user && (
            <p className="mt-6 text-sm" style={{ color: "var(--color-sub)" }}>
              <Link to="/login" style={{ color: "var(--color-main)" }}>log in</Link>
              {" "}to save your results
            </p>
          )}
        </div>
      </div>
    )
  }

  // ── Typing screen ────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: "calc(100vh - 76px)" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="w-full max-w-4xl px-8">

        {/* Mode selector */}
        <div className="flex justify-center mb-8">
          <div
            className="flex items-center gap-1 rounded-lg px-3 py-2"
            style={{ backgroundColor: "rgba(100,102,105,0.1)" }}
          >
            <span className="text-xs flex items-center gap-1.5 mr-2" style={{ color: "var(--color-sub)" }}>
              <ClockIcon /> time
            </span>
            {TIME_MODES.map(mode => (
              <button
                key={mode}
                onClick={(e) => { e.stopPropagation(); doReset(mode) }}
                className="px-3 py-1 rounded text-sm transition-all duration-150"
                style={{
                  color:           timeMode === mode ? "var(--color-main)" : "var(--color-sub)",
                  backgroundColor: timeMode === mode ? "rgba(226,183,20,0.15)" : "transparent",
                  fontWeight:      timeMode === mode ? 700 : 400,
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Timer / live stats */}
        <div className="mb-4 h-10 flex items-center gap-4">
          <span
            className="text-3xl font-bold transition-colors duration-200"
            // turn the timer red when there are 10 seconds or less left to warn the user
            style={{ color: timeLeft <= 10 && started ? "var(--color-error)" : "var(--color-main)" }}
          >
            {started ? timeLeft : timeMode}
          </span>
          {liveStats && (
            <span className="text-sm" style={{ color: "var(--color-sub)" }}>
              {liveStats.wpm} wpm &nbsp;·&nbsp; {liveStats.accuracy}% acc
            </span>
          )}
        </div>

        {/* ── Words area ─────────────────────────────────────────────────── */}
        <div
          ref={wordsContainerRef}
          className="words-container relative"
          style={{ height: LINE_HEIGHT * 3, overflow: "hidden", position: "relative" }}
        >
          <div
            className="flex flex-wrap"
            style={{ fontSize: 22, lineHeight: `${LINE_HEIGHT}px`, gap: `0 0.55em` }}
          >
            {words.map((word, wi) => {
              const isCompleted = wi < wordIndex
              const isCurrent   = wi === wordIndex
              const typedStr    = isCompleted
                ? (completedWords[wi]?.typed ?? "")
                : isCurrent ? currentInput : ""
              const hasError    = isCompleted && typedStr !== word

              return (
                <span
                  key={wi}
                  style={{
                    display:      "inline-flex",
                    alignItems:   "center",
                    height:       LINE_HEIGHT,
                    borderBottom: hasError
                      ? "2px solid var(--color-error)"
                      : "2px solid transparent",
                  }}
                >
                  {/* Characters within the word */}
                  {word.split("").map((char, ci) => {
                    // figure out exactly where the blinking cursor should sit
                    const cursorHere = isCurrent && ci === currentInput.length && currentInput.length < word.length

                    // grey = not typed yet, white/dark = correct, red = wrong character
                    let color = "var(--color-sub)"
                    if (ci < typedStr.length) {
                      color = typedStr[ci] === char ? "var(--color-text)" : "var(--color-error)"
                    }

                    return (
                      <span
                        key={ci}
                        ref={cursorHere ? cursorRef : undefined}
                        style={{ color, position: "relative" }}
                      >
                        {cursorHere && <Caret />}
                        {char}
                      </span>
                    )
                  })}

                  {/* user typed more letters than the word has — show the extras in red */}
                  {isCurrent && currentInput.length > word.length &&
                    currentInput.slice(word.length).split("").map((c, ei) => (
                      <span key={`xi${ei}`} style={{ color: "var(--color-error)", backgroundColor: "rgba(202,71,84,0.15)" }}>{c}</span>
                    ))
                  }
                  {isCompleted && typedStr.length > word.length &&
                    typedStr.slice(word.length).split("").map((c, ei) => (
                      <span key={`xe${ei}`} style={{ color: "var(--color-error)", backgroundColor: "rgba(202,71,84,0.15)" }}>{c}</span>
                    ))
                  }

                  {/* Cursor at end of word (when typed length >= word length) */}
                  {isCurrent && currentInput.length >= word.length && (
                    <span ref={cursorRef} style={{ position: "relative", display: "inline-block", width: 0, height: LINE_HEIGHT }}>
                      <Caret />
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </div>

        {/* Restart hint */}
        <div className="flex justify-center mt-8">
          <RestartButton onClick={(e) => { e.stopPropagation(); doReset() }} hint />
        </div>
      </div>

      {/* this input is invisible but it captures every keystroke from the user */}
      <input
        ref={inputRef}
        value={currentInput}
        onChange={handleInput}
        className="absolute opacity-0 pointer-events-none"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Caret() {
  return (
    <span
      className="caret-blink"
      style={{
        position:        "absolute",
        left:            -1,
        top:             7,
        bottom:          7,
        width:           2,
        backgroundColor: "var(--color-main)",
        borderRadius:    1,
      }}
    />
  )
}

function BigStat({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-sm mb-3" style={{ color: "var(--color-sub)" }}>{label}</div>
      <div style={{ fontSize: 88, lineHeight: 1, fontWeight: 700, color: "var(--color-main)" }}>
        {value}
      </div>
    </div>
  )
}

function SmallStat({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs mb-1" style={{ color: "var(--color-sub)" }}>{label}</div>
      <div className="text-2xl font-bold" style={{ color: color ?? "var(--color-text)" }}>{value}</div>
    </div>
  )
}

function RestartButton({ onClick, hint }) {
  const base = {
    display:        "inline-flex",
    alignItems:     "center",
    gap:            8,
    borderRadius:   8,
    fontSize:       13,
    cursor:         "pointer",
    border:         "none",
    background:     "transparent",
    transition:     "color 0.15s",
    color:          "var(--color-sub)",
    padding:        hint ? "8px 16px" : "10px 20px",
    ...(hint ? {} : { backgroundColor: "var(--color-sub)", color: "var(--color-bg)", padding: "10px 20px" }),
  }

  return (
    <button
      onClick={onClick}
      style={base}
      onMouseEnter={e => { e.currentTarget.style.color = hint ? "var(--color-main)" : "var(--color-bg)"; if (!hint) e.currentTarget.style.backgroundColor = "var(--color-main)" }}
      onMouseLeave={e => { e.currentTarget.style.color = hint ? "var(--color-sub)" : "var(--color-bg)"; if (!hint) e.currentTarget.style.backgroundColor = "var(--color-sub)" }}
    >
      <ResetIcon />
      {hint ? "tab — restart" : "restart"}
    </button>
  )
}

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.45" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export default TypingBox
