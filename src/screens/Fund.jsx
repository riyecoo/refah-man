import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'
import Art from '../components/Art'
import { Avatar, Btn, Card, Num, Row, Screen, Section, Sheet, Toggle, useApp } from '../components/ui'
import { fund as F } from '../data/mock'
import { money, short, toEn, toFa } from '../utils/fa'

// صندوق دوستانه: قرض‌الحسنه‌ی جمعی همکاران یا فامیل، با قرعه‌ی شفاف داخل اپ
export default function Fund() {
  const { toast } = useApp()
  const [members, setMembers] = useState(F.members)
  const [auto, setAuto] = useState(true)
  const [phase, setPhase] = useState('idle') // idle → rolling → done
  const [cursor, setCursor] = useState(null)
  const [winner, setWinner] = useState(null)
  const [create, setCreate] = useState(false)
  const timer = useRef(0)

  const pot = F.share * members.length
  const candidates = members.filter((m) => !m.got)
  const unpaid = members.filter((m) => !m.paid)

  useEffect(() => () => clearInterval(timer.current), [])

  const draw = () => {
    setPhase('rolling')
    let i = 0
    const pick = candidates[Math.floor(Math.random() * candidates.length)]
    timer.current = setInterval(() => {
      setCursor(candidates[i % candidates.length].id)
      i++
      if (i > 14 && candidates[(i - 1) % candidates.length].id === pick.id) {
        clearInterval(timer.current)
        setWinner(pick)
        setMembers((ms) => ms.map((m) => (m.id === pick.id ? { ...m, got: true, round: F.round } : m)))
        setPhase('done')
      }
    }, 140)
  }

  return (
    <Screen
      title="صندوق دوستانه"
      action={
        <button className="hdr-btn" onClick={() => setCreate(true)} aria-label="صندوق جدید">
          <Icon name="plus" size={22} />
        </button>
      }
    >
      <Card className="fund-hero">
        <div className="fund-top">
          <div>
            <span className="muted small">{F.name}</span>
            <b className="fund-pot">
              <Num>{money(pot)}</Num> <span>تومان</span>
            </b>
            <span className="muted small">
              وام بدون سود این ماه · {toFa(members.length)} عضو × {short(F.share)}
            </span>
          </div>
          <Art name="ic-family" size={72} />
        </div>
        <div className="fund-rounds">
          {members.map((m, i) => (
            <span key={m.id} className={i < F.round - 1 ? 'done' : i === F.round - 1 ? 'now' : ''} />
          ))}
        </div>
        <span className="muted small">
          نوبت {toFa(F.round)} از {toFa(members.length)} · قرعه‌ی این ماه: {toFa(F.day)} آذر
        </span>
      </Card>

      <Section title="اعضا">
        <Card className="list">
          {members.map((m) => (
            <Row
              key={m.id}
              lead={
                <span className={`fund-av ${cursor === m.id && phase === 'rolling' ? 'roll' : ''} ${winner?.id === m.id ? 'win' : ''}`}>
                  <Avatar c={{ id: m.av, name: m.name }} size={42} />
                </span>
              }
              title={m.name}
              sub={m.got ? `وام را در نوبت ${toFa(m.round)} گرفته` : 'هنوز نوبتش نرسیده'}
              end={
                m.paid ? (
                  <span className="ok-tag">سهم آذر ✓</span>
                ) : (
                  <button
                    className="link"
                    onClick={() => {
                      setMembers(members.map((x) => (x.id === m.id ? { ...x, paid: true } : x)))
                      toast(`یادآوری برای ${m.name} فرستاده شد`)
                    }}
                  >
                    یادآوری
                  </button>
                )
              }
            />
          ))}
        </Card>
      </Section>

      {phase === 'done' && winner ? (
        <Card className="fund-win fade-in">
          <Art name="st-success" size={96} pop />
          <b>وام این ماه به {winner.name} رسید</b>
          <span className="muted small">نتیجه همین لحظه برای همه‌ی اعضا پیامک شد. مبلغ بعد از پرداخت سهم همه، خودکار واریز می‌شود.</span>
        </Card>
      ) : (
        <Card className="fund-draw">
          <b>قرعه‌کشی شفاف</b>
          <span className="muted small">
            بین {toFa(candidates.length)} نفری که هنوز وام نگرفته‌اند. همه‌ی اعضا نتیجه را همزمان می‌بینند و قابل تغییر نیست.
          </span>
          {unpaid.length > 0 && <span className="tag-warn small">{toFa(unpaid.length)} نفر هنوز سهم این ماه را نداده</span>}
          <Btn disabled={phase === 'rolling' || !candidates.length} onClick={draw}>
            {phase === 'rolling' ? 'در حال قرعه‌کشی…' : 'قرعه‌کشی این ماه'}
          </Btn>
        </Card>
      )}

      <Card className="list">
        <Row icon="refresh" title="پرداخت خودکار سهم من" sub={`هر ماه ${toFa(F.day)}ام از حساب جاری`} end={<Toggle on={auto} onChange={setAuto} label="پرداخت خودکار سهم" />} />
        <Row icon="text" title="قوانین صندوق" sub="سهم ماهانه، ترتیب نوبت‌ها، جریمه‌ی دیرکرد: ندارد" onClick={() => toast('قوانینی که همه‌ی اعضا امضا کرده‌اند')} chevron />
        <Row icon="link" title="دعوت عضو جدید" sub="با لینک؛ عضو جدید از دوره‌ی بعد شریک می‌شود" onClick={() => toast('لینک دعوت کپی شد')} chevron />
      </Card>

      <NewFund open={create} onClose={() => setCreate(false)} />
    </Screen>
  )
}

function NewFund({ open, onClose }) {
  const { toast } = useApp()
  const [name, setName] = useState('')
  const [share, setShare] = useState(2_000_000)
  const [n, setN] = useState('10')
  const total = share * (+n || 0)
  return (
    <Sheet open={open} onClose={onClose} title="ساخت صندوق دوستانه">
      <label className="field">
        <span>اسم صندوق</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً صندوق فامیل" />
      </label>
      <div className="chips center-chips">
        {[1_000_000, 2_000_000, 5_000_000].map((v) => (
          <button key={v} className={`chip ${share === v ? 'on' : ''}`} onClick={() => setShare(v)}>
            سهم ماهانه {short(v)}
          </button>
        ))}
      </div>
      <label className="field">
        <span>تعداد اعضا</span>
        <input inputMode="numeric" value={toFa(n)} onChange={(e) => setN(toEn(e.target.value).replace(/\D/g, '').slice(0, 2))} />
      </label>
      <p className="muted small center">
        هر ماه {money(total)} تومان وام بدون سود به یک نفر می‌رسد؛ دوره {toFa(+n || 0)} ماه طول می‌کشد.
      </p>
      <Btn
        disabled={!name || !+n}
        onClick={() => {
          onClose()
          toast('صندوق ساخته شد؛ لینک دعوت برای اعضا آماده است')
        }}
      >
        ساختن و دعوت اعضا
      </Btn>
    </Sheet>
  )
}
