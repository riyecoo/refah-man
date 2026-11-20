import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, Screen, Section, useApp } from '../components/ui'
import { toFa } from '../utils/fa'

// نمای بانک (برای کارشناس رفاه): ارزش طول عمر مشتری + پیش‌بینی رویگردانی + اقدام نگه‌داشت
// چالش‌های ۱ و ۲ اینوکاپ. همه‌ی داده‌ها نمونه است؛ سیگنال‌ها از داده‌ی حقوق و رفتار اپ می‌آیند.
const F = (v) => toFa(String(v)).replace('.', '٫')

const SEGMENTS = [
  ['کارگر حقوق‌بگیر', 1240000, 18, 'ok'],
  ['بازنشسته', 680000, 6, 'ok'],
  ['کارگر فصلی', 210000, 31, 'risk'],
  ['جوان زیر ۳۰ سال', 390000, 27, 'risk'],
]

const CUSTOMERS = [
  {
    id: 'c1',
    name: 'علی رضایی · کارگر تعمیرات',
    risk: 82,
    clv: 46,
    signals: [
      ['۸۵٪ حقوق در ۲۴ ساعت به بانک دیگر منتقل می‌شود', 'سه ماه پیش ۳۰٪ بود'],
      ['ورود به اپ از هفته‌ای ۹ بار به ۲ بار رسید', '۶ هفته‌ی اخیر'],
      ['قسط وام آخرش ماه بعد تمام می‌شود', 'بعد از آن، دلیلی برای ماندن ندارد'],
      ['یک بار پاسپورت حقوق را برای بانک دیگری ساخت', '۱۰ روز پیش'],
    ],
    action: ['پیشنهاد سطح طلایی رفاه‌بازار + حقوق کارکرده', 'احتمال ماندن بعد از این پیشنهاد در مشتری‌های مشابه: ۶۱٪'],
  },
  {
    id: 'c2',
    name: 'زهرا کریمی · بازنشسته',
    risk: 64,
    clv: 31,
    signals: [
      ['مستمری دو ماه است نقد برداشت می‌شود', 'نشانه‌ی سختی کار با اپ'],
      ['۳ بار تلاش ناموفق برای پرداخت قبض', 'هفته‌ی گذشته'],
    ],
    action: ['تماس پشتیبان + روشن کردن «حالت ساده» و «دسترسی امانی» برای فرزند', 'احتمال ماندن: ۷۴٪'],
  },
  {
    id: 'c3',
    name: 'مهدی نوری · کارگر فصلی',
    risk: 41,
    clv: 12,
    signals: [['واریزهای نامنظم؛ ۲ ماه بدون واریز', 'فصلی بودن کار']],
    action: ['پیشنهاد «پس‌انداز فصل کار» برای ماه‌های بیکاری', 'احتمال ماندن: ۵۸٪'],
  },
]

export default function BankDashboard() {
  const { toast } = useApp()
  const [sel, setSel] = useState('c1')
  const [done, setDone] = useState({})
  const c = CUSTOMERS.find((x) => x.id === sel)
  return (
    <Screen title="نمای بانک · تحلیل مشتری">
      <Card className="dp-hero">
        <b>کدام مشتری ارزشمند است، و کدام دارد می‌رود؟</b>
        <p className="small">از روی داده‌ی حقوق و رفتار اپ، بانک قبل از رفتن مشتری خبردار می‌شود و یک پیشنهاد شخصی می‌دهد. (نمای کارشناس بانک؛ داده‌ها نمونه)</p>
      </Card>

      <div className="gb-stats">
        <div><b>{F(2.1)}م</b><span>مشتری حقوق‌بگیر</span></div>
        <div><b className="bd-bad">٪{F(14)}</b><span>در خطر رویگردانی</span></div>
        <div><b>{F(9.4)}</b><span>همت سپرده‌ی در خطر</span></div>
      </div>

      <Section title="ارزش طول عمر مشتری (CLV) به تفکیک گروه">
        <Card className="bd-seg">
          {SEGMENTS.map(([t, v, r, s]) => (
            <div key={t} className="bd-row">
              <span className="bd-name">{t}</span>
              <span className="bd-bar">
                <i style={{ width: `${(v / 1240000) * 100}%` }} />
              </span>
              <b>{toFa(Math.round(v / 1000))}هزار</b>
              <span className={`bd-risk ${s}`}>٪{toFa(r)}</span>
            </div>
          ))}
          <div className="muted small" style={{ marginTop: 8 }}>
            CLV = میانگین سود ماهانه × ماه‌های ماندگاری پیش‌بینی‌شده (تومان، سود خالص هر مشتری). ستون آخر: احتمال رویگردانی در ۹۰ روز.
          </div>
        </Card>
      </Section>

      <Section title="هشدار رویگردانی · این هفته">
        <div className="chips">
          {CUSTOMERS.map((x) => (
            <button key={x.id} className={`chip ${sel === x.id ? 'on' : ''}`} onClick={() => setSel(x.id)}>
              {x.name.split(' · ')[0]} · ٪{toFa(x.risk)}
            </button>
          ))}
        </div>
        <Card className="bd-cust">
          <div className="bd-head">
            <div className="grow">
              <b>{c.name}</b>
              <div className="muted small">ارزش طول عمر: {toFa(c.clv)} میلیون تومان</div>
            </div>
            <div className={`bd-gauge ${c.risk > 70 ? 'hi' : c.risk > 50 ? 'mid' : ''}`}>
              <b>٪{toFa(c.risk)}</b>
              <small>خطر رفتن</small>
            </div>
          </div>
          <div className="cn-log-h">چرا؟ سیگنال‌های رفتاری</div>
          {c.signals.map(([t, s]) => (
            <div key={t} className="bd-sig">
              <Icon name="alert" size={16} />
              <div>
                <b>{t}</b>
                <small>{s}</small>
              </div>
            </div>
          ))}
          <div className="bd-act">
            <div className="muted small">اقدام پیشنهادی</div>
            <b>{c.action[0]}</b>
            <small>{c.action[1]}</small>
          </div>
          <Btn
            className="block"
            disabled={done[c.id]}
            onClick={() => {
              setDone({ ...done, [c.id]: true })
              toast('پیشنهاد شخصی برای مشتری ارسال شد ✓')
            }}
          >
            {done[c.id] ? 'ارسال شد ✓' : 'ارسال پیشنهاد نگه‌داشت'}
          </Btn>
        </Card>
      </Section>
      <p className="muted small center">سیگنال‌ها فقط از داده‌های داخل بانک و با رعایت حریم خصوصی محاسبه می‌شوند.</p>
    </Screen>
  )
}
