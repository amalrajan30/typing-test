import {useState} from 'react'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'
import {TypingArea} from './components/TypingArea'
import {getTypings} from './utils/typings'
import NavBar from './components/Navbar'
import Footer from './components/Footer'
import Result from './components/Result'
import './App.css'

function App() {
  const [typings, setTypings] = useState(() => getTypings())
  const [showResult, setShowResult] = useState(false)
  const [speed, setSpeed] = useState('0wpm')
  const [accuracy, setAccuracy] = useState('0%')
  const [reset, setReset] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="App">
      <NavBar />
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
          getNew={() => setTypings(getTypings())}
          showResult={setShowResult}
        />
      )}

      <Dialog
        isOpen={isSettingsOpen}
        onDismiss={() => setIsSettingsOpen(false)}
      >
        <button aria-label="close">
          <span aria-hidden>×</span>
        </button>
        <div className="settings"></div>
      </Dialog>

      <Footer />
    </div>
  )
}

export default App
