export function LiveResult({
  speed,
  accuracy,
  reset,
  remainingSeconds,
  testType,
}: {
  speed: string
  accuracy: string
  reset: () => void
  remainingSeconds: number
  testType: string
}) {
  return (
    <div className="liveResult">
      {testType === 'time' ? <p>{remainingSeconds}</p> : null}
      <div>wpm: {speed}</div>
      <div>acc: {accuracy}</div>
      <button className="button" onClick={reset}>
        Restart
      </button>
    </div>
  )
}
