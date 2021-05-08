import * as React from 'react'
import {render, screen} from '@testing-library/react'
import {build, fake, sequence, perBuild} from '@jackfranklin/test-data-bot'
import faker from 'faker'
import Letter from '../Letter'
import {Char} from '../../App'

describe('Letter component', () => {
  const letterBuilder = build<Char>('letter', {
    fields: {
      char: fake(f => f.random.alphaNumeric(1)),
      index: sequence(),
      wordIndex: sequence(),
      typed: perBuild(() => false),
      valid: perBuild(() => true),
    },
    traits: {
      typed: {
        overrides: {typed: perBuild(() => true)},
      },
      inValid: {
        overrides: {valid: perBuild(() => false)},
      },
    },
  })

  test('should have `current` class name if typing position is reached', () => {
    const letter = letterBuilder()
    render(<Letter letter={letter} position={letter.index} wrongLetter={''} />)
    expect(screen.getByText(letter.char).className).toContain('current')
  })

  test('should have `wrong` class name and show wrongly typed letter', () => {
    const letter = letterBuilder({traits: ['typed', 'inValid']})
    const wrongLetter = faker.random.alphaNumeric(1)
    render(
      <Letter
        letter={letter}
        position={letter.index + 1}
        wrongLetter={wrongLetter}
      />,
    )
    expect(screen.getByText(wrongLetter).className).toContain('wrong')
  })

  test('should have `correct` class name if its valid', () => {
    const letter = letterBuilder({traits: 'typed'})
    render(
      <Letter letter={letter} position={letter.index + 1} wrongLetter={''} />,
    )
    expect(screen.getByText(letter.char).className).toContain('correct')
  })
})
