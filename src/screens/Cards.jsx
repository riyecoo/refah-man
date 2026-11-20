import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import Art from '../components/Art'
import { Btn, Card, Keypad, Num, Row, Screen, Section, Sheet, Toggle, useApp } from '../components/ui'
import { cards, goals } from '../data/mock'
import { money, short, toFa, tomanWords } from '../utils/fa'

function CardFace({ c, frozen }) {
  return (
    <div className={`bank-card ${c.tone} ${frozen ? 'frozen' : ''}`}>
      <div className="bc-top">
        <span className="bc-bank">بانک رفاه کارگران</span>
        <img src="./assets/app-icon.png" alt="" className="bc-logo" />
      </div>
      <span className="bc-chip" />
      <div className="bc-no"><Num>{c.no}</Num></div>
      <div className="bc-bottom">
        <span>آرش حمیدی</span>
        <span>انقضا {c.exp}</span>
      </div>
      {frozen && (
        <div className="bc-frozen">
          <Icon name="snow" size={18} /> موقتاً قفل است
        </div>
      )}
    </div>
  )
}

export function Cards() {
  const { frozen, setFrozen, toast } = useApp()
  const [i, setI] = useState(0)
  const [otp, setOtp] = useState(false)
  const [limitOpen, setLimitOpen] = useState(false)
  const c = cards[i]
  const isFrozen = !!frozen[c.id]
  const [limit, setLimit] = useState(c.limit)
  const [online, setOnline] = useState(true)
  const [notif, setNotif] = useState(true)

  return (
    <Screen title="کارت‌ها" back={false}>
      <div className="card-scroll" onScroll={(e) => setI(Math.round(Math.abs(e.currentTarget.scrollLeft) / (e.currentTarget.clientWidth * 0.86)))}>
        {cards.map((x) => (
          <CardFace key={x.id} c={x} frozen={!!frozen[x.id]} />
        ))}
        <button className="bank-card add" onClick={() => toast('صدور کارت جدید با ارسال پستی')}>
          <Icon name="plus" size={28} />
          درخواست کارت جدید
        </button>
      </div>

      <div className="card-actions">
        <button onClick={() => setOtp(true)}>
          <span className="ca-ic">
            <Icon name="key" size={22} />
          </span>
          رمز پویا
        </button>
        <button
          onClick={() => {
            setFrozen({ ...frozen, [c.id]: !isFrozen })
            toast(isFrozen ? 'کارت دوباره فعال شد' : 'کارت قفل شد؛ هیچ خرید و برداشتی انجام نمی‌شود')
          }}
          className={isFrozen ? 'on' : ''}
        >
          <span className="ca-ic">
            <Icon name="snow" size={22} />
          </span>
          {isFrozen ? 'باز کردن' : 'قفل موقت'}
        </button>
        <button onClick={() => setLimitOpen(true)}>
          <span className="ca-ic">
            <Icon name="gear" size={22} />
          </span>
          سقف خرید
        </button>
        <button onClick={() => toast('تغییر رمز اول کارت')}>
          <span className="ca-ic">
            <Icon name="lock" size={22} />
          </span>
          تغییر رمز
        </button>
      </div>

      <Section title="مدیریت کارت">
        <Card className="list">
          <Row icon="card" title="خریدهای اینترنتی" sub="فقط وقتی خودتان روشن کنید" end={<Toggle on={online} onChange={(v) => (setOnline(v), toast(v ? 'خرید اینترنتی فعال شد' : 'خرید اینترنتی با این کارت بسته شد'))} label="خرید اینترنتی" />} />
          <Row icon="bell" title="پیامک و اعلان هر تراکنش" end={<Toggle on={notif} onChange={setNotif} label="اعلان تراکنش" />} />
          <Row icon="receipt" title="تاریخچه‌ی تراکنش‌های کارت" onClick={() => toast('تاریخچه‌ی کارت')} chevron />
          <Row icon="alert" title="مسدودی دائم و صدور المثنی" sub="برای کارت گم‌شده یا دزدیده‌شده" onClick={() => toast('کارت مسدود و درخواست المثنی ثبت شد')} danger chevron />
        </Card>
      </Section>

      <Sheet open={otp} onClose={() => setOtp(false)} title="رمز دوم پویا">
        <OtpGen />
      </Sheet>
      <Sheet open={limitOpen} onClose={() => setLimitOpen(false)} title="سقف خرید روزانه">
        <div className="limit-val">{money(limit)} تومان</div>
        <div className="muted small center">{tomanWords(limit)}</div>
        <input type="range" min={1_000_000} max={100_000_000} step={1_000_000} value={limit} onChange={(e) => setLimit(+e.target.value)} className="range" />
        <Btn
          onClick={() => {
            setLimitOpen(false)
            toast('سقف خرید ذخیره شد')
          }}
        >
          ذخیره
        </Btn>
      </Sheet>
    </Screen>
  )
}

function OtpGen() {
  const [sec, setSec] = useState(60)
  const [code] = useState('۱۱۱۱')
  useEffect(() => {
    const iv = setInterval(
      () =>
        setSec((s) => {
          if (s <= 1) {
            return 60
          }
          return s - 1
        }),
      1000,
    )
    return () => clearInterval(iv)
  }, [])
  return (
    <div className="otp-gen">
      <div className="otp-code">{code}</div>
      <div className="otp-timer">
        <span style={{ width: `${(sec / 60) * 100}%` }} />
      </div>
      <p className="muted small center">این رمز تا {toFa(sec)} ثانیه‌ی دیگر معتبر است. آن را به هیچ‌کس نگویید.</p>
    </div>
  )
}

export function Goals() {
  const { push } = useApp()
  const total = goals.reduce((s, g) => s + g.saved, 0)
  return (
    <Screen title="قلک" action={<span className="hdr-btn ghost" />}>
      <Card className="goal-hero">
        <Art name="ic-envelopes" size={72} />
        <div>
          <span className="muted small">جمع پس‌انداز قلک‌ها</span>
          <b className="total-num">{money(total)} تومان</b>
        </div>
      </Card>
      {goals.map((g) => (
        <button key={g.id} className="card goal" onClick={() => push('goal', { id: g.id })}>
          <div className="goal-top">
            <b>{g.title}</b>
            <span className="muted small">
              {toFa(Math.round((g.saved / g.target) * 100))}٪
            </span>
          </div>
          <div className="prog">
            <span style={{ width: `${(g.saved / g.target) * 100}%` }} />
          </div>
          <div className="goal-meta">
            <span>
              {short(g.saved)} از {short(g.target)}
            </span>
            <span className="muted small">{g.rule}</span>
          </div>
        </button>
      ))}
      <Btn kind="soft" onClick={() => push('goal', { id: 'new' })}>
        <Icon name="plus" size={18} /> قلک جدید
      </Btn>
    </Screen>
  )
}

export function GoalDetail({ id }) {
  const { reset, toast } = useApp()
  const g = goals.find((x) => x.id === id) || { id: 'new', title: 'قلک جدید', target: 50_000_000, saved: 0, rule: '' }
  const [r1, setR1] = useState(g.rule.includes('حقوق'))
  const [r2, setR2] = useState(g.rule.includes('گرد'))
  const [amt, setAmt] = useState('')
  const key = (k) => setAmt((v) => (k === 'del' ? v.slice(0, -1) : (v + k).replace(/^0+/, '').slice(0, 9)))
  return (
    <Screen title={g.title}>
      <Card className="goal-hero col">
        <div className="ring" style={{ '--p': g.saved / g.target }}>
          <span>
            <b>{toFa(Math.round((g.saved / g.target) * 100))}٪</b>
            <small>{short(g.target)}</small>
          </span>
        </div>
        <b>{money(g.saved)} تومان پس‌انداز شده</b>
      </Card>
      <Section title="قانون‌های پس‌انداز خودکار">
        <Card className="list">
          <Row icon="download" title="هر بار حقوق واریز شد" sub="۲ میلیون تومان به این قلک برود" end={<Toggle on={r1} onChange={setR1} label="قانون حقوق" />} />
          <Row icon="refresh" title="گرد کردن خریدها" sub="مثلاً خرید ۸۷ هزار ← ۹۰ هزار؛ ۳ هزار به قلک" end={<Toggle on={r2} onChange={setR2} label="گرد کردن" />} />
        </Card>
      </Section>
      <div className="amount-in small-in">
        <div className={`ai-num ${amt ? '' : 'ph'}`}>
          {amt ? money(+amt) : '۰'} <span>تومان</span>
        </div>
      </div>
      <Keypad onKey={key} extra="000" />
      <Btn
        disabled={!+amt}
        onClick={() =>
          reset('receipt', {
            title: 'به قلک اضافه شد',
            amount: +amt,
            rows: [
              ['قلک', g.title],
              ['از حساب', 'حساب جاری'],
              ['کد پیگیری', toFa('118204'), true],
            ],
          })
        }
      >
        واریز به قلک
      </Btn>
    </Screen>
  )
}

export function RequestMoney() {
  const { toast } = useApp()
  const [amt, setAmt] = useState('')
  const [why, setWhy] = useState('')
  const [made, setMade] = useState(false)
  const key = (k) => setAmt((v) => (k === 'del' ? v.slice(0, -1) : (v + k).replace(/^0+/, '').slice(0, 9)))
  return (
    <Screen title="درخواست وجه">
      {!made ? (
        <>
          <p className="muted">یک لینک بسازید و برای کسی بفرستید؛ او با هر کارت بانکی می‌تواند پرداخت کند.</p>
          <div className="amount-in">
            <div className={`ai-num ${amt ? '' : 'ph'}`}>
              {amt ? money(+amt) : '۰'} <span>تومان</span>
            </div>
            <div className="ai-words">{amt ? tomanWords(+amt) : 'مبلغ درخواستی'}</div>
          </div>
          <input className="desc" placeholder="بابت… (مثلاً سهم شام جمعه)" value={why} onChange={(e) => setWhy(e.target.value)} />
          <Keypad onKey={key} extra="000" />
          <Btn disabled={!+amt} onClick={() => setMade(true)}>
            ساخت لینک پرداخت
          </Btn>
        </>
      ) : (
        <div className="req-done">
          <Art name="ic-qr" size={150} pop />
          <b>{money(+amt)} تومان</b>
          {why && <span className="muted">{why}</span>}
          <div className="req-link">
            <span className="ltr-num">refah-bank.ir/pay/7Kx2</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText('https://refah-bank.ir/pay/7Kx2').catch(() => {})
                toast('لینک کپی شد')
              }}
              aria-label="کپی لینک"
            >
              <Icon name="copy" size={18} />
            </button>
          </div>
          <Btn onClick={() => toast('ارسال لینک در پیام‌رسان')}>
            <Icon name="share" size={18} /> ارسال لینک
          </Btn>
          <p className="muted small center">وقتی پرداخت شد، اعلان می‌گیرید. لینک تا ۷ روز معتبر است.</p>
        </div>
      )}
    </Screen>
  )
}
