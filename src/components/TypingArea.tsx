import * as React from 'react'
import {flatten} from 'ramda'
import FocusLock from 'react-focus-lock'
import {Char, Words} from '../App'
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
  // const [intervalTimer, setIntervalTimer] = React.useState<any>()
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

  const calculateSpeedAndAccuracy = React.useCallback(() => {
    const uncorrectedErrors = position - correctCount
    const time = (performance.now() - startTime) / 60000
    const speed = Math.floor((position / 5 - uncorrectedErrors) / time)
    const accuracy = Math.floor((correctCount / position) * 100)
    setSpeed(speed)
    setAccuracy(accuracy)
  }, [correctCount, position, startTime])

  React.useEffect(() => {
    if (position > 5) {
      calculateSpeedAndAccuracy()
    }
  }, [calculateSpeedAndAccuracy, position])

  const reset = () => {
    getNew()
    changePosition(0)
    setCorrectCount(0)
    setStartTime(0)
    setAccuracy(0)
    setSpeed(0)
  }

  const changeLetterState = (
    typedLetter: string,
    type: 'typed' | 'backspace',
    currentLetter: Char,
  ) => {
    // Finding the current letter and changing its sate
    const typedWord = allTypings[currentLetter.wordIndex].letters.map(
      letter => {
        if (letter.index === currentLetter.index) {
          if (type === 'typed') {
            letter.typed = true
            letter.valid = typedLetter === currentLetter.char
            setCorrectCount(
              typedLetter === currentLetter.char
                ? correctCount + 1
                : correctCount,
            )
          } else {
            letter.typed = false
            setCorrectCount(letter.valid ? correctCount - 1 : correctCount)
          }
          return letter
        } else {
          return letter
        }
      },
    )

    // find currently typed word and update it's state
    const newTypings = allTypings.map(word =>
      word.letters[0].wordIndex === currentLetter.wordIndex
        ? {letters: typedWord}
        : word,
    )
    changeAllTypings(newTypings)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(e.nativeEvent as any).data) return
    const currentChar = chars[position] // currently typed letter
    if (!currentChar) {
      calculateSpeedAndAccuracy()
      return
    }
    if (position === 0) setStartTime(performance.now())
    const key = (e.nativeEvent as any).data
    changeLetterState(key, 'typed', currentChar)
    // if the user typed is wrong
    if (key !== currentChar.char && key !== ' ') changeWronglyTyped(key)
    changePosition(position + 1)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newPosition = position - 1
      if (newPosition < 0) return
      changePosition(newPosition)
      changeLetterState('', 'backspace', chars[newPosition])
    }
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
            onKeyDown={onKeyDown}
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
