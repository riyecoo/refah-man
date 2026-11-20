import Icon from '../components/Icon'
import { Btn, Card, Screen, Section, Toggle, useApp } from '../components/ui'
import { API_BASE, CATALOG, CHALLENGES, PARTNERS } from '../data/openApi'

// «رفاه باز»: پرتال توسعه‌دهندگان؛ همان APIهایی که اپ خودش هم مصرف می‌کند
export default function DevPortal() {
  const { devMode, setDevMode, push } = useApp()
  return (
    <Screen title="رفاه باز · پرتال API">
      <Card className="dp-hero">
        <b>بانک رفاه، به‌عنوان یک پلتفرم</b>
        <p className="small">داده‌ی حقوق ۲ میلیون کارگر و بازنشسته، فقط با رضایت خود مشتری، به API تبدیل می‌شود.</p>
        <code dir="ltr">{API_BASE}</code>
      </Card>

      <Card className="list">
        <div className="row">
          <span className="row-ic">
            <Icon name="code" size={20} />
          </span>
          <span className="row-txt">
            <span className="row-title">حالت توسعه‌دهنده</span>
            <span className="row-sub">روی هر صفحه نشان می‌دهد کدام API صدا زده می‌شود</span>
          </span>
          <Toggle on={devMode} onChange={setDevMode} label="حالت توسعه‌دهنده" />
        </div>
      </Card>

      <Section title="پاسخ به چالش‌های اینوکاپ رفاتک ۱۴۰۵">
        <Card className="list">
          {CHALLENGES.map(([n, t, ans, to]) => (
            <button key={n} className="ch-row" onClick={() => push(to)}>
              <span className="ch-n">{n.toLocaleString('fa-IR')}</span>
              <span className="grow">
                <b>{t}</b>
                <small>{ans}</small>
              </span>
              <Icon name="chev" size={16} />
            </button>
          ))}
        </Card>
      </Section>

      {CATALOG.map(([group, eps]) => (
        <Section key={group} title={group}>
          <Card className="dp-eps" dir="ltr">
            {eps.map(([m, p]) => (
              <div key={p + m} className="api-line">
                <span className={`m m-${m}`}>{m}</span>
                <code>{p}</code>
              </div>
            ))}
          </Card>
        </Section>
      ))}

      <Section title="چه کسانی وصل می‌شوند؟">
        <div className="dp-partners">
          {PARTNERS.map(([t, s, ic]) => (
            <Card key={t} className="dp-p">
              <Icon name={ic} size={22} />
              <b>{t}</b>
              <span className="muted small">{s}</span>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="سود بانک">
        <Card className="dp-biz">
          <div><b>کارمزد هر فراخوانی</b><span>استعلام حقوق و پاسپورت برای فروشگاه‌ها و املاک</span></div>
          <div><b>جذب حساب حقوق</b><span>کارفرمایی که «حقوق کارکرده» می‌خواهد، حقوق را در رفاه واریز می‌کند</span></div>
          <div><b>ریسک کمتر</b><span>اعتبارسنجی از روی واریز واقعی، نه چک و ضامن</span></div>
        </Card>
      </Section>

      <div className="dp-std small muted" dir="ltr">OAuth 2.0 · mTLS · SCA (OTP + biometric) · Sandbox: sandbox.refah-bank.ir</div>
      <Btn kind="soft" className="block" onClick={() => setDevMode(true)}>
        روشن کردن حالت توسعه‌دهنده
      </Btn>
    </Screen>
  )
}
