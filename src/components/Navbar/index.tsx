import './style.css'

interface NavBarProps {
  openSettings: () => void
}

function NavBar({openSettings}: NavBarProps) {
  return (
    <header className="header">
      <div>
        <h1>Typing Test</h1>
        <button onClick={() => openSettings()} className="button">
          Config
        </button>
      </div>
    </header>
  )
}

export default NavBar
