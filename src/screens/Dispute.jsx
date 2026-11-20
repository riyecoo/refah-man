import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, Screen, useApp } from '../components/ui'
import { CATS, transactions } from '../data/mock'
import { money } from '../utils/fa'

const REASONS = [
  ['notdone', 'پول کم شد ولی خرید انجام نشد'],
  ['atm', 'خودپرداز پول نداد'],
  ['twice', 'دو بار کم شد'],
  ['unknown', 'این تراکنش را من انجام نداده‌ام'],
  ['wrong', 'مبلغ اشتباه است'],
]

// اعتراض به تراکنش، بدون فرم کاغذی و رفتن به شعبه
export default function Dispute({ id }) {
  const { addCase, reset, setFrozen, frozen } = useApp()
  const [tid, setTid] = useState(id || null)
  const [reason, setReason] = useState(null)
  const [note, setNote] = useState('')
  const [file, setFile] = useState(null)
  const [freeze, setFreeze] = useState(true)
  const t = transactions.find((x) => x.id === tid)
  const out = transactions.filter((x) => x.amount < 0)

  const submit = () => {
    if (reason === 'unknown' && freeze) setFrozen({ ...frozen, c1: true })
    const r = REASONS.find((x) => x[0] === reason)[1]
    const cid = addCase({
      kind: 'dispute',
      icon: 'alert',
      title: `اعتراض: ${t.title}`,
      summary: `${money(-t.amount)} تومان · ${r}`,
      steps: [
        ['اعتراض ثبت شد', 'امروز'],
        ['درخواست گزارش از شبکه‌ی پرداخت (شاپرک)', 'معمولاً ۲ روز کاری'],
        ['بررسی کارشناس', ''],
        ['نتیجه: برگشت مبلغ یا پاسخ کتبی', ''],
      ],
    })
    reset('case', { id: cid, fresh: true })
  }

  return (
    <Screen title="اعتراض به تراکنش">
      {!t ? (
        <>
          <p className="muted">کدام تراکنش؟</p>
          <Card className="list">
            {out.map((x) => (
              <button key={x.id} className="txn" onClick={() => setTid(x.id)}>
                <span className="txn-ic" style={{ color: CATS[x.cat].c, background: `color-mix(in srgb, ${CATS[x.cat].c} 13%, transparent)` }}>
                  <Icon name="card" size={18} />
                </span>
                <span className="txn-txt">
                  <span className="txn-title">{x.title}</span>
                  <span className="txn-sub">
                    {x.date} · {x.time}
                  </span>
                </span>
                <span className="txn-amt">−{money(-x.amount)}</span>
              </button>
            ))}
          </Card>
        </>
      ) : (
        <>
          <Card className="owner slim">
            <span className="txn-ic" style={{ color: CATS[t.cat].c, background: `color-mix(in srgb, ${CATS[t.cat].c} 13%, transparent)` }}>
              <Icon name="card" size={18} />
            </span>
            <div className="grow">
              <b>{t.title}</b>
              <div className="muted small">
                {t.date} · {t.time} · {money(-t.amount)} تومان
              </div>
            </div>
            {!id && (
              <button className="link" onClick={() => setTid(null)}>
                تغییر
              </button>
            )}
          </Card>
          <div className="sec-head">
            <h2>چه مشکلی پیش آمده؟</h2>
          </div>
          <div className="reasons">
            {REASONS.map(([k, r]) => (
              <button key={k} className={`reason ${reason === k ? 'on' : ''}`} onClick={() => setReason(k)}>
                <span className="m-radio" />
                {r}
              </button>
            ))}
          </div>
          {reason === 'unknown' && (
            <Card className="guard">
              <div className="guard-head">
                <Icon name="shield" size={20} /> کارت را همین الان قفل کنیم؟
              </div>
              <label className="check">
                <input type="checkbox" checked={freeze} onChange={(e) => setFreeze(e.target.checked)} />
                <span>بله، کارت تا روشن شدن موضوع قفل موقت شود</span>
              </label>
            </Card>
          )}
          <textarea className="desc area" rows={3} placeholder="توضیح کوتاه (اختیاری)" value={note} onChange={(e) => setNote(e.target.value)} />
          <label className="attach">
            <Icon name="camera" size={20} />
            <span>{file ? `پیوست شد: ${file}` : 'عکس رسید یا پیامک (اختیاری)'}</span>
            <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0]?.name || null)} />
          </label>
          <Btn disabled={!reason} onClick={submit}>
            ثبت اعتراض
          </Btn>
          <p className="muted small center">طبق مقررات، نتیجه‌ی اعتراض حداکثر تا چند روز کاری اعلام می‌شود. هر مرحله را در «پرونده‌های من» می‌بینید.</p>
        </>
      )}
    </Screen>
  )
}
