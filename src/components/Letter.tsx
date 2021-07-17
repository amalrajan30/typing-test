import * as React from 'react'
import classNames from 'classnames'
import {Char} from '../App'

type Props = {
  letter: Char
  position: number
  wrongLetter: undefined | string
}
function LetterComponent(props: Props) {
  const {letter, position, wrongLetter} = props
  const {char, index, typed, valid} = letter
  const [character, setCharacter] = React.useState(char)
  React.useEffect(() => {
    if (position - 1 === index && !valid && typed && wrongLetter) {
      setCharacter(wrongLetter)
    } else setCharacter(char)
  }, [char, index, position, typed, valid, wrongLetter])
  const letterClassName = classNames('letter', {
    current: props.position === index,
    correct: typed && valid,
    wrong: typed && !valid,
  })
  return (
    <>
      <span className={letterClassName}>{character}</span>
    </>
  )
}

// const Letter = React.memo(
//   LetterComponent,
//   (perv: Props, next: Props) =>
//     next.position !== perv.letter.index &&
//     next.letter.valid !== perv.letter.valid,
// )

export default LetterComponent
