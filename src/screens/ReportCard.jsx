import Icon from '../components/Icon'
import { Btn, Card, Screen, Section, useApp } from '../components/ui'
import { reportCard as R, user } from '../data/mock'
import { toFa } from '../utils/fa'

const n = (v) => toFa(String(v)).replace('.', '٫')
const tone = (v) => (v >= 17 ? 'good' : v >= 13 ? 'mid' : 'low')
const TIP_TO = [['life'], ['goals'], ['security']]

// کارنامه‌ی ماه: نمره‌ی انضباط مالی از ۲۰، مثل کارنامه‌ی مدرسه
export default function ReportCard() {
  const { push, toast } = useApp()
  const diff = R.score - R.prev
  return (
    <Screen
      title="کارنامه‌ی ماه"
      action={
        <button className="hdr-btn" onClick={() => toast('تصویر کارنامه برای استوری ساخته شد؛ مبلغ‌ها در آن نیست')} aria-label="اشتراک">
          <Icon name="share" size={20} />
        </button>
      }
    >
      <div className="rc-paper">
        <div className="rc-title">
          <span>کارنامه‌ی مالی</span>
          <b>{R.month}</b>
        </div>
        <div className="rc-who">
          <span>نام: {user.name}</span>
          <span>بانک رفاه کارگران</span>
        </div>
        <table className="rc-table">
          <thead>
            <tr>
              <th>درس</th>
              <th>نمره</th>
            </tr>
          </thead>
          <tbody>
            {R.subjects.map(([t, v, why]) => (
              <tr key={t}>
                <td>
                  <b>{t}</b>
                  <span>{why}</span>
                </td>
                <td className={`grade ${tone(v)}`}>{n(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="rc-avg">
          <div>
            <span>معدل</span>
            <b className={tone(R.score)}>{n(R.score)}</b>
          </div>
          <div className={`rc-diff ${diff >= 0 ? 'up' : 'down'}`}>
            <Icon name="trend" size={16} /> {diff >= 0 ? '+' : '−'}
            {n(Math.abs(diff))} نسبت به ماه قبل
          </div>
        </div>
        <div className="rc-persona">
          <span>تیپ این ماه</span>
          <b>{R.persona}</b>
        </div>
      </div>

      <Card className="advice">
        <b>
          <Icon name="chat" size={16} /> نظر مشاور
        </b>
        <p>{R.note}</p>
        <span className="muted small">این متن را هوش مصنوعی فقط از روی آمار جمع‌بندی‌شده‌ی ماه نوشته است؛ ریز تراکنش‌های شما از بانک بیرون نمی‌رود.</span>
      </Card>

      <Section title="سه کار برای ماه بعد">
        <div className="rc-tips">
          {R.tips.map((t, i) => (
            <button key={t} className="rc-tip" onClick={() => push(...TIP_TO[i])}>
              <span className="rc-num">{toFa(i + 1)}</span>
              <span className="grow">{t}</span>
              <Icon name="chev" size={16} />
            </button>
          ))}
        </div>
      </Section>
      <Btn kind="soft" onClick={() => push('inflation')}>
        <Icon name="trend" size={18} /> تورم شخصی من در همین ماه
      </Btn>
    </Screen>
  )
}
