import { useState } from 'react'
import Icon from './Icon'

// تصویر 3D از public/assets/<name>.png؛ اگر هنوز ساخته نشده، یک جایگزین تمیز نشان می‌دهد.
const FALLBACK = {
  'ic-transfer': ['send', 'violet'],
  'ic-card': ['wallet', 'violet'],
  'ic-bill': ['bill', 'amber'],
  'ic-topup': ['sim', 'magenta'],
  'ic-internet': ['bolt', 'teal'],
  'ic-loan': ['home', 'teal'],
  'ic-envelopes': ['layers', 'violet'],
  'ic-shield': ['shield', 'violet'],
  'ic-family': ['users', 'magenta'],
  'ic-charity': ['heart', 'magenta'],
  'ic-qr': ['qr', 'violet'],
  'ic-all': ['grid', 'violet'],
  'il-rent': ['home', 'violet'],
  'il-assistant': ['chat', 'violet'],
  'il-payday': ['wallet', 'violet'],
  'il-shield': ['shield', 'violet'],
  'il-family': ['users', 'magenta'],
  'il-consent': ['key', 'violet'],
  'st-success': ['check', 'gold'],
  'st-blocked': ['shield', 'ok'],
  'st-waiting': ['clock', 'amber'],
  'st-empty': ['check', 'violet'],
  'st-offline': ['alert', 'violet'],
}

const missing = new Set()

export default function Art({ name, size = 56, className = '', pop = false }) {
  const [broken, setBroken] = useState(missing.has(name))
  const [icon, tone] = FALLBACK[name] || ['info', 'violet']
  const cls = `art ${pop ? 'pop' : 'rise'} ${className}`
  if (broken)
    return (
      <span className={`${cls} art-fb tone-${tone}`} style={{ width: size, height: size }} aria-hidden="true">
        <Icon name={icon} size={Math.round(size * 0.46)} stroke={2} />
      </span>
    )
  return (
    <img
      className={cls}
      src={`./assets/${name}.png`}
      width={size}
      height={size}
      alt=""
      draggable="false"
      onError={() => {
        missing.add(name)
        setBroken(true)
      }}
    />
  )
}
