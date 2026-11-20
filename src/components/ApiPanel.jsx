import { useState } from 'react'
import Icon from './Icon'
import { API_BASE, API_MAP } from '../data/openApi'

const fmt = (o) => JSON.stringify(o, null, 2)

// پنل «حالت توسعه‌دهنده»: برای هر صفحه نشان می‌دهد کدام API بانکداری باز صدا زده می‌شود
export default function ApiPanel({ screen }) {
  const [open, setOpen] = useState(false)
  const calls = API_MAP[screen] || []
  return (
    <>
      <button className={`api-fab ${open ? 'on' : ''}`} onClick={() => setOpen(!open)} aria-label="نمایش API">
        <Icon name="code" size={16} /> API{calls.length ? <i>{calls.length}</i> : null}
      </button>
      {open && (
        <div className="api-panel" dir="ltr">
          <div className="api-head">
            <b>Refah Open API</b>
            <span>{API_BASE}</span>
            <button onClick={() => setOpen(false)} aria-label="بستن">
              <Icon name="x" size={16} />
            </button>
          </div>
          <div className="api-scr">screen: {screen}</div>
          {calls.length === 0 && <div className="api-empty">No external call on this screen.</div>}
          {calls.map((c, i) => (
            <div className="api-call" key={i}>
              <div className="api-line">
                <span className={`m m-${c.method}`}>{c.method}</span>
                <code>{c.path}</code>
                <span className="api-ok">{c.method === 'POST' ? '201' : '200'}</span>
              </div>
              {c.note && <div className="api-note" dir="rtl">{c.note}</div>}
              {c.body && <pre className="api-pre req">{fmt(c.body)}</pre>}
              <pre className="api-pre">{fmt(c.res)}</pre>
            </div>
          ))}
          <div className="api-foot">Authorization: Bearer ‹consent token› · mTLS · X-Request-ID</div>
        </div>
      )}
    </>
  )
}
