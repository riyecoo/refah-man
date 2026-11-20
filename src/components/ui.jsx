import { createContext, useContext, useEffect, useState } from 'react'
import Icon from './Icon'
import { money, toEn, toFa, tomanWords } from '../utils/fa'

/* ---------- navigation & app context ---------- */
export const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

// «حالت جمع»: همه‌ی اعداد پنهان می‌شوند؛ با نگه‌داشتن انگشت لحظه‌ای دیده می‌شوند
export function Num({ children }) {
  const { crowd } = useApp()
  const [peek, setPeek] = useState(false)
  if (!crowd) return <>{children}</>
  return (
    <span
      className={`num-hide ${peek ? 'peek' : ''}`}
      onPointerDown={(e) => {
        e.stopPropagation()
        setPeek(true)
      }}
      onPointerUp={() => setPeek(false)}
      onPointerLeave={() => setPeek(false)}
      title="برای دیدن نگه دارید"
    >
      {peek ? children : '••••'}
    </span>
  )
}

/* ---------- layout ---------- */
export function Screen({ title, back = true, action, children, className = '', footer, onBack }) {
  const { pop } = useApp()
  return (
    <div className={`scr ${className}`}>
      {title !== undefined && (
        <header className="hdr">
          {back ? (
            <button className="hdr-btn" onClick={onBack || pop} aria-label="بازگشت">
              <Icon name="back" size={22} />
            </button>
          ) : (
            <span className="hdr-btn ghost" />
          )}
          <h1>{title}</h1>
          {action || <span className="hdr-btn ghost" />}
        </header>
      )}
      <div className="scr-body">{children}</div>
      {footer && <div className="scr-foot">{footer}</div>}
    </div>
  )
}

export const Section = ({ title, more, onMore, children }) => (
  <section className="sec">
    {title && (
      <div className="sec-head">
        <h2>{title}</h2>
        {more && (
          <button className="link" onClick={onMore}>
            {more}
          </button>
        )}
      </div>
    )}
    {children}
  </section>
)

export const Card = ({ children, className = '', ...p }) => (
  <div className={`card ${className}`} {...p}>
    {children}
  </div>
)

export function Row({ icon, lead, title, sub, end, onClick, chevron, danger, tone }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className={`row ${danger ? 'danger' : ''}`} onClick={onClick}>
      {lead ||
        (icon && (
          <span className={`row-ic ${tone || ''}`}>
            <Icon name={icon} size={20} />
          </span>
        ))}
      <span className="row-txt">
        <span className="row-title">{title}</span>
        {sub && <span className="row-sub">{sub}</span>}
      </span>
      {end}
      {chevron && <Icon name="chev" size={18} className="row-chev" />}
    </Tag>
  )
}

export function Btn({ kind = 'primary', children, className = '', ...p }) {
  return (
    <button className={`btn ${kind} ${className}`} {...p}>
      {children}
    </button>
  )
}

export function Toggle({ on, onChange, label }) {
  return <button className={`toggle ${on ? 'on' : ''}`} aria-pressed={on} aria-label={label} onClick={() => onChange(!on)} />
}

export function Amount({ value, big, words = true, sign }) {
  const { crowd } = useApp()
  return (
    <div className={`amt ${big ? 'big' : ''}`}>
      <div className="amt-num">
        <Num>
          {sign && value > 0 ? '+' : ''}
          {money(Math.abs(value))}
        </Num>{' '}
        <span className="unit">تومان</span>
      </div>
      {words && !crowd && <div className="amt-words">{tomanWords(Math.abs(value))}</div>}
    </div>
  )
}

const noAv = new Set()
export function Avatar({ c, size = 46 }) {
  const [bad, setBad] = useState(!c?.id || noAv.has(c.id))
  if (!bad)
    return (
      <img
        className="av"
        src={`./assets/av-${c.id}.png`}
        width={size}
        height={size}
        alt=""
        onError={() => {
          noAv.add(c.id)
          setBad(true)
        }}
      />
    )
  return (
    <span className="av av-txt" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {(c?.name || '؟').replace('آقای ', '').slice(0, 1)}
    </span>
  )
}

export function Sheet({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grab" />
        {title && <h3 className="sheet-title">{title}</h3>}
        {children}
      </div>
    </div>
  )
}

export function Keypad({ onKey, extra }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', extra || '', '0', 'del']
  return (
    <div className="keypad">
      {keys.map((k, i) =>
        k === '' ? (
          <span key={i} />
        ) : (
          <button key={i} className="key" onClick={() => onKey(k)} aria-label={k === 'del' ? 'پاک کردن' : k}>
            {k === 'del' ? <Icon name="back" size={22} /> : k === 'finger' ? <Icon name="finger" size={26} /> : k === '000' ? toFa('000') : toFa(k)}
          </button>
        ),
      )}
    </div>
  )
}

export function Dots({ n, len = 4, error }) {
  return (
    <div className={`dots ${error ? 'shake' : ''}`}>
      {Array.from({ length: len }, (_, i) => (
        <span key={i} className={i < n ? 'on' : ''} />
      ))}
    </div>
  )
}

export function Steps({ at, of }) {
  return (
    <div className="steps">
      {Array.from({ length: of }, (_, i) => (
        <span key={i} className={i <= at ? 'on' : ''} />
      ))}
    </div>
  )
}

// «رمز دوم پویا»: یک کد پیامکی شبیه‌سازی‌شده که خودکار پر می‌شود
export function OtpField({ value, onChange }) {
  const { toast } = useApp()
  const [sent, setSent] = useState(0)
  useEffect(() => {
    if (!sent) return
    const t = setTimeout(() => {
      toast('پیامک بانک رفاه: رمز پویا ۱۱۱۱')
      onChange('1111')
    }, 1100)
    return () => clearTimeout(t)
  }, [sent])
  return (
    <div className="otp">
      <input inputMode="numeric" maxLength={4} value={toFa(value)} onChange={(e) => onChange(toEn(e.target.value).replace(/\D/g, ''))} placeholder="رمز دوم پویا" />
      <button className="otp-btn" onClick={() => setSent((v) => v + 1)}>
        {sent ? 'ارسال دوباره' : 'دریافت رمز'}
      </button>
    </div>
  )
}

export const Empty = ({ art = 'st-empty', title, sub }) => (
  <div className="empty">
    <img src={`./assets/${art}.png`} width="120" height="120" alt="" />
    <div className="strong">{title}</div>
    {sub && <div className="muted small">{sub}</div>}
  </div>
)
