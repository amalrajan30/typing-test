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

const getRandomWords = (length: number): string[] =>
  CommonWords.commonWords
    .sort(() => 0.5 - Math.random())
    .slice(0, length)
    .map(word => `${word} `)

// Generate typing words
export const getTypings = (
  length: number,
  index = 0,
  currentWordsLength = 0,
): Word[] => {
  const words = getRandomWords(length)
  return words.map((word, i) => {
    const wordIndex = i + currentWordsLength
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
