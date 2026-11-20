import { useState } from 'react'
import Icon from './Icon'
import { useApp } from './ui'
import { PITCH as SHORT, PITCH_FULL } from '../data/pitch'
import { toFa } from '../utils/fa'

// نوار «حالت ارائه»: ارائه‌دهنده را قدم‌به‌قدم در یک داستان واحد می‌برد
export default function PitchBar() {
  const { pitchStep, setPitchStep, setPitch, reset, pitchKind } = useApp()
  const PITCH = pitchKind === 'full' ? PITCH_FULL : SHORT
  const [min, setMin] = useState(false)
  const [screen, title, say, show] = PITCH[pitchStep]
  const goto = (i) => {
    setPitchStep(i)
    reset(PITCH[i][0])
  }
  const last = pitchStep === PITCH.length - 1
  if (min)
    return (
      <button className="pb-mini" onClick={() => setMin(false)} aria-label="باز کردن نوار ارائه">
        ▶ {toFa(pitchStep + 1)}/{toFa(PITCH.length)}
      </button>
    )
  return (
    <div className="pb" role="region" aria-label="حالت ارائه">
      <div className="pb-top">
        <span className="pb-step">{toFa(pitchStep + 1)} از {toFa(PITCH.length)}</span>
        <b className="grow">{title}</b>
        <button onClick={() => setMin(true)} aria-label="کوچک کردن">
          <Icon name="minus" size={16} />
        </button>
        <button onClick={() => setPitch(false)} aria-label="خروج از حالت ارائه">
          <Icon name="x" size={16} />
        </button>
      </div>
      <div className="pb-dots">
        {PITCH.map((p, i) => (
          <button key={p[0] + i} className={i === pitchStep ? 'on' : i < pitchStep ? 'done' : ''} onClick={() => goto(i)} aria-label={p[1]} />
        ))}
      </div>
      <p className="pb-say">«{say}»</p>
      <div className="pb-show">
        <Icon name="info" size={14} /> {show}
      </div>
      <div className="pb-nav">
        <button className="pb-prev" disabled={pitchStep === 0} onClick={() => goto(pitchStep - 1)}>
          قبلی
        </button>
        <button className="pb-next" onClick={() => (last ? setPitch(false) : goto(pitchStep + 1))}>
          {last ? 'پایان ✓' : 'بعدی ←'}
        </button>
      </div>
      <span hidden>{screen}</span>
    </div>
  )
}
