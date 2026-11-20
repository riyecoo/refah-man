import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { Avatar, Btn, Card, OtpField, Screen, Steps, useApp } from '../components/ui'
import { KV } from './Accounts'
import { accounts, contacts, lifeIncome, lifeLines, loanProducts } from '../data/mock'
import { money, short, toFa } from '../utils/fa'

const MONTHS = ['دی', 'بهمن', 'اسفند', 'فروردین', 'اردیبهشت', 'خرداد']
const EXTRA = { اسفند: 10_000_000 } // خرید عید

const inst = (P, ratePct, n) => {
  const r = ratePct / 12 / 100
  return Math.round((P * r) / (1 - Math.pow(1 + r, -n)) / 1000) * 1000
}

// وام از درخواست تا واریز، بدون رفتن به شعبه
export default function LoanApply() {
  const { addCase, reset } = useApp()
  const [step, setStep] = useState(0)
  const [pid, setPid] = useState('q')
  const [amt, setAmt] = useState(100_000_000)
  const [n, setN] = useState(36)
  const [score, setScore] = useState(null)
  const [g, setG] = useState(null)
  const [gState, setGState] = useState('none') // none → sent → signed
  const [ok1, setOk1] = useState(false)
  const [ok2, setOk2] = useState(false)
  const [otp, setOtp] = useState('')

  const p = loanProducts.find((x) => x.id === pid)
  const needG = p.id !== 'p'
  const q = inst(amt, p.rate, n)
  const surplus = lifeIncome.reduce((s, [, v]) => s + v, 0) - lifeLines.reduce((s, l) => s + l.now, 0)
  let buf = accounts[0].balance
  const proj = MONTHS.map((m) => {
    const delta = surplus - q - (EXTRA[m] || 0)
    buf += delta
    return { m, delta, buf }
  })
  const short1 = proj.find((x) => x.delta < 0)
  const maxBuf = Math.max(...proj.map((x) => Math.abs(x.buf)), 1)

  useEffect(() => {
    if (gState !== 'sent') return
    const t = setTimeout(() => setGState('signed'), 2600)
    return () => clearTimeout(t)
  }, [gState])

  const submit = () => {
    const id = addCase({
      kind: 'loan',
      icon: 'bank',
      title: `وام ${p.t}`,
      summary: `${short(amt)} تومان، ${toFa(n)} قسط ماهانه‌ی ${short(q)} تومان`,
      steps: [
        ['درخواست، ضمانت و امضا ثبت شد', 'امروز'],
        ['بررسی کارشناس اعتبارات', 'معمولاً یک روز کاری'],
        ['تأیید نهایی و فعال شدن قرارداد', ''],
        ['واریز به حساب جاری', ''],
      ],
    })
    reset('case', { id, fresh: true })
  }

  return (
    <Screen title="درخواست وام بدون شعبه" onBack={step > 0 ? () => setStep(step - 1) : undefined}>
      <Steps at={step} of={4} />

      {step === 0 && (
        <>
          <div className="methods">
            {loanProducts.map((x) => (
              <button key={x.id} className={`method ${pid === x.id ? 'on' : ''}`} onClick={() => setPid(x.id)}>
                <span className="m-radio" />
                <span className="m-body">
                  <b>{x.t}</b>
                  <span className="m-line">{x.note}</span>
                  <span className="m-facts">
                    <span>تا {short(x.max)}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="sec-head">
            <h2>مبلغ و تعداد قسط</h2>
          </div>
          <div className="chips">
            {[50_000_000, 100_000_000, 200_000_000].map((v) => (
              <button key={v} className={`chip ${amt === v ? 'on' : ''}`} onClick={() => setAmt(v)}>
                {short(v)}
              </button>
            ))}
            {[12, 24, 36, 60].map((v) => (
              <button key={v} className={`chip ${n === v ? 'on' : ''}`} onClick={() => setN(v)}>
                {toFa(v)} قسط
              </button>
            ))}
          </div>
          <Card className="sim">
            <div className="sim-top">
              <span className="muted small">قسط ماهانه</span>
              <b className="total-num">{money(q)} تومان</b>
            </div>
            <p className="sim-say">
              {short1 ? (
                <>
                  <Icon name="alert" size={15} /> با این قسط، <b>{short1.m}</b> حدود <b>{short(-short1.delta)}</b> تومان کم می‌آورید و از پس‌انداز برداشته می‌شود.
                </>
              ) : (
                <>
                  <Icon name="check" size={15} /> با درآمد و خرج‌های فعلی، این قسط را راحت می‌دهید.
                </>
              )}
            </p>
            <div className="sim-bars">
              {proj.map((x) => (
                <div key={x.m} className={`sb ${x.delta < 0 ? 'neg' : ''}`}>
                  <span className="sb-col">
                    <i style={{ height: `${Math.max(6, (Math.abs(x.buf) / maxBuf) * 100)}%` }} />
                  </span>
                  <span className="sb-v">{short(x.buf)}</span>
                  <span className="sb-m">{x.m}</span>
                </div>
              ))}
            </div>
            <span className="muted small">موجودی پیش‌بینی‌شده‌ی آخر هر ماه، با حساب قسط، خرج‌های همیشگی و خرید عید.</span>
          </Card>
          <Btn onClick={() => setStep(1)}>ادامه: استعلام اعتبار</Btn>
        </>
      )}

      {step === 1 && (
        <>
          <Card className="credit">
            {score ? (
              <>
                <div className="credit-grade">{score}</div>
                <b>رتبه‌ی اعتباری شما خوب است</b>
                <span className="muted small">بر اساس سابقه‌ی پرداخت اقساط و چک‌ها. سقف قابل دریافت: {short(p.max)} تومان.</span>
              </>
            ) : (
              <>
                <Icon name="shield" size={40} />
                <b>استعلام از سامانه‌ی اعتبارسنجی</b>
                <span className="muted small">فقط با رضایت شما و فقط برای همین درخواست انجام می‌شود.</span>
                <Btn
                  onClick={() => {
                    setScore('…')
                    setTimeout(() => setScore('A2'), 1300)
                  }}
                >
                  {score === '…' ? 'در حال استعلام…' : 'استعلام کن'}
                </Btn>
              </>
            )}
          </Card>
          <Btn disabled={score !== 'A2'} onClick={() => setStep(needG ? 2 : 3)}>
            {needG ? 'ادامه: ضامن' : 'ادامه: قرارداد'}
          </Btn>
        </>
      )}

      {step === 2 && (
        <>
          <p className="muted">ضامن لازم نیست به شعبه بیاید. یک لینک می‌گیرد و در گوشی خودش، با رمز پویای خودش، ضمانت را امضا می‌کند.</p>
          <div className="g-list">
            {contacts.slice(0, 4).map((c) => (
              <button key={c.id} className={`g-item ${g?.id === c.id ? 'on' : ''}`} disabled={gState !== 'none'} onClick={() => setG(c)}>
                <Avatar c={c} size={44} />
                <span>{c.full}</span>
              </button>
            ))}
          </div>
          {g && (
            <Card className={`g-status ${gState}`}>
              {gState === 'none' && (
                <Btn onClick={() => setGState('sent')}>
                  <Icon name="send" size={18} /> فرستادن لینک ضمانت برای {g.name}
                </Btn>
              )}
              {gState === 'sent' && (
                <div className="g-wait">
                  <span className="spin" /> لینک فرستاده شد؛ منتظر امضای {g.full}…
                </div>
              )}
              {gState === 'signed' && (
                <div className="g-done">
                  <Icon name="check" size={18} stroke={2.6} /> {g.full} ضمانت را امضا کرد · سفته‌ی الکترونیکی ضامن صادر شد
                </div>
              )}
            </Card>
          )}
          <Btn disabled={gState !== 'signed'} onClick={() => setStep(3)}>
            ادامه: قرارداد
          </Btn>
        </>
      )}

      {step === 3 && (
        <>
          <Card className="list kv">
            <KV k="نوع وام" v={p.t} />
            <KV k="مبلغ" v={`${money(amt)} تومان`} />
            <KV k="قسط" v={`${toFa(n)} × ${money(q)} تومان`} />
            <KV k="ضامن" v={needG && g ? g.full : 'ندارد (کسر از مستمری)'} />
            <KV k="واریز به" v="حساب جاری" />
          </Card>
          <label className="check">
            <input type="checkbox" checked={ok1} onChange={(e) => setOk1(e.target.checked)} />
            <span>متن کامل قرارداد را خواندم و می‌پذیرم.</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={ok2} onChange={(e) => setOk2(e.target.checked)} />
            <span>سفته‌ی الکترونیکی به مبلغ {short(amt)} تومان به نام من صادر شود.</span>
          </label>
          <label className="field">
            <span>امضای دیجیتال با رمز پویا</span>
            <OtpField value={otp} onChange={setOtp} />
          </label>
          <Btn disabled={!ok1 || !ok2 || otp.length < 4} onClick={submit}>
            <Icon name="pen" size={18} /> امضا و ثبت درخواست
          </Btn>
        </>
      )}
    </Screen>
  )
}
