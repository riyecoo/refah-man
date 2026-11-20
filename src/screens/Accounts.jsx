import { useState } from 'react'
import Icon from '../components/Icon'
import Art from '../components/Art'
import { Amount, Btn, Card, Num, Row, Screen, Section, useApp } from '../components/ui'
import { BalanceCard, TxnRow } from './Home'
import { accounts, CATS, pension, transactions } from '../data/mock'
import { money, short, toFa } from '../utils/fa'

export function Accounts() {
  const { push, hideBal: hb, crowd } = useApp()
  const hideBal = hb || crowd
  const total = accounts.reduce((s, a) => s + a.balance, 0)
  return (
    <Screen title="حساب‌ها" back={false}>
      <Card className="total">
        <span className="muted small">مجموع دارایی در بانک رفاه</span>
        <b className="total-num">{hideBal ? '••••••••' : money(total)} تومان</b>
      </Card>
      <Section title="حساب‌ها و سپرده‌ها">
        <Card className="list">
          {accounts.map((a) => (
            <Row
              key={a.id}
              lead={<Art name={a.type === 'کوتاه‌مدت' ? 'ic-envelopes' : a.type === 'جاری' ? 'ic-card' : 'ic-loan'} size={44} />}
              title={a.title}
              sub={`${a.no}${a.rate ? ` · سود ${a.rate}` : ''}`}
              end={<b className="row-amt">{hideBal ? '•••' : short(a.balance)}</b>}
              onClick={() => push('account', { id: a.id })}
              chevron
            />
          ))}
        </Card>
      </Section>
      <Section title="خدمات حساب">
        <Card className="list">
          <Row icon="receipt" title="فیش حقوق و مستمری" sub={`آخرین فیش: ${pension.month}`} onClick={() => push('pension')} chevron />
          <Row icon="download" title="صورت‌حساب رسمی (PDF)" sub="با مهر بانک، برای سفارت و وام" onClick={() => push('account', { id: 'cur' })} chevron />
          <Row icon="plus" title="افتتاح حساب و سپرده‌ی جدید" sub="غیرحضوری، با احراز هویت تصویری" onClick={() => push('services')} chevron />
          <Row icon="doc" title="گواهی تمکن مالی و موجودی" sub="آنی، فارسی یا انگلیسی، با QR استعلام برای سفارت" onClick={() => push('certificate')} chevron />
          <Row icon="lock" title="بستن حساب یا انتقال به شعبه‌ی دیگر" sub="آنلاین، بدون مراجعه" onClick={() => push('closeAccount')} chevron />
        </Card>
      </Section>
    </Screen>
  )
}

export function AccountDetail({ id = 'cur', tab: tab0 = 'list' }) {
  const { toast, push } = useApp()
  const a = accounts.find((x) => x.id === id) || accounts[0]
  const [tab, setTab] = useState(tab0)
  const [f, setF] = useState('all')
  const list = transactions.filter((t) => t.acc === a.id && (f === 'all' || (f === 'in' ? t.amount > 0 : t.amount < 0)))
  const out = transactions.filter((t) => t.acc === a.id && t.amount < 0)
  const byCat = Object.entries(out.reduce((m, t) => ((m[t.cat] = (m[t.cat] || 0) + -t.amount), m), {})).sort((x, y) => y[1] - x[1])
  const max = byCat[0]?.[1] || 1
  return (
    <Screen
      title={a.title}
      action={
        <button className="hdr-btn" onClick={() => toast('صورت‌حساب ۳ ماه اخیر به‌صورت PDF ذخیره شد')} aria-label="دریافت PDF">
          <Icon name="download" size={20} />
        </button>
      }
    >
      <BalanceCard a={a} />
      <Card className="list">
        <Row
          icon="copy"
          title="شماره شبا"
          sub={<Num><span className="ltr-num">{a.iban}</span></Num>}
          onClick={() => {
            navigator.clipboard?.writeText(a.iban).catch(() => {})
            toast('شبا کپی شد')
          }}
        />
      </Card>
      <div className="seg">
        <button className={tab === 'list' ? 'on' : ''} onClick={() => setTab('list')}>
          گردش حساب
        </button>
        <button className={tab === 'report' ? 'on' : ''} onClick={() => setTab('report')}>
          گزارش خرج
        </button>
      </div>
      {tab === 'list' ? (
        <>
          <div className="chips">
            {[
              ['all', 'همه'],
              ['in', 'واریز'],
              ['out', 'برداشت'],
            ].map(([k, t]) => (
              <button key={k} className={`chip ${f === k ? 'on' : ''}`} onClick={() => setF(k)}>
                {t}
              </button>
            ))}
            <button className="chip" onClick={() => toast('فیلتر بازه‌ی تاریخ و مبلغ')}>
              <Icon name="filter" size={14} /> فیلتر
            </button>
          </div>
          <Card className="list">
            {list.length ? list.map((t) => <TxnRow key={t.id} t={t} />) : <p className="muted center pad">تراکنشی نیست.</p>}
          </Card>
        </>
      ) : (
        <Card className="report">
          <button className="life-link" onClick={() => push('life')}>
            <Icon name="receipt" size={18} />
            <span className="grow">
              <b>صورت‌حساب زندگی آذر</b>
              <span className="muted small">مقایسه با ماه قبل، سقف ماهانه و پس‌انداز</span>
            </span>
            <Icon name="chev" size={16} />
          </button>
          <p className="muted small">دسته‌بندی بر اساس صنف فروشگاه انجام می‌شود.</p>
          {byCat.map(([k, v]) => (
            <div className="rep-row" key={k}>
              <span className="rep-label">{CATS[k].t}</span>
              <span className="rep-track">
                <span style={{ width: `${(v / max) * 100}%`, background: CATS[k].c }} />
              </span>
              <span className="rep-val"><Num>{short(v)}</Num></span>
            </div>
          ))}
        </Card>
      )}
    </Screen>
  )
}

export function TxnDetail({ id }) {
  const { toast, push } = useApp()
  const t = transactions.find((x) => x.id === id) || transactions[0]
  const a = accounts.find((x) => x.id === t.acc)
  return (
    <Screen title="جزئیات تراکنش">
      <div className="txd-head">
        <span className={`txd-badge ${t.amount > 0 ? 'pos' : ''}`}>{t.amount > 0 ? 'واریز' : 'برداشت'}</span>
        <Amount value={t.amount} big sign />
      </div>
      <Card className="list kv">
        <KV k="شرح" v={t.title} />
        <KV k="دسته" v={CATS[t.cat].t} />
        <KV k="تاریخ و ساعت" v={`${t.date} · ${t.time}`} />
        <KV k="حساب" v={`${a.title} · ${a.no}`} />
        <KV k="کد پیگیری" v={t.trace} copy />
      </Card>
      <div className="two">
        <Btn kind="soft" onClick={() => toast('رسید به‌صورت تصویر ذخیره شد')}>
          <Icon name="download" size={18} /> ذخیره‌ی رسید
        </Btn>
        <Btn kind="soft" onClick={() => toast('اشتراک‌گذاری رسید')}>
          <Icon name="share" size={18} /> اشتراک
        </Btn>
      </div>
      <button className="link center" onClick={() => push('dispute', { id: t.id })}>
        این تراکنش را نمی‌شناسم
      </button>
    </Screen>
  )
}

export function KV({ k, v, copy }) {
  const { toast } = useApp()
  return (
    <div className="kv-row">
      <span className="muted">{k}</span>
      <span className="kv-v">
        {typeof v === 'string' && /^[\d۰-۹\s•]+$/.test(v) ? <Num><span className="ltr-num">{v}</span></Num> : v}
        {copy && (
          <button
            onClick={() => {
              navigator.clipboard?.writeText(String(v)).catch(() => {})
              toast('کپی شد')
            }}
            aria-label="کپی"
          >
            <Icon name="copy" size={15} />
          </button>
        )}
      </span>
    </div>
  )
}

export function Pension() {
  const { toast } = useApp()
  const net = pension.items.reduce((s, [, v]) => s + v, 0)
  return (
    <Screen
      title="فیش حقوق و مستمری"
      action={
        <button className="hdr-btn" onClick={() => toast('فیش به‌صورت PDF ذخیره شد')} aria-label="دریافت">
          <Icon name="download" size={20} />
        </button>
      }
    >
      <div className="chips">
        {['آبان', 'مهر', 'شهریور', 'مرداد'].map((m, i) => (
          <button key={m} className={`chip ${i === 0 ? 'on' : ''}`}>
            {m} ۱۴۰۵
          </button>
        ))}
      </div>
      <Card className="list kv">
        {pension.items.map(([k, v]) => (
          <div className="kv-row" key={k}>
            <span className="muted">{k}</span>
            <span className={`kv-v ${v < 0 ? 'neg' : ''}`}>
              {v < 0 ? '−' : ''}
              {money(Math.abs(v))}
            </span>
          </div>
        ))}
        <div className="kv-row total-row">
          <b>خالص پرداختی</b>
          <b>{money(net)} تومان</b>
        </div>
      </Card>
      <p className="muted small">واریز شده به حساب جاری در ۱ آذر {toFa(1405)}.</p>
    </Screen>
  )
}
