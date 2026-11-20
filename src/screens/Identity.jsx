import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, OtpField, Screen, useApp } from '../components/ui'
import { user } from '../data/mock'
import { short, toEn, toFa } from '../utils/fa'

// کارهای هویتی بدون شعبه: تغییر شماره همراه، افزایش سقف با احراز تصویری
export default function Identity({ tab: tab0 = 'mobile' }) {
  const [tab, setTab] = useState(tab0)
  return (
    <Screen title="کارهای هویتی بدون شعبه">
      <div className="seg">
        <button className={tab === 'mobile' ? 'on' : ''} onClick={() => setTab('mobile')}>
          تغییر شماره همراه
        </button>
        <button className={tab === 'limit' ? 'on' : ''} onClick={() => setTab('limit')}>
          افزایش سقف انتقال
        </button>
      </div>
      {tab === 'mobile' ? <Mobile /> : <Limit />}
    </Screen>
  )
}

function Mobile() {
  const { addCase, reset } = useApp()
  const [num, setNum] = useState('')
  const [chk, setChk] = useState(null) // null → checking → ok
  const [otp, setOtp] = useState('')
  useEffect(() => {
    if (num.length !== 11) return setChk(null)
    setChk('checking')
    const t = setTimeout(() => setChk('ok'), 1200)
    return () => clearTimeout(t)
  }, [num])
  const submit = () => {
    const id = addCase({
      kind: 'id',
      icon: 'phone',
      title: 'تغییر شماره همراه',
      summary: `از ${user.mobile} به ${toFa(num)}`,
      steps: [
        ['درخواست ثبت شد', 'امروز'],
        ['مالکیت سیم‌کارت در سامانه‌ی شاهکار تأیید شد', 'امروز'],
        ['شماره‌ی جدید فعال شد', 'رمزهای پیامکی از این به بعد به شماره‌ی جدید می‌آیند'],
      ],
      at: 2,
    })
    reset('case', { id, fresh: true })
  }
  return (
    <>
      <Card className="list kv">
        <div className="kv-row">
          <span className="muted">شماره‌ی فعلی</span>
          <span className="kv-v ltr-num">{user.mobile}</span>
        </div>
      </Card>
      <label className="field">
        <span>شماره‌ی جدید</span>
        <input inputMode="numeric" maxLength={11} value={toFa(num)} placeholder="۰۹۱۲۰۰۰۰۰۰۰" onChange={(e) => setNum(toEn(e.target.value).replace(/\D/g, ''))} />
      </label>
      {chk === 'checking' && (
        <div className="inquiry">
          <span className="spin" /> استعلام مالکیت سیم‌کارت از سامانه‌ی شاهکار…
        </div>
      )}
      {chk === 'ok' && (
        <Card className="ok-card fade-in">
          <Icon name="check" size={18} stroke={2.6} /> این سیم‌کارت به نام کد ملی شما ({user.nationalId}) ثبت شده است.
        </Card>
      )}
      {chk === 'ok' && (
        <label className="field">
          <span>کدی که به شماره‌ی جدید پیامک شد</span>
          <OtpField value={otp} onChange={setOtp} />
        </label>
      )}
      <Btn disabled={chk !== 'ok' || otp.length < 4} onClick={submit}>
        ثبت شماره‌ی جدید
      </Btn>
      <p className="muted small center">قبلاً این کار فقط با مراجعه‌ی حضوری و کارت ملی انجام می‌شد.</p>
    </>
  )
}

const DIGITS = '۱ ۱ ۱ ۱'

function Limit() {
  const { addCase, reset } = useApp()
  const [lim, setLim] = useState(50_000_000)
  const [phase, setPhase] = useState('idle') // idle → rec → match → ok
  const [count, setCount] = useState(3)
  const [cam, setCam] = useState(false)
  const video = useRef(null)
  const stream = useRef(null)

  useEffect(() => () => stream.current?.getTracks().forEach((t) => t.stop()), [])

  const openCam = async () => {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      setCam(true)
      setTimeout(() => {
        if (video.current) video.current.srcObject = stream.current
      }, 50)
    } catch {
      setCam(false)
    }
  }

  const record = () => {
    setPhase('rec')
    setCount(3)
    let c = 3
    const iv = setInterval(() => {
      c -= 1
      setCount(c)
      if (c <= 0) {
        clearInterval(iv)
        setPhase('match')
        setTimeout(() => setPhase('ok'), 1500)
      }
    }, 1000)
  }

  const submit = () => {
    stream.current?.getTracks().forEach((t) => t.stop())
    const id = addCase({
      kind: 'id',
      icon: 'camera',
      title: 'افزایش سقف انتقال روزانه',
      summary: `سقف جدید: ${short(lim)} تومان`,
      steps: [
        ['ویدیوی احراز هویت ضبط شد', 'امروز'],
        ['تطبیق چهره با تصویر ثبت احوال', 'امروز ✓'],
        ['بررسی کارشناس', 'معمولاً کمتر از ۲ ساعت'],
        ['سقف جدید فعال شد', ''],
      ],
      at: 2,
    })
    reset('case', { id, fresh: true })
  }

  return (
    <>
      <div className="sec-head">
        <h2>سقف جدید روزانه</h2>
      </div>
      <div className="amt-grid">
        {[20_000_000, 50_000_000, 100_000_000].map((v) => (
          <button key={v} className={`amt-opt ${lim === v ? 'on' : ''}`} onClick={() => setLim(v)}>
            {short(v)}
          </button>
        ))}
      </div>
      <Card className="selfie">
        <div className={`face ${phase}`}>
          {cam ? <video ref={video} autoPlay playsInline muted /> : <img src="./assets/av-reza.png" alt="" />}
          {phase === 'rec' && <span className="rec-badge">● {toFa(count)}</span>}
          {phase === 'ok' && (
            <span className="face-ok">
              <Icon name="check" size={28} stroke={3} />
            </span>
          )}
        </div>
        {phase === 'idle' && (
          <>
            <b>صورتتان را داخل دایره بگذارید و این عدد را بلند بخوانید:</b>
            <span className="say-digits">{DIGITS}</span>
            {!cam && (
              <button className="link" onClick={openCam}>
                استفاده از دوربین این دستگاه
              </button>
            )}
            <Btn onClick={record}>
              <Icon name="camera" size={18} /> شروع ضبط ۳ ثانیه‌ای
            </Btn>
          </>
        )}
        {phase === 'rec' && <b>در حال ضبط… عدد را بخوانید: {DIGITS}</b>}
        {phase === 'match' && (
          <div className="inquiry">
            <span className="spin" /> تطبیق چهره با تصویر کارت ملی در ثبت احوال…
          </div>
        )}
        {phase === 'ok' && <b className="ok-t">چهره تأیید شد؛ زنده بودن تصویر هم از حرکت لب‌ها بررسی شد</b>}
      </Card>
      <Btn disabled={phase !== 'ok'} onClick={submit}>
        ثبت درخواست افزایش سقف
      </Btn>
    </>
  )
}
