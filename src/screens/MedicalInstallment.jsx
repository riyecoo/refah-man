import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, OtpField, Screen, Section, useApp } from '../components/ui'
import { money, toFa } from '../utils/fa'

const BILL = { center: 'دندانپزشکی دکتر امینی', what: 'ایمپلنت و روکش · ۲ واحد', amount: 18000000 }
const MONTHS = ['دی', 'بهمن', 'اسفند', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر']

// درمان قسطی: هزینه‌ی درمان بدون چک و ضامن، قسط از حقوق یا مستمری
export default function MedicalInstallment() {
  const { addCase, toast, reset } = useApp()
  const [n, setN] = useState(6)
  const [otp, setOtp] = useState('')
  const [done, setDone] = useState(false)
  const per = Math.round(BILL.amount / n)

  if (done)
    return (
      <Screen title="درمان قسطی" back={false} home>
        <div className="ip-browser">
          <div className="ip-verified">
            <span className="ip-badge"><Icon name="check" size={22} stroke={2.6} /></span>
            <b>پرداخت به مرکز درمانی انجام شد</b>
            <span className="muted small">{BILL.center} پول را همین الان کامل دریافت کرد</span>
          </div>
          <div className="ip-row"><span>مبلغ</span><b>{money(BILL.amount)} تومان</b></div>
          <div className="ip-row"><span>بازپرداخت</span><b>{toFa(n)} قسط {money(per)}</b></div>
          <div className="ip-row"><span>کسر از</span><b>حقوق یا مستمری، روز ۱ هر ماه</b></div>
          <div className="ip-hidden"><Icon name="info" size={16} /> بدون چک، بدون ضامن، بدون رفتن به شعبه.</div>
        </div>
        <div className="row2">
          <Btn kind="soft" onClick={() => toast('رسید ذخیره شد')}>
            <Icon name="download" size={18} /> رسید
          </Btn>
          <Btn kind="soft" onClick={() => reset('cases')}>
            <Icon name="box" size={18} /> پرونده‌ها
          </Btn>
        </div>
        <Btn className="block" onClick={() => reset('home')}>بازگشت به خانه</Btn>
      </Screen>
    )

  return (
    <Screen title="درمان قسطی">
      <Card className="ip-hero">
        <b>درمان، بدون چک و ضامن</b>
        <p className="muted small">
          هزینه‌ی دندانپزشکی، بیمارستان یا عینک را قسطی کنید. مرکز درمانی فقط پاسپورت حقوق شما را می‌بیند و قسط هم خودکار از حقوق یا مستمری کم می‌شود.
        </p>
      </Card>

      <Section title="صورت‌حساب درمانی">
        <Card className="md-bill">
          <span className="row-ic"><Icon name="heart" size={20} /></span>
          <div className="grow">
            <b>{BILL.center}</b>
            <div className="muted small">{BILL.what}</div>
          </div>
          <b>{money(BILL.amount)}</b>
        </Card>
        <div className="muted small" style={{ marginTop: 6 }}>این صورت‌حساب را مرکز درمانی از راه API برایتان فرستاده است.</div>
      </Section>

      <Section title="چند قسط؟">
        <Card>
          <div className="chips">
            {[3, 6, 12].map((m) => (
              <button key={m} className={`chip ${n === m ? 'on' : ''}`} onClick={() => setN(m)}>
                {toFa(m)} قسط
              </button>
            ))}
          </div>
          <div className="p2p-sched">
            {Array.from({ length: Math.min(n, 4) }, (_, i) => (
              <div key={i}>
                <span>۱ {MONTHS[i]}</span>
                <b>{money(per)}</b>
              </div>
            ))}
            {n > 4 && <div className="muted small center">و {toFa(n - 4)} قسط دیگر…</div>}
          </div>
          <div className="ewa-terms" style={{ marginTop: 12 }}>
            <div><span>چک و ضامن</span><b>ندارد</b></div>
            <div><span>کسر از</span><b>حقوق/مستمری</b></div>
            <div><span>مرکز درمانی</span><b>نقد می‌گیرد</b></div>
          </div>
        </Card>
      </Section>

      <Section title="تأیید با رمز دوم پویا">
        <OtpField value={otp} onChange={setOtp} />
      </Section>
      <Btn
        className="block"
        disabled={otp !== '1111'}
        onClick={() => {
          addCase({
            kind: 'med',
            icon: 'heart',
            title: 'درمان قسطی',
            summary: `${BILL.center} · ${toFa(n)} قسط`,
            steps: [
              ['مبلغ کامل به مرکز درمانی پرداخت شد', 'امروز'],
              ['کسر خودکار قسط‌ها', `${toFa(n)} ماه`],
            ],
          })
          setDone(true)
        }}
      >
        قسطی کن و پرداخت شود
      </Btn>
    </Screen>
  )
}
