import { useState } from 'react'
import Icon from '../components/Icon'
import { Avatar, Btn, Card, OtpField, Row, Screen, Section, Sheet, useApp } from '../components/ui'
import { toFa } from '../utils/fa'

const PERMS = {
  bills: ['پرداخت قبض', 'قبض‌های آب، برق، گاز و تلفن'],
  alerts: ['دیدن هشدارها', 'تراکنش مشکوک یا موجودی کم را به او هم خبر بده'],
  topup: ['خرید شارژ', 'فقط برای شماره‌های خانواده'],
  transfer: ['انتقال وجه', 'فقط به مخاطبین قبلی، تا سقف ماهانه'],
}
const seed = [
  {
    id: 'd1',
    c: { id: 'reza', name: 'رضا' },
    who: 'رضا حمیدی · پسرم',
    perms: ['bills', 'alerts', 'topup'],
    cap: 2000000,
    until: '۳۰ اسفند ۱۴۰۵',
    log: [['امروز ۱۰:۲۲', 'قبض برق · ۳۸۶ هزار تومان'], ['۲۸ آبان', 'شارژ همراه · ۱۰۰ هزار تومان']],
  },
]

// دسترسی امانی: به‌جای دادن رمز کارت به فرزند، یک دسترسی محدود و قابل‌لغو
export default function Delegation() {
  const { toast } = useApp()
  const [list, setList] = useState(seed)
  const [sel, setSel] = useState(null)
  const [adding, setAdding] = useState(false)
  const d = list.find((x) => x.id === sel)

  if (adding) return <AddDelegate onDone={(x) => { setList([x, ...list]); setAdding(false); toast('دسترسی امانی فعال شد ✓') }} onBack={() => setAdding(false)} />

  return (
    <Screen title="دسترسی امانی">
      <Card className="cn-hero">
        <div className="cn-hero-ic">
          <Icon name="users" size={24} />
        </div>
        <div>
          <b>رمز کارتتان را به کسی ندهید</b>
          <p className="muted small">
            اگر فرزندتان کارهای بانکی شما را انجام می‌دهد، به‌جای رمز، یک دسترسی محدود به او بدهید: فقط همان کارها، با سقف مشخص، و هر وقت خواستید قطعش کنید.
          </p>
        </div>
      </Card>

      <Section title={`افراد امین (${toFa(list.length)})`}>
        <Card className="list">
          {list.map((x) => (
            <Row
              key={x.id}
              lead={<Avatar c={x.c} size={42} />}
              title={x.who}
              sub={`${x.perms.map((p) => PERMS[p][0]).join('، ')} · سقف ${toFa(x.cap / 1e6)} میلیون`}
              onClick={() => setSel(x.id)}
              chevron
            />
          ))}
          {!list.length && <div className="muted small pad">هنوز به کسی دسترسی نداده‌اید.</div>}
        </Card>
      </Section>
      <Btn kind="soft" className="block" onClick={() => setAdding(true)}>
        <Icon name="plus" size={18} /> افزودن فرد امین
      </Btn>

      <Sheet open={!!d} onClose={() => setSel(null)} title={d?.who}>
        {d && (
          <>
            <div className="muted small">سقف ماهانه {toFa(d.cap / 1e6)} میلیون · تا {d.until}</div>
            <div className="cn-scopes">
              {d.perms.map((p) => (
                <div key={p} className="cn-scope">
                  <Icon name="check" size={16} />
                  <div>
                    <b>{PERMS[p][0]}</b>
                    <div className="muted small">{PERMS[p][1]}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cn-log-h">کارهایی که انجام داده</div>
            {d.log.map(([t, w], i) => (
              <div key={i} className="cn-log">
                <span>{t}</span>
                <span>{w}</span>
              </div>
            ))}
            <Btn
              kind="danger"
              className="block"
              onClick={() => {
                setList(list.filter((x) => x.id !== d.id))
                setSel(null)
                toast('دسترسی لغو شد')
              }}
            >
              لغو دسترسی
            </Btn>
          </>
        )}
      </Sheet>
    </Screen>
  )
}

function AddDelegate({ onDone, onBack }) {
  const [name, setName] = useState('مریم حمیدی · دخترم')
  const [on, setOn] = useState({ bills: true, alerts: true, topup: false, transfer: false })
  const [cap, setCap] = useState(2)
  const [otp, setOtp] = useState('')
  const perms = Object.keys(on).filter((k) => on[k])
  return (
    <Screen title="فرد امین تازه" onBack={onBack}>
      <Section title="به چه کسی؟">
        <Card>
          <input className="rg-in" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="muted small" style={{ marginTop: 6 }}>یک لینک تأیید به شماره‌ی همراه او فرستاده می‌شود.</div>
        </Card>
      </Section>
      <Section title="چه کارهایی بتواند بکند؟">
        <Card className="list">
          {Object.entries(PERMS).map(([k, [t, s]]) => (
            <label key={k} className="cn-chk">
              <input type="checkbox" checked={on[k]} onChange={(e) => setOn({ ...on, [k]: e.target.checked })} />
              <div>
                <b>{t}</b>
                <div className="muted small">{s}</div>
              </div>
            </label>
          ))}
        </Card>
      </Section>
      <Section title="سقف ماهانه">
        <div className="chips">
          {[1, 2, 5].map((m) => (
            <button key={m} className={`chip ${cap === m ? 'on' : ''}`} onClick={() => setCap(m)}>
              {toFa(m)} میلیون
            </button>
          ))}
        </div>
      </Section>
      <Card className="cn-never">
        <Icon name="eyeOff" size={18} />
        <span>هرگز: دیدن رمز، تغییر رمز، بستن حساب، وام گرفتن، یا انتقال به مقصد جدید.</span>
      </Card>
      <Section title="تأیید با رمز دوم پویا">
        <OtpField value={otp} onChange={setOtp} />
      </Section>
      <Btn
        className="block"
        disabled={otp !== '1111' || !perms.length || !name}
        onClick={() =>
          onDone({ id: `d${Date.now()}`, c: { id: 'maryam', name }, who: name, perms, cap: cap * 1e6, until: '۶ ماه دیگر', log: [['همین الان', 'دسترسی فعال شد']] })
        }
      >
        فعال کردن دسترسی
      </Btn>
    </Screen>
  )
}
