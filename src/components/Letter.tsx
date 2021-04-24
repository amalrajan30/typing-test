import * as React from 'react'
import classNames from 'classnames'
import {Chars} from '../App'

type Props = {
  letter: Chars
  position: number
  wrongLetter: undefined | string
}
export default function Letter(props: Props) {
  const {letter} = props
  const {char, index, typed, valid} = letter
  const letterClassName = classNames('letter', {
    current: props.position === index,
    correct: typed && valid,
    wrong: typed && !valid,
  })
  return (
    <>
      <span className={letterClassName}>
        {(props.wrongLetter && index === props.position) || char}
      </span>
    </>
  )
}
