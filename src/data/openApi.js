// «رفاه باز»: لایه‌ی بانکداری باز. همه‌ی داده‌ها ساختگی‌اند؛ قالب درخواست‌ها واقعی است.
export const API_BASE = 'https://openapi.refah-bank.ir/v1'

// دسترسی‌هایی که یک اپ بیرونی می‌تواند با رضایت مشتری بگیرد
export const SCOPES = {
  identity: ['احراز هویت', 'فقط تأیید «این شخص همان است که می‌گوید»', 'identity:verify'],
  payrollBand: ['بازه‌ی حقوق', 'مثلاً «بین ۲۰ تا ۲۵ میلیون»؛ عدد دقیق دیده نمی‌شود', 'payroll:band'],
  payrollHistory: ['سابقه‌ی واریز حقوق', 'تعداد ماه‌های پیوسته‌ی واریز، بدون مبلغ', 'payroll:history'],
  noDebt: ['نداشتن بدهی معوق', 'فقط بله یا نه', 'credit:no-arrears'],
  balance: ['موجودی حساب', 'موجودی لحظه‌ای حساب جاری', 'accounts:balance'],
  txns: ['گردش حساب', 'ریز تراکنش‌های ۹۰ روز اخیر', 'accounts:transactions'],
  pay: ['برداشت قسط خودکار', 'برداشت تا سقف تعیین‌شده در هر ماه', 'payments:mandate'],
}

export const seedConsents = [
  {
    id: 'cn-1',
    app: 'فروشگاه قسطی «کالانو»',
    ic: 'box',
    kind: 'خرید قسطی',
    scopes: ['identity', 'payrollBand', 'noDebt', 'pay'],
    until: '۱۲ اسفند ۱۴۰۵',
    limit: '۳٫۲ میلیون در ماه',
    reads: [['امروز ۰۹:۱۲', 'payroll:band'], ['۱ آذر', 'payments:mandate · ۳٫۲ میلیون'], ['۱ آبان', 'payments:mandate · ۳٫۲ میلیون']],
  },
  {
    id: 'cn-2',
    app: 'سامانه‌ی اجاره «خانه‌یار»',
    ic: 'home',
    kind: 'اجاره بدون ضامن',
    scopes: ['identity', 'payrollBand', 'payrollHistory'],
    until: '۵ آذر ۱۴۰۵',
    reads: [['دیروز ۱۸:۴۰', 'payroll:history']],
  },
  {
    id: 'cn-3',
    app: 'اپ مدیریت مالی «دخل‌وخرج»',
    ic: 'chart',
    kind: 'حسابداری شخصی',
    scopes: ['balance', 'txns'],
    until: '۳۰ دی ۱۴۰۵',
    reads: [['امروز ۰۷:۰۰', 'accounts:transactions'], ['دیروز ۰۷:۰۰', 'accounts:transactions']],
  },
]

// درخواست اتصال تازه‌ای که از یک اپ بیرونی می‌رسد (برای نمایش جریان رضایت)
export const incoming = {
  app: 'تعمیرگاه «موتورسازان» — تعمیر قسطی',
  ic: 'gear',
  why: 'برای فروش قسطی تعمیر خودرو، بدون چک و ضامن',
  scopes: ['identity', 'payrollBand', 'noDebt', 'pay'],
  limit: '۲ میلیون در ماه، ۶ ماه',
}

// حقوق کارکرده
export const ewa = {
  salary: 24000000,
  payday: '۱ دی',
  daysInMonth: 30,
  dayNow: 18,
  pct: 50,
  fee: 0,
  employer: 'شرکت فولاد ونک (کارفرمای متصل)',
}

/* ---------- نقشه‌ی API هر صفحه (برای پنل توسعه‌دهنده) ---------- */
const E = (method, path, body, res, note) => ({ method, path, body, res, note })
export const API_MAP = {
  home: [
    E('GET', '/accounts', null, { items: [{ id: 'ACC-1', type: 'current', balance: '••••' }] }),
    E('GET', '/payroll/earned', null, { earned: 14400000, available: 7200000, payday: '1405-10-01' }, 'حقوق کارکرده'),
    E('GET', '/consents?status=active', null, { count: 3 }),
  ],
  consents: [
    E('GET', '/consents', null, { items: [{ id: 'cn-1', client_id: 'kalano', scopes: ['identity:verify', 'payroll:band', 'credit:no-arrears', 'payments:mandate'], expires_at: '1405-12-12' }] }),
    E('GET', '/consents/cn-1/access-log', null, { items: [{ at: '09:12', scope: 'payroll:band' }] }),
    E('DELETE', '/consents/{id}', null, { status: 'revoked' }, 'لغو با یک لمس؛ از همان لحظه توکن اپ باطل است'),
  ],
  consentRequest: [
    E('POST', '/consents', { client_id: 'motorsazan', scopes: ['identity:verify', 'payroll:band', 'credit:no-arrears', 'payments:mandate'], mandate: { max_monthly: 2000000, months: 6 } }, { id: 'cn-4', status: 'awaiting_customer' }),
    E('POST', '/consents/cn-4/authorize', { otp: '••••', sca: 'biometric' }, { status: 'active', access_token: 'eyJhbGciOi…' }, 'تأیید قوی مشتری (SCA)'),
  ],
  passport: [
    E('POST', '/income-passports', { show: ['payroll:band', 'payroll:history', 'credit:no-arrears'], ttl_hours: 48, single_use: true }, { id: 'IP-7Q2K', url: 'https://refah.bank/p/7Q2K', expires_at: '+48h' }),
    E('GET', '/income-passports/IP-7Q2K/verify', null, { valid: true, holder: 'احسان هاشمی', payroll_band: '20-25M', months_continuous: 38, arrears: false, signed_by: 'Refah Kargaran Bank' }, 'همان چیزی که صاحبخانه یا فروشگاه می‌بیند'),
  ],
  ewa: [
    E('GET', '/payroll/earned', null, { salary: 24000000, worked_days: 18, earned: 14400000, available: 7200000, fee: 0 }),
    E('POST', '/payroll/advances', { amount: 5000000, repay: 'next_payday' }, { id: 'ADV-311', status: 'paid', repay_on: '1405-10-01' }),
    E('POST', '/employers/{id}/payroll-feed', { worked_days: 18 }, { ok: true }, 'سمت کارفرما: روزهای کارکرد را می‌فرستد'),
  ],
  rentGuarantee: [
    E('POST', '/credit/payroll-limit', { purpose: 'rent_guarantee' }, { max_amount: 400000000 }, 'سقف از روی سابقه‌ی حقوق'),
    E('POST', '/rent-guarantees', { amount: 300000000, beneficiary: 'محمود کریمی', months: 12, fee: 'monthly_from_salary' }, { id: 'RG-5521', status: 'issued', verify_url: 'https://refah.bank/g/RG-5521' }),
    E('GET', '/rent-guarantees/RG-5521/verify', null, { valid: true, amount: 300000000, tenant: 'احسان هاشمی', bank: 'Refah Kargaran' }, 'همان چیزی که صاحبخانه می‌بیند'),
  ],
  delegation: [
    E('GET', '/delegations', null, { items: [{ id: 'd1', delegate: 'reza', scopes: ['bills:pay', 'alerts:read', 'topup:buy'], monthly_cap: 2000000 }] }),
    E('POST', '/delegations', { delegate_mobile: '0912…', scopes: ['bills:pay', 'alerts:read'], monthly_cap: 2000000, expires_in: '6m' }, { id: 'd2', status: 'awaiting_delegate' }),
    E('DELETE', '/delegations/{id}', null, { status: 'revoked' }, 'لغو با یک لمس'),
  ],
  groupGuarantee: [
    E('POST', '/loans/applications', { amount: 200000000, guarantee: 'split' }, { id: 'LA-90' }),
    E('POST', '/loans/LA-90/guarantors/split', { guarantors: 5, share_pct: 20 }, { invites_sent: 5 }),
    E('POST', '/guarantees/{id}/sign', { otp: '••••' }, { signed: true }, 'هر همکار در گوشی خودش'),
  ],
  p2pLoan: [
    E('POST', '/p2p-loans', { counterparty: 'maryam', amount: 10000000, installments: 5, day: 1 }, { id: 'QN-2087', status: 'awaiting_counterparty' }),
    E('POST', '/payments/mandates', { from: 'borrower', to: 'lender', amount: 2000000, schedule: 'monthly@payday' }, { id: 'MD-77', status: 'active' }, 'کسر خودکار قسط در روز حقوق'),
  ],
  employerMatch: [
    E('POST', '/savings/employer-match', { pct: 5, account: 'savings', start: 'next_payday' }, { id: 'EM-12', status: 'awaiting_employer' }),
    E('POST', '/employers/{id}/match-feed', { employee: '••••', match_pct: 5 }, { accepted: true }, 'سمت کارفرما: سهم خود را تأیید می‌کند'),
  ],
  medical: [
    E('GET', '/medical-bills/pending', null, { items: [{ center: 'dentist-amini', amount: 18000000 }] }, 'صورت‌حسابی که مرکز درمانی فرستاده'),
    E('POST', '/medical-installments', { bill_id: 'MB-301', installments: 6 }, { id: 'MI-44', paid_to_center: 18000000 }),
    E('POST', '/payments/mandates', { amount: 3000000, schedule: 'monthly@payday', source: 'salary_or_pension' }, { status: 'active' }),
  ],
  devPortal: [E('GET', '/catalog', null, { apis: 14, sandbox: 'https://sandbox.refah-bank.ir', auth: 'OAuth2 + mTLS' })],
  transfer: [
    E('GET', '/inquiry/owner?iban=IR..', null, { name: 'مریم هاشمی', bank: 'رفاه' }, 'استعلام صاحب حساب'),
    E('POST', '/transfers', { method: 'paya', amount: 30000000, otp: '••••' }, { id: 'TR-9921', status: 'queued', eta: '13:45' }),
  ],
  accounts: [E('GET', '/accounts', null, { items: 3 }), E('GET', '/accounts/ACC-1/transactions?from=1405-08-01', null, { items: 42 })],
  account: [E('GET', '/accounts/ACC-1', null, { iban: 'IR..', balance: '••••' })],
  bills: [E('GET', '/bills', null, { items: 3 }), E('POST', '/bills/pay', { ids: ['b1', 'b2', 'b3'] }, { status: 'paid' })],
  topup: [E('POST', '/topups', { operator: 'MCI', amount: 100000 }, { status: 'ok' })],
  loans: [E('GET', '/loans', null, { items: 2 })],
  loanApply: [
    E('POST', '/credit/score', { national_id: '••••' }, { grade: 'A', limit: 300000000 }),
    E('POST', '/loans/applications', { amount: 200000000, months: 36 }, { id: 'LA-77', guarantor_link: 'https://refah.bank/g/77' }),
    E('POST', '/promissory-notes', { amount: 240000000 }, { id: 'SN-55', status: 'signed' }, 'سفته‌ی الکترونیکی'),
  ],
  cards: [E('POST', '/cards/{id}/freeze', null, { status: 'frozen' }), E('GET', '/cards/{id}/otp', null, { otp: '••••' })],
  certificate: [E('POST', '/certificates', { type: 'tamakkon', lang: 'en' }, { id: 'RF-8841-2207', pdf: '…', verify_url: '…' })],
  dispute: [E('POST', '/disputes', { txn_id: 'T-1', reason: 'not_received' }, { case_id: 'C-42311' })],
  cases: [E('GET', '/cases', null, { items: 4 })],
  reportCard: [
    E('GET', '/insights/monthly?month=1405-08', null, { score: 16.5, categories: 6 }, 'فقط آمار جمع‌بندی‌شده'),
    E('POST', 'https://api.avalai.ir/v1/chat/completions', { model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'آمار جمع‌بندی‌شده…' }] }, { choices: [{ message: { content: 'احسان جان…' } }] }, 'هوش مصنوعی AvalAI'),
  ],
  inflation: [E('GET', '/insights/personal-inflation', null, { rate: 3.1, national: 2.6 })],
  fund: [E('GET', '/pools/FUND-1', null, { members: 6, balance: 18000000 })],
  calendar: [E('GET', '/standing-orders', null, { items: 3 })],
  identity: [E('POST', '/kyc/shahkar', { mobile: '0912…' }, { match: true }), E('POST', '/kyc/liveness', { video: '…' }, { pass: true })],
}

export const CATALOG = [
  ['احراز و رضایت', [['POST', '/consents'], ['DELETE', '/consents/{id}'], ['POST', '/kyc/shahkar']]],
  ['داده‌ی حقوق (انحصاری رفاه)', [['GET', '/payroll/earned'], ['POST', '/payroll/advances'], ['POST', '/income-passports'], ['GET', '/income-passports/{id}/verify']]],
  ['حساب و پرداخت', [['GET', '/accounts'], ['GET', '/accounts/{id}/transactions'], ['POST', '/transfers'], ['POST', '/payments/mandates']]],
  ['ایده‌های تازه', [['POST', '/rent-guarantees'], ['POST', '/delegations'], ['POST', '/loans/{id}/guarantors/split'], ['POST', '/p2p-loans'], ['POST', '/savings/employer-match'], ['POST', '/medical-installments']]],
  ['اعتبار و وام', [['POST', '/credit/score'], ['POST', '/loans/applications'], ['POST', '/promissory-notes']]],
]

export const PARTNERS = [
  ['فروشگاه‌های قسطی', 'اعتبارسنجی از روی حقوق، بدون چک', 'box'],
  ['سامانه‌های اجاره و املاک', 'پاسپورت حقوق به‌جای ضامن', 'home'],
  ['کارفرماها و منابع انسانی', 'حقوق کارکرده برای کارکنان', 'users'],
  ['اپ‌های مدیریت مالی', 'گردش حساب با رضایت', 'chart'],
]
