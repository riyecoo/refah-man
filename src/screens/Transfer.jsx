import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/Icon'
import { Amount, Avatar, Btn, Card, Keypad, OtpField, Row, Screen, Sheet, Steps, Toggle, useApp } from '../components/ui'
import { accounts, contacts } from '../data/mock'
import { money, short, toEn, toFa, tomanWords } from '../utils/fa'

// مقادیر سقف، کارمزد و ساعت‌ها در این نمونه فرضی‌اند
const PAYA_CYCLES = [
  [3, 45],
  [9, 45],
  [12, 45],
  [18, 45],
]
const hm = (h, m) => toFa(`${h}:${String(m).padStart(2, '0')}`)

function payaEta(now) {
  const mins = now.getHours() * 60 + now.getMinutes()
  const next = PAYA_CYCLES.find(([h, m]) => h * 60 + m > mins)
  return next ? `امروز حدود ساعت ${hm(...next)}` : `فردا حدود ساعت ${hm(...PAYA_CYCLES[0])}`
}
function satnaEta(now) {
  const h = now.getHours()
  return h >= 8 && h < 15 ? 'تا یک ساعت دیگر' : 'فردا صبح، در ساعت کاری'
}

function buildMethods(dest, amt, now) {
  const isRefah = dest?.bank === 'رفاه'
  const isCard = dest?.kind !== 'iban' && dest?.kind !== 'acc'
  const m = [
    {
      id: 'internal',
      name: 'داخلی رفاه',
      line: 'وقتی مقصد هم مشتری بانک رفاه است؛ رایگان و فوری.',
      eta: 'همین الان',
      fee: 0,
      limit: 'تا ۵۰۰ میلیون',
      ok: isRefah && amt <= 500_000_000,
      why: !isRefah ? 'فقط وقتی مقصد حساب بانک رفاه باشد' : 'بیشتر از سقف روزانه',
    },
    {
      id: 'card',
      name: 'کارت به کارت',
      line: 'سریع‌ترین راه برای مبلغ‌های کوچک و روزمره.',
      eta: 'همین الان',
      fee: 900,
      limit: 'تا ۱۰ میلیون در روز',
      ok: isCard && amt <= 10_000_000,
      why: !isCard ? 'مقصد شماره کارت نیست' : 'سقف کارت به کارت ۱۰ میلیون تومان در روز است',
    },
    {
      id: 'pol',
      name: 'پل',
      line: 'انتقال فوری بین بانک‌ها با شماره شبا؛ مناسب مبلغ‌های متوسط.',
      eta: 'همین الان',
      fee: 800,
      limit: 'تا ۵۰ میلیون در هر انتقال',
      ok: amt <= 50_000_000,
      why: 'سقف هر انتقال پل ۵۰ میلیون تومان است',
      note: isCard ? 'شبای این کارت خودکار پیدا می‌شود' : null,
    },
    {
      id: 'paya',
      name: 'پایا',
      line: 'ارزان، برای مبلغ‌های بزرگ؛ در نوبت بعدی بانک می‌رسد.',
      eta: payaEta(now),
      fee: 400,
      limit: 'تا ۲۰۰ میلیون در روز',
      ok: amt <= 200_000_000,
      why: 'سقف روزانه‌ی پایا ۲۰۰ میلیون تومان است',
      note: isCard ? 'شبای این کارت خودکار پیدا می‌شود' : null,
    },
    {
      id: 'satna',
      name: 'ساتنا',
      line: 'برای مبلغ‌های خیلی بزرگ؛ در ساعت کاری سریع می‌رسد.',
      eta: satnaEta(now),
      fee: 2_400,
      limit: 'از ۱۰۰ میلیون به بالا',
      ok: amt >= 100_000_000,
      why: 'ساتنا برای مبلغ‌های ۱۰۰ میلیون تومان به بالاست',
      note: isCard ? 'شبای این کارت خودکار پیدا می‌شود' : null,
    },
  ]
  const order = ['internal', 'card', 'pol', 'satna', 'paya']
  const best = order.find((id) => m.find((x) => x.id === id).ok)
  return m.map((x) => ({ ...x, best: x.id === best }))
}

function detect(raw) {
  if (raw.length === 16) return 'card'
  if (raw.length === 24) return 'iban'
  if (raw.length === 13) return 'acc'
  return null
}
const KIND_LABEL = { card: 'شماره کارت', iban: 'شماره شبا', acc: 'شماره حساب رفاه' }

export default function Transfer({ to }) {
  const { reset } = useApp()
  const pre = contacts.find((c) => c.id === to)
  const [step, setStep] = useState(pre ? 1 : 0)
  const [dest, setDest] = useState(pre ? { ...pre, kind: 'card' } : null)
  const [raw, setRaw] = useState('')
  const [checking, setChecking] = useState(false)
  const [amount, setAmount] = useState('')
  const [src, setSrc] = useState('cur')
  const [method, setMethod] = useState(null)
  const [explain, setExplain] = useState(false)
  const [desc, setDesc] = useState('')
  const [otp, setOtp] = useState('')
  const [delay, setDelay] = useState(true)
  const [repeat, setRepeat] = useState(false)
  const [saveC, setSaveC] = useState(false)

  const kind = detect(raw)
  const amt = +amount || 0
  const acc = accounts.find((a) => a.id === src)
  const overBal = amt > acc.balance
  const isNew = dest && !dest.id
  const guard = isNew && amt >= 5_000_000
  const now = useMemo(() => new Date(), [step])
  const methods = useMemo(() => (dest ? buildMethods(dest, amt, now) : []), [dest, amt, now])
  const m = methods.find((x) => x.id === method)

  // استعلام نام صاحب کارت/حساب، همیشه قبل از وارد کردن مبلغ
  useEffect(() => {
    if (!kind) {
      setChecking(false)
      return
    }
    setChecking(true)
    const t = setTimeout(() => {
      setChecking(false)
      const bank = kind === 'acc' ? 'رفاه' : kind === 'card' ? 'تجارت' : 'آینده'
      const shown = kind === 'iban' ? `IR${raw.slice(0, 2)} ${raw.slice(2).replace(/(\d{4})(?=\d)/g, '$1 ')}` : raw.replace(/(\d{4})(?=\d)/g, '$1 ')
      setDest({ name: 'سعید نادری', full: 'سعید نادری', bank, kind, card: toFa(shown) })
    }, 900)
    return () => clearTimeout(t)
  }, [raw])

  const key = (k) => setAmount((v) => (k === 'del' ? v.slice(0, -1) : (v + k).replace(/^0+/, '').slice(0, 10)))

  const goMethods = () => {
    const best = buildMethods(dest, amt, new Date()).find((x) => x.best)
    setMethod(best?.id || null)
    setStep(2)
  }

  const submit = () => {
    const rows = [
      ['گیرنده', dest.full],
      [KIND_LABEL[dest.kind] || 'مقصد', dest.card],
      ['بانک مقصد', dest.bank],
      ['روش', m.name],
      ['زمان رسیدن', guard && delay ? `${m.eta === 'همین الان' ? '' : `${m.eta}، `}بعد از ۳۰ دقیقه تأخیر امنیتی` : m.eta],
      ['از', `${acc.title} · ${acc.no}`],
      ['کارمزد', m.fee ? `${money(m.fee)} تومان` : 'رایگان'],
      ['کد پیگیری', toFa('731904'), true],
    ]
    if (desc) rows.splice(5, 0, ['توضیح', desc])
    if (repeat) rows.splice(5, 0, ['تکرار', 'هر ماه همین روز'])
    const held = guard && delay
    reset('receipt', {
      title: held ? 'انتقال ثبت شد' : 'انتقال موفق',
      amount: amt,
      pending: held,
      note: held
        ? 'چون مقصد جدید است، این انتقال ۳۰ دقیقه‌ی دیگر انجام می‌شود و تا آن موقع از «اعلان‌ها» قابل لغو است.'
        : repeat
          ? 'این انتقال هر ماه همین روز تکرار می‌شود. یک روز قبلش یادآوری می‌گیرید.'
          : null,
      rows,
    })
  }

  return (
    <Screen title="انتقال وجه" onBack={step > 0 ? () => setStep(step - 1) : undefined}>
      <Steps at={step} of={4} />

      {step === 0 && (
        <>
          <label className="field">
            <span>شماره کارت، شبا یا حساب مقصد</span>
            <div className="field-in">
              <input
                inputMode="numeric"
                className="ltr-in"
                value={toFa(raw.replace(/(\d{4})(?=\d)/g, '$1 '))}
                placeholder="۶۰۳۷ ۹۹۷۱ ۰۰۰۰ ۰۰۰۰"
                onChange={(e) => {
                  setDest(null)
                  setRaw(toEn(e.target.value).replace(/\D/g, '').slice(0, 24))
                }}
              />
              {kind && <span className="kind-chip">{KIND_LABEL[kind]}</span>}
            </div>
          </label>
          {checking && (
            <div className="inquiry">
              <span className="spin" /> در حال استعلام نام صاحب {KIND_LABEL[kind]}…
            </div>
          )}
          {dest && !dest.id && (
            <>
              <Card className="owner fade-in">
                <Avatar c={dest} size={44} />
                <div className="grow">
                  <div className="muted small">صاحب {KIND_LABEL[dest.kind]}</div>
                  <b>{dest.full}</b>
                  <div className="muted small">بانک {dest.bank}</div>
                </div>
                <span className="new-badge">مقصد جدید</span>
              </Card>
              <label className="check">
                <input type="checkbox" checked={saveC} onChange={(e) => setSaveC(e.target.checked)} />
                <span>ذخیره در مخاطبین</span>
              </label>
            </>
          )}
          {!dest && !checking && (
            <>
              <div className="sec-head">
                <h2>مخاطبین</h2>
                <button className="link" onClick={() => setRaw('6037691234567890')}>
                  یک مقصد نمونه
                </button>
              </div>
              <Card className="list">
                {contacts.map((c) => (
                  <Row
                    key={c.id}
                    lead={<Avatar c={c} size={42} />}
                    title={c.full}
                    sub={
                      <>
                        {c.bank} · <span className="ltr-num">{c.card}</span>
                      </>
                    }
                    onClick={() => {
                      setDest({ ...c, kind: 'card' })
                      setStep(1)
                    }}
                    chevron
                  />
                ))}
              </Card>
            </>
          )}
          {dest && (
            <div className="sticky-foot">
              <Btn onClick={() => setStep(1)}>ادامه</Btn>
            </div>
          )}
        </>
      )}

      {step === 1 && dest && (
        <>
          <DestCard dest={dest} onChange={() => setStep(0)} />
          <div className="amount-in">
            <div className={`ai-num ${amt ? '' : 'ph'}`}>
              {amt ? money(amt) : '۰'} <span>تومان</span>
            </div>
            <div className="ai-words">{amt ? tomanWords(amt) : 'مبلغ را وارد کنید'}</div>
            {overBal && <div className="ai-err">موجودی کافی نیست</div>}
          </div>
          <div className="chips center-chips">
            {[1_000_000, 5_000_000, 30_000_000, 150_000_000].map((v) => (
              <button key={v} className="chip" onClick={() => setAmount(String(v))}>
                {short(v)}
              </button>
            ))}
          </div>
          <label className="field compact">
            <span>از حساب</span>
            <select value={src} onChange={(e) => setSrc(e.target.value)}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} — {short(a.balance)}
                </option>
              ))}
            </select>
          </label>
          <Keypad onKey={key} extra="000" />
          <Btn disabled={!amt || overBal} onClick={goMethods}>
            انتخاب روش انتقال
          </Btn>
        </>
      )}

      {step === 2 && (
        <>
          <div className="method-head">
            <div>
              <b>
                {money(amt)} تومان به {dest.full}
              </b>
              <div className="muted small">روش انتقال را انتخاب کنید</div>
            </div>
            <button className="link" onClick={() => setExplain(true)}>
              فرق این روش‌ها چیست؟
            </button>
          </div>
          <div className="methods">
            {methods.map((x) => (
              <button key={x.id} className={`method ${method === x.id ? 'on' : ''} ${x.ok ? '' : 'off'}`} disabled={!x.ok} onClick={() => setMethod(x.id)}>
                <span className="m-radio" />
                <span className="m-body">
                  <span className="m-top">
                    <b>{x.name}</b>
                    {x.best && <span className="m-best">پیشنهاد برای این مبلغ</span>}
                  </span>
                  <span className="m-line">{x.ok ? x.line : x.why}</span>
                  {x.ok && (
                    <span className="m-facts">
                      <span>
                        <Icon name="clock" size={14} /> {x.eta}
                      </span>
                      <span>کارمزد: {x.fee ? `${money(x.fee)} تومان` : 'رایگان'}</span>
                      <span>{x.limit}</span>
                    </span>
                  )}
                  {x.ok && x.note && <span className="m-note">{x.note}</span>}
                </span>
              </button>
            ))}
          </div>
          <div className="sticky-foot">
            <Btn disabled={!m} onClick={() => setStep(3)}>
              ادامه با {m?.name || '…'}
            </Btn>
          </div>
          <Sheet open={explain} onClose={() => setExplain(false)} title="فرق روش‌های انتقال">
            <div className="explain">
              {[
                ['کارت به کارت', 'همین الان', 'خرید و کارهای روزمره', 'تا ۱۰ میلیون در روز'],
                ['پل', 'همین الان', 'مبلغ متوسط به هر بانکی', 'تا ۵۰ میلیون در هر بار'],
                ['پایا', 'نوبت بعدی بانک (چند بار در روز)', 'مبلغ بزرگ، وقتی عجله ندارید', 'تا ۲۰۰ میلیون در روز'],
                ['ساتنا', 'حداکثر یک ساعت در ساعت کاری', 'مبلغ خیلی بزرگ مثل خرید خانه یا ماشین', 'از ۱۰۰ میلیون به بالا'],
                ['داخلی رفاه', 'همین الان', 'وقتی مقصد هم مشتری رفاه است', 'رایگان'],
              ].map(([n, s, f, l]) => (
                <div key={n} className="ex-row">
                  <b>{n}</b>
                  <span>
                    <Icon name="clock" size={13} /> {s}
                  </span>
                  <span>مناسب: {f}</span>
                  <span className="muted">{l}</span>
                </div>
              ))}
              <p className="muted small">سقف‌ها و کارمزدها در این نمونه فرضی‌اند.</p>
            </div>
          </Sheet>
        </>
      )}

      {step === 3 && m && (
        <>
          <Card className="review">
            <div className="rv-to">
              <Avatar c={dest} size={52} />
              <div>
                <div className="muted small">انتقال به</div>
                <b className="rv-name">{dest.full}</b>
                <div className="muted small">
                  {dest.bank} · <span className="ltr-num">{dest.card}</span>
                </div>
              </div>
            </div>
            <Amount value={amt} big />
            <div className="rv-method">
              <span>
                روش: <b>{m.name}</b>
              </span>
              <span>
                <Icon name="clock" size={14} /> {m.eta}
              </span>
            </div>
            <div className="rv-meta">
              <span>از: {acc.title}</span>
              <span>کارمزد: {m.fee ? `${money(m.fee)} تومان` : 'رایگان'}</span>
            </div>
            <input className="desc" placeholder="توضیح (اختیاری) — مثلاً اجاره‌ی آذر" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <div className="guard-row plain">
              <span>
                <b>هر ماه تکرار شود</b>
                <span className="muted small">همین روز، با یادآوری یک روز قبل</span>
              </span>
              <Toggle on={repeat} onChange={setRepeat} label="تکرار ماهانه" />
            </div>
          </Card>

          {guard && (
            <Card className="guard">
              <div className="guard-head">
                <Icon name="shield" size={20} /> محافظ مقصد جدید
              </div>
              <p>اولین بار است به این مقصد پول می‌فرستید و مبلغ بالاست. اگر کسی تلفنی از شما خواسته پول جابه‌جا کنید، ادامه ندهید؛ بانک هیچ‌وقت چنین درخواستی ندارد.</p>
              <div className="guard-row">
                <span>
                  <b>انجام با ۳۰ دقیقه تأخیر</b>
                  <span className="muted small">تا آن موقع قابل لغو است</span>
                </span>
                <Toggle on={delay} onChange={setDelay} label="تأخیر ۳۰ دقیقه‌ای" />
              </div>
            </Card>
          )}

          {m.id !== 'internal' && (
            <label className="field">
              <span>رمز دوم پویا</span>
              <OtpField value={otp} onChange={setOtp} />
            </label>
          )}
          <div className="sticky-foot">
            <Btn disabled={m.id !== 'internal' && otp.length < 4} onClick={submit}>
              تأیید و انتقال {money(amt)} تومان
            </Btn>
          </div>
        </>
      )}
    </Screen>
  )
}

function DestCard({ dest, onChange }) {
  return (
    <Card className="owner slim">
      <Avatar c={dest} size={40} />
      <div className="grow">
        <b>{dest.full}</b>
        <div className="muted small">
          {dest.bank} · <span className="ltr-num">{dest.card}</span>
        </div>
      </div>
      <button className="link" onClick={onChange}>
        تغییر
      </button>
    </Card>
  )
}
