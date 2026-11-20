import { useState } from 'react'
import Icon from '../components/Icon'
import { Avatar, Btn, Card, OtpField, Screen, Section, useApp } from '../components/ui'
import { contacts } from '../data/mock'
import { money, toFa } from '../utils/fa'

const MONTHS = ['دی', 'بهمن', 'اسفند', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر']

// قرض‌نامه‌ی دوستانه: قرض بین دوست و فامیل، با سند و کسر خودکار قسط در روز حقوق
export default function P2PLoan() {
  const { toast, post, reset, addCase } = useApp()
  const [to, setTo] = useState(contacts[3].id)
  const [role, setRole] = useState('lend') // lend: من قرض می‌دهم، borrow: من قرض می‌گیرم
  const [amt, setAmt] = useState(10000000)
  const [n, setN] = useState(5)
  const [otp, setOtp] = useState('')
  const [done, setDone] = useState(false)
  const c = contacts.find((x) => x.id === to)
  const per = Math.round(amt / n)

  if (done)
    return (
      <Screen title="قرض‌نامه" back={false} home>
        <div className="p2p-doc">
          <div className="p2p-head">
            <Icon name="doc" size={20} />
            <b>قرض‌نامه‌ی دیجیتال</b>
            <span dir="ltr">QN-2087</span>
          </div>
          <div className="ip-row"><span>قرض‌دهنده</span><b>{role === 'lend' ? 'احسان هاشمی' : c.full}</b></div>
          <div className="ip-row"><span>قرض‌گیرنده</span><b>{role === 'lend' ? c.full : 'احسان هاشمی'}</b></div>
          <div className="ip-row"><span>مبلغ</span><b>{money(amt)} تومان</b></div>
          <div className="ip-row"><span>بازپرداخت</span><b>{toFa(n)} قسط، روز ۱ هر ماه (روز حقوق)</b></div>
          <div className="ip-row"><span>امضا</span><b className="ok-t">هر دو طرف ✓</b></div>
          <div className="ip-hidden">
            <Icon name="check" size={16} /> قسط‌ها خودکار از حساب قرض‌گیرنده کسر و به قرض‌دهنده واریز می‌شود. سند در «پرونده‌های من» هر دو نفر ذخیره است.
          </div>
        </div>
        <Btn kind="soft" className="block" onClick={() => toast('سند PDF ذخیره شد')}>
          <Icon name="download" size={18} /> دریافت سند
        </Btn>
        <Btn className="block" style={{ marginTop: 10 }} onClick={() => reset('home')}>بازگشت به خانه</Btn>
      </Screen>
    )

  return (
    <Screen title="قرض‌نامه‌ی دوستانه">
      <Card className="ip-hero">
        <b>قرض بدهید، بدون دلخوری</b>
        <p className="muted small">قرض بین دوست و فامیل را با سند ثبت کنید. قسط‌ها روز حقوق خودکار کسر می‌شود؛ نه کسی یادش می‌رود، نه کسی خجالت می‌کشد یادآوری کند.</p>
      </Card>

      <div className="chips p2p-role">
        <button className={`chip ${role === 'lend' ? 'on' : ''}`} onClick={() => setRole('lend')}>قرض می‌دهم</button>
        <button className={`chip ${role === 'borrow' ? 'on' : ''}`} onClick={() => setRole('borrow')}>قرض می‌گیرم</button>
      </div>

      <Section title={role === 'lend' ? 'به چه کسی؟' : 'از چه کسی؟'}>
        <div className="p2p-people">
          {contacts.map((x) => (
            <button key={x.id} className={`p2p-p ${to === x.id ? 'on' : ''}`} onClick={() => setTo(x.id)}>
              <Avatar c={x} size={44} />
              <span>{x.name}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="مبلغ و قسط">
        <Card>
          <div className="ewa-amt">
            {money(amt)} <span className="muted">تومان</span>
          </div>
          <input type="range" className="ewa-range" min={1000000} max={50000000} step={1000000} value={amt} onChange={(e) => setAmt(+e.target.value)} />
          <div className="chips">
            {[1, 3, 5, 10].map((m) => (
              <button key={m} className={`chip ${n === m ? 'on' : ''}`} onClick={() => setN(m)}>
                {toFa(m)} قسط
              </button>
            ))}
          </div>
          <div className="p2p-sched">
            {Array.from({ length: Math.min(n, 5) }, (_, i) => (
              <div key={i}>
                <span>۱ {MONTHS[i]}</span>
                <b>{money(per)}</b>
              </div>
            ))}
            {n > 5 && <div className="muted small center">و {toFa(n - 5)} قسط دیگر…</div>}
          </div>
        </Card>
      </Section>

      <Section title="امضای شما با رمز دوم پویا">
        <OtpField value={otp} onChange={setOtp} />
      </Section>
      <Btn
        className="block"
        disabled={otp !== '1111'}
        onClick={() => {
          post({ title: role === 'lend' ? `قرض به ${c.full}` : `قرض از ${c.full}`, amount: role === 'lend' ? -amt : amt, cat: role === 'lend' ? 'transfer' : 'income' })
          addCase({ kind: 'p2p', icon: 'doc', title: 'قرض‌نامه‌ی دوستانه', summary: `${money(amt)} تومان · ${c.full} · ${toFa(n)} قسط`, steps: [['هر دو طرف امضا کردند', 'امروز'], ['کسر خودکار قسط‌ها', `${toFa(n)} ماه`], ['تسویه', 'پایان قرارداد']] })
          toast(`${c.full} قرض‌نامه را در گوشی خودش امضا کرد ✓`)
          setTimeout(() => setDone(true), 700)
        }}
      >
        امضا و ارسال برای {c.name}
      </Btn>
    </Screen>
  )
}
