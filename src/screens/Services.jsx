import { useState } from 'react'
import Icon from '../components/Icon'
import Art from '../components/Art'
import { Screen, useApp } from '../components/ui'

const GROUPS = [
  {
    t: 'شعبه در جیب',
    items: [
      ['ic-loan', 'وام بدون شعبه', 'loanApply'],
      ['ic-bill', 'گواهی تمکن', 'certificate'],
      ['ic-shield', 'اعتراض به تراکنش', 'dispute'],
      ['ic-topup', 'تغییر شماره و سقف', 'identity'],
      ['ic-all', 'بستن یا انتقال حساب', 'closeAccount'],
      ['ic-envelopes', 'پرونده‌های من', 'cases'],
      ['ic-family', 'نوبت شعبه', 'appointment'],
    ],
  },
  {
    t: 'انتقال و پرداخت',
    items: [
      ['ic-card', 'کارت به کارت', 'transfer', { mode: 'card' }],
      ['ic-transfer', 'شبا (پایا/ساتنا)', 'transfer', { mode: 'iban' }],
      ['ic-bank', 'انتقال داخلی', 'transfer', { mode: 'internal' }],
      ['ic-family', 'درخواست وجه', 'request'],
      ['ic-qr', 'پرداخت با QR', null],
      ['ic-bill', 'قبض‌ها', 'bills'],
      ['ic-topup', 'شارژ', 'topup'],
      ['ic-internet', 'بسته‌ی اینترنت', 'topup'],
    ],
  },
  {
    t: 'حساب و کارت',
    items: [
      ['ic-envelopes', 'قلک', 'goals'],
      ['ic-loan', 'وام و اقساط', 'loans'],
      ['ic-shield', 'امنیت', 'security'],
      ['ic-all', 'افتتاح حساب', null],
      ['ic-card', 'کارت‌ها', 'cards'],
      ['ic-bill', 'فیش حقوق', 'pension'],
    ],
  },
  {
    t: 'چک و سایر',
    items: [
      ['ic-bill', 'چک صیادی (پیچک)', null],
      ['ic-shield', 'استعلام چک', null],
      ['ic-charity', 'نیکوکاری', null],
      ['ic-loan', 'خلافی خودرو', null],
    ],
  },
]

export default function Services() {
  const { push, toast } = useApp()
  const [q, setQ] = useState('')
  return (
    <Screen title="همه‌ی خدمات">
      <label className="search">
        <Icon name="search" size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی خدمت…" />
      </label>
      {GROUPS.map((g) => {
        const items = g.items.filter(([, t]) => !q || t.includes(q))
        if (!items.length) return null
        return (
          <section className="sec" key={g.t}>
            <div className="sec-head">
              <h2>{g.t}</h2>
            </div>
            <div className="svc-grid card">
              {items.map(([art, t, to, p]) => (
                <button key={t} className="svc" onClick={() => (to ? push(to, p) : toast(`«${t}» در نسخه‌ی کامل`))}>
                  <Art name={art === 'ic-bank' ? 'ic-transfer' : art} size={46} />
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </section>
        )
      })}
    </Screen>
  )
}
