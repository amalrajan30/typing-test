export function LiveResult({
  speed,
  accuracy,
  reset,
}: {
  speed: string
  accuracy: string
  reset: () => void
}) {
  return (
    <div className="liveResult">
      <div>Speed: {speed}</div>
      <div>Accuracy: {accuracy}</div>
      <button className="button" onClick={reset}>
        Restart
      </button>
    </div>
  )
}
