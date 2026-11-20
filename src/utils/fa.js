const FA = '۰۱۲۳۴۵۶۷۸۹'

export const toFa = (v) => String(v).replace(/\d/g, (d) => FA[d])

export const toEn = (s) =>
  String(s)
    .replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

export const money = (n) => toFa(Math.round(n).toLocaleString('en-US').replace(/,/g, '٬'))

export const short = (n) => {
  if (n >= 1e9) return toFa(+(n / 1e9).toFixed(1)) + ' میلیارد'
  if (n >= 1e6) return toFa(+(n / 1e6).toFixed(1)).replace('.', '٫') + ' میلیون'
  if (n >= 1e3) return toFa(Math.round(n / 1e3)) + ' هزار'
  return toFa(n)
}

const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه']
const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده']
const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود']
const hundreds = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد']
const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'هزار میلیارد']

function three(n) {
  const parts = []
  const h = Math.floor(n / 100)
  const r = n % 100
  if (h) parts.push(hundreds[h])
  if (r >= 10 && r < 20) parts.push(teens[r - 10])
  else {
    const t = Math.floor(r / 10)
    const o = r % 10
    if (t) parts.push(tens[t])
    if (o) parts.push(ones[o])
  }
  return parts.join(' و ')
}

export function words(n) {
  n = Math.round(n)
  if (n === 0) return 'صفر'
  const groups = []
  let i = 0
  while (n > 0) {
    const g = n % 1000
    if (g) groups.unshift(three(g) + (scales[i] ? ' ' + scales[i] : ''))
    n = Math.floor(n / 1000)
    i++
  }
  return groups.join(' و ')
}

export const tomanWords = (n) => words(n) + ' تومان'
