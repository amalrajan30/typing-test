import * as React from 'react'
import './App.css'
import Typing from './components/Typing'
import {TypingArea} from './components/TypingArea'
import CommonWords from './data/commonWords.json'

export interface Words {
  letters: Char[]
}
export interface Char {
  char: string
  index: number
  wordIndex: number
  typed: boolean
  valid: boolean
}
function App() {
  const [currentWords, setCurrentWords] = React.useState(20)
  const createChars = (para: string): Char[] => {
    return [...para].reduce(function createCharsReducer(
      acc: Char[],
      current,
      index,
    ) {
      const temp: Char = {
        wordIndex: 0,
        char: current,
        index: index,
        typed: false,
        valid: false,
      }
      temp.wordIndex =
        index === 0
          ? 0
          : acc[index - 1].char === ' '
          ? acc[index - 1].wordIndex + 1
          : acc[index - 1].wordIndex
      return [...acc, temp]
    },
    [])
  }

  const createTypings = (words: string[]): Words[] => {
    let index = 0
    return words.map((word, wordIndex) => {
      const currentWord = wordIndex === words.length - 1 ? word.trim() : word
      return {
        letters: [...currentWord].map(letter => {
          return {
            wordIndex,
            char: letter,
            index: index++,
            typed: false,
            valid: false,
          }
        }),
      }
    })
  }
  const words = CommonWords.commonWords
    .sort(() => 0.5 - Math.random())
    .slice(0, 20)
    .map(word => `${word} `)
  // const chars = createChars(words)
  const typings = createTypings(words)

  return (
    <div className="App">
      {/* <Typing typingPara={words.slice(0, currentWords)} words={true} /> */}
      <TypingArea words={typings} />
    </div>
  )
}

export default App
