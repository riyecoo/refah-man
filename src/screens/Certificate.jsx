import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Screen, useApp } from '../components/ui'
import { accounts, user } from '../data/mock'
import { money, toFa } from '../utils/fa'

// یک QR تزئینی ثابت (در نسخه‌ی واقعی: لینک استعلام اصالت گواهی)
function FakeQR({ seed = 7, size = 92 }) {
  const N = 21
  let x = seed
  const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280)
  const finder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7)
  const cells = []
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      let on
      if (finder(r, c)) {
        const lr = r < 7 ? r : r - (N - 7)
        const lc = c < 7 ? c : c - (N - 7)
        on = lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4)
      } else on = rnd() > 0.52
      if (on) cells.push(<rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" />)
    }
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${N + 2} ${N + 2}`} className="qr" aria-label="کد QR استعلام گواهی">
      <rect x="-1" y="-1" width={N + 2} height={N + 2} fill="#fff" />
      <g fill="#1c1726">{cells}</g>
    </svg>
  )
}

const PURPOSE = {
  fa: { embassy: 'سفارت', court: 'دادگاه', other: 'سایر' },
  en: { embassy: 'Embassy', court: 'Court', other: 'Other' },
}

export default function Certificate() {
  const { addCase, reset } = useApp()
  const [type, setType] = useState('tamakkon')
  const [lang, setLang] = useState('en')
  const [purpose, setPurpose] = useState('embassy')
  const [to, setTo] = useState('Embassy of Germany, Tehran')
  const total = accounts.reduce((s, a) => s + a.balance, 0)
  const rial = total * 10
  const code = 'RF-8841-2207'
  const en = lang === 'en'

  const issue = () => {
    const id = addCase({
      kind: 'cert',
      icon: 'doc',
      title: type === 'tamakkon' ? 'گواهی تمکن مالی' : 'گواهی موجودی',
      summary: `${en ? 'انگلیسی' : 'فارسی'} · برای ${PURPOSE.fa[purpose]} · کد استعلام ${code}`,
      steps: [
        ['صادر و با امضای دیجیتال بانک مهر شد', 'امروز'],
        ['قابل استعلام با QR تا ۳۰ روز', 'فایل PDF در گوشی شما ذخیره شد'],
      ],
    })
    reset('case', { id, fresh: true })
  }

  return (
    <Screen title="گواهی تمکن و موجودی">
      <div className="seg">
        <button className={type === 'tamakkon' ? 'on' : ''} onClick={() => setType('tamakkon')}>
          تمکن مالی
        </button>
        <button className={type === 'balance' ? 'on' : ''} onClick={() => setType('balance')}>
          گواهی موجودی
        </button>
      </div>
      <div className="seg small-seg">
        <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
          English
        </button>
        <button className={lang === 'fa' ? 'on' : ''} onClick={() => setLang('fa')}>
          فارسی
        </button>
      </div>
      <div className="chips">
        {Object.entries(PURPOSE.fa).map(([k, t]) => (
          <button key={k} className={`chip ${purpose === k ? 'on' : ''}`} onClick={() => setPurpose(k)}>
            برای {t}
          </button>
        ))}
      </div>
      <label className="field">
        <span>گیرنده (روی گواهی نوشته می‌شود)</span>
        <input value={to} onChange={(e) => setTo(e.target.value)} dir={en ? 'ltr' : 'rtl'} />
      </label>

      <div className={`cert ${en ? 'en' : ''}`} dir={en ? 'ltr' : 'rtl'}>
        <div className="cert-top">
          <img src="./assets/app-icon.png" alt="" />
          <div>
            <b>{en ? 'Refah Kargaran Bank' : 'بانک رفاه کارگران'}</b>
            <span>{en ? (type === 'tamakkon' ? 'Certificate of Financial Standing' : 'Balance Certificate') : type === 'tamakkon' ? 'گواهی تمکن مالی' : 'گواهی موجودی حساب'}</span>
          </div>
        </div>
        <p>
          {en ? (
            <>
              To: <b>{to || '—'}</b>
              <br />
              This is to certify that <b>Ehsan Hashemi</b> (National ID 0012345678) holds accounts with this bank with a total available balance of{' '}
              <b>{rial.toLocaleString('en-US')} IRR</b> as of 24 November 2026.
            </>
          ) : (
            <>
              به: <b>{to || '—'}</b>
              <br />
              بدین‌وسیله گواهی می‌شود <b>{user.name}</b> (کد ملی {user.nationalId}) دارای حساب نزد این بانک با مجموع موجودی{' '}
              <b>{money(total)} تومان</b> در تاریخ ۳ آذر ۱۴۰۵ است.
            </>
          )}
        </p>
        <div className="cert-foot">
          <FakeQR />
          <div>
            <span>{en ? 'Verify at refah-bank.ir/verify' : 'استعلام اصالت: refah-bank.ir/verify'}</span>
            <b className="ltr-num">{code}</b>
            <span className="cert-seal">{en ? 'Digitally signed' : 'امضای دیجیتال بانک'}</span>
          </div>
        </div>
      </div>

      <Btn onClick={issue}>
        <Icon name="download" size={18} /> صدور و دریافت PDF
      </Btn>
      <p className="muted small center">بدون مراجعه به شعبه. سفارت یا دادگاه با اسکن QR اصالت گواهی را می‌بیند.</p>
    </Screen>
  )
}
