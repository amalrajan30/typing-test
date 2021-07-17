export function LiveResult({
  speed,
  accuracy,
  reset,
}: {
  speed: number
  accuracy: number
  reset: () => void
}) {
  return (
    <div className="liveResult">
      <div>
        Speed: {speed}
        <sup style={{fontSize: '16px'}}>WPM</sup>
      </div>
      <div>Accuracy: {accuracy}%</div>
      <button onClick={reset}>Restart</button>
    </div>
  )
}
