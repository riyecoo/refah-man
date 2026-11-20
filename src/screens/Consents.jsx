import { useState } from 'react'
import Icon from '../components/Icon'
import { Btn, Card, OtpField, Row, Screen, Section, Sheet, useApp } from '../components/ui'
import { SCOPES, incoming } from '../data/openApi'
import { toFa } from '../utils/fa'

const AppIc = ({ ic }) => (
  <span className="row-ic">
    <Icon name={ic} size={20} />
  </span>
)

// مرکز رضایت‌ها: قلب بانکداری باز؛ کنترل داده دست خود مشتری است
export default function Consents() {
  const { consents, setConsents, push, toast } = useApp()
  const [sel, setSel] = useState(null)
  const c = consents.find((x) => x.id === sel)

  const revoke = (id) => {
    setConsents((cs) => cs.filter((x) => x.id !== id))
    setSel(null)
    toast('دسترسی لغو شد؛ از همین لحظه آن اپ هیچ داده‌ای نمی‌بیند')
  }

  return (
    <Screen title="مرکز رضایت‌ها">
      <Card className="cn-hero">
        <div className="cn-hero-ic">
          <Icon name="shield" size={26} />
        </div>
        <div>
          <b>داده‌ی شما، اجازه‌ی شما</b>
          <p className="muted small">
            هر اپی که با «رفاه باز» به حسابتان وصل است اینجاست: چه می‌بیند، تا کی، و هر بار که داده خوانده. با یک لمس قطعش کنید.
          </p>
        </div>
      </Card>

      <Card className="cn-incoming" onClick={() => push('consentRequest')}>
        <span className="pulse-dot" />
        <div className="grow">
          <b>درخواست اتصال تازه</b>
          <div className="muted small">{incoming.app}</div>
        </div>
        <Btn kind="soft">بررسی</Btn>
      </Card>

      <Section title={`اپ‌های متصل (${toFa(consents.length)})`}>
        <Card className="list">
          {consents.map((x) => (
            <Row
              key={x.id}
              lead={<AppIc ic={x.ic} />}
              title={x.app}
              sub={`${x.kind} · ${toFa(x.scopes.length)} دسترسی · تا ${x.until}`}
              onClick={() => setSel(x.id)}
              chevron
            />
          ))}
          {!consents.length && <div className="muted small pad">هیچ اپی متصل نیست.</div>}
        </Card>
      </Section>

      <p className="muted small center">طبق ضوابط بانکداری باز؛ هیچ اپی بدون تأیید شما و رمز پویا نمی‌تواند وصل شود.</p>

      <Sheet open={!!c} onClose={() => setSel(null)} title={c?.app}>
        {c && (
          <>
            <div className="muted small">
              {c.kind} · اعتبار تا {c.until}
              {c.limit ? ` · سقف برداشت ${c.limit}` : ''}
            </div>
            <div className="cn-scopes">
              {c.scopes.map((s) => (
                <div key={s} className="cn-scope">
                  <Icon name="check" size={16} />
                  <div>
                    <b>{SCOPES[s][0]}</b>
                    <div className="muted small">{SCOPES[s][1]}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cn-log-h">گزارش دسترسی</div>
            {c.reads.map(([t, w], i) => (
              <div key={i} className="cn-log">
                <span>{t}</span>
                <code dir="ltr">{w}</code>
              </div>
            ))}
            <Btn kind="danger" className="block" onClick={() => revoke(c.id)}>
              لغو دسترسی
            </Btn>
          </>
        )}
      </Sheet>
    </Screen>
  )
}

// جریان رضایت: یک اپ بیرونی اجازه می‌خواهد؛ مشتری دقیقاً انتخاب می‌کند چه چیزی را بدهد
export function ConsentRequest() {
  const { setConsents, reset, toast } = useApp()
  const [on, setOn] = useState(() => Object.fromEntries(incoming.scopes.map((s) => [s, true])))
  const [months, setMonths] = useState(6)
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(0)
  const chosen = incoming.scopes.filter((s) => on[s])

  const approve = () => {
    setConsents((cs) => [
      {
        id: `cn-${Date.now()}`,
        app: incoming.app.split(' — ')[0],
        ic: incoming.ic,
        kind: 'تعمیر قسطی',
        scopes: chosen,
        until: `${toFa(months)} ماه دیگر`,
        limit: on.pay ? incoming.limit.split('،')[0] : undefined,
        reads: [['همین الان', 'consent:authorized']],
      },
      ...cs,
    ])
    toast('اتصال برقرار شد ✓ — اعتبار قسطی شما بدون چک تأیید شد')
    reset('consents')
  }

  return (
    <Screen title="درخواست اتصال">
      <Card className="cn-req">
        <span className="row-ic big">
          <Icon name={incoming.ic} size={26} />
        </span>
        <b>{incoming.app}</b>
        <div className="muted small">{incoming.why}</div>
        <div className="cn-req-arrow">
          <span>اپ بیرونی</span>
          <Icon name="link" size={18} />
          <span>بانک رفاه</span>
        </div>
      </Card>

      {step === 0 ? (
        <>
          <Section title="این اپ اجازه می‌خواهد که…">
            <Card className="list">
              {incoming.scopes.map((s) => (
                <label key={s} className="cn-chk">
                  <input type="checkbox" checked={on[s]} onChange={(e) => setOn({ ...on, [s]: e.target.checked })} />
                  <div>
                    <b>{SCOPES[s][0]}</b>
                    <div className="muted small">
                      {SCOPES[s][1]}
                      {s === 'pay' ? ` · ${incoming.limit}` : ''}
                    </div>
                  </div>
                </label>
              ))}
            </Card>
          </Section>
          <Section title="مدت اجازه">
            <div className="chips">
              {[1, 6, 12].map((m) => (
                <button key={m} className={`chip ${months === m ? 'on' : ''}`} onClick={() => setMonths(m)}>
                  {toFa(m)} ماه
                </button>
              ))}
            </div>
          </Section>
          <Card className="cn-never">
            <Icon name="eyeOff" size={18} />
            <span>هرگز دیده نمی‌شود: موجودی، گردش حساب، عدد دقیق حقوق، نام کارفرما.</span>
          </Card>
          <Btn className="block" disabled={!chosen.length} onClick={() => setStep(1)}>
            ادامه با {toFa(chosen.length)} دسترسی
          </Btn>
        </>
      ) : (
        <>
          <Section title="تأیید با رمز دوم پویا">
            <OtpField value={otp} onChange={setOtp} />
          </Section>
          <Btn className="block" disabled={otp !== '1111'} onClick={approve}>
            اجازه می‌دهم
          </Btn>
        </>
      )}
    </Screen>
  )
}
