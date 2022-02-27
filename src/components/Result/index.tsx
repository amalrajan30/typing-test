import './style.css'

interface IResultProps {
  speed: string
  accuracy: string
  reset: () => void
}

function Result(props: IResultProps) {
  const {speed, accuracy, reset} = props
  return (
    <main className="result">
      <section>
        <span>
          <h3>Speed</h3>
          <span>{speed}wpm</span>
        </span>
        <span>
          <h3>Accuracy</h3>
          <span>{accuracy}</span>
        </span>
      </section>
      <button className="button" onClick={reset}>
        Restart
      </button>
    </main>
  )
}

export default Result
