import CommonWords from '../data/commonWords.json'

export interface Word {
  letters: Char[]
}

// Each letter in the word has the following properties:
// - char: the letter itself
// - index: the index of the letter in the typing area
// - wordIndex: the index of the word in the typing area
// - typed: whether the letter has been typed
// - valid: whether the user has typed the letter correctly
export interface Char {
  char: string
  index: number
  wordIndex: number
  typed: boolean
  valid: boolean
}

const getRandomWords = (): string[] =>
  CommonWords.commonWords
    .sort(() => 0.5 - Math.random())
    .slice(0, 30)
    .map(word => `${word} `)

// Generate typing words
export const getTypings = (): Word[] => {
  const words = getRandomWords()
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
