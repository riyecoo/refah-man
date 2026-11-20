import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Dots, Keypad, useApp } from '../components/ui'
import { toEn, toFa } from '../utils/fa'
import { user } from '../data/mock'

// نسخه‌ی نمایشی: نام کاربری، رمز عبور، کد پیامکی و رمز ورود همه «۱۱۱۱» است
export const DEMO_CODE = '1111'

const SLIDES = [
  { art: 'promo-hero', t: 'همه‌ی حساب‌ها و کارت‌ها، یک‌جا', d: 'موجودی، گردش حساب، کارت‌ها، وام‌ها و سپرده‌ها را در یک صفحه ببینید.' },
  { art: 'il-shield', t: 'انتقال امن، بدون نگرانی', d: 'قبل از هر انتقال نام صاحب حساب و مبلغ به حروف را می‌بینید. برای مقصدهای جدید هم یک لایه‌ی محافظ بیشتر داریم.' },
  { art: 'il-payday', t: 'شعبه در جیب شما', d: 'وام، گواهی تمکن، اعتراض به تراکنش و تغییر شماره؛ بدون رفتن به شعبه.' },
]

export default function Auth({ phase, setPhase, done }) {
  if (phase === 'splash') return <Splash />
  if (phase === 'onboard') return <Onboard next={() => setPhase('login')} />
  if (phase === 'login') return <Login next={() => setPhase('otp')} />
  if (phase === 'otp') return <Otp next={() => setPhase('bio')} back={() => setPhase('login')} />
  if (phase === 'bio') return <Bio next={done} />
  return <Lock done={done} />
}

function Splash() {
  return (
    <div className="splash">
      <img className="splash-logo" src="./assets/app-icon.png" alt="" />
      <div className="splash-name">رفاه من</div>
      <div className="splash-sub">همراه بانک رفاه کارگران</div>
      <div className="splash-load">
        <span />
      </div>
    </div>
  )
}

function Onboard({ next }) {
  const [i, setI] = useState(0)
  const s = SLIDES[i]
  return (
    <div className="auth onboard">
      <button className="skip" onClick={next}>
        رد شدن
      </button>
      <div className="ob-art" key={s.art}>
        <img src={`./assets/${s.art}.png`} alt="" />
      </div>
      <div className="ob-text" key={i}>
        <h1>{s.t}</h1>
        <p>{s.d}</p>
      </div>
      <div className="ob-foot">
        <div className="ob-dots">
          {SLIDES.map((_, k) => (
            <span key={k} className={k === i ? 'on' : ''} />
          ))}
        </div>
        <Btn onClick={() => (i < SLIDES.length - 1 ? setI(i + 1) : next())}>{i < SLIDES.length - 1 ? 'بعدی' : 'شروع کنیم'}</Btn>
      </div>
    </div>
  )
}

function Login({ next }) {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState(false)
  const digits = (v) => toEn(v).replace(/\D/g, '').slice(0, 4)
  const go = () => {
    if (u === DEMO_CODE && p === DEMO_CODE) next()
    else setErr(true)
  }
  return (
    <div className="auth">
      <div className="auth-top">
        <img className="auth-logo" src="./assets/app-icon.png" alt="" />
        <h1>ورود به رفاه من</h1>
        <p className="muted">نام کاربری و رمز عبور خود را وارد کنید.</p>
      </div>
      <label className="field">
        <span>نام کاربری</span>
        <input
          inputMode="numeric"
          value={toFa(u)}
          placeholder="۱۱۱۱"
          onChange={(e) => {
            setErr(false)
            setU(digits(e.target.value))
          }}
        />
      </label>
      <label className="field">
        <span>رمز عبور</span>
        <input
          type="password"
          inputMode="numeric"
          value={p}
          placeholder="••••"
          onChange={(e) => {
            setErr(false)
            setP(digits(e.target.value))
          }}
          onKeyDown={(e) => e.key === 'Enter' && go()}
        />
      </label>
      {err && <p className="ai-err">نام کاربری یا رمز عبور درست نیست.</p>}
      <div className="demo-hint">
        <Icon name="info" size={16} /> نسخه‌ی نمایشی: نام کاربری، رمز و همه‌ی کدها <b>۱۱۱۱</b> است.
      </div>
      <div className="auth-foot">
        <Btn disabled={u.length < 4 || p.length < 4} onClick={go}>
          ورود
        </Btn>
        <button
          className="link center"
          onClick={() => {
            setU(DEMO_CODE)
            setP(DEMO_CODE)
          }}
        >
          پر کردن خودکار
        </button>
      </div>
    </div>
  )
}

function Otp({ next, back }) {
  const { toast } = useApp()
  const [code, setCode] = useState('')
  const [err, setErr] = useState(false)
  const [sec, setSec] = useState(120)
  useEffect(() => {
    const t1 = setTimeout(() => {
      toast('پیامک: کد ورود رفاه من ۱۱۱۱')
      setCode(DEMO_CODE)
    }, 1400)
    const iv = setInterval(() => setSec((s) => Math.max(0, s - 1)), 1000)
    return () => {
      clearTimeout(t1)
      clearInterval(iv)
    }
  }, [])
  useEffect(() => {
    if (code.length !== 4) return
    if (code === DEMO_CODE) {
      const t = setTimeout(next, 500)
      return () => clearTimeout(t)
    }
    setErr(true)
    const t = setTimeout(() => {
      setErr(false)
      setCode('')
    }, 700)
    return () => clearTimeout(t)
  }, [code])
  const key = (k) => setCode((c) => (k === 'del' ? c.slice(0, -1) : c.length < 4 ? c + k : c))
  return (
    <div className="auth">
      <button className="hdr-btn" onClick={back} aria-label="بازگشت">
        <Icon name="back" size={22} />
      </button>
      <div className="auth-top">
        <h1>کد تأیید</h1>
        <p className="muted">{err ? 'کد اشتباه است.' : `کد ۴ رقمی به شماره‌ی ${user.mobile} پیامک شد.`}</p>
      </div>
      <div className={`otp-boxes ${err ? 'shake' : ''}`}>
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className={i === code.length ? 'cur' : code[i] ? 'on' : ''}>
            {code[i] ? toFa(code[i]) : ''}
          </span>
        ))}
      </div>
      <div className="muted small center">{sec ? `ارسال دوباره تا ${toFa(Math.floor(sec / 60))}:${toFa(String(sec % 60).padStart(2, '0'))}` : 'ارسال دوباره‌ی کد'}</div>
      <div className="auth-foot">
        <Keypad onKey={key} />
      </div>
    </div>
  )
}

function Bio({ next }) {
  return (
    <div className="auth">
      <div className="auth-top grow-center">
        <div className="bio-ic">
          <Icon name="finger" size={56} stroke={1.6} />
        </div>
        <h1>ورود با اثر انگشت</h1>
        <p className="muted">دفعه‌ی بعد با اثر انگشت یا رمز ورود ۴ رقمی وارد شوید.</p>
      </div>
      <div className="auth-foot">
        <Btn onClick={next}>فعال کن</Btn>
        <Btn kind="ghost" onClick={next}>
          بعداً
        </Btn>
      </div>
    </div>
  )
}

function Lock({ done }) {
  const [p, setP] = useState('')
  const [err, setErr] = useState(false)
  useEffect(() => {
    if (p.length !== 4) return
    if (p === DEMO_CODE) setTimeout(done, 200)
    else {
      setErr(true)
      setTimeout(() => {
        setErr(false)
        setP('')
      }, 600)
    }
  }, [p])
  const key = (k) => {
    if (k === 'finger') return setTimeout(done, 300)
    setP((v) => (k === 'del' ? v.slice(0, -1) : v.length < 4 ? v + k : v))
  }
  return (
    <div className="auth lock">
      <div className="auth-top">
        <img className="auth-logo" src="./assets/app-icon.png" alt="" />
        <div className="lock-hi">سلام {user.first} جان</div>
        <p className="muted">{err ? 'رمز اشتباه است.' : 'رمز ورود (۱۱۱۱) یا اثر انگشت'}</p>
      </div>
      <Dots n={p.length} error={err} />
      <div className="auth-foot">
        <Keypad onKey={key} extra="finger" />
      </div>
    </div>
  )
}
