import { useState } from 'react'
import Art from '../components/Art'
import { Btn, Card, Row, Screen, Section, Toggle, useApp } from '../components/ui'
import { KV } from './Accounts'
import { loans } from '../data/mock'
import { money, short, toFa } from '../utils/fa'

export function Loans() {
  const { push } = useApp()
  const due = loans.reduce((s, l) => s + l.installment, 0)
  return (
    <Screen title="وام‌ها و اقساط">
      <Card className="total">
        <span className="muted small">اقساط این ماه</span>
        <b className="total-num">{money(due)} تومان</b>
      </Card>
      <div className="loan-list">
        {loans.map((l) => (
          <button key={l.id} className="card loan" onClick={() => push('loan', { id: l.id })}>
            <div className="loan-top">
              <Art name="ic-loan" size={44} />
              <div className="grow">
                <b>{l.title}</b>
                <div className="muted small">
                  قسط بعدی {l.next} · {short(l.installment)} تومان
                </div>
              </div>
            </div>
            <div className="prog">
              <span style={{ width: `${(l.paid / l.count) * 100}%` }} />
            </div>
            <div className="loan-meta">
              <span>
                {toFa(l.paid)} از {toFa(l.count)} قسط پرداخت شده
              </span>
              {l.auto && <span className="ok-tag">پرداخت خودکار</span>}
            </div>
          </button>
        ))}
      </div>
      <Section title="خدمات تسهیلات">
        <Card className="list">
          <Row icon="plus" title="درخواست وام جدید، بدون شعبه" sub="شبیه‌ساز قسط، اعتبارسنجی، ضامن آنلاین، سفته‌ی الکترونیکی" onClick={() => push('loanApply')} chevron />
          <Row icon="text" title="محاسبه‌گر اقساط" onClick={() => push('services')} chevron />
          <Row icon="users" title="ضمانت‌های من" sub="وام‌هایی که ضامن آن هستید" onClick={() => push('services')} chevron />
        </Card>
      </Section>
    </Screen>
  )
}

export function LoanDetail({ id }) {
  const { reset, toast } = useApp()
  const l = loans.find((x) => x.id === id) || loans[0]
  const [auto, setAuto] = useState(l.auto)
  const schedule = Array.from({ length: 5 }, (_, i) => ({ n: l.paid + i + 1, when: ['۱۰ آذر', '۱۰ دی', '۱۰ بهمن', '۱۰ اسفند', '۱۰ فروردین'][i] }))
  return (
    <Screen
      title={l.title}
      footer={
        <Btn
          onClick={() =>
            reset('receipt', {
              title: 'قسط پرداخت شد',
              amount: l.installment,
              rows: [
                ['وام', l.title],
                ['قسط', `${toFa(l.paid + 1)} از ${toFa(l.count)}`],
                ['از حساب', 'حساب جاری'],
                ['کد پیگیری', toFa('330812'), true],
              ],
            })
          }
        >
          پرداخت قسط {toFa(l.paid + 1)} · {money(l.installment)} تومان
        </Btn>
      }
    >
      <Card className="loan-hero">
        <div className="ring" style={{ '--p': l.paid / l.count }}>
          <span>
            <b>{toFa(Math.round((l.paid / l.count) * 100))}٪</b>
            <small>تسویه شده</small>
          </span>
        </div>
        <div className="loan-nums">
          <KV k="مبلغ وام" v={`${short(l.total)} تومان`} />
          <KV k="مانده" v={`${short(l.installment * l.remain)} تومان`} />
          <KV k="اقساط باقی‌مانده" v={toFa(l.remain)} />
        </div>
      </Card>
      <Card className="list">
        <Row
          icon="refresh"
          title="پرداخت خودکار قسط"
          sub="روز سررسید از حساب جاری کسر می‌شود؛ دیگر جریمه‌ی دیرکرد ندارید"
          end={<Toggle on={auto} onChange={(v) => (setAuto(v), toast(v ? 'پرداخت خودکار فعال شد' : 'پرداخت خودکار خاموش شد'))} label="پرداخت خودکار" />}
        />
      </Card>
      <Section title="اقساط پیش رو">
        <Card className="list">
          {schedule.map((s, i) => (
            <Row key={s.n} title={`قسط ${toFa(s.n)}`} sub={s.when} end={<span className={i === 0 ? 'tag-warn' : 'muted'}>{short(l.installment)}</span>} />
          ))}
        </Card>
      </Section>
    </Screen>
  )
}
