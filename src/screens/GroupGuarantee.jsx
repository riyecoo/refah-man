import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { Avatar, Btn, Card, Screen, Section, useApp } from '../components/ui'
import { toFa } from '../utils/fa'

const PEOPLE = [
  { id: 'karimi', name: 'محمود کریمی', role: 'همکار · واحد تولید' },
  { id: 'reza', name: 'رضا محمدی', role: 'همکار · انبار' },
  { id: 'maryam', name: 'مریم حمیدی', role: 'همکار · اداری' },
  { id: 'dad', name: 'حسین حمیدی', role: 'همکار · نگهبانی' },
  { id: 'mom', name: 'فاطمه احمدی', role: 'همکار · حسابداری' },
  { id: 'x6', name: 'علی رضایی', role: 'همکار · تعمیرات' },
]
const M = (v) => toFa(String(Math.round(v / 1e6)))

// ضمانت جمعی: به‌جای یک ضامن با حقوق بالا، چند همکار هر کدام سهم کوچکی را ضمانت می‌کنند
export default function GroupGuarantee() {
  const { addCase, reset, toast } = useApp()
  const [amt, setAmt] = useState(200000000)
  const [picked, setPicked] = useState(['karimi', 'reza', 'maryam', 'dad', 'mom'])
  const [sent, setSent] = useState(false)
  const [signed, setSigned] = useState([])
  const share = picked.length ? Math.round(100 / picked.length) : 0

  useEffect(() => {
    if (!sent || signed.length >= picked.length) return
    const t = setTimeout(() => {
      const next = picked[signed.length]
      setSigned((s) => [...s, next])
      toast(`${PEOPLE.find((p) => p.id === next).name} ضمانت را امضا کرد ✓`)
    }, 1300)
    return () => clearTimeout(t)
  }, [sent, signed, picked])

  const done = sent && signed.length === picked.length
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  return (
    <Screen title="ضمانت جمعی همکاران">
      <Card className="ip-hero">
        <b>یک ضامن پیدا نمی‌کنید؟ پنج همکار کافی است</b>
        <p className="muted small">
          هر همکار فقط سهم کوچکی از وام را ضمانت می‌کند، با یک لمس در گوشی خودش. بانک از روی حقوق هر نفر (با رضایت خودش) اعتبار را می‌سنجد. هیچ‌کس کل ریسک را گردن نمی‌گیرد.
        </p>
      </Card>

      <Section title="مبلغ وام">
        <Card>
          <div className="ewa-amt">
            {M(amt)} <span className="muted">میلیون تومان</span>
          </div>
          <input type="range" className="ewa-range" disabled={sent} min={50000000} max={500000000} step={10000000} value={amt} onChange={(e) => setAmt(+e.target.value)} />
        </Card>
      </Section>

      <Section title={`ضامن‌ها (${toFa(picked.length)} نفر · هر نفر ${toFa(share)}٪ = ${M((amt * share) / 100)} میلیون)`}>
        <Card className="list">
          {PEOPLE.map((p) => {
            const isOn = picked.includes(p.id)
            const ok = signed.includes(p.id)
            return (
              <label key={p.id} className="cn-chk gg-row">
                {!sent && <input type="checkbox" checked={isOn} onChange={() => toggle(p.id)} />}
                <Avatar c={p} size={38} />
                <div className="grow">
                  <b>{p.name}</b>
                  <div className="muted small">{p.role}</div>
                </div>
                {sent && isOn && <span className={`gg-st ${ok ? 'ok' : ''}`}>{ok ? 'امضا شد ✓' : 'در انتظار…'}</span>}
              </label>
            )
          })}
        </Card>
      </Section>

      {!sent ? (
        <Btn className="block" disabled={picked.length < 2} onClick={() => setSent(true)}>
          ارسال درخواست ضمانت به {toFa(picked.length)} همکار
        </Btn>
      ) : done ? (
        <Btn
          className="block"
          onClick={() => {
            const id = addCase({
              kind: 'loan',
              icon: 'users',
              title: 'وام با ضمانت جمعی',
              summary: `${M(amt)} میلیون · ${toFa(picked.length)} ضامن`,
              steps: [
                ['همه‌ی ضامن‌ها امضا کردند', 'امروز'],
                ['اعتبارسنجی از روی حقوق ضامن‌ها', 'خودکار'],
                ['واریز وام', 'پس از تأیید'],
              ],
            })
            reset('case', { id, fresh: true })
          }}
        >
          ثبت درخواست وام
        </Btn>
      ) : (
        <div className="muted small center">
          <Icon name="clock" size={14} /> لینک امضا برای همکاران فرستاده شد؛ هر کدام در گوشی خودش تأیید می‌کند…
        </div>
      )}
    </Screen>
  )
}
