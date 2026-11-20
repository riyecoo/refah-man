import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Num, Screen, Sheet, useApp } from '../components/ui'
import { lifeIncome, lifeLines } from '../data/mock'
import { money, short, toFa } from '../utils/fa'

const pct = (a, b) => Math.round(((a - b) / b) * 100)

function compare(l) {
  if (!l.prev || l.now === l.prev) return { txt: 'مثل ماه قبل', tone: '' }
  const p = pct(l.now, l.prev)
  return p > 0 ? { txt: `${toFa(p)}٪ بیشتر از آبان`, tone: 'up' } : { txt: `${toFa(-p)}٪ کمتر از آبان`, tone: 'down' }
}

export default function LifeReceipt() {
  const { toast } = useApp()
  const [lines, setLines] = useState(lifeLines)
  const [edit, setEdit] = useState(null)
  const out = lines.reduce((s, l) => s + l.now, 0)
  const inc = lifeIncome.reduce((s, [, v]) => s + v, 0)
  const saved = inc - out
  const top = lines.filter((l) => l.prev).sort((a, b) => b.now - b.prev - (a.now - a.prev))[0]
  const near = lines.filter((l) => l.cap && l.now / l.cap >= 0.8)

  return (
    <Screen
      title="صورت‌حساب زندگی"
      action={
        <button className="hdr-btn" onClick={() => toast('صورت‌حساب آذر به‌صورت تصویر ذخیره شد')} aria-label="ذخیره">
          <Icon name="download" size={20} />
        </button>
      }
    >
      <div className="paper">
        <div className="paper-head">
          <img src="./assets/app-icon.png" alt="" />
          <b>صورت‌حساب زندگی</b>
          <span>آذر ۱۴۰۵ · احسان هاشمی</span>
        </div>
        <div className="paper-rule" />

        <div className="paper-sec">خرج‌ها</div>
        {lines.map((l) => {
          const c = compare(l)
          const ratio = l.cap ? l.now / l.cap : 0
          return (
            <button key={l.id} className={`pl ${ratio >= 0.8 ? 'warn' : ''}`} onClick={() => setEdit(l)}>
              <span className="pl-row">
                <span>{l.t}</span>
                <span className="pl-dots" />
                <b>
                  <Num>{money(l.now)}</Num>
                </b>
              </span>
              <span className="pl-sub">
                <span className={`pl-cmp ${c.tone}`}>{c.txt}</span>
                {l.cap ? (
                  <span className="pl-cap">
                    <span className="cap-track">
                      <i style={{ width: `${Math.min(100, ratio * 100)}%` }} />
                    </span>
                    <em>
                      {toFa(Math.round(ratio * 100))}٪ از سقف {short(l.cap)}
                    </em>
                  </span>
                ) : (
                  <span className="pl-nocap">+ سقف بگذار</span>
                )}
              </span>
            </button>
          )
        })}
        <div className="paper-rule" />
        <div className="pl-row sum">
          <span>جمع خرج</span>
          <span className="pl-dots" />
          <b>
            <Num>{money(out)}</Num>
          </b>
        </div>

        <div className="paper-sec">واریزها</div>
        {lifeIncome.map(([t, v]) => (
          <div key={t} className="pl-row">
            <span>{t}</span>
            <span className="pl-dots" />
            <b>
              <Num>{money(v)}</Num>
            </b>
          </div>
        ))}
        <div className="paper-rule double" />
        <div className={`pl-row grand ${saved >= 0 ? 'pos' : 'neg'}`}>
          <span>{saved >= 0 ? 'پس‌انداز این ماه' : 'کسری این ماه'}</span>
          <span className="pl-dots" />
          <b>
            <Num>{money(Math.abs(saved))}</Num>
          </b>
        </div>

        <div className="paper-note">
          <p>
            بیشترین تغییر این ماه: <b>{top.t}</b> ({compare(top).txt}).
          </p>
          {near.length > 0 && (
            <p>
              {near.map((l) => l.t).join(' و ')} به ۸۰٪ سقف ماهانه رسیده؛ تا آخر ماه حواسمان هست.
            </p>
          )}
          <p className="muted">دسته‌بندی بر اساس صنف فروشگاه انجام شده است.</p>
        </div>
        <div className="paper-edge" />
      </div>

      <Sheet open={!!edit} onClose={() => setEdit(null)} title={edit ? `سقف ماهانه‌ی ${edit.t}` : ''}>
        {edit && (
          <>
            <p className="muted small center">وقتی به ۸۰٪ سقف برسید، یک اعلان آرام می‌گیرید. هیچ خریدی مسدود نمی‌شود.</p>
            <div className="amt-grid">
              {[2_000_000, 3_000_000, 5_000_000, 8_000_000, 10_000_000, 15_000_000].map((v) => (
                <button
                  key={v}
                  className={`amt-opt ${edit.cap === v ? 'on' : ''}`}
                  onClick={() => setEdit({ ...edit, cap: v })}
                >
                  {short(v)}
                </button>
              ))}
            </div>
            <Btn
              onClick={() => {
                setLines(lines.map((l) => (l.id === edit.id ? { ...l, cap: edit.cap } : l)))
                setEdit(null)
                toast('سقف ماهانه ذخیره شد')
              }}
            >
              ذخیره‌ی سقف
            </Btn>
          </>
        )}
      </Sheet>
    </Screen>
  )
}
