import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, OtpField, Screen, Section, useApp } from '../components/ui'
import { ewa } from '../data/openApi'
import { toFa } from '../utils/fa'

const MATCH_CAP = 5 // کارفرما تا ۵٪ حقوق، هم‌اندازه‌ی کارگر می‌گذارد (نمونه)
const M = (v) => toFa((v / 1e6).toFixed(1)).replace('.', '٫').replace('٫۰', '')

// پس‌انداز با سهم کارفرما: کارگر پس‌انداز می‌کند، کارفرما هم‌اندازه رویش می‌گذارد
export default function EmployerMatch() {
  const { addCase, reset, toast } = useApp()
  const [pct, setPct] = useState(5)
  const [otp, setOtp] = useState('')
  const [done, setDone] = useState(false)
  const mine = (ewa.salary * pct) / 100
  const theirs = (ewa.salary * Math.min(pct, MATCH_CAP)) / 100
  const monthly = mine + theirs
  const year = monthly * 12

  if (done)
    return (
      <Screen title="پس‌انداز با سهم کارفرما" back={false} home>
        <div className="ewa-done">
          <img src="./assets/st-success.png" width="130" height="130" alt="" />
          <b>فعال شد؛ از حقوق ۱ دی شروع می‌شود</b>
          <p className="muted small">
            هر ماه {M(mine)} میلیون از حقوق شما و {M(theirs)} میلیون از طرف {ewa.employer.split(' (')[0]} به این حساب واریز می‌شود.
          </p>
        </div>
        <Btn className="block" onClick={() => reset('home')}>بازگشت به خانه</Btn>
      </Screen>
    )

  return (
    <Screen title="پس‌انداز با سهم کارفرما">
      <Card className="ip-hero">
        <b>تو پس‌انداز کن، کارفرما هم‌اندازه می‌گذارد</b>
        <p className="muted small">
          هر ماه درصدی از حقوقت خودکار پس‌انداز می‌شود و کارفرما، از راه API حقوق، تا {toFa(MATCH_CAP)}٪ حقوق همان‌قدر رویش می‌گذارد. یعنی پس‌اندازت دو برابر می‌شود.
        </p>
      </Card>

      <Section title="چند درصد از حقوقت؟">
        <div className="chips">
          {[3, 5, 10].map((p) => (
            <button key={p} className={`chip ${pct === p ? 'on' : ''}`} onClick={() => setPct(p)}>
              {toFa(p)}٪
            </button>
          ))}
        </div>
      </Section>

      <Card className="em-card">
        <div className="ewa-terms">
          <div><span>سهم شما</span><b>{M(mine)} م</b></div>
          <div><span>سهم کارفرما</span><b className="em-gift">+{M(theirs)} م</b></div>
          <div><span>هر ماه</span><b>{M(monthly)} م</b></div>
        </div>
        <div className="muted small" style={{ margin: '14px 0 6px' }}>بعد از ۱۲ ماه:</div>
        <div className="ewa-big">{M(year)} <span>میلیون تومان</span></div>
        <div className="ewa-bar">
          <span className="ewa-earned" style={{ width: '100%' }} />
          <span className="ewa-avail" style={{ width: `${(mine / monthly) * 100}%` }} />
        </div>
        <div className="ewa-legend">
          <span><i className="d1" /> سهم شما: {M(mine * 12)} م</span>
          <span>هدیه‌ی کارفرما: {M(theirs * 12)} م</span>
        </div>
        {pct > MATCH_CAP && <div className="muted small" style={{ marginTop: 8 }}>کارفرما تا {toFa(MATCH_CAP)}٪ هم‌اندازه می‌گذارد؛ بقیه فقط سهم خود شماست.</div>}
      </Card>

      <Card className="ewa-why">
        <Icon name="users" size={18} />
        <span>
          کارفرمای متصل: <b>{ewa.employer.split(' (')[0]}</b>. برای کارفرما یک مزیت رفاهی و نگه‌داشتن نیروست؛ برای بانک، سپرده‌ی بلندمدت.
        </span>
      </Card>

      <Section title="تأیید با رمز دوم پویا">
        <OtpField value={otp} onChange={setOtp} />
      </Section>
      <Btn
        className="block"
        disabled={otp !== '1111'}
        onClick={() => {
          addCase({
            kind: 'save',
            icon: 'piggy',
            title: 'پس‌انداز با سهم کارفرما',
            summary: `${toFa(pct)}٪ حقوق · کارفرما +${M(theirs)} میلیون در ماه`,
            steps: [
              ['ثبت شد', 'امروز'],
              ['کارفرما سهم خود را تأیید کند', 'از راه API حقوق'],
              ['اولین واریز', '۱ دی'],
            ],
          })
          toast('درخواست برای کارفرما ارسال شد')
          setDone(true)
        }}
      >
        فعال کن
      </Btn>
    </Screen>
  )
}
