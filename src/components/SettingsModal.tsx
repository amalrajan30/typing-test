import {useState, SyntheticEvent} from 'react'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'

interface SettingsModalProps {
  open: boolean
  onDismiss: () => void
  changeSettings: (type: string, length: number) => void
}

function SettingsModal({open, onDismiss, changeSettings}: SettingsModalProps) {
  const [type, setType] = useState('words')
  const [length, setLength] = useState('60')
  const [customLength, setCustomLength] = useState('60')

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    changeSettings(
      type,
      length === 'custom' ? Number(customLength) : Number(length),
    )
    onDismiss()
  }
  return (
    <Dialog isOpen={open} onDismiss={() => onDismiss()}>
      <div className="modal-header">
        <h2>Settings</h2>
        <button onClick={() => onDismiss()} aria-label="close">
          <span aria-hidden>×</span>
        </button>
      </div>
      <div className="settings">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="type">
              Type
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="form-input"
              id="type"
              name="type"
            >
              <option value="time">Time</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="length">
              Length
            </label>
            <select
              value={length}
              onChange={e => setLength(e.target.value)}
              className="form-input"
              id="length"
              name="length"
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="60">60</option>
              <option value="120">120</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {length === 'custom' ? (
            <div className="form-group">
              <label className="form-label" htmlFor="Custom">
                Custom
              </label>
              <input
                value={customLength}
                onChange={e => setCustomLength(e.target.value)}
                className="form-input"
                id="Custom"
                name="Custom"
                type="number"
              />
            </div>
          ) : null}
          <div className="form-group">
            <button className="from-button" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}

export default SettingsModal
