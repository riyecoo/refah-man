import Icon from '../components/Icon'
import Art from '../components/Art'
import { Btn, Card, Empty, Screen, Section, useApp } from '../components/ui'
import { toFa } from '../utils/fa'

const status = (c) => (c.at >= c.steps.length - 1 ? 'done' : 'open')

// «پرونده‌های من»: همه‌ی درخواست‌ها با خط زمانی، مثل رهگیری مرسوله‌ی پستی
export function Cases() {
  const { cases, push } = useApp()
  const open = cases.filter((c) => status(c) === 'open')
  const done = cases.filter((c) => status(c) === 'done')
  return (
    <Screen title="پرونده‌های من">
      <Card className="cases-hero">
        <Art name="il-consent" size={68} />
        <div>
          <b>هر درخواست، یک پرونده‌ی قابل رهگیری</b>
          <span className="muted small">وام، گواهی، اعتراض، کارت و نوبت شعبه؛ همه این‌جا، مرحله‌به‌مرحله.</span>
        </div>
      </Card>
      <Section title={`در جریان (${toFa(open.length)})`}>
        {open.length ? open.map((c) => <CaseCard key={c.id} c={c} onClick={() => push('case', { id: c.id })} />) : <Empty title="پرونده‌ی بازی ندارید" />}
      </Section>
      {done.length > 0 && (
        <Section title="تمام‌شده">
          {done.map((c) => (
            <CaseCard key={c.id} c={c} onClick={() => push('case', { id: c.id })} />
          ))}
        </Section>
      )}
    </Screen>
  )
}

function CaseCard({ c, onClick }) {
  const pct = (c.at / (c.steps.length - 1)) * 100
  const st = status(c)
  return (
    <button className="card case-card" onClick={onClick}>
      <div className="cc-top">
        <span className={`cc-ic ${st}`}>
          <Icon name={c.icon} size={18} />
        </span>
        <span className="grow">
          <b>{c.title}</b>
          <span className="muted small">
            {toFa(c.id.replace('C-', 'شماره '))} · {c.created}
          </span>
        </span>
        <span className={`cc-st ${st}`}>{st === 'done' ? 'تمام شد' : c.steps[c.at][0]}</span>
      </div>
      <div className="cc-bar">
        <span style={{ width: `${pct}%` }} />
      </div>
    </button>
  )
}

export function CaseDetail({ id, fresh }) {
  const { cases, reset, toast } = useApp()
  const c = cases.find((x) => x.id === id)
  if (!c) return <Screen title="پرونده">پیدا نشد</Screen>
  const st = status(c)
  return (
    <Screen title="پرونده" onBack={fresh ? () => reset('home') : undefined}>
      {fresh && (
        <Card className="case-fresh">
          <Art name="st-success" size={84} pop />
          <b>درخواست شما ثبت شد</b>
          <span className="muted small">لازم نیست به شعبه بروید. هر مرحله که جلو برود، اعلان می‌گیرید.</span>
        </Card>
      )}
      <Card className="case-head">
        <span className="muted small">{toFa(c.id.replace('C-', 'پرونده‌ی شماره '))}</span>
        <b>{c.title}</b>
        {c.summary && <span className="muted small">{c.summary}</span>}
        <span className={`cc-st ${st}`}>{st === 'done' ? 'تمام شد' : 'در جریان'}</span>
      </Card>
      <Card className="track">
        {c.steps.map(([t, when, extra], i) => {
          const s = i < c.at ? 'past' : i === c.at ? (st === 'done' ? 'past' : 'now') : 'next'
          return (
            <div key={t} className={`tk ${s}`}>
              <span className="tk-dot">{s === 'past' ? <Icon name="check" size={13} stroke={3} /> : null}</span>
              <div className="tk-body">
                <b>{t}</b>
                {when && <span className="muted small">{when}</span>}
                {s === 'now' && <span className="tk-now">الان در این مرحله</span>}
                {extra && <span className="tk-extra">{extra}</span>}
              </div>
            </div>
          )
        })}
      </Card>
      <div className="two">
        <Btn kind="soft" onClick={() => toast('گفتگو با کارشناس همین پرونده')}>
          <Icon name="chat" size={18} /> پیام به کارشناس
        </Btn>
        <Btn kind="ghost" onClick={() => reset('home')}>
          بازگشت به خانه
        </Btn>
      </div>
    </Screen>
  )
}
