import * as React from 'react'
import {flatten} from 'ramda'
import {Words} from '../App'
import {Letter} from './Letter'

export function TypingArea(props: {typings: Words[]}) {
  const {typings} = props
  const [allTypings, changeAllTypings] = React.useState(typings)
  const [position, changePosition] = React.useState(0)
  const [wronglyTyped, changeWronglyTyped] = React.useState<
    undefined | string
  >()
  const chars = flatten(typings.map(type => type.letters))

  const onKeyUp = (e: React.KeyboardEvent) => {
    const currentChar = chars[position]
    const typedWord = allTypings[currentChar.wordIndex].letters.map(letter => {
      if (letter.index === currentChar.index) {
        letter.typed = true
        letter.valid = e.key === currentChar.char
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
    if (e.key !== currentChar.char) changeWronglyTyped(e.key)
    changePosition(position + 1)
  }

  return (
    <div className="typing-card">
      <div className="typing-area word" onKeyUp={onKeyUp} tabIndex={0}>
        {allTypings.map(word => (
          <span className="word">
            {word.letters.map(letter => (
              <Letter
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
