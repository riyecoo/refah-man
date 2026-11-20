import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, OtpField, Screen, useApp } from '../components/ui'
import { accounts, branches, branchServices } from '../data/mock'
import { money } from '../utils/fa'

// بستن حساب یا انتقال حساب به شعبه‌ی دیگر، آنلاین
export function CloseAccount() {
  const { addCase, reset } = useApp()
  const [mode, setMode] = useState('close')
  const [aid, setAid] = useState('qh')
  const [why, setWhy] = useState(null)
  const [br, setBr] = useState('b2')
  const [otp, setOtp] = useState('')
  const a = accounts.find((x) => x.id === aid)
  const others = accounts.filter((x) => !x.main)

  const submit = () => {
    const id =
      mode === 'close'
        ? addCase({
            kind: 'close',
            icon: 'lock',
            title: `بستن ${a.title}`,
            summary: `مانده‌ی ${money(a.balance)} تومان به حساب جاری منتقل می‌شود`,
            steps: [
              ['درخواست ثبت شد', 'امروز'],
              ['سود تا امروز حساب و مانده به حساب جاری منتقل شد', ''],
              ['حساب بسته شد', ''],
            ],
          })
        : addCase({
            kind: 'move',
            icon: 'bank',
            title: `انتقال ${a.title} به شعبه‌ی دیگر`,
            summary: branches.find((b) => b.id === br).t,
            steps: [
              ['درخواست ثبت شد', 'امروز'],
              ['تأیید شعبه‌ی مقصد', ''],
              ['حساب منتقل شد؛ شماره حساب و شبا عوض نمی‌شود', ''],
            ],
          })
    reset('case', { id, fresh: true })
  }

  return (
    <Screen title="بستن یا انتقال حساب">
      <div className="seg">
        <button className={mode === 'close' ? 'on' : ''} onClick={() => setMode('close')}>
          بستن حساب
        </button>
        <button className={mode === 'move' ? 'on' : ''} onClick={() => setMode('move')}>
          انتقال به شعبه‌ی دیگر
        </button>
      </div>
      <div className="methods">
        {others.map((x) => (
          <button key={x.id} className={`method ${aid === x.id ? 'on' : ''}`} onClick={() => setAid(x.id)}>
            <span className="m-radio" />
            <span className="m-body">
              <b>{x.title}</b>
              <span className="m-line">
                <span className="ltr-num">{x.no}</span> · موجودی {money(x.balance)} تومان
              </span>
            </span>
          </button>
        ))}
      </div>
      {mode === 'close' ? (
        <>
          <Card className="list kv">
            <div className="kv-row">
              <span className="muted">مانده منتقل می‌شود به</span>
              <span className="kv-v">حساب جاری</span>
            </div>
            {a.rate && (
              <div className="kv-row">
                <span className="muted">سود</span>
                <span className="kv-v">تا امروز حساب و پرداخت می‌شود</span>
              </div>
            )}
          </Card>
          <div className="chips">
            {['دیگر لازم ندارم', 'حساب در بانک دیگری دارم', 'کارمزدها زیاد است', 'سایر'].map((r) => (
              <button key={r} className={`chip ${why === r ? 'on' : ''}`} onClick={() => setWhy(r)}>
                {r}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="methods">
          {branches.map((b) => (
            <button key={b.id} className={`method ${br === b.id ? 'on' : ''}`} onClick={() => setBr(b.id)}>
              <span className="m-radio" />
              <span className="m-body">
                <b>{b.t}</b>
                <span className="m-line">{b.d} از شما</span>
              </span>
            </button>
          ))}
        </div>
      )}
      <label className="field">
        <span>تأیید با رمز پویا</span>
        <OtpField value={otp} onChange={setOtp} />
      </label>
      <Btn kind={mode === 'close' ? 'danger' : 'primary'} disabled={(mode === 'close' && !why) || otp.length < 4} onClick={submit}>
        {mode === 'close' ? `بستن ${a.title}` : 'ثبت انتقال حساب'}
      </Btn>
    </Screen>
  )
}

const DAYS = ['شنبه ۵ آذر', 'یکشنبه ۶ آذر', 'دوشنبه ۷ آذر', 'سه‌شنبه ۸ آذر']
const SLOTS = ['۸:۰۰', '۸:۳۰', '۹:۰۰', '۹:۳۰', '۱۰:۰۰', '۱۰:۳۰', '۱۱:۰۰', '۱۱:۳۰', '۱۲:۰۰']
const FULL = new Set(['۸:۰۰', '۹:۳۰', '۱۱:۰۰'])

// برای چند کاری که هنوز حضوری است: نوبت دقیق، فهرست مدارک، فرم از قبل پرشده
export function Appointment() {
  const { addCase, reset } = useApp()
  const [sid, setSid] = useState('s1')
  const [br, setBr] = useState('b1')
  const [day, setDay] = useState(0)
  const [slot, setSlot] = useState(null)
  const s = branchServices.find((x) => x.id === sid)
  const b = branches.find((x) => x.id === br)

  const submit = () => {
    const id = addCase({
      kind: 'appt',
      icon: 'cal',
      title: `نوبت شعبه: ${s.t}`,
      summary: `${b.t} · ${DAYS[day]} · ساعت ${slot}`,
      steps: [
        ['نوبت ثبت شد و فرم از قبل پر شد', 'امروز'],
        ['یادآوری یک روز قبل', DAYS[Math.max(0, day - 1)]],
        ['حضور در شعبه، بدون صف', `${DAYS[day]} · ${slot}`],
      ],
    })
    reset('case', { id, fresh: true })
  }

  return (
    <Screen title="نوبت شعبه">
      <p className="muted small">بیشتر کارها دیگر شعبه نمی‌خواهند. برای این چند مورد که هنوز حضوری است، بدون صف و با مدارک کامل بروید.</p>
      <div className="methods">
        {branchServices.map((x) => (
          <button key={x.id} className={`method ${sid === x.id ? 'on' : ''}`} onClick={() => setSid(x.id)}>
            <span className="m-radio" />
            <span className="m-body">
              <b>{x.t}</b>
            </span>
          </button>
        ))}
      </div>
      <Card className="docs">
        <b>
          <Icon name="doc" size={16} /> این‌ها را همراه داشته باشید
        </b>
        {s.docs.map((d) => (
          <span key={d}>• {d}</span>
        ))}
      </Card>
      <div className="chips">
        {branches.map((x) => (
          <button key={x.id} className={`chip ${br === x.id ? 'on' : ''}`} onClick={() => setBr(x.id)}>
            {x.t.replace('شعبه‌ی ', '')} · {x.d}
          </button>
        ))}
      </div>
      <div className="chips">
        {DAYS.map((d, i) => (
          <button key={d} className={`chip ${day === i ? 'on' : ''}`} onClick={() => setDay(i)}>
            {d}
          </button>
        ))}
      </div>
      <div className="slots">
        {SLOTS.map((t) => (
          <button key={t} className={`slot ${slot === t ? 'on' : ''}`} disabled={FULL.has(t)} onClick={() => setSlot(t)}>
            {t}
            {FULL.has(t) && <small>پر</small>}
          </button>
        ))}
      </div>
      <Btn disabled={!slot} onClick={submit}>
        ثبت نوبت {slot ? `· ساعت ${slot}` : ''}
      </Btn>
      <p className="muted small center">فرم درخواست از قبل با اطلاعات شما پر شده؛ در شعبه فقط امضا می‌کنید.</p>
    </Screen>
  )
}
