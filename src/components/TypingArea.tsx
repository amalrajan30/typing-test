import * as React from 'react'
import {flatten} from 'ramda'
import FocusLock from 'react-focus-lock'
import {Char, Word} from '../utils/typings'
import Letter from './Letter'
import {LiveResult} from './LiveResult'

interface TypingAreaProps {
  words: Word[]
  getNew: (charsLength?: number, wordsLength?: number) => void
  showResult: (show: boolean) => void
  speed: string
  setSpeed: (speed: string) => void
  accuracy: string
  setAccuracy: (accuracy: string) => void
  reset: boolean
  changeReset: (reset: boolean) => void
  isSettingsOpen: boolean
  testType: string
  setStartedTyping: (startedTyping: boolean) => void
}

export function TypingArea(props: TypingAreaProps) {
  const {
    words,
    getNew,
    showResult,
    speed,
    setSpeed,
    accuracy,
    setAccuracy,
    reset,
    changeReset,
    isSettingsOpen,
    testType,
    setStartedTyping,
  } = props
  const [allTypings, changeAllTypings] = React.useState<Word[]>([])
  const [position, changePosition] = React.useState(0)
  const [wronglyTyped, changeWronglyTyped] = React.useState<
    undefined | string
  >()
  const [startTime, setStartTime] = React.useState(0)
  const [correctCount, setCorrectCount] = React.useState(0)
  const [wordsToRemove, changeWordsToRemove] = React.useState<
    (string | null)[]
  >([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    changeAllTypings(words)
  }, [words])

  React.useEffect(() => {
    setTimeout(() => {
      changeWronglyTyped('')
    }, 200)
  }, [wronglyTyped])

  React.useEffect(() => {
    if (startTime) {
      setStartedTyping(true)
    }
  }, [startTime, setStartedTyping])

  React.useEffect(() => {
    const wordsElm = document.querySelectorAll('.word')
    if (wordsElm.length === 0) return
    const wordElmHeight = wordsElm[0].getBoundingClientRect().height
    const wordTop = wordsElm[0].getBoundingClientRect().top
    const lastWordTop = wordsElm[wordsElm.length - 1].getBoundingClientRect()
      .top
    const bottomLineTop = wordTop + wordElmHeight * 3
    const currentLetter = document.querySelector('.current')
    // we don't want to remove words if the user has reached the end
    if (lastWordTop <= bottomLineTop) {
      if (testType === 'time') {
        getNew(chars.length, words.length)
      }
      return
    }
    if (
      currentLetter &&
      currentLetter.getBoundingClientRect().top >= bottomLineTop
    ) {
      const remove: (string | null)[] = []
      for (let i = 0; i < wordsElm.length; i++) {
        if (wordsElm[i].getBoundingClientRect().top === wordTop) {
          remove.push(wordsElm[i].getAttribute('id'))
        }
      }
      console.log({remove})
      changeWordsToRemove([...wordsToRemove, ...remove])
    }
  }, [position, wordsToRemove])

  const chars = flatten(words.map(word => word.letters))

  console.log(`TypingArea:`, {chars: chars.length, words: words.length})

  const calculateSpeedAndAccuracy = React.useCallback(() => {
    const uncorrectedErrors = position - correctCount
    const time = (performance.now() - startTime) / 60000
    const speed = Math.floor((position / 5 - uncorrectedErrors) / time)
    const accuracy = Math.floor((correctCount / position) * 100)
    setSpeed(`${speed}wpm`)
    setAccuracy(`${accuracy}%`)
  }, [correctCount, position, setAccuracy, setSpeed, startTime])

  React.useEffect(() => {
    if (position > 5) {
      calculateSpeedAndAccuracy()
    }
  }, [calculateSpeedAndAccuracy, position])

  React.useEffect(() => {
    if (reset) {
      getNew()
      changePosition(0)
      setCorrectCount(0)
      changeWordsToRemove([])
      setStartTime(0)
      setAccuracy('0%')
      setSpeed('0wpm')
      setStartedTyping(false)
      changeReset(false)
    }
  }, [getNew, reset, setAccuracy, setSpeed, changeReset, setStartedTyping])

  const changeLetterState = (
    typedLetter: string,
    type: 'typed' | 'backspace',
    currentLetter: Char,
  ) => {
    // Finding the current letter and changing its sate

    const typedWord = words[currentLetter.wordIndex].letters.map(letter => {
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
    })

    // find currently typed word and update it's state
    const newTypings = words.map(word =>
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
      console.log('reached end of text')
      showResult(true)
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
        <LiveResult
          reset={() => changeReset(true)}
          accuracy={accuracy}
          speed={speed}
        />
      </section>
      <section
        className="typing-area"
        onClick={() => inputRef.current?.focus()}
        tabIndex={0}
      >
        {!isSettingsOpen ? (
          <FocusLock>
            <input
              data-no-focus-lock
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
        ) : null}
        {words
          .filter(
            word => !wordsToRemove.includes(word.letters[0].index.toString()),
          )
          .map(word => {
            const wordKey = word.letters[0].index.toString()
            return (
              <span key={wordKey} id={wordKey} className="word">
                {word.letters.map((letter, index) => (
                  <Letter
                    key={`${index}-${letter.char}`}
                    letter={letter}
                    position={position}
                    wrongLetter={wronglyTyped}
                  />
                ))}
              </span>
            )
          })}
      </section>
    </main>
  )
}
