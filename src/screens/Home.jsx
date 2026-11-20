import { useState } from 'react'
import Icon from '../components/Icon'
import Art from '../components/Art'
import { Avatar, Num, Section, useApp } from '../components/ui'
import { Countdown } from './Calendar'
import { NewDeviceCard } from './Profile'
import { accounts, bills, CATS, contacts, fund, loans, transactions, user } from '../data/mock'
import { money, short, toFa } from '../utils/fa'

const QUICK = [
  ['ic-card', 'کارت به کارت', 'transfer', { mode: 'card' }],
  ['ic-transfer', 'انتقال شبا', 'transfer', { mode: 'iban' }],
  ['ic-bill', 'قبض', 'bills'],
  ['ic-topup', 'شارژ و بسته', 'topup'],
  ['ic-loan', 'وام‌ها', 'loans'],
  ['ic-envelopes', 'قلک', 'goals'],
  ['ic-family', 'درخواست وجه', 'request'],
  ['ic-all', 'همه‌ی خدمات', 'services'],
]

export function BalanceCard({ a }) {
  const { hideBal: hb, setHideBal, toast, push, crowd } = useApp()
  const hideBal = hb || crowd
  return (
    <div className="acc-card">
      <div className="acc-top">
        <span className="acc-type">{a.title}</span>
        <button onClick={() => setHideBal(!hideBal)} aria-label="نمایش یا پنهان کردن موجودی">
          <Icon name={hideBal ? 'eye' : 'eyeOff'} size={19} />
        </button>
      </div>
      <div className="acc-label">موجودی قابل برداشت</div>
      <div className="acc-bal">
        {hideBal ? '••••••••' : money(a.balance)} <span>تومان</span>
      </div>
      <div className="acc-bottom">
        <button
          className="acc-no"
          onClick={() => {
            navigator.clipboard?.writeText(a.no).catch(() => {})
            toast('شماره حساب کپی شد')
          }}
        >
          <Num>{a.no}</Num> <Icon name="copy" size={14} />
        </button>
        <button className="acc-btn" onClick={() => push('account', { id: a.id })}>
          گردش حساب
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const { push, simple, hideBal: hb, crowd, setCrowd, toast } = useApp()
  const hideBal = hb || crowd
  const [slide, setSlide] = useState(0)
  const unpaid = bills.filter((b) => !b.paid)
  const nextLoan = loans[0]
  const spent = transactions.filter((t) => t.amount < 0 && t.cat !== 'transfer')
  const byCat = Object.entries(
    spent.reduce((m, t) => ((m[t.cat] = (m[t.cat] || 0) + -t.amount), m), {}),
  ).sort((a, b) => b[1] - a[1])
  const total = byCat.reduce((s, [, v]) => s + v, 0)

  if (simple) return <SimpleHome />

  return (
    <div className="scr home">
      <header className="home-hdr">
        <button className="me" onClick={() => push('profile')}>
          <Avatar c={{ id: 'reza', name: user.first }} size={42} />
          <span>
            <span className="muted small">سلام،</span>
            <b>{user.name}</b>
          </span>
        </button>
        <div className="hdr-actions">
          <button
            className={`icon-btn ${crowd ? 'on' : ''}`}
            onClick={() => {
              setCrowd(!crowd)
              toast(crowd ? 'حالت جمع خاموش شد' : 'حالت جمع: همه‌ی اعداد پنهان شد؛ برای دیدن هر عدد انگشت را نگه دارید')
            }}
            aria-label="حالت جمع"
            aria-pressed={crowd}
          >
            <Icon name={crowd ? 'eyeOff' : 'users'} size={21} />
          </button>
          <button className="icon-btn" onClick={() => push('support')} aria-label="پشتیبانی">
            <Icon name="help" size={21} />
          </button>
          <button className="icon-btn" onClick={() => push('notifs')} aria-label="اعلان‌ها">
            <Icon name="bell" size={21} />
            <span className="badge-dot" />
          </button>
        </div>
      </header>

      <div className="scr-body">
        <NewDeviceCard />
        <div
          className="acc-scroll"
          onScroll={(e) => setSlide(Math.round(Math.abs(e.currentTarget.scrollLeft) / e.currentTarget.clientWidth))}
        >
          {accounts.map((a) => (
            <BalanceCard key={a.id} a={a} />
          ))}
        </div>
        <div className="pager">
          {accounts.map((a, i) => (
            <span key={a.id} className={i === slide ? 'on' : ''} />
          ))}
        </div>

        <div className="quick-grid">
          {QUICK.map(([art, t, to, p]) => (
            <button key={t} className="q" onClick={() => push(to, p)}>
              <span className="q-art">
                <Art name={art} size={44} />
              </span>
              <span>{t}</span>
            </button>
          ))}
        </div>

        <Section title="یادآوری‌ها">
          <div className="remind-list">
            {unpaid.slice(0, 1).map((b) => (
              <button key={b.id} className="remind" onClick={() => push('bills', { focus: b.id })}>
                <span className="remind-tag warn">مهلت {b.due}</span>
                <b>قبض {b.kind}</b>
                <span className="muted small"><Num>{short(b.amount)}</Num> تومان</span>
                <span className="remind-go">پرداخت</span>
              </button>
            ))}
            <button className="remind" onClick={() => push('loan', { id: nextLoan.id })}>
              <span className="remind-tag">سررسید {nextLoan.next}</span>
              <b>قسط {nextLoan.title}</b>
              <span className="muted small"><Num>{short(nextLoan.installment)}</Num> تومان</span>
              <span className="remind-go ok">{nextLoan.auto ? 'پرداخت خودکار ✓' : 'پرداخت'}</span>
            </button>
          </div>
        </Section>

        <div className="card rc-banner" role="button" tabIndex={0} onClick={() => push('reportCard')}>
          <span className="rc-banner-score">۱۶٫۵</span>
          <span className="grow">
            <b>کارنامه‌ی آبان آمد</b>
            <span className="muted small">معدل ۱۶٫۵ از ۲۰ · یک نمره و نیم بهتر از مهر</span>
          </span>
          <button
            className="inf-chip"
            onClick={(e) => {
              e.stopPropagation()
              push('inflation')
            }}
          >
            تورم شما ۳٫۱٪
          </button>
        </div>

        <Countdown />

        <OpenRefah />
        <BranchInPocket />

        <button className="card fund-banner" onClick={() => push('fund')}>
          <Art name="ic-family" size={52} />
          <span className="grow">
            <b>{fund.name}</b>
            <span className="muted small">قرعه‌ی این ماه: {toFa(fund.day)} آذر · سهم شما پرداخت شد</span>
          </span>
          <Icon name="chev" size={18} className="row-chev" />
        </button>

        <Section title="انتقال سریع">
          <div className="fav-row">
            {contacts
              .filter((c) => c.fav)
              .map((c) => (
                <button key={c.id} className="fav" onClick={() => push('transfer', { mode: 'card', to: c.id })}>
                  <Avatar c={c} size={54} />
                  <span>{c.name.replace('آقای ', '')}</span>
                </button>
              ))}
            <button className="fav" onClick={() => push('contacts')}>
              <span className="fav-add">
                <Icon name="plus" size={22} />
              </span>
              <span>مخاطبین</span>
            </button>
          </div>
        </Section>

        <Section title="خرج‌های آذر" more="صورت‌حساب زندگی" onMore={() => push('life')}>
          <div className="card spend">
            <div className="spend-top">
              <span className="muted small">مجموع</span>
              <b>{hideBal ? '••••••' : money(total)} تومان</b>
            </div>
            <div className="spend-bar">
              {byCat.map(([k, v]) => (
                <span key={k} style={{ width: `${(v / total) * 100}%`, background: CATS[k].c }} />
              ))}
            </div>
            <div className="spend-legend">
              {byCat.slice(0, 4).map(([k, v]) => (
                <span key={k}>
                  <i style={{ background: CATS[k].c }} />
                  {CATS[k].t} · {toFa(Math.round((v / total) * 100))}٪
                </span>
              ))}
            </div>
          </div>
        </Section>

        <Section title="تراکنش‌های اخیر" more="همه" onMore={() => push('account', { id: 'cur' })}>
          <div className="card list">
            {transactions.slice(0, 5).map((t) => (
              <TxnRow key={t.id} t={t} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}

export function TxnRow({ t }) {
  const { push, hideBal: hb, crowd } = useApp()
  const hideBal = hb || crowd
  const c = CATS[t.cat]
  return (
    <button className="txn" onClick={() => push('txn', { id: t.id })}>
      <span className="txn-ic" style={{ color: c.c, background: `color-mix(in srgb, ${c.c} 13%, transparent)` }}>
        <Icon name={t.amount > 0 ? 'download' : t.cat === 'transfer' ? 'send' : t.cat === 'bill' ? 'bill' : 'card'} size={18} />
      </span>
      <span className="txn-txt">
        <span className="txn-title">{t.title}</span>
        <span className="txn-sub">
          {t.date} · {t.time}
        </span>
      </span>
      <span className={`txn-amt ${t.amount > 0 ? 'pos' : ''}`}>
        {hideBal ? '•••' : `${t.amount > 0 ? '+' : '−'}${money(Math.abs(t.amount))}`}
      </span>
    </button>
  )
}

const POCKET = [
  ['loanApply', 'bank', 'وام بدون شعبه'],
  ['certificate', 'doc', 'گواهی تمکن'],
  ['dispute', 'alert', 'اعتراض به تراکنش'],
  ['identity', 'camera', 'تغییر شماره و سقف'],
  ['closeAccount', 'lock', 'بستن حساب'],
  ['appointment', 'cal', 'نوبت شعبه'],
]

// «رفاه باز»: داده‌ی حقوق، با رضایت مشتری، به‌جای ضامن و قرض آخر ماه
function OpenRefah() {
  const { push, consents } = useApp()
  return (
    <section className="sec">
      <div className="sec-head">
        <h2>رفاه باز</h2>
        <button className="link" onClick={() => push('devPortal')}>
          پرتال API
        </button>
      </div>
      <button className="or-ewa" onClick={() => push('ewa')}>
        <span className="or-ewa-ic">
          <Icon name="wallet" size={22} />
        </span>
        <span className="grow">
          <b>۷٫۲ میلیون از حقوقت آماده است</b>
          <small>حقوق ۱۸ روز کارکرد؛ بی‌سود، همین حالا</small>
        </span>
        <Icon name="chev" size={18} />
      </button>
      <div className="pocket">
        <button className="pk" onClick={() => push('passport')}>
          <span className="pk-ic"><Icon name="qr" size={20} /></span>
          <span>پاسپورت حقوق</span>
        </button>
        <button className="pk" onClick={() => push('consents')}>
          <span className="pk-ic"><Icon name="shield" size={20} /></span>
          <span>مرکز رضایت‌ها ({toFa(consents.length)})</span>
        </button>
        <button className="pk" onClick={() => push('devPortal')}>
          <span className="pk-ic"><Icon name="code" size={20} /></span>
          <span>پرتال API</span>
        </button>
      </div>
    </section>
  )
}

// «شعبه در جیب»: کارهایی که تا امروز رفتن به شعبه می‌خواست
function BranchInPocket() {
  const { push, cases } = useApp()
  const open = cases.filter((c) => c.at < c.steps.length - 1).length
  return (
    <section className="sec">
      <div className="sec-head">
        <h2>شعبه در جیب</h2>
        <button className="link" onClick={() => push('cases')}>
          پرونده‌های من {open ? `(${toFa(open)})` : ''}
        </button>
      </div>
      <div className="pocket">
        {POCKET.map(([to, ic, t]) => (
          <button key={to} className="pk" onClick={() => push(to)}>
            <span className="pk-ic">
              <Icon name={ic} size={20} />
            </span>
            <span>{t}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

// حالت ساده برای بازنشستگان و سالمندان: متن درشت، فقط ۴ کار اصلی
function SimpleHome() {
  const { push, hideBal, setHideBal } = useApp()
  const a = accounts[0]
  const tiles = [
    ['ic-transfer', 'پول بفرست', 'transfer', { mode: 'card' }],
    ['ic-bill', 'قبض‌ها', 'bills'],
    ['ic-topup', 'شارژ', 'topup'],
    ['ic-loan', 'قسط وام', 'loans'],
  ]
  return (
    <div className="scr home simple-home">
      <header className="home-hdr">
        <div className="simple-hi">
          سلام <b>{user.first} جان</b>
        </div>
        <button className="icon-btn" onClick={() => push('support')} aria-label="تماس با پشتیبانی">
          <Icon name="call" size={22} />
        </button>
      </header>
      <div className="scr-body">
        <button className="simple-bal" onClick={() => setHideBal(!hideBal)}>
          <span>موجودی حساب</span>
          <b>{hideBal ? 'برای دیدن، لمس کنید' : `${money(a.balance)} تومان`}</b>
        </button>
        <div className="simple-tiles">
          {tiles.map(([art, t, to, p]) => (
            <button key={t} className="simple-tile" onClick={() => push(to, p)}>
              <Art name={art} size={64} />
              <span>{t}</span>
            </button>
          ))}
        </div>
        <p className="muted center small">برای برگشت به حالت عادی: من ← نمایش ← حالت ساده</p>
      </div>
    </div>
  )
}
