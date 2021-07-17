import * as React from 'react'
import {flatten} from 'ramda'
import FocusLock from 'react-focus-lock'
import {Words} from '../App'
import Letter from './Letter'
import {LiveResult} from './LiveResult'

export function TypingArea(props: {words: Words[]; getNew: () => void}) {
  const {words, getNew} = props
  const [allTypings, changeAllTypings] = React.useState<Words[]>([])
  const [position, changePosition] = React.useState(0)
  const [wronglyTyped, changeWronglyTyped] = React.useState<
    undefined | string
  >()
  const [startTime, setStartTime] = React.useState(0)
  const [correctCount, setCorrectCount] = React.useState(0)
  const [speed, setSpeed] = React.useState(0)
  const [accuracy, setAccuracy] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    changeAllTypings(words)
  }, [words])

  React.useEffect(() => {
    setTimeout(() => {
      changeWronglyTyped('')
    }, 200)
  }, [wronglyTyped])

  const chars = flatten(words.map(word => word.letters))

  const calculateSpeedAndAccuracy = () => {
    const uncorrectedErrors = position - correctCount
    const time = (performance.now() - startTime) / 60000
    console.log({time})
    const speed = Math.floor((position / 5 - uncorrectedErrors) / time)
    const accuracy = Math.floor((correctCount / position) * 100)
    setSpeed(speed)
    setAccuracy(accuracy)
  }

  const reset = () => {
    getNew()
    changePosition(0)
    setCorrectCount(0)
    setStartTime(0)
    setAccuracy(0)
    setSpeed(0)
  }

  const onChange = (e: React.ChangeEvent) => {
    const currentChar = chars[position]
    if (!currentChar) {
      calculateSpeedAndAccuracy()
      return
    }
    if (position === 0) setStartTime(performance.now())
    const key = (e.nativeEvent as any).data
    const typedWord = allTypings[currentChar.wordIndex].letters.map(letter => {
      if (letter.index === currentChar.index) {
        letter.typed = true
        letter.valid = key === currentChar.char
        setCorrectCount(
          key === currentChar.char ? correctCount + 1 : correctCount,
        )
        return letter
      } else {
        return letter
      }
    })

    const newTypings = allTypings.map(word =>
      word.letters[0].wordIndex === currentChar.wordIndex
        ? {letters: typedWord}
        : word,
    )
    changeAllTypings(newTypings)
    if (key !== currentChar.char && key !== ' ') changeWronglyTyped(key)
    changePosition(position + 1)
  }

  return (
    <main className="typing-card">
      <section>
        <LiveResult reset={reset} accuracy={accuracy} speed={speed} />
      </section>
      <section
        className="typing-area word"
        onClick={() => inputRef.current?.focus()}
        tabIndex={0}
      >
        <FocusLock>
          <input
            placeholder="Typing area"
            style={{position: 'fixed', top: '-30px'}}
            type="text"
            name="test-input"
            autoFocus={true}
            onChange={onChange}
            ref={inputRef}
          />
        </FocusLock>
        {allTypings.map(word => (
          <span className="word">
            {word.letters.map((letter, index) => (
              <Letter
                key={`${index}-${letter.char}`}
                letter={letter}
                position={position}
                wrongLetter={wronglyTyped}
              />
            ))}
          </span>
        ))}
      </section>
    </main>
  )
}
