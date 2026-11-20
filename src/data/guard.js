// «نگهبان مالی»: قبل از هر تصمیم پولی، از روی گردش واقعی حساب هشدار می‌دهد.
// همه‌ی حساب‌ها روی یک سرور است؛ پس بانک می‌تواند (با رضایت طرف مقابل) توان بازپرداخت را بسنجد.
// اعداد نمونه‌اند؛ در نسخه‌ی واقعی از میانگین ۶ ماه گردش حساب محاسبه می‌شود.
import { accounts } from './mock'
import { ewa } from './openApi'
import { money, toFa } from '../utils/fa'

const M = (v) => toFa((v / 1e6).toFixed(1)).replace('.', '٫').replace('٫۰', '')

// تعهدات ماهانه‌ی کاربر (از تقویم پول)
export const OBLIGATIONS = [
  ['اجاره', 12000000],
  ['قسط وام مسکن', 6800000],
  ['قسط وام ازدواج', 2500000],
  ['قبض‌ها (میانگین)', 1100000],
]
const fixed = () => OBLIGATIONS.reduce((s, [, v]) => s + v, 0)

// پول آزاد ماهانه‌ی کاربر = حقوق − تعهدات − خرج‌های معمول
export const myFreeMonthly = () => 4500000 // میانگین ۶ ماه: واریزها منهای همه‌ی برداشت‌ها (نمونه)
export const AFTER_PAYDAY = OBLIGATIONS.slice(0, 2) // اجاره و قسط مسکن: چند روز اول بعد از حقوق
// موجودی که تا روز حقوق می‌ماند
export const leftUntilPayday = () => {
  const cur = accounts.find((a) => a.id === 'cur').balance
  return cur - 12000000 - 6800000 - 1100000 // اجاره و قسط و قبض که قبل از حقوق کسر می‌شود
}

// توان بازپرداخت طرف مقابل: فقط «بازه» دیده می‌شود، نه عدد دقیق و نه گردش (با رضایت او)
export const COUNTER = {
  mom: { free: 3500000, months: 60, band: 'بازنشسته، مستمری منظم', late: 0 },
  dad: { free: 2200000, months: 48, band: 'حقوق‌بگیر منظم', late: 0 },
  karimi: { free: 6000000, months: 72, band: 'درآمد اجاره، منظم', late: 0 },
  maryam: { free: 1500000, months: 14, band: 'حقوق‌بگیر، درآمد متوسط', late: 1 },
  reza: { free: 800000, months: 5, band: 'درآمد نامنظم', late: 2 },
}

// ارزیابی یک قسط ماهانه در برابر پول آزاد
// خروجی: { tone: 'ok' | 'warn' | 'risk', ratio, title, lines, fix }
export function assess({ monthly, free, who = 'شما', months, extra = [] }) {
  const ratio = free > 0 ? monthly / free : 9
  const tone = ratio <= 0.5 ? 'ok' : ratio <= 0.9 ? 'warn' : 'risk'
  const safeMonths = Math.ceil((monthly * (months || 1)) / Math.max(free * 0.5, 1))
  const you = who === 'شما'
  const title =
    tone === 'ok'
      ? `${who} از پس این قسط ${you ? 'برمی‌آیید' : 'برمی‌آید'}`
      : tone === 'warn'
        ? `قسط به سقف توان ${you ? 'شما' : who} نزدیک است`
        : `${who} احتمالاً ${you ? 'نمی‌توانید' : 'نمی‌تواند'} این قسط را بپردازد`
  const lines = [
    `قسط ماهانه: ${money(monthly)} تومان`,
    `پول آزاد ماهانه‌ی ${who} (میانگین ۶ ماه): حدود ${M(free)} میلیون`,
    `قسط، ${toFa(Math.round(ratio * 100))}٪ پول آزاد ماهانه است`,
    ...extra,
  ]
  return { tone, ratio, title, lines, safeMonths, safeAmount: Math.floor((free * 0.5 * (months || 1)) / 1e6) * 1e6 }
}
