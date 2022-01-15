import {useState} from 'react'
import {TypingArea} from './components/TypingArea'
import {getTypings} from './utils/typings'
import './App.css'

function App() {
  const [typings, setTypings] = useState(() => getTypings())

  return (
    <div className="App">
      <TypingArea words={typings} getNew={() => setTypings(getTypings())} />
    </div>
  )
}

export default App
