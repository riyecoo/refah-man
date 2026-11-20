import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, Num, Row, Screen, Section, Toggle, useApp } from '../components/ui'
import { accounts, events as allEvents, MONTH, MONTH_DAYS, MONTH_START_COL, PAYDAY, TODAY } from '../data/mock'
import { money, short, toFa } from '../utils/fa'

const left = () => {
  const out = allEvents.filter((e) => e.day >= TODAY).reduce((s, e) => s + e.amount, 0)
  return accounts[0].balance - out
}

// نوار «روزشمار تا حقوق» روی خانه
export function Countdown() {
  const { push } = useApp()
  const upcoming = allEvents.filter((e) => e.day >= TODAY)
  return (
    <section className="sec">
      <div className="sec-head">
        <h2>روزشمار تا حقوق</h2>
        <button className="link" onClick={() => push('calendar')}>
          تقویم ماه
        </button>
      </div>
      <div className="card countdown">
        <p className="cd-say">
          <b>{toFa(PAYDAY.daysLeft)} روز</b> تا حقوق بعدی؛ بعد از اجاره، اقساط و قبض‌ها حدود{' '}
          <b>
            <Num>{short(left())}</Num>
          </b>{' '}
          تومان می‌ماند.
        </p>
        <div className="cd-track">
          <button className="cd-node today" onClick={() => push('calendar', { day: TODAY })}>
            <span className="cd-dot" />
            <span className="cd-day">امروز</span>
          </button>
          {upcoming.map((e) => (
            <button key={e.id} className={`cd-node k-${e.kind}`} onClick={() => push('calendar', { day: e.day })}>
              <span className="cd-dot">
                <Icon name={e.icon} size={14} />
              </span>
              <span className="cd-day">{toFa(e.day)} {MONTH}</span>
              <span className="cd-t">{e.title.replace('‌ی آقای کریمی', '')}</span>
              <span className="cd-a">
                <Num>−{short(e.amount)}</Num>
              </span>
            </button>
          ))}
          <button className="cd-node payday" onClick={() => push('calendar')}>
            <span className="cd-dot">
              <Icon name="download" size={14} />
            </span>
            <span className="cd-day">{PAYDAY.label}</span>
            <span className="cd-t">واریز حقوق</span>
            <span className="cd-a pos">
              <Num>+{short(PAYDAY.amount)}</Num>
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default function Calendar({ day: day0 }) {
  const { push, toast } = useApp()
  const [day, setDay] = useState(day0 || TODAY)
  const [ev, setEv] = useState(allEvents)
  const byDay = (d) => ev.filter((e) => e.day === d)
  const cells = [...Array(MONTH_START_COL).fill(null), ...Array.from({ length: MONTH_DAYS }, (_, i) => i + 1)]
  const sel = byDay(day)
  const flip = (id, v) => {
    setEv(ev.map((e) => (e.id === id ? { ...e, repeat: v } : e)))
    toast(v ? 'از این به بعد هر ماه تکرار می‌شود' : 'تکرار ماهانه خاموش شد')
  }

  return (
    <Screen title={`تقویم پول · ${MONTH}`}>
      <Card className="cal-sum">
        <div>
          <span className="muted small">تا حقوق بعدی ({PAYDAY.label})</span>
          <b className="total-num">{toFa(PAYDAY.daysLeft)} روز</b>
        </div>
        <div>
          <span className="muted small">پیش‌بینی مانده</span>
          <b className="total-num">
            <Num>{short(left())}</Num>
          </b>
        </div>
      </Card>

      <Card className="cal">
        <div className="cal-week">
          {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="cal-grid">
          {cells.map((d, i) =>
            d === null ? (
              <span key={`x${i}`} />
            ) : (
              <button key={d} className={`cal-d ${d === day ? 'sel' : ''} ${d === TODAY ? 'today' : ''} ${d < TODAY ? 'past' : ''}`} onClick={() => setDay(d)}>
                {toFa(d)}
                {byDay(d).length > 0 && (
                  <span className="cal-dots">
                    {byDay(d).map((e) => (
                      <i key={e.id} className={`k-${e.kind}`} />
                    ))}
                  </span>
                )}
              </button>
            ),
          )}
        </div>
      </Card>

      <Section title={`${toFa(day)} ${MONTH}${day === TODAY ? ' (امروز)' : ''}`}>
        {sel.length ? (
          <div className="cal-items">
            {sel.map((e) => (
              <Card key={e.id} className="cal-item">
                <div className="ci-top">
                  <span className={`ci-ic k-${e.kind}`}>
                    <Icon name={e.icon} size={18} />
                  </span>
                  <div className="grow">
                    <b>{e.title}</b>
                    <div className="muted small">
                      <Num>{money(e.amount)}</Num> تومان {e.auto && '· پرداخت خودکار فعال'}
                    </div>
                  </div>
                </div>
                <div className="guard-row plain">
                  <span>
                    <b>هر ماه تکرار شود</b>
                    <span className="muted small">یک روز قبل یادآوری می‌گیرید</span>
                  </span>
                  <Toggle on={e.repeat} onChange={(v) => flip(e.id, v)} label="تکرار ماهانه" />
                </div>
                {!e.auto && (
                  <Btn kind="soft" onClick={() => push(...e.to)}>
                    همین الان پرداخت کن
                  </Btn>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="cal-empty">
            <p className="muted">این روز پرداختی ندارد.</p>
            <Btn kind="soft" onClick={() => push('transfer')}>
              <Icon name="plus" size={18} /> یک پرداخت برای این روز بگذار
            </Btn>
          </Card>
        )}
      </Section>

      <Section title="پرداخت‌های تکراری">
        <Card className="list">
          {ev
            .filter((e) => e.repeat)
            .map((e) => (
              <Row key={e.id} icon={e.icon} title={e.title} sub={`هر ماه ${toFa(e.day)}ام`} end={<b className="row-amt"><Num>{short(e.amount)}</Num></b>} />
            ))}
        </Card>
      </Section>
    </Screen>
  )
}
