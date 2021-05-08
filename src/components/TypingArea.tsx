import * as React from 'react'
import {flatten} from 'ramda'
import FocusLock from 'react-focus-lock'
import {Words} from '../App'
import Letter from './Letter'

export function TypingArea(props: {words: Words[]}) {
  const {words} = props
  const [allTypings, changeAllTypings] = React.useState(words)
  const [position, changePosition] = React.useState(0)
  const [wronglyTyped, changeWronglyTyped] = React.useState<
    undefined | string
  >()
  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    setTimeout(() => {
      changeWronglyTyped('')
    }, 200)
  }, [wronglyTyped])

  const chars = flatten(words.map(word => word.letters))

  const onChange = (e: React.ChangeEvent) => {
    const currentChar = chars[position]
    if (!currentChar) return
    const key = (e.nativeEvent as any).data
    const typedWord = allTypings[currentChar.wordIndex].letters.map(letter => {
      if (letter.index === currentChar.index) {
        letter.typed = true
        letter.valid = key === currentChar.char
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
    <div className="typing-card">
      <div
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
      </div>
    </div>
  )
}
