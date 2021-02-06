import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import user from '@testing-library/user-event'
import TypingTest from '../Typing'

jest.useFakeTimers()

describe('Typing', () => {
	test('should render typing component', () => {
		const testPara = 'Hello There'
		render(<TypingTest typingPara={testPara} />)
		const typingArea = screen.getByTestId(/typing-area/i)
		user.type(typingArea, "Hll")
		jest.runAllTimers()
		// screen.debug(typingArea)
		expect(screen.getAllByTestId('typing-current').length).toBe(1)
		expect(screen.getAllByTestId('typing-correct').length).toBe(2)
		expect(screen.getAllByTestId('typing-wrong').length).toBe(1)
		expect(typingArea.children.length).toBe(testPara.length)
	})

	test('should be able to correct mistakes', () => {
		render(<TypingTest typingPara="Hello again" />)
		const typingArea = screen.getByTestId(/typing-area/i)
		user.type(typingArea, "Hwll")
		fireEvent.keyDown(typingArea, { key: 'Backspace' })
		fireEvent.keyDown(typingArea, { key: 'Backspace' })
		expect(screen.getAllByTestId(/typing-correct/i).length).toBe(1)
	})

	test('calculate wpm', async () => {
		render(<TypingTest typingPara="Hello again" />)
		await user.type(screen.getByTestId(/typing-area/i), "Hello again")
	})

})
