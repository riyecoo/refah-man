// داده‌های ساختگی برای نمایش. هیچ اتصال واقعی به بانک وجود ندارد.

export const user = {
  first: 'آرش',
  name: 'آرش حمیدی',
  mobile: '۰۹۱۲ ۳۴۵ ۶۷۸۹',
  nationalId: '۰۰۱۲۳۴۵۶۷۸',
  branch: 'شعبه‌ی میدان ونک (کد ۱۲۴۵)',
  since: '۱۳۹۸',
}

export const accounts = [
  { id: 'cur', type: 'جاری', title: 'حساب جاری', no: '۱۰۴۵۷۸۹۲۱۳', iban: 'IR۰۸ ۰۱۳۰ ۰۰۰۰ ۰۰۱۰ ۴۵۷۸ ۹۲۱۳', balance: 61_480_000, main: true },
  { id: 'qh', type: 'قرض‌الحسنه', title: 'قرض‌الحسنه پس‌انداز', no: '۲۲۸۷۱۰۴۴۵۶', iban: 'IR۵۴ ۰۱۳۰ ۰۰۰۰ ۰۰۲۲ ۸۷۱۰ ۴۴۵۶', balance: 18_250_000 },
  { id: 'kt', type: 'کوتاه‌مدت', title: 'سپرده‌ی کوتاه‌مدت', no: '۳۰۱۸۴۴۷۷۰۲', iban: 'IR۷۱ ۰۱۳۰ ۰۰۰۰ ۰۰۳۰ ۱۸۴۴ ۷۷۰۲', balance: 240_000_000, rate: '۱۵٪' },
]

export const cards = [
  { id: 'c1', title: 'کارت حساب جاری', no: '۵۸۹۴ ۶۳۱۵ ۲۲۰۴ ۴۲۱۸', exp: '۱۴۰۸/۰۶', acc: 'cur', tone: 'brand', limit: 50_000_000 },
  { id: 'c2', title: 'کارت هدیه', no: '۵۸۹۴ ۶۳۲۷ ۹۱۰۰ ۷۷۵۳', exp: '۱۴۰۶/۱۲', acc: 'qh', tone: 'gold', limit: 10_000_000 },
]

export const contacts = [
  { id: 'mom', name: 'مامان', full: 'فاطمه احمدی', bank: 'رفاه', card: '۵۸۹۴ ۶۳۱۵ •••• ۱۱۰۲', fav: true },
  { id: 'dad', name: 'بابا', full: 'حسین حمیدی', bank: 'ملی', card: '۶۰۳۷ ۹۹۷۱ •••• ۴۴۹۰', fav: true },
  { id: 'karimi', name: 'آقای کریمی', full: 'محمود کریمی', bank: 'رفاه', card: '۵۸۹۴ ۶۳۱۵ •••• ۵۴۳۲', fav: true, note: 'اجاره' },
  { id: 'maryam', name: 'مریم', full: 'مریم حمیدی', bank: 'سپه', card: '۵۸۹۲ ۱۰۱۱ •••• ۰۱۲۳' },
  { id: 'reza', name: 'رضا', full: 'رضا محمدی', bank: 'ملت', card: '۶۱۰۴ ۳۳۷۸ •••• ۲۲۲۲' },
]

// دسته‌ها از روی کد صنف پذیرنده (MCC) — بدون هوش مصنوعی
export const CATS = {
  food: { t: 'خوراکی و سوپرمارکت', c: '#7B4FD6' },
  transport: { t: 'رفت‌وآمد', c: '#0F8A7E' },
  bill: { t: 'قبض و شارژ', c: '#B4700F' },
  transfer: { t: 'انتقال', c: '#4A2683' },
  eat: { t: 'رستوران', c: '#D6338A' },
  health: { t: 'دارو و درمان', c: '#1E7F52' },
  income: { t: 'واریز', c: '#1E7F52' },
}

export const transactions = [
  { id: 't1', date: 'امروز', time: '۱۰:۱۲', title: 'فروشگاه افق کوروش', cat: 'food', amount: -1_240_000, acc: 'cur', trace: '۴۸۲۱۱۹' },
  { id: 't2', date: 'امروز', time: '۰۸:۴۵', title: 'اسنپ', cat: 'transport', amount: -186_000, acc: 'cur', trace: '۴۸۱۰۰۲' },
  { id: 't3', date: 'دیروز', time: '۲۱:۳۰', title: 'کارت به کارت به مامان', cat: 'transfer', amount: -2_000_000, acc: 'cur', trace: '۴۷۹۹۸۴' },
  { id: 't4', date: 'دیروز', time: '۱۳:۰۵', title: 'رستوران شاندیز', cat: 'eat', amount: -2_350_000, acc: 'cur', trace: '۴۷۹۲۱۰' },
  { id: 't5', date: '۱ آذر', time: '۰۹:۰۰', title: 'واریز حقوق — شرکت پارس‌بافت', cat: 'income', amount: 24_000_000, acc: 'cur', trace: '۴۷۵۵۰۱' },
  { id: 't6', date: '۱ آذر', time: '۰۹:۰۱', title: 'قلک: سفر شمال (خودکار)', cat: 'transfer', amount: -2_000_000, acc: 'cur', trace: '۴۷۵۵۰۲' },
  { id: 't7', date: '۲۹ آبان', time: '۱۸:۲۰', title: 'قبض برق', cat: 'bill', amount: -386_000, acc: 'cur', trace: '۴۷۱۰۴۰' },
  { id: 't8', date: '۲۸ آبان', time: '۱۱:۴۰', title: 'داروخانه دکتر امینی', cat: 'health', amount: -640_000, acc: 'cur', trace: '۴۶۹۸۷۷' },
  { id: 't9', date: '۲۷ آبان', time: '۱۹:۰۲', title: 'شارژ همراه اول', cat: 'bill', amount: -100_000, acc: 'cur', trace: '۴۶۸۰۳۱' },
  { id: 't10', date: '۲۵ آبان', time: '۱۰:۱۵', title: 'سود سپرده', cat: 'income', amount: 2_950_000, acc: 'kt', trace: '۴۶۵۱۱۸' },
]

export const loans = [
  { id: 'l1', title: 'وام خرید مسکن', total: 300_000_000, paid: 27, count: 60, installment: 6_850_000, next: '۱۰ آذر', remain: 33, auto: true },
  { id: 'l2', title: 'وام قرض‌الحسنه ازدواج', total: 150_000_000, paid: 11, count: 60, installment: 2_500_000, next: '۱۵ آذر', remain: 49, auto: false },
]

export const bills = [
  { id: 'b1', kind: 'برق', art: 'ic-bill', billId: '۹۸۷۶۵۴۳۲۱۰', amount: 386_000, due: '۵ آذر', paid: false },
  { id: 'b2', kind: 'گاز', art: 'ic-bill', billId: '۵۵۵۴۴۴۳۳۳۰', amount: 458_000, due: '۱۲ آذر', paid: false },
  { id: 'b3', kind: 'آب', art: 'ic-bill', billId: '۱۲۳۴۵۶۷۸۹۰', amount: 214_000, due: '۸ آذر', paid: true },
  { id: 'b4', kind: 'تلفن همراه', art: 'ic-topup', billId: '۰۹۱۲۳۴۵۶۷۸۹', amount: 172_000, due: '۲ آذر', paid: false },
]

export const goals = [
  { id: 'g1', title: 'سفر شمال', target: 30_000_000, saved: 18_000_000, rule: 'هر واریز حقوق ← ۲ میلیون', art: 'il-payday' },
  { id: 'g2', title: 'جهیزیه‌ی مریم', target: 120_000_000, saved: 41_500_000, rule: 'گرد کردن خریدها به ۱۰ هزار', art: 'ic-envelopes' },
]

export const notifications = [
  { id: 'n1', t: 'واریز حقوق', d: '۲۴٬۰۰۰٬۰۰۰ تومان به حساب جاری واریز شد.', time: '۱ آذر', kind: 'ok' },
  { id: 'n2', t: 'یادآوری قسط', d: 'قسط وام مسکن ۱۰ آذر سررسید می‌شود؛ پرداخت خودکار فعال است.', time: '۲ روز پیش', kind: 'info' },
  { id: 'n3', t: 'ورود از دستگاه جدید', d: 'ورود از Samsung A54 در تهران. اگر شما نبودید، فوراً خارج کنید.', time: '۳ روز پیش', kind: 'warn' },
  { id: 'n4', t: 'قبض گاز صادر شد', d: 'مبلغ ۴۵۸٬۰۰۰ تومان — مهلت ۱۲ آذر.', time: '۴ روز پیش', kind: 'info' },
]

export const devices = [
  { id: 'd1', name: 'iPhone 13 (همین دستگاه)', where: 'تهران', last: 'اکنون', current: true },
  { id: 'd2', name: 'Samsung A54', where: 'تهران', last: '۳ روز پیش' },
  { id: 'd3', name: 'اینترنت‌بانک — Chrome', where: 'کرج', last: '۲ هفته پیش' },
]

export const pension = {
  month: 'آبان ۱۴۰۵',
  items: [
    ['حقوق پایه', 21_400_000],
    ['حق اولاد و عائله‌مندی', 1_900_000],
    ['کمک‌هزینه‌ی مسکن', 900_000],
    ['بیمه‌ی تکمیلی', -200_000],
  ],
}

// ---------- نسخه‌ی ۳ ----------
// امروز در این دنیای نمونه: ۳ آذر. واریز بعدی حقوق/مستمری: ۱ دی
export const TODAY = 3
export const MONTH = 'آذر'
export const MONTH_DAYS = 30
export const MONTH_START_COL = 1 // ۱ آذر = یکشنبه (ستون دوم؛ هفته از شنبه)
export const PAYDAY = { label: '۱ دی', daysLeft: 28, amount: 24_000_000 }

export const events = [
  { id: 'e1', day: 5, title: 'اجاره‌ی آقای کریمی', amount: 12_000_000, kind: 'rent', icon: 'home', repeat: true, to: ['transfer', { to: 'karimi' }] },
  { id: 'e2', day: 5, title: 'قبض برق', amount: 386_000, kind: 'bill', icon: 'bill', repeat: false, to: ['bills', { focus: 'b1' }] },
  { id: 'e3', day: 10, title: 'قسط وام مسکن', amount: 6_850_000, kind: 'loan', icon: 'bank', repeat: true, auto: true, to: ['loan', { id: 'l1' }] },
  { id: 'e4', day: 12, title: 'قبض گاز', amount: 458_000, kind: 'bill', icon: 'bill', repeat: false, to: ['bills', { focus: 'b2' }] },
  { id: 'e5', day: 15, title: 'قسط وام ازدواج', amount: 2_500_000, kind: 'loan', icon: 'bank', repeat: true, to: ['loan', { id: 'l2' }] },
  { id: 'e6', day: 20, title: 'سهم صندوق همکاران', amount: 3_000_000, kind: 'fund', icon: 'users', repeat: true, auto: true, to: ['fund'] },
]

// صورت‌حساب زندگی: خرج آذر در برابر آبان، با سقف ماهانه
export const lifeLines = [
  { id: 'food', t: 'خوراکی و سوپرمارکت', now: 7_820_000, prev: 6_900_000, cap: 9_000_000 },
  { id: 'rent', t: 'اجاره', now: 12_000_000, prev: 12_000_000, cap: null },
  { id: 'loan', t: 'اقساط وام', now: 9_350_000, prev: 9_350_000, cap: null },
  { id: 'transport', t: 'رفت‌وآمد', now: 2_150_000, prev: 2_300_000, cap: 3_000_000 },
  { id: 'eat', t: 'رستوران و بیرون', now: 2_960_000, prev: 1_700_000, cap: 3_200_000 },
  { id: 'bill', t: 'قبض و شارژ', now: 1_240_000, prev: 1_180_000, cap: 2_000_000 },
  { id: 'health', t: 'دارو و درمان', now: 640_000, prev: 980_000, cap: null },
]
export const lifeIncome = [['حقوق آذر', 24_000_000], ['سود سپرده', 2_950_000], ['سایر واریزها', 12_500_000]]

// صندوق دوستانه (قرض‌الحسنه‌ی جمعی)
export const fund = {
  name: 'صندوق همکاران کارخانه',
  share: 3_000_000,
  day: 20,
  round: 4,
  members: [
    { id: 'me', name: 'آرش حمیدی (شما)', av: 'reza', got: false, paid: true },
    { id: 'm2', name: 'حسین حمیدی', av: 'dad', got: true, paid: true, round: 1 },
    { id: 'm3', name: 'مریم حمیدی', av: 'maryam', got: true, paid: true, round: 2 },
    { id: 'm4', name: 'محمود کریمی', av: 'karimi', got: true, paid: true, round: 3 },
    { id: 'm5', name: 'رضا محمدی', av: 'reza', got: false, paid: false },
    { id: 'm6', name: 'فاطمه احمدی', av: 'mom', got: false, paid: true },
  ],
}

export const pendingDevice = { name: 'Xiaomi Redmi Note 13', where: 'شیراز', when: '۲ دقیقه پیش' }

// ---------- نسخه‌ی ۴: شعبه در جیب ----------
// پرونده‌ها: هر درخواست مثل یک مرسوله‌ی پستی قابل رهگیری است
export const seedCases = [
  {
    id: 'C-41207',
    kind: 'card',
    title: 'صدور کارت المثنی',
    created: '۲۸ آبان',
    icon: 'card',
    steps: [
      ['درخواست ثبت شد', '۲۸ آبان · ۱۱:۲۰'],
      ['کارت چاپ شد', '۲۹ آبان · ۰۹:۱۵'],
      ['تحویل پست شد', '۱ آذر · ۱۴:۰۰', 'کد رهگیری پست: ۸۸۲۱۴۵۰۰۹'],
      ['به دست شما رسید', ''],
    ],
    at: 2,
  },
  {
    id: 'C-40988',
    kind: 'dispute',
    title: 'اعتراض به تراکنش خودپرداز',
    created: '۱۹ آبان',
    icon: 'alert',
    steps: [
      ['اعتراض ثبت شد', '۱۹ آبان · ۱۸:۴۰'],
      ['بررسی گزارش خودپرداز', '۲۰ آبان'],
      ['مبلغ برگشت داده شد', '۲۲ آبان', '۵۰۰٬۰۰۰ تومان به حساب جاری برگشت'],
    ],
    at: 3,
  },
]

export const loanProducts = [
  { id: 'q', t: 'قرض‌الحسنه', rate: 4, max: 300_000_000, note: 'کارمزد ۴٪ · نیاز به ۱ ضامن' },
  { id: 'm', t: 'مرابحه خرید کالا', rate: 23, max: 500_000_000, note: 'سود ۲۳٪ · نیاز به ۱ ضامن' },
  { id: 'p', t: 'وام ویژه‌ی مستمری‌بگیران', rate: 18, max: 200_000_000, note: 'سود ۱۸٪ · بدون ضامن، کسر از مستمری' },
]

export const branches = [
  { id: 'b1', t: 'شعبه‌ی میدان ونک', d: '۸۰۰ متر' },
  { id: 'b2', t: 'شعبه‌ی خیابان ملاصدرا', d: '۲٫۱ کیلومتر' },
  { id: 'b3', t: 'شعبه‌ی مرکزی (خیابان مطهری)', d: '۵ کیلومتر' },
]

export const branchServices = [
  { id: 's1', t: 'دریافت دسته‌چک', docs: ['کارت ملی', 'برگه‌ی ثبت در سامانه‌ی صیاد (در اپ صادر می‌شود)'] },
  { id: 's2', t: 'انحصار وراثت و حساب متوفی', docs: ['گواهی انحصار وراثت', 'کارت ملی همه‌ی وراث', 'شناسنامه‌ی متوفی'] },
  { id: 's3', t: 'صندوق امانات', docs: ['کارت ملی', 'قرارداد اجاره‌ی صندوق'] },
]

// کارنامه‌ی ماه: نمره‌ها از روی آمار جمع‌بندی‌شده محاسبه می‌شوند
export const reportCard = {
  month: 'آبان ۱۴۰۵',
  score: 16.5,
  prev: 14.75,
  persona: 'صرفه‌جوی منظم، با یک نقطه‌ی ضعف: آخر هفته‌ها',
  subjects: [
    ['پرداخت به‌موقع قسط و قبض', 20, 'هیچ قسط و قبضی دیر نشد'],
    ['پس‌انداز', 17, '۸٪ حقوق به قلک رفت'],
    ['کنترل خرج‌های آخر هفته', 12, '۴۱٪ خرج رستوران در پنجشنبه و جمعه بود'],
    ['خریدهای نصفه‌شب', 15, '۳ خرید بعد از ساعت ۲۳'],
    ['ماندن در سقف ماهانه', 18, '۵ دسته از ۶ دسته زیر سقف ماند'],
  ],
  note: 'آرش جان، آبان ماه منظمی بود: همه‌ی قسط‌ها سر وقت رفت و نمره‌ات از ۱۴٫۷۵ به ۱۶٫۵ رسید. تنها جایی که پول از دستت در رفت آخر هفته‌ها بود؛ رستوران و بیرون رفتن نسبت به مهر ۷۴٪ بیشتر شد. اگر فقط همین یکی را نصف کنی، تا اسفند ۴ میلیون بیشتر در قلک سفر شمال داری.',
  tips: ['برای «رستوران و بیرون» سقف ۲ میلیونی بگذار', 'قانون «گرد کردن خریدها» را برای قلک روشن کن', 'خریدهای بعد از ۲۳ را با «محدودیت شبانه» کم کن'],
}

// تورم شخصی: وزن خرج‌های خود کاربر × تورم رسمی هر دسته (داده‌ی عمومی مرکز آمار؛ اعداد نمونه)
export const inflation = {
  month: 'آبان ۱۴۰۵',
  official: 2.9,
  yearlyPersonal: 41,
  yearlySalary: 22,
  rows: [
    ['خوراکی و سوپرمارکت', 34, 3.8],
    ['مسکن و اجاره', 32, 2.6],
    ['رفت‌وآمد', 9, 1.9],
    ['رستوران و بیرون', 12, 4.4],
    ['دارو و درمان', 4, 3.1],
    ['قبض و شارژ', 9, 1.2],
  ],
}
