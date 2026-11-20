import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, Num, OtpField, Screen, Section, useApp } from '../components/ui'
import { ewa } from '../data/openApi'
import { money, toFa } from '../utils/fa'

const M = (v) => toFa((v / 1e6).toFixed(1)).replace('.', '٫')

// حقوقِ کارکرده: بخشی از حقوقی که تا امروز کار کرده‌اید را بی‌سود، همین حالا بگیرید
export default function EarnedWage() {
  const { reset, toast, post, ewaTaken, setEwaTaken } = useApp()
  const earned = Math.round((ewa.salary * ewa.dayNow) / ewa.daysInMonth)
  const avail = Math.max(0, Math.round((earned * ewa.pct) / 100) - ewaTaken)
  const [amt, setAmt] = useState(Math.min(5000000, avail))
  const [paid, setPaid] = useState(0)
  const [otp, setOtp] = useState('')
  const [done, setDone] = useState(false)

  if (done)
    return (
      <Screen title="حقوق کارکرده" back={false} home>
        <div className="ewa-done">
          <img src="./assets/st-success.png" width="130" height="130" alt="" />
          <b>{M(paid)} میلیون تومان به حساب جاری واریز شد</b>
          <p className="muted small">
            بدون سود و کارمزد. روز {ewa.payday} همین مبلغ از حقوق کم می‌شود. موجودی و گردش حسابتان همین الان به‌روز شد و بقیه مثل همیشه واریز می‌شود.
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

      {avail < 500000 && (
        <Card className="ewa-why">
          <Icon name="check" size={18} />
          <span>سقف این ماه را برداشته‌اید. از روزهای کاری بعدی، دوباره قابل برداشت می‌شود.</span>
        </Card>
      )}
      <Section title="چقدر لازم دارید؟">
        <Card>
          <div className="ewa-amt">
            <Num>{money(amt)}</Num> <span className="muted">تومان</span>
          </div>
          <input type="range" className="ewa-range" min={500000} max={Math.max(avail, 500000)} step={500000} value={Math.min(amt, Math.max(avail, 500000))} onChange={(e) => setAmt(+e.target.value)} />
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
        disabled={otp !== '1111' || avail < 500000}
        onClick={() => {
          post({ title: 'واریز از حقوق کارکرده', amount: amt, cat: 'income' })
          setEwaTaken((t) => t + amt)
          setPaid(amt)
          toast('پیامک بانک رفاه: واریز از محل حقوق کارکرده')
          setDone(true)
        }}
      >
        همین الان واریز کن
      </Btn>
    </Screen>
  )
}
