import { useState } from 'react'
import Icon from '../components/Icon'
import Art from '../components/Art'
import { Btn, Card, Row, Screen, Section, Sheet, Toggle, useApp } from '../components/ui'
import { bills as allBills, user } from '../data/mock'
import { money, short, toEn, toFa } from '../utils/fa'

export function Bills({ focus }) {
  const { reset, toast } = useApp()
  const unpaid = allBills.filter((b) => !b.paid)
  const [sel, setSel] = useState(() => new Set(focus ? [focus] : unpaid.map((b) => b.id)))
  const [add, setAdd] = useState(false)
  const [auto, setAuto] = useState(false)
  const [newId, setNewId] = useState('')
  const chosen = unpaid.filter((b) => sel.has(b.id))
  const sum = chosen.reduce((s, b) => s + b.amount, 0)
  const flip = (id) =>
    setSel((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  const pay = () =>
    reset('receipt', {
      title: chosen.length > 1 ? `${toFa(chosen.length)} قبض پرداخت شد` : `قبض ${chosen[0].kind} پرداخت شد`,
      amount: sum,
      rows: [...chosen.map((b) => [`قبض ${b.kind}`, `${money(b.amount)} تومان`]), ['از حساب', 'حساب جاری'], ['کد پیگیری', toFa('552019'), true]],
    })

  return (
    <Screen
      title="قبض‌ها"
      action={
        <button className="hdr-btn" onClick={() => setAdd(true)} aria-label="افزودن قبض">
          <Icon name="plus" size={22} />
        </button>
      }
      footer={
        <Btn disabled={!chosen.length} onClick={pay}>
          {chosen.length ? `پرداخت ${toFa(chosen.length)} قبض · ${money(sum)} تومان` : 'قبضی انتخاب نشده'}
        </Btn>
      }
    >
      <Section title="قبض‌های پرداخت‌نشده">
        <div className="bill-list">
          {unpaid.map((b) => (
            <button key={b.id} className={`bill ${sel.has(b.id) ? 'on' : ''}`} onClick={() => flip(b.id)}>
              <span className="bill-check">{sel.has(b.id) && <Icon name="check" size={16} stroke={2.6} />}</span>
              <Art name={b.art} size={44} />
              <span className="grow">
                <b>قبض {b.kind}</b>
                <span className="muted small">
                  شناسه {b.billId} · مهلت {b.due}
                </span>
              </span>
              <b className="bill-amt">{short(b.amount)}</b>
            </button>
          ))}
        </div>
      </Section>
      <Card className="list">
        <Row icon="refresh" title="پرداخت خودکار قبض‌ها" sub="هر قبض جدید تا سقف ۱ میلیون، روز آخر مهلت پرداخت شود" end={<Toggle on={auto} onChange={(v) => (setAuto(v), toast(v ? 'پرداخت خودکار فعال شد' : 'پرداخت خودکار خاموش شد'))} label="پرداخت خودکار" />} />
      </Card>
      <Section title="پرداخت‌شده‌ها">
        <Card className="list">
          {allBills
            .filter((b) => b.paid)
            .map((b) => (
              <Row key={b.id} lead={<Art name={b.art} size={40} />} title={`قبض ${b.kind}`} sub="پرداخت شد · ۲۹ آبان" end={<span className="muted">{short(b.amount)}</span>} />
            ))}
        </Card>
      </Section>

      <Sheet open={add} onClose={() => setAdd(false)} title="افزودن قبض">
        <label className="field">
          <span>شناسه قبض</span>
          <input inputMode="numeric" value={toFa(newId)} onChange={(e) => setNewId(toEn(e.target.value).replace(/\D/g, ''))} placeholder="شناسه‌ی ۱۳ رقمی روی قبض" />
        </label>
        <div className="chips">
          {['برق', 'آب', 'گاز', 'تلفن ثابت', 'عوارض شهرداری'].map((k) => (
            <button key={k} className="chip">
              {k}
            </button>
          ))}
        </div>
        <Btn
          disabled={newId.length < 6}
          onClick={() => {
            setAdd(false)
            setNewId('')
            toast('قبض ذخیره شد؛ از این به بعد خودکار استعلام می‌شود')
          }}
        >
          استعلام و ذخیره
        </Btn>
      </Sheet>
    </Screen>
  )
}

const OPS = [
  ['mci', 'همراه اول'],
  ['mtn', 'ایرانسل'],
  ['rtl', 'رایتل'],
]
const PACKS = [
  ['۳ گیگ — ۷ روزه', 59_000],
  ['۱۰ گیگ — ۳۰ روزه', 129_000],
  ['۳۰ گیگ — ۳۰ روزه', 189_000],
  ['۱۰۰ گیگ — ۹۰ روزه', 449_000],
]

export function TopUp() {
  const { reset } = useApp()
  const [kind, setKind] = useState('charge')
  const [mine, setMine] = useState(true)
  const [num, setNum] = useState('')
  const [op, setOp] = useState('mci')
  const [amount, setAmount] = useState(100_000)
  const [pack, setPack] = useState(1)
  const mobile = mine ? user.mobile : toFa(num)
  const ok = mine || num.length === 11
  const price = kind === 'charge' ? amount : PACKS[pack][1]

  const buy = () =>
    reset('receipt', {
      title: kind === 'charge' ? 'شارژ انجام شد' : 'بسته فعال شد',
      amount: price,
      rows: [
        ['شماره', mobile],
        ['اپراتور', OPS.find((o) => o[0] === op)[1]],
        [kind === 'charge' ? 'نوع' : 'بسته', kind === 'charge' ? 'شارژ مستقیم' : PACKS[pack][0]],
        ['کد پیگیری', toFa('609114'), true],
      ],
    })

  return (
    <Screen title="شارژ و بسته‌ی اینترنت" footer={<Btn disabled={!ok} onClick={buy}>{`خرید · ${money(price)} تومان`}</Btn>}>
      <div className="seg">
        <button className={kind === 'charge' ? 'on' : ''} onClick={() => setKind('charge')}>
          شارژ
        </button>
        <button className={kind === 'net' ? 'on' : ''} onClick={() => setKind('net')}>
          بسته‌ی اینترنت
        </button>
      </div>
      <div className="seg small-seg">
        <button className={mine ? 'on' : ''} onClick={() => setMine(true)}>
          شماره‌ی خودم
        </button>
        <button className={!mine ? 'on' : ''} onClick={() => setMine(false)}>
          شماره‌ی دیگر
        </button>
      </div>
      {mine ? (
        <Card className="owner slim">
          <Art name="ic-topup" size={40} />
          <div className="grow">
            <b className="ltr-num">{user.mobile}</b>
            <div className="muted small">همراه اول · اعتباری</div>
          </div>
        </Card>
      ) : (
        <label className="field">
          <span>شماره‌ی همراه</span>
          <input inputMode="numeric" maxLength={11} value={toFa(num)} placeholder="۰۹۱۲۳۴۵۶۷۸۹" onChange={(e) => setNum(toEn(e.target.value).replace(/\D/g, ''))} />
        </label>
      )}
      <div className="ops">
        {OPS.map(([k, t]) => (
          <button key={k} className={`op ${op === k ? 'on' : ''}`} onClick={() => setOp(k)}>
            {t}
          </button>
        ))}
      </div>
      {kind === 'charge' ? (
        <div className="amt-grid">
          {[20_000, 50_000, 100_000, 200_000, 500_000, 1_000_000].map((v) => (
            <button key={v} className={`amt-opt ${amount === v ? 'on' : ''}`} onClick={() => setAmount(v)}>
              {short(v)}
            </button>
          ))}
        </div>
      ) : (
        <Card className="list">
          {PACKS.map(([t, p], i) => (
            <Row key={t} title={t} sub={`${money(p)} تومان`} onClick={() => setPack(i)} end={<span className={`radio ${pack === i ? 'on' : ''}`} />} />
          ))}
        </Card>
      )}
    </Screen>
  )
}
