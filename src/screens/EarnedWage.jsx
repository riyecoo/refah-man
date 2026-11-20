import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, Num, OtpField, Screen, Section, useApp } from '../components/ui'
import { ewa } from '../data/openApi'
import { money, toFa } from '../utils/fa'

const M = (v) => toFa((v / 1e6).toFixed(1)).replace('.', '٫')

// حقوقِ کارکرده: بخشی از حقوقی که تا امروز کار کرده‌اید را بی‌سود، همین حالا بگیرید
export default function EarnedWage() {
  const { reset, toast } = useApp()
  const earned = Math.round((ewa.salary * ewa.dayNow) / ewa.daysInMonth)
  const avail = Math.round((earned * ewa.pct) / 100)
  const [amt, setAmt] = useState(Math.min(5000000, avail))
  const [otp, setOtp] = useState('')
  const [done, setDone] = useState(false)

  if (done)
    return (
      <Screen title="حقوق کارکرده" back={false}>
        <div className="ewa-done">
          <img src="./assets/st-success.png" width="130" height="130" alt="" />
          <b>{M(amt)} میلیون تومان واریز شد</b>
          <p className="muted small">
            بدون سود و کارمزد. روز {ewa.payday} همین مبلغ از حقوق کم می‌شود و بقیه مثل همیشه واریز می‌شود.
          </p>
        </div>
        <Btn className="block" onClick={() => reset('home')}>
          بازگشت به خانه
        </Btn>
      </Screen>
    )

  return (
    <Screen title="حقوق کارکرده">
      <Card className="ewa-hero">
        <div className="muted small">تا امروز ({toFa(ewa.dayNow)} روز از {toFa(ewa.daysInMonth)}) کار کرده‌اید:</div>
        <div className="ewa-big">
          <Num>{M(earned)}</Num> <span>میلیون تومان</span>
        </div>
        <div className="ewa-bar">
          <span className="ewa-earned" style={{ width: `${(ewa.dayNow / ewa.daysInMonth) * 100}%` }} />
          <span className="ewa-avail" style={{ width: `${((ewa.dayNow / ewa.daysInMonth) * ewa.pct) }%` }} />
        </div>
        <div className="ewa-legend">
          <span>
            <i className="d1" /> قابل برداشت الان: <Num>{M(avail)}</Num> م
          </span>
          <span>حقوق کامل: {ewa.payday}</span>
        </div>
      </Card>

      <Section title="چقدر لازم دارید؟">
        <Card>
          <div className="ewa-amt">
            <Num>{money(amt)}</Num> <span className="muted">تومان</span>
          </div>
          <input type="range" className="ewa-range" min={500000} max={avail} step={500000} value={amt} onChange={(e) => setAmt(+e.target.value)} />
          <div className="ewa-terms">
            <div>
              <span>سود</span>
              <b>صفر</b>
            </div>
            <div>
              <span>کارمزد</span>
              <b>صفر</b>
            </div>
            <div>
              <span>بازپرداخت</span>
              <b>خودکار، {ewa.payday}</b>
            </div>
          </div>
        </Card>
      </Section>

      <Card className="ewa-why">
        <Icon name="info" size={18} />
        <span>
          به‌جای قرض از همکار یا وام گران آخر ماه. روزهای کارکرد را <b>{ewa.employer}</b> از راه API به بانک می‌فرستد.
        </span>
      </Card>

      <Section title="تأیید با رمز دوم پویا">
        <OtpField value={otp} onChange={setOtp} />
      </Section>
      <Btn
        className="block"
        disabled={otp !== '1111'}
        onClick={() => {
          toast('پیامک بانک رفاه: واریز از محل حقوق کارکرده')
          setDone(true)
        }}
      >
        همین الان واریز کن
      </Btn>
    </Screen>
  )
}
