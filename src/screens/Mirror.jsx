import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, Screen, Section, useApp } from '../components/ui'
import { user } from '../data/mock'
import { toFa } from '../utils/fa'

// «آینه‌ی مالی من»: بعد از چند ماه استفاده، کاربر می‌بیند چه جور آدمی با پولش است و چطور عوض شده
// مقایسه فقط با گذشته‌ی خود کاربر، نه با دیگران. چالش ۳ اینوکاپ. داده‌ها نمونه است.
const MONTHS = [
  { m: 'خرداد', spend: 21.4, save: 0.9, persona: 'ولخرج آخر هفته', score: 12.5 },
  { m: 'تیر', spend: 20.8, save: 1.1, persona: 'ولخرج آخر هفته', score: 13 },
  { m: 'مرداد', spend: 22.6, save: 0.6, persona: 'خرید احساسی', score: 11.75 },
  { m: 'شهریور', spend: 19.9, save: 1.4, persona: 'در حال تغییر', score: 13.5 },
  { m: 'مهر', spend: 19.1, save: 1.6, persona: 'برنامه‌ریز تازه‌کار', score: 14.75 },
  { m: 'آبان', spend: 18.8, save: 1.9, persona: 'صرفه‌جوی منظم', score: 16.5 },
]
const HABITS = [
  ['cal', '۴۱٪ خرج رستوران‌ت پنجشنبه و جمعه است', 'آخر هفته‌ها نقطه‌ی ضعف همیشگی توست', 'warn'],
  ['bolt', 'سه روز بعد از حقوق، پرخرج‌ترین روزهای ماه توست', 'میانگین ۳٫۲ میلیون در همین سه روز', 'warn'],
  ['moon', 'خریدهای نصفه‌شب‌ت نصف شد', 'از ۶ خرید در خرداد به ۳ خرید در آبان', 'good'],
  ['check', 'شش ماه است هیچ قسطی دیر نشده', 'منظم‌ترین عادت مالی تو', 'good'],
]
const F = (v) => toFa(String(v)).replace('.', '٫')

export default function Mirror() {
  const { push, toast } = useApp()
  const [view, setView] = useState('spend')
  const first = MONTHS[0]
  const last = MONTHS[MONTHS.length - 1]
  const spendChange = Math.round(((last.spend - first.spend) / first.spend) * 100)
  const saveX = (last.save / first.save).toFixed(1)
  const max = Math.max(...MONTHS.map((x) => (view === 'spend' ? x.spend : x.save)))
  return (
    <Screen
      title="آینه‌ی مالی من"
      action={
        <button className="hdr-btn" onClick={() => toast('تصویر آینه برای اشتراک ساخته شد؛ مبلغ‌ها در آن نیست')} aria-label="اشتراک">
          <Icon name="share" size={20} />
        </button>
      }
    >
      <Card className="mr-hero">
        <span className="muted small">شش ماه با رفاه · خرداد تا آبان ۱۴۰۵</span>
        <b className="mr-headline">
          {user.first}، خرجت {F(Math.abs(spendChange))}٪ کم شد و پس‌اندازت {F(saveX)} برابر شد.
        </b>
        <div className="mr-journey">
          <div>
            <small>خرداد</small>
            <span className="mr-p old">{first.persona}</span>
          </div>
          <Icon name="arrow" size={22} />
          <div>
            <small>آبان</small>
            <span className="mr-p now">{last.persona}</span>
          </div>
        </div>
      </Card>

      <Section title="روند شش ماه">
        <div className="chips">
          <button className={`chip ${view === 'spend' ? 'on' : ''}`} onClick={() => setView('spend')}>خرج ماهانه</button>
          <button className={`chip ${view === 'save' ? 'on' : ''}`} onClick={() => setView('save')}>پس‌انداز ماهانه</button>
        </div>
        <Card className="mr-chart">
          <div className="mr-bars">
            {MONTHS.map((x, i) => {
              const v = view === 'spend' ? x.spend : x.save
              return (
                <div key={x.m} className={`mr-col ${i === MONTHS.length - 1 ? 'now' : ''}`}>
                  <span className="mr-val">{F(v)}</span>
                  <span className={`mr-bar ${view}`} style={{ height: `${(v / max) * 100}%` }} />
                  <small>{x.m}</small>
                </div>
              )
            })}
          </div>
          <div className="muted small center">میلیون تومان · {view === 'spend' ? 'کوتاه‌تر یعنی بهتر' : 'بلندتر یعنی بهتر'}</div>
        </Card>
      </Section>

      <Section title="نمره‌ی کارنامه، ماه به ماه">
        <Card className="mr-scores">
          {MONTHS.map((x) => (
            <div key={x.m}>
              <b className={x.score >= 15 ? 'good' : x.score >= 13 ? 'mid' : 'low'}>{F(x.score)}</b>
              <small>{x.m}</small>
            </div>
          ))}
        </Card>
      </Section>

      <Section title="عادت‌های تو، با عدد واقعی">
        <Card className="list">
          {HABITS.map(([ic, t, s, tone]) => (
            <div key={t} className="row">
              <span className={`row-ic mr-h ${tone}`}><Icon name={ic} size={18} /></span>
              <span className="row-txt">
                <span className="row-title">{t}</span>
                <span className="row-sub">{s}</span>
              </span>
            </div>
          ))}
        </Card>
      </Section>

      <div className="mr-two">
        <Card className="mr-strong">
          <Icon name="star" size={18} />
          <b>نقطه‌ی قوت</b>
          <span>نظم در قسط‌ها و قبض‌ها؛ شش ماه بدون حتی یک روز دیرکرد.</span>
        </Card>
        <Card className="mr-grow">
          <Icon name="trend" size={18} />
          <b>جای رشد</b>
          <span>سه روز بعد از حقوق. اگر آن را آرام کنی، ماهی ۱ میلیون بیشتر می‌ماند.</span>
        </Card>
      </div>

      <Card className="advice">
        <b><Icon name="chat" size={16} /> نامه‌ی شش‌ماهه</b>
        <p>
          {user.first} جان، شش ماه پیش آخر هفته‌ها پول از دستت در می‌رفت و ماهی کمتر از یک میلیون پس‌انداز می‌کردی. حالا هر ماه نزدیک دو میلیون کنار می‌گذاری و نمره‌ات از ۱۲٫۵ به ۱۶٫۵ رسیده. این تغییر کوچک نیست. فقط یک قدم مانده: سه روز بعد از حقوق را آرام‌تر بگذران.
        </p>
        <span className="muted small">این تحلیل فقط از آمار جمع‌بندی‌شده‌ی حساب خودت ساخته شده و با هیچ‌کس مقایسه نمی‌شوی.</span>
      </Card>

      <div className="row2">
        <Btn kind="soft" onClick={() => push('reportCard')}><Icon name="star" size={18} /> کارنامه‌ی این ماه</Btn>
        <Btn kind="soft" onClick={() => push('life')}><Icon name="receipt" size={18} /> صورت‌حساب زندگی</Btn>
      </div>
    </Screen>
  )
}
