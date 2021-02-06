import * as React from 'react'
import findIndex from 'lodash/findIndex'
type typingProps = {
	typingPara: string[],
	words: boolean,
	wordsCount?: number
}

type positon = {
	word: number,
	letter: number
}

const defaultPosition: positon = {
	word: 0,
	letter: 0
}
export default function Typing(props: typingProps) {
	const { typingPara } = props
	const [currentPos, changePos] = useAsyncRef<positon>(defaultPosition)
	const [correct, changeCorrect] = useAsyncRef<positon[]>([])
	const [wrongs, changeWrongs] = React.useState<positon[]>([])
	const [startTime, setStartTime] = React.useState<number>(0)
	const [wrongLetter, setWrongLetter] = React.useState<string>()
	const [speed, setSpeed] = React.useState<number>(0)
	const [accuracy, setAccuracy] = React.useState<number>(0)
	const [timer, setTimer] = React.useState<number>()
	const [entries, setEntries] = useAsyncRef<number>(0)

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
			console.log(`calculation args: ${startTime}, ${entries.current} `)
			setSpeed(result.speed)
			setAccuracy(result.accuracy)
		}, 1500)
	}


	const onKeyPress = (e: React.KeyboardEvent<HTMLDivElement>): void => {
		if (currentPos.current.word >= typingPara.length) {
			return
		}
		if (currentPos.current.word === 0 && currentPos.current.letter === 0) {
			setStartTime(performance.now())
			const timerId = startCalculating()
			setTimer(timerId as unknown as number)
		} else if (currentPos.current.word + 1 === typingPara.length && typingPara[currentPos.current.word].length === currentPos.current.letter + 1) {
			let speedAndAccuracy: speedAndAccuracy
			clearInterval(timer)
			console.log('timer cleared from onKeyPress', timer)
			e.key === typingPara[currentPos.current.letter]
				? speedAndAccuracy = calculateSpeedAndAccuracy(startTime, typingPara.length, correct.current.length + 1)
				: speedAndAccuracy = calculateSpeedAndAccuracy(startTime, typingPara.length, correct.current.length)
			setSpeed(speedAndAccuracy.speed)
			setAccuracy(speedAndAccuracy.accuracy)
		}
		if (e.key === typingPara[currentPos.current.word][currentPos.current.letter]) {
			changeCorrect([...correct.current, currentPos.current])
		} else {
			setWrongLetter(e.key)
			const current = currentPos.current
			changeWrongs(wrongs => [...wrongs, current])
		}

		if (currentPos.current.letter === typingPara[currentPos.current.word].length - 1) {
			changePos({ word: currentPos.current.word + 1, letter: 0 })
		} else changePos({ word: currentPos.current.word, letter: currentPos.current.letter + 1 })

		setEntries(entries.current + 1)
	}

	const onKeyDown = (e: React.KeyboardEvent): void => {
		// debugger
		if (e.key === 'Backspace' && currentPos.current.word > 0) {
			let position: positon
			if (currentPos.current.letter === 0) {
				position = { word: currentPos.current.word - 1, letter: typingPara[currentPos.current.word - 1].length - 1 }
			} else position = { word: currentPos.current.word, letter: currentPos.current.letter - 1 }
			changePos(position)
			if (correct.current.includes(position)) {
				const index = correct.current.indexOf(position)
				changeCorrect(correct.current.slice(0, index))
			} else {
				const index = wrongs.indexOf(position)
				changeWrongs(wrong => wrong.slice(0, index))
			}
			setEntries(entries.current - 1)
		}
	}
	return (
		<div className="typing-card">
			<div className="liveResult">
				<div>Speed: {speed}<sup style={{ fontSize: '16px' }}>WPM</sup></div>
				<div>Accuracy: {accuracy}%</div>
			</div>
			<div data-testid="typing-area" onKeyDown={onKeyDown} onKeyPress={onKeyPress} tabIndex={0} className='typing-area'>
				{
					typingPara.map((word, wordIndex) => (
						<span key={wordIndex} className="word">
							{
								[...word].map((letter, letterIndex) => {
									const pos: positon = { word: wordIndex, letter: letterIndex }
									if (wordIndex === currentPos.current.word && letterIndex === currentPos.current.letter) {
										return <span key={`${wordIndex}-${letterIndex}`} data-testid="typing-current" className="letter current">{letter}</span>
									} else if (findIndex(correct.current, pos) !== -1) {
										return <span key={`${wordIndex}-${letterIndex}`} data-testid="typing-correct" className="letter correct">{letter}</span>
									} else if (findIndex(wrongs, pos) !== -1) {
										return (
											<>
												{wrongLetter && currentPos.current.word === wordIndex && currentPos.current.letter - 1 === letterIndex
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