import {useState, useEffect} from 'react'
import {TypingArea} from './components/TypingArea'
import {getTypings} from './utils/typings'
import NavBar from './components/Navbar'
import Footer from './components/Footer'
import Result from './components/Result'
import SettingsModal from './components/SettingsModal'
import './App.css'

function App() {
  const [showResult, setShowResult] = useState(false)
  const [speed, setSpeed] = useState('0wpm')
  const [accuracy, setAccuracy] = useState('0%')
  const [reset, setReset] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [testType, setTestType] = useState('words')
  const [testLength, setTestLength] = useState(60)
  const [typings, setTypings] = useState(() => getTypings(testLength))
  const [startedTyping, setStartedTyping] = useState(false)

  const handleSettingsChange = (type: string, length: number) => {
    setTestType(type)
    setTestLength(length)
    setTypings(getTypings(length))
    setReset(true)
    setShowResult(false)
  }

  const getNew = (charsLength = 0, wordsLength = 0) => {
    const length = testType === 'words' ? testLength : 60
    if (testType === 'time' && !reset) {
      setTypings(types => [
        ...types,
        ...getTypings(wordsLength, charsLength, wordsLength),
      ])
    } else {
      setTypings(getTypings(length))
    }
  }

  useEffect(() => {
    if (testType === 'time' && startedTyping) {
      setTimeout(() => {
        setShowResult(true)
      }, testLength * 1000)
    }
  }, [startedTyping, testLength, testType])

  return (
    <div className="App">
      <NavBar openSettings={() => setIsSettingsOpen(true)} />
      {showResult ? (
        <Result
          accuracy={accuracy}
          speed={speed}
          reset={() => {
            setReset(true)
            setShowResult(false)
          }}
        />
      ) : (
        <TypingArea
          speed={speed}
          setSpeed={setSpeed}
          accuracy={accuracy}
          setAccuracy={setAccuracy}
          reset={reset}
          changeReset={setReset}
          words={typings}
          getNew={getNew}
          showResult={setShowResult}
          isSettingsOpen={isSettingsOpen}
          testType={testType}
          setStartedTyping={setStartedTyping}
        />
      )}

      <SettingsModal
        open={isSettingsOpen}
        onDismiss={() => setIsSettingsOpen(false)}
        changeSettings={handleSettingsChange}
      />

      <Footer />
    </div>
  )
}

export default App
