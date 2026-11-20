import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, OtpField, Screen, Section, useApp } from '../components/ui'
import { accounts } from '../data/mock'
import { money, toFa } from '../utils/fa'

// رفاه‌بازار: پیشنهاد گروهی فروشگاه‌ها فقط برای مشتریان رفاه
// چالش‌های ۱۱ (خرید اعتباری زیر ۱ دقیقه)، ۱۲ (خرید گروهی با تسهیلگری بانک) و ۱۴ (ماندگاری بیشتر پول، تخفیف بیشتر)
export const DEALS = [
  { id: 'bag', shop: 'چرم مشهد', title: 'کیف چرم طبیعی دست‌دوز', ic: 'bag', grad: ['#8a5a3c', '#c9925f'], price: 5000000, base: 3000000, cap: 1000, taken: 742, ends: '۲ روز و ۵ ساعت' },
  { id: 'fridge', shop: 'لوازم خانگی پارس', title: 'یخچال ساید بای ساید ۳۰ فوت', ic: 'box', grad: ['#3f5a7a', '#7fa3c9'], price: 98000000, base: 79000000, cap: 300, taken: 211, ends: '۵ روز' },
  { id: 'rice', shop: 'تعاونی کارگران', title: 'برنج ایرانی طارم · ۱۰ کیلو', ic: 'heart', grad: ['#5b7a3a', '#a3c46b'], price: 2400000, base: 1850000, cap: 5000, taken: 4120, ends: '۱۸ ساعت' },
]
const LOCK = 200000
// پلکان تخفیف از روی میانگین موجودی ۳ ماه اخیر در رفاه
const TIERS = [
  { min: 0, label: 'پایه', extra: 0 },
  { min: 20000000, label: 'نقره‌ای', extra: 5 },
  { min: 50000000, label: 'طلایی', extra: 10 },
]
const avgBalance = () => Math.round(accounts.reduce((s, a) => s + (a.id === 'kt' ? 0 : a.balance), 0) * 0.82)

export default function GroupBuy({ id }) {
  const [sel, setSel] = useState(id || null)
  const [merchant, setMerchant] = useState(false)
  const d = DEALS.find((x) => x.id === sel)
  if (merchant) return <MerchantView onBack={() => setMerchant(false)} />
  if (d) return <Deal d={d} onBack={() => setSel(null)} />
  return (
    <Screen title="رفاه‌بازار · خرید گروهی">
      <Card className="gb-hero">
        <b>پیشنهاد ویژه، فقط برای مشتریان رفاه</b>
        <p className="small">
          فروشگاه‌ها برای تعداد محدودی از مشتریان رفاه تخفیف گروهی می‌گذارند. با قفل ۲۰۰ هزار تومان جایت را رزرو کن؛ بعد نقد یا ۴ قسط بخر. هرچه پولت بیشتر در رفاه بماند، تخفیفت بیشتر است.
        </p>
      </Card>
      {DEALS.map((x) => (
        <DealCard key={x.id} d={x} onClick={() => setSel(x.id)} />
      ))}
      <Btn kind="ghost" className="block" onClick={() => setMerchant(true)}>
        <Icon name="chart" size={18} /> نمای فروشگاه: ساختن کمپین
      </Btn>
    </Screen>
  )
}

function Thumb({ d, big }) {
  return (
    <div className={`gb-thumb ${big ? 'big' : ''}`} style={{ background: `linear-gradient(135deg, ${d.grad[0]}, ${d.grad[1]})` }}>
      <Icon name={d.ic} size={big ? 64 : 34} stroke={1.4} />
    </div>
  )
}

function DealCard({ d, onClick }) {
  const pct = Math.round((1 - d.base / d.price) * 100)
  return (
    <button className="gb-card" onClick={onClick}>
      <Thumb d={d} />
      <div className="grow">
        <span className="muted small">{d.shop}</span>
        <b>{d.title}</b>
        <div className="gb-price">
          <s>{money(d.price)}</s> <b>{money(d.base)}</b> <span className="gb-off">٪{toFa(pct)}</span>
        </div>
        <div className="gb-cap">
          <span style={{ width: `${(d.taken / d.cap) * 100}%` }} />
        </div>
        <span className="muted small">
          {toFa(d.cap - d.taken)} جای خالی از {toFa(d.cap)} · {d.ends}
        </span>
      </div>
    </button>
  )
}

function Deal({ d, onBack }) {
  const { post, toast, reset, addCase } = useApp()
  const avg = avgBalance()
  const tier = [...TIERS].reverse().find((t) => avg >= t.min)
  const final = Math.round((d.base * (100 - tier.extra)) / 100 / 1000) * 1000
  const [step, setStep] = useState(0) // 0 جزئیات، 1 رزرو شد، 2 روش پرداخت، 3 تأیید اعتبار، 4 تمام
  const [pay, setPay] = useState('bnpl')
  const [otp, setOtp] = useState('')
  const [sec, setSec] = useState(0)
  const inst = Math.ceil(final / 4 / 1000) * 1000

  useEffect(() => {
    if (step !== 3) return
    if (sec >= 9) {
      setStep(4)
      return
    }
    const t = setTimeout(() => setSec((s) => s + 1), 280)
    return () => clearTimeout(t)
  }, [step, sec])

  const finish = () => {
    post({ title: 'آزادسازی مبلغ قفل‌شده‌ی رزرو', amount: LOCK, cat: 'income' })
    post({ title: `${d.shop} · ${pay === 'bnpl' ? 'قسط اول' : 'خرید'} ${d.title}`, amount: -(pay === 'bnpl' ? inst : final), cat: 'food' })
    addCase({
      kind: 'buy',
      icon: 'bag',
      title: `خرید گروهی: ${d.title}`,
      summary: pay === 'bnpl' ? `۴ قسط ${money(inst)} تومان · ${d.shop}` : `${money(final)} تومان · ${d.shop}`,
      steps: [
        ['پرداخت شد و به فروشگاه اطلاع داده شد', 'امروز'],
        ['ارسال کالا', '۲ تا ۳ روز کاری'],
        ...(pay === 'bnpl' ? [['قسط‌های بعدی، خودکار از حقوق', '۳ ماه']] : []),
      ],
    })
    setStep(5)
  }

  if (step === 5)
    return (
      <Screen title="خرید انجام شد" back={false} home>
        <div className="ewa-done">
          <img src="./assets/st-success.png" width="120" height="120" alt="" />
          <b>{d.title} مال شماست</b>
          <p className="muted small">
            {pay === 'bnpl' ? `قسط اول ${money(inst)} تومان پرداخت شد؛ ۳ قسط بعدی روز حقوق خودکار کم می‌شود.` : `${money(final)} تومان پرداخت شد.`} مبلغ قفل‌شده‌ی رزرو آزاد شد. کالا ۲ تا ۳ روز دیگر می‌رسد.
          </p>
        </div>
        <div className="row2">
          <Btn kind="soft" onClick={() => reset('cases')}>
            <Icon name="box" size={18} /> پیگیری سفارش
          </Btn>
          <Btn kind="soft" onClick={() => reset('groupBuy')}>
            <Icon name="bag" size={18} /> پیشنهادهای دیگر
          </Btn>
        </div>
        <Btn className="block" style={{ marginTop: 10 }} onClick={() => reset('home')}>بازگشت به خانه</Btn>
      </Screen>
    )

  return (
    <Screen title={d.shop} onBack={step === 0 ? onBack : () => setStep(step === 2 ? 1 : step === 3 ? 2 : 0)}>
      <Thumb d={d} big />
      <h2 className="gb-title">{d.title}</h2>
      <div className="gb-price big">
        <s>{money(d.price)}</s> <b>{money(d.base)}</b> <span className="muted small">تومان</span>
      </div>
      <div className="gb-cap">
        <span style={{ width: `${(d.taken / d.cap) * 100}%` }} />
      </div>
      <div className="muted small">
        {toFa(d.taken + (step >= 1 ? 1 : 0))} نفر از {toFa(d.cap)} رزرو کرده‌اند · پایان: {d.ends}
      </div>

      <Section title="تخفیف ماندگاری شما">
        <Card className="gb-tier">
          <div className="gb-tiers">
            {TIERS.map((t) => (
              <div key={t.label} className={t === tier ? 'on' : ''}>
                <b>{t.label}</b>
                <span>{t.extra ? `+${toFa(t.extra)}٪` : '—'}</span>
                <small>{t.min ? `میانگین ${toFa(t.min / 1e6)}م+` : 'همه'}</small>
              </div>
            ))}
          </div>
          <div className="muted small" style={{ marginTop: 8 }}>
            میانگین موجودی شما در ۳ ماه اخیر: <b>{toFa(Math.round(avg / 1e6))} میلیون</b> ← سطح <b>{tier.label}</b>
          </div>
          <div className="gb-final">
            قیمت نهایی برای شما: <b>{money(final)} تومان</b>
          </div>
        </Card>
      </Section>

      {step === 0 && (
        <>
          <Card className="ewa-why">
            <Icon name="lock" size={18} />
            <span>برای رزرو، {money(LOCK)} تومان در حسابتان <b>قفل</b> می‌شود (برداشت نمی‌شود). اگر نخریدید، آخر کمپین آزاد می‌شود.</span>
          </Card>
          <Btn
            className="block"
            onClick={() => {
              post({ title: `قفل رزرو · ${d.title}`, amount: -LOCK, cat: 'transfer' })
              toast(`جای شما رزرو شد ✓ ${money(LOCK)} تومان قفل شد`)
              setStep(1)
            }}
          >
            رزرو با قفل {money(LOCK)} تومان
          </Btn>
        </>
      )}

      {step === 1 && (
        <>
          <Card className="cn-never">
            <Icon name="check" size={18} />
            <span>رزرو شد. جای شما تا پایان کمپین محفوظ است.</span>
          </Card>
          <Btn className="block" onClick={() => setStep(2)}>
            همین الان بخر
          </Btn>
        </>
      )}

      {step === 2 && (
        <>
          <Section title="روش پرداخت">
            <Card className="list">
              <label className="cn-chk">
                <input type="radio" name="pay" checked={pay === 'bnpl'} onChange={() => setPay('bnpl')} />
                <div>
                  <b>۴ قسط بدون سود · {money(inst)} تومان</b>
                  <div className="muted small">قسط اول الان، بقیه روز حقوق؛ بدون چک و ضامن</div>
                </div>
              </label>
              <label className="cn-chk">
                <input type="radio" name="pay" checked={pay === 'cash'} onChange={() => setPay('cash')} />
                <div>
                  <b>نقد · {money(final)} تومان</b>
                  <div className="muted small">از حساب جاری</div>
                </div>
              </label>
            </Card>
          </Section>
          <Section title="تأیید با رمز دوم پویا">
            <OtpField value={otp} onChange={setOtp} />
          </Section>
          <Btn
            className="block"
            disabled={otp !== '1111'}
            onClick={() => {
              setSec(0)
              setStep(pay === 'bnpl' ? 3 : 4)
            }}
          >
            {pay === 'bnpl' ? 'اعتبارسنجی و خرید' : 'پرداخت'}
          </Btn>
        </>
      )}

      {step === 3 && (
        <Card className="gb-check">
          <div className="gb-timer">{toFa(sec)}<small>ثانیه</small></div>
          {[
            ['احراز هویت', 1],
            ['سابقه‌ی واریز حقوق (پاسپورت حقوق)', 3],
            ['نداشتن بدهی معوق', 5],
            ['سقف اعتبار خرید', 7],
          ].map(([t, at]) => (
            <div key={t} className={`gb-ck ${sec >= at ? 'ok' : ''}`}>
              <Icon name={sec >= at ? 'check' : 'clock'} size={16} /> {t}
            </div>
          ))}
          <div className="muted small center">اعتبارسنجی آنی از روی داده‌ی حقوق؛ زیر ۱ دقیقه</div>
        </Card>
      )}

      {step === 4 && (
        <>
          <Card className="cn-never">
            <Icon name="check" size={18} />
            <span>{pay === 'bnpl' ? `اعتبار شما در ${toFa(Math.max(sec, 1))} ثانیه تأیید شد.` : 'آماده‌ی پرداخت.'}</span>
          </Card>
          <Btn className="block" onClick={finish}>
            {pay === 'bnpl' ? `پرداخت قسط اول ${money(inst)} تومان` : `پرداخت ${money(final)} تومان`}
          </Btn>
        </>
      )}
    </Screen>
  )
}

// نمای فروشگاه: ساختن کمپین گروهی روی پلتفرم بانک
function MerchantView({ onBack }) {
  const { toast } = useApp()
  const [price, setPrice] = useState(5000000)
  const [deal, setDeal] = useState(3000000)
  const [cap, setCap] = useState(1000)
  const d = DEALS[0]
  return (
    <Screen title="پنل فروشگاه" onBack={onBack}>
      <Card className="dp-hero">
        <b>چرم مشهد · کمپین فعال</b>
        <p className="small">فروشگاه روی «رفاه‌بازار» کمپین می‌سازد و فقط مشتریان بانک رفاه آن را می‌بینند.</p>
      </Card>
      <div className="gb-stats">
        <div><b>{toFa(d.taken)}</b><span>رزرو</span></div>
        <div><b>٪{toFa(68)}</b><span>تبدیل به خرید</span></div>
        <div><b>٪{toFa(57)}</b><span>خرید قسطی</span></div>
      </div>
      <Section title="کمپین تازه">
        <Card className="gb-form">
          <label>قیمت اصلی<input className="rg-in" value={money(price)} onChange={(e) => setPrice(+e.target.value.replace(/\D/g, '') || 0)} /></label>
          <label>قیمت برای مشتریان رفاه<input className="rg-in" value={money(deal)} onChange={(e) => setDeal(+e.target.value.replace(/\D/g, '') || 0)} /></label>
          <label>ظرفیت (نفر)
            <div className="chips">
              {[100, 500, 1000].map((c) => (
                <button key={c} className={`chip ${cap === c ? 'on' : ''}`} onClick={() => setCap(c)}>{toFa(c)}</button>
              ))}
            </div>
          </label>
          <div className="muted small">مبلغ قفل رزرو: {money(LOCK)} تومان · قسطی ۴ ماهه با تضمین بانک · تخفیف ماندگاری را بانک می‌پردازد</div>
        </Card>
      </Section>
      <Btn className="block" onClick={() => toast('کمپین ساخته شد و برای مشتریان رفاه نمایش داده می‌شود')}>
        انتشار کمپین
      </Btn>
    </Screen>
  )
}
