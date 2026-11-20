import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, OtpField, Screen, Section, useApp } from '../components/ui'
import { FakeQR } from './Certificate'
import { user } from '../data/mock'
import { toFa } from '../utils/fa'

const M = (v) => toFa(String(Math.round(v / 1e6)))
const FEE = 0.012 // کارمزد سالانه‌ی ضمانت‌نامه (نمونه)

// ودیعه‌ی بانکی: به‌جای پول رهن نقد، بانک از روی سابقه‌ی حقوق ضمانت‌نامه می‌دهد
export default function RentGuarantee() {
  const { addCase, toast } = useApp()
  const [amt, setAmt] = useState(300000000)
  const [owner, setOwner] = useState('محمود کریمی')
  const [months, setMonths] = useState(12)
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(0) // 0 فرم، 1 ضمانت‌نامه، 2 نمای صاحبخانه
  const monthly = Math.round((amt * FEE) / 12)
  const maxAmt = 400000000 // سقف از روی حقوق (نمونه)

  if (step === 2)
    return (
      <Screen title="نمای صاحبخانه" onBack={() => setStep(1)}>
        <div className="ip-browser">
          <div className="ip-url" dir="ltr">
            <Icon name="lock" size={12} /> refah.bank/g/RG-5521
          </div>
          <div className="ip-verified">
            <span className="ip-badge">
              <Icon name="shield" size={22} stroke={2.4} />
            </span>
            <b>ضمانت‌نامه‌ی ودیعه‌ی بانک رفاه کارگران</b>
            <span className="muted small">معتبر · امضای دیجیتال بانک</span>
          </div>
          <div className="ip-row"><span>ذی‌نفع (صاحبخانه)</span><b>{owner}</b></div>
          <div className="ip-row"><span>مستأجر</span><b>{user.name}</b></div>
          <div className="ip-row"><span>مبلغ تضمین‌شده</span><b>{M(amt)} میلیون تومان</b></div>
          <div className="ip-row"><span>مدت</span><b>{toFa(months)} ماه</b></div>
          <div className="ip-hidden">
            <Icon name="info" size={16} /> اگر مستأجر اجاره ندهد یا خسارت بزند، بانک رفاه تا سقف این مبلغ به شما می‌پردازد.
          </div>
        </div>
      </Screen>
    )

  if (step === 1)
    return (
      <Screen title="ودیعه‌ی بانکی" onBack={() => setStep(0)}>
        <Card className="ip-card">
          <div className="ip-card-top">
            <span>ضمانت‌نامه‌ی ودیعه</span>
            <b dir="ltr">RG-5521</b>
          </div>
          <FakeQR seed={41} size={150} />
          <b>{M(amt)} میلیون تومان</b>
          <div className="muted small">به نام {owner} · {toFa(months)} ماه</div>
          <div className="ip-timer">
            <Icon name="check" size={14} /> {M(amt)} میلیون پول شما آزاد ماند
          </div>
        </Card>
        <div className="row2">
          <Btn kind="soft" onClick={() => toast('لینک برای صاحبخانه ارسال شد')}>
            <Icon name="share" size={18} /> ارسال به صاحبخانه
          </Btn>
          <Btn kind="soft" onClick={() => toast('PDF ذخیره شد')}>
            <Icon name="download" size={18} /> PDF
          </Btn>
        </div>
        <Btn kind="ghost" className="block" onClick={() => setStep(2)}>
          ببینید صاحبخانه چه می‌بیند
        </Btn>
      </Screen>
    )

  return (
    <Screen title="ودیعه‌ی بانکی">
      <Card className="ip-hero">
        <b>رهن بدون پول نقد</b>
        <p className="muted small">
          به‌جای این‌که صدها میلیون پول رهن بلوکه شود، بانک رفاه از روی سابقه‌ی حقوقتان به صاحبخانه ضمانت‌نامه می‌دهد. شما فقط ماهانه یک کارمزد کم می‌پردازید.
        </p>
      </Card>

      <Section title="مبلغ رهن">
        <Card>
          <div className="ewa-amt">
            {M(amt)} <span className="muted">میلیون تومان</span>
          </div>
          <input type="range" className="ewa-range" min={50000000} max={maxAmt} step={10000000} value={amt} onChange={(e) => setAmt(+e.target.value)} />
          <div className="muted small center">سقف شما از روی حقوق: {M(maxAmt)} میلیون</div>
          <div className="ewa-terms" style={{ marginTop: 12 }}>
            <div><span>پول نقد لازم</span><b>صفر</b></div>
            <div><span>کارمزد ماهانه</span><b>{toFa((monthly / 1e6).toFixed(1)).replace('.', '٫')} م</b></div>
            <div><span>پرداخت</span><b>خودکار از حقوق</b></div>
          </div>
        </Card>
      </Section>

      <Section title="صاحبخانه">
        <Card>
          <input className="rg-in" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="نام صاحبخانه" />
        </Card>
      </Section>
      <Section title="مدت قرارداد">
        <div className="chips">
          {[6, 12, 24].map((m) => (
            <button key={m} className={`chip ${months === m ? 'on' : ''}`} onClick={() => setMonths(m)}>
              {toFa(m)} ماه
            </button>
          ))}
        </div>
      </Section>
      <Section title="تأیید با رمز دوم پویا">
        <OtpField value={otp} onChange={setOtp} />
      </Section>
      <Btn
        className="block"
        disabled={otp !== '1111' || !owner}
        onClick={() => {
          addCase({
            kind: 'rent',
            icon: 'shield',
            title: 'ضمانت‌نامه‌ی ودیعه',
            summary: `${M(amt)} میلیون · به نام ${owner}`,
            steps: [
              ['صادر شد و به صاحبخانه ارسال شد', 'امروز'],
              ['صاحبخانه قرارداد را تأیید کند', 'در انتظار'],
              ['فعال تا پایان قرارداد', `${toFa(months)} ماه`],
            ],
          })
          setStep(1)
        }}
      >
        صدور ضمانت‌نامه
      </Btn>
    </Screen>
  )
}
