import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, Screen, Section, Toggle, useApp } from '../components/ui'
import { money, toFa } from '../utils/fa'

// پرداخت شهری: مترو، اتوبوس، تاکسی و پارکینگ با یک لمس؛ بدون رمز تا سقف روزانه
// چالش ۱۳ اینوکاپ: پرداخت خرد در موقعیت‌های شهری
const PLACES = [
  { id: 'metro', t: 'مترو', ic: 'layers', price: 18000, where: 'ایستگاه میدان ولیعصر' },
  { id: 'bus', t: 'اتوبوس', ic: 'box', price: 9000, where: 'خط ۱۲۸' },
  { id: 'taxi', t: 'تاکسی', ic: 'send', price: 45000, where: 'ونک ← تجریش' },
  { id: 'park', t: 'پارکینگ', ic: 'cal', price: 30000, where: 'پارکینگ طبقاتی ونک · ۲ ساعت' },
]
const CAP = 300000

export default function CityPay() {
  const { post, toast } = useApp()
  const [spent, setSpent] = useState(54000)
  const [noPin, setNoPin] = useState(true)
  const [paying, setPaying] = useState(null)
  const [last, setLast] = useState(null)

  const pay = (p) => {
    if (spent + p.price > CAP) {
      toast('سقف روزانه‌ی پرداخت بدون رمز پر شد')
      return
    }
    setPaying(p.id)
    setTimeout(() => {
      post({ title: `${p.t} · ${p.where}`, amount: -p.price, cat: 'transport' })
      setSpent((s) => s + p.price)
      setLast(p)
      setPaying(null)
      toast(`${p.t}: ${money(p.price)} تومان ✓`)
    }, 900)
  }

  return (
    <Screen title="پرداخت شهری">
      <Card className="cp-hero">
        <div className="cp-ring" style={{ '--p': `${(spent / CAP) * 360}deg` }}>
          <div>
            <b>{toFa(Math.round(spent / 1000))}</b>
            <small>از {toFa(CAP / 1000)} هزار</small>
          </div>
        </div>
        <div className="grow">
          <b>امروز در شهر</b>
          <p className="small muted">گوشی را به دستگاه نزدیک کنید یا QR را اسکن کنید. پرداخت‌های زیر سقف روزانه رمز نمی‌خواهد.</p>
        </div>
      </Card>

      <Section title="کجا هستید؟">
        <div className="cp-grid">
          {PLACES.map((p) => (
            <button key={p.id} className={`cp-tile ${paying === p.id ? 'busy' : ''}`} onClick={() => pay(p)} disabled={!!paying}>
              <span className="cp-ic"><Icon name={p.ic} size={24} /></span>
              <b>{p.t}</b>
              <small>{money(p.price)} تومان</small>
              {paying === p.id && <span className="cp-nfc">در حال پرداخت…</span>}
            </button>
          ))}
        </div>
      </Section>

      {last && (
        <Card className="cn-never">
          <Icon name="check" size={18} />
          <span>{last.t} · {last.where} · {money(last.price)} تومان پرداخت شد</span>
        </Card>
      )}

      <Section title="تنظیمات">
        <Card className="list">
          <div className="row">
            <span className="row-ic"><Icon name="bolt" size={20} /></span>
            <span className="row-txt">
              <span className="row-title">پرداخت بدون رمز</span>
              <span className="row-sub">تا {money(CAP)} تومان در روز؛ بالاتر از آن، رمز پویا لازم است</span>
            </span>
            <Toggle on={noPin} onChange={setNoPin} label="پرداخت بدون رمز" />
          </div>
          <div className="row">
            <span className="row-ic"><Icon name="chart" size={20} /></span>
            <span className="row-txt">
              <span className="row-title">جمع رفت‌وآمد این ماه</span>
              <span className="row-sub">۱٫۲ میلیون تومان · ۱۸٪ کمتر از ماه قبل</span>
            </span>
          </div>
        </Card>
      </Section>
      <Btn kind="soft" className="block" onClick={() => toast('QR آماده‌ی اسکن است')}>
        <Icon name="qr" size={18} /> اسکن QR پذیرنده
      </Btn>
    </Screen>
  )
}
