import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, OtpField, Screen, Section, useApp } from '../components/ui'
import { FakeQR } from './Certificate'
import { user } from '../data/mock'
import { toFa } from '../utils/fa'

const ITEMS = [
  ['band', 'بازه‌ی حقوق', 'بین ۲۰ تا ۲۵ میلیون تومان'],
  ['history', 'سابقه‌ی واریز', '۳۸ ماه پیوسته، بدون وقفه'],
  ['debt', 'بدهی معوق', 'ندارد'],
  ['job', 'وضعیت', 'شاغل، بیمه‌ی تأمین اجتماعی فعال'],
]
const FOR = [
  ['rent', 'صاحبخانه', 'home'],
  ['shop', 'فروشگاه قسطی', 'box'],
  ['job', 'کارفرمای جدید', 'users'],
]

// پاسپورت حقوق: به‌جای ضامن و چک؛ بانک گواهی می‌دهد، عدد دقیق و گردش حساب لو نمی‌رود
export default function IncomePassport() {
  const { toast } = useApp()
  const [show, setShow] = useState({ band: true, history: true, debt: true, job: false })
  const [who, setWho] = useState('rent')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(0) // 0 انتخاب، 1 ساخته شد، 2 نمای گیرنده
  const picked = ITEMS.filter(([k]) => show[k])

  if (step === 2)
    return (
      <Screen title="نمای گیرنده" onBack={() => setStep(1)}>
        <div className="ip-browser">
          <div className="ip-url" dir="ltr">
            <Icon name="lock" size={12} /> refah.bank/p/7Q2K
          </div>
          <div className="ip-verified">
            <span className="ip-badge">
              <Icon name="check" size={22} stroke={2.6} />
            </span>
            <b>تأییدشده توسط بانک رفاه کارگران</b>
            <span className="muted small">امضای دیجیتال بانک معتبر است · استعلام یک‌بارمصرف</span>
          </div>
          <div className="ip-holder">
            <span className="muted small">دارنده</span>
            <b>{user.name}</b>
          </div>
          {picked.map(([k, t, v]) => (
            <div className="ip-row" key={k}>
              <span>{t}</span>
              <b>{v}</b>
            </div>
          ))}
          <div className="ip-hidden">
            <Icon name="eyeOff" size={16} /> موجودی، گردش حساب و عدد دقیق حقوق به گیرنده نشان داده نمی‌شود.
          </div>
        </div>
        <p className="muted small center">صاحبخانه این صفحه را با اسکن QR می‌بیند؛ بدون نصب هیچ اپی.</p>
      </Screen>
    )

  if (step === 1)
    return (
      <Screen title="پاسپورت حقوق" onBack={() => setStep(0)}>
        <Card className="ip-card">
          <div className="ip-card-top">
            <span>پاسپورت حقوق</span>
            <b dir="ltr">IP-7Q2K</b>
          </div>
          <FakeQR seed={23} size={150} />
          <b>{user.name}</b>
          <div className="muted small">برای {FOR.find((f) => f[0] === who)[1]} · {toFa(picked.length)} مورد</div>
          <div className="ip-timer">
            <Icon name="clock" size={14} /> فقط یک بار و تا ۴۸ ساعت معتبر
          </div>
        </Card>
        <div className="row2">
          <Btn kind="soft" onClick={() => toast('لینک کپی شد: refah.bank/p/7Q2K')}>
            <Icon name="link" size={18} /> کپی لینک
          </Btn>
          <Btn kind="soft" onClick={() => toast('ارسال شد')}>
            <Icon name="share" size={18} /> ارسال
          </Btn>
        </div>
        <Btn kind="ghost" className="block" onClick={() => setStep(2)}>
          ببینید گیرنده چه می‌بیند
        </Btn>
      </Screen>
    )

  return (
    <Screen title="پاسپورت حقوق">
      <Card className="ip-hero">
        <b>ضامن و چک نمی‌خواهد</b>
        <p className="muted small">
          برای اجاره یا خرید قسطی، به‌جای ضامن و چک، یک لینک از بانک بفرستید: «این شخص حقوق‌بگیر منظم است». خودتان انتخاب می‌کنید چه چیزی دیده شود.
        </p>
      </Card>
      <Section title="برای چه کسی؟">
        <div className="chips">
          {FOR.map(([k, t, ic]) => (
            <button key={k} className={`chip ${who === k ? 'on' : ''}`} onClick={() => setWho(k)}>
              <Icon name={ic} size={16} /> {t}
            </button>
          ))}
        </div>
      </Section>
      <Section title="چه چیزی نشان داده شود؟">
        <Card className="list">
          {ITEMS.map(([k, t, v]) => (
            <label key={k} className="cn-chk">
              <input type="checkbox" checked={show[k]} onChange={(e) => setShow({ ...show, [k]: e.target.checked })} />
              <div>
                <b>{t}</b>
                <div className="muted small">{v}</div>
              </div>
            </label>
          ))}
        </Card>
      </Section>
      <Section title="تأیید با رمز دوم پویا">
        <OtpField value={otp} onChange={setOtp} />
      </Section>
      <Btn className="block" disabled={!picked.length || otp !== '1111'} onClick={() => setStep(1)}>
        ساختن پاسپورت
      </Btn>
    </Screen>
  )
}
