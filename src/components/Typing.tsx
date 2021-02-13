import * as React from 'react'
import * as R from 'ramda'
import findIndex from 'lodash/findIndex'
type typingProps = {
	typingPara: string[],
	words: boolean,
	wordsCount?: number
}

type position = {
	word: number,
	letter: number
}

interface Stats {
	totalWords: number,
	totalLetters: number,
	wrongLetters: number,
}

interface CharStats {
	typed: string,
	valid: boolean,
	delay: number
}

const defaultPosition: position = {
	word: 0,
	letter: 0
}
export default function Typing(props: typingProps) {
	const { typingPara } = props
	const [currentPos, changePos] = React.useState<position>(defaultPosition)
	const [correct, changeCorrect] = useAsyncRef<position[]>([])
	const [wrongs, changeWrongs] = React.useState<position[]>([])
	const [startTime, setStartTime] = React.useState<number>(0)
	const [wrongLetter, setWrongLetter] = React.useState<string>()
	const [speed, setSpeed] = React.useState<number>(0)
	const [accuracy, setAccuracy] = React.useState<number>(0)
	const [timer, setTimer] = React.useState<number>()
	const [entries, setEntries] = useAsyncRef<number>(0)

	const getCurrentLetter = () => currentPos.letter
	const getCurrentWord = () => currentPos.word
	const isThePressedKeyCorrect = (key: string) => key === typingPara[getCurrentWord()][getCurrentLetter()]
	const isLastLetter = () => getCurrentLetter() === typingPara[getCurrentWord()].length - 1
	const nextWord = (currentWord: number) => () => changePos({ word: currentWord + 1, letter: 0 })
	const nextLetter = (currentLetter: number) => () => changePos({ word: getCurrentWord(), letter: currentLetter + 1 })
	const previousWord = (currentWord: number) => ({ word: currentWord - 1, letter: typingPara[currentWord - 1].length - 1 })
	const previousLetter = (currentLetter: number) => ({ word: getCurrentWord(), letter: currentLetter - 1 })
	const reachedEnd = () => getCurrentWord() + 1 === typingPara.length && typingPara[getCurrentWord()].length === getCurrentLetter() + 1
	const isVeryFirstLetter = () => getCurrentWord() === 0 && getCurrentLetter() === 0

	const notRequiredKeys = ['Alt', 'Control', 'Tab', 'Shift', 'Enter', 'OS', 'CapsLock', 'Escape', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown']
	const notConcernedKey = (e: React.KeyboardEvent) => notRequiredKeys.includes(e.key)

	React.useEffect(() => {
		if (wrongLetter) {
			setTimeout(() => {
				setWrongLetter(undefined)
			}, 200)
		}
	}, [wrongLetter])

	// React.useEffect(() => {
	// 	return function cleanup() {
	// 		console.log('timer cleared from effect', timer)
	// 		clearTimeout(timer)
	// 	}
	// })

	type speedAndAccuracy = {
		speed: number,
		accuracy: number
	}

	const calculateSpeedAndAccuracy = (startTime: number, currentPos: number, correctNo: number): speedAndAccuracy => {
		if (currentPos > 5) {
			const time = (performance.now() - startTime) / 60000
			const speed = Math.floor((currentPos / 5) / time)
			const accuracy = Math.floor((correctNo / currentPos) * 100)
			return { speed, accuracy }
		} else return { speed: 0, accuracy: 0 }
	}

	// const memoized = React.useMemo(() => {
	// 	calculateSpeedAndAccuracy(startTime, entries.current, correct.current.length)
	// }, [entries, correct, startTime])

	const startCalculating = () => {
		return setInterval(() => {
			const result = calculateSpeedAndAccuracy(startTime, entries.current, correct.current.length)
			// console.log(`calculation args: ${startTime}, ${entries.current} `)
			setSpeed(result.speed)
			setAccuracy(result.accuracy)
		}, 1500)
	}

	const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>): void => {
		if (notConcernedKey(e)) return
		e.key === 'Backspace' ? handleBackSpace() : handleTyping(e)
	}

	const handleTyping = (e: React.KeyboardEvent<HTMLElement>): void => {
		if (getCurrentWord() >= typingPara.length) {
			return
		}
		if (getCurrentWord() === 0 && getCurrentLetter() === 0) {
			setStartTime(performance.now())
			const timerId = startCalculating()
			setTimer(timerId as unknown as number)
		} else if (reachedEnd()) {
			const getSpeedAndAccuracy = R.partial(calculateSpeedAndAccuracy, [startTime, entries.current + 1])
			clearInterval(timer)
			console.log('timer cleared from onKeyPress', timer)
			const speedAndAccuracy = e.key === typingPara[getCurrentLetter()]
				? getSpeedAndAccuracy(correct.current.length + 1)
				: getSpeedAndAccuracy(correct.current.length)
			setSpeed(speedAndAccuracy.speed)
			setAccuracy(speedAndAccuracy.accuracy)
		}

		if (isThePressedKeyCorrect(e.key)) {
			changeCorrect([...correct.current, currentPos])
		} else {
			setWrongLetter(e.key)
			const current = currentPos
			changeWrongs(wrongs => [...wrongs, current])
		}

		isLastLetter() ? nextWord(getCurrentWord())() : nextLetter(getCurrentLetter())()

		setEntries(entries.current + 1)
	}


	const handleBackSpace = (): void => {
		if (reachedEnd() || isVeryFirstLetter()) return
		const newPosition = getCurrentLetter() === 0
			? previousWord(getCurrentWord())
			: previousLetter(getCurrentLetter())
		changePos(newPosition)
		R.includes(newPosition, correct.current)
			? changeCorrect(R.slice(0, R.indexOf(newPosition, correct.current), correct.current))
			: changeWrongs(R.slice(0, R.indexOf(newPosition, wrongs), wrongs))

		setEntries(entries.current - 1)
	}

	const resetStats = (): void => {
		setStartTime(0)
		setSpeed(0)
		setAccuracy(0)
		changePos(defaultPosition)
		changeCorrect([])
		changeWrongs([])
		setEntries(0)
		clearInterval(timer)
	}


	return (
		<div className="typing-card">
			<div className="liveResult">
				<div>Speed: {speed}<sup style={{ fontSize: '16px' }}>WPM</sup></div>
				<div>Accuracy: {accuracy}%</div>
				<button onClick={resetStats}>Restart</button>
			</div>
			<div data-testid="typing-area" onKeyUp={onKeyUp} tabIndex={0} className='typing-area'>
				{
					typingPara.map((word, wordIndex) => (
						<span key={wordIndex} className="word">
							{
								[...word].map((letter, letterIndex) => {
									const pos: position = { word: wordIndex, letter: letterIndex }
									if (wordIndex === getCurrentWord() && letterIndex === getCurrentLetter()) {
										return <span key={`${wordIndex}-${letterIndex}`} data-testid="typing-current" className="letter current">{letter}</span>
									} else if (findIndex(correct.current, pos) !== -1) {
										return <span key={`${wordIndex}-${letterIndex}`} data-testid="typing-correct" className="letter correct">{letter}</span>
									} else if (findIndex(wrongs, pos) !== -1) {
										return (
											<>
												{wrongLetter && getCurrentWord() === wordIndex && getCurrentLetter() - 1 === letterIndex
													? <span key={`wrong-${wordIndex}- ${letterIndex}`} className="letter wrong">{wrongLetter}</span>
													: <span key={`${wordIndex}-${letterIndex}`} data-testid="typing-wrong" className="letter wrong">
														{letter}
													</span>
												}
											</>
										)
									} else {
										return <span key={`${wordIndex}-${letterIndex}`} className="letter">{letter}</span>
									}
								})
							}
						</span>
					))
				}
			</div>
		</div>
	)
}

function useAsyncRef<T>(value: T): [React.MutableRefObject<T>, (newVal: T) => void] {
	const ref = React.useRef(value)
	const [, forceRender] = React.useState(false)

	function updateState(newVal: T) {
		ref.current = newVal
		forceRender(s => !s)
	}

	return [ref, updateState]
}