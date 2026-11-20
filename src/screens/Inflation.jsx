import Icon from '../components/Icon'
import { Btn, Card, Screen, Section, useApp } from '../components/ui'
import { inflation as I } from '../data/mock'
import { toFa } from '../utils/fa'

const n = (v, d = 1) => toFa(v.toFixed(d)).replace('.', '٫')

// تورم شخصی: وزن خرج‌های خود کاربر × تورم رسمی هر دسته
export default function Inflation() {
  const { push } = useApp()
  const rows = I.rows.map(([t, w, r]) => ({ t, w, r, c: (w * r) / 100 }))
  const mine = rows.reduce((s, x) => s + x.c, 0)
  const top = [...rows].sort((a, b) => b.c - a.c)[0]
  const power = ((1 + I.yearlySalary / 100) / (1 + I.yearlyPersonal / 100) - 1) * 100
  const maxR = Math.max(...rows.map((x) => x.r))

  return (
    <Screen title="تورم شخصی من">
      <Card className="inf-hero">
        <span className="muted small">{I.month}</span>
        <div className="inf-big">
          <b>{n(mine)}٪</b>
          <span>تورم ماهانه‌ی زندگی شما</span>
        </div>
        <div className={`inf-vs ${mine > I.official ? 'up' : 'down'}`}>
          میانگین کشور: {n(I.official)}٪ · زندگی شما {mine > I.official ? 'گران‌تر' : 'ارزان‌تر'} از میانگین شد
        </div>
      </Card>

      <Card className="inf-power">
        <Icon name="trend" size={22} />
        <div>
          <b>
            قدرت خرید حقوقتان در یک سال {power < 0 ? `${n(-power, 0)}٪ کم شد` : `${n(power, 0)}٪ بیشتر شد`}
          </b>
          <span className="muted small">
            حقوق شما {toFa(I.yearlySalary)}٪ بیشتر شد، ولی هزینه‌ی زندگی خودتان {toFa(I.yearlyPersonal)}٪.
          </span>
        </div>
      </Card>

      <Section title="از کجا آمد؟">
        <Card className="inf-rows">
          {rows.map((x) => (
            <div key={x.t} className={`inf-row ${x === top ? 'top' : ''}`}>
              <div className="inf-l">
                <b>{x.t}</b>
                <span className="muted small">
                  {toFa(x.w)}٪ از خرج شما · گرانی این ماه {n(x.r)}٪
                </span>
              </div>
              <span className="inf-bar">
                <i style={{ width: `${(x.r / maxR) * 100}%` }} />
              </span>
            </div>
          ))}
        </Card>
      </Section>

      <Card className="advice">
        <b>
          <Icon name="info" size={16} /> یعنی چه؟
        </b>
        <p>
          بیشترین سهم گرانی زندگی شما از «{top.t}» آمد. تورم رسمی برای یک خانوار میانگین حساب می‌شود؛ این عدد برای <b>سبد خرید خود شما</b> است، چون ترکیب خرجتان را از دسته‌بندی تراکنش‌هایتان می‌دانیم.
        </p>
        <span className="muted small">روش: سهم هر دسته از خرج شما × تورم رسمی همان دسته (داده‌ی عمومی). اعداد این نمونه فرضی‌اند.</span>
      </Card>
      <Btn kind="soft" onClick={() => push('life')}>
        <Icon name="receipt" size={18} /> صورت‌حساب زندگی همین ماه
      </Btn>
    </Screen>
  )
}
