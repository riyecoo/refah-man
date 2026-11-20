import { useCallback, useEffect, useMemo, useState } from 'react'
import Icon from './components/Icon'
import { AppCtx, useApp } from './components/ui'
import Auth from './screens/Auth'
import Home from './screens/Home'
import { Accounts, AccountDetail, TxnDetail, Pension } from './screens/Accounts'
import Transfer from './screens/Transfer'
import { Bills, TopUp } from './screens/Payments'
import { Loans, LoanDetail } from './screens/Loans'
import { Cards, Goals, GoalDetail, RequestMoney } from './screens/Cards'
import { Profile, Security, Devices, Notifications, Contacts, Support } from './screens/Profile'
import Services from './screens/Services'
import Receipt from './screens/Receipt'
import Calendar from './screens/Calendar'
import LifeReceipt from './screens/LifeReceipt'
import Fund from './screens/Fund'
import { Cases, CaseDetail } from './screens/Cases'
import LoanApply from './screens/LoanApply'
import Certificate from './screens/Certificate'
import Dispute from './screens/Dispute'
import Identity from './screens/Identity'
import { CloseAccount, Appointment } from './screens/Branchless'
import ReportCard from './screens/ReportCard'
import Inflation from './screens/Inflation'
import { seedCases } from './data/mock'
import Consents, { ConsentRequest } from './screens/Consents'
import IncomePassport from './screens/IncomePassport'
import EarnedWage from './screens/EarnedWage'
import DevPortal from './screens/DevPortal'
import ApiPanel from './components/ApiPanel'
import RentGuarantee from './screens/RentGuarantee'
import Delegation from './screens/Delegation'
import GroupGuarantee from './screens/GroupGuarantee'
import P2PLoan from './screens/P2PLoan'
import EmployerMatch from './screens/EmployerMatch'
import MedicalInstallment from './screens/MedicalInstallment'
import { seedConsents } from './data/openApi'

const SCREENS = {
  home: Home,
  accounts: Accounts,
  account: AccountDetail,
  txn: TxnDetail,
  pension: Pension,
  transfer: Transfer,
  bills: Bills,
  topup: TopUp,
  loans: Loans,
  loan: LoanDetail,
  cards: Cards,
  goals: Goals,
  goal: GoalDetail,
  request: RequestMoney,
  profile: Profile,
  security: Security,
  devices: Devices,
  notifs: Notifications,
  contacts: Contacts,
  support: Support,
  services: Services,
  receipt: Receipt,
  calendar: Calendar,
  life: LifeReceipt,
  fund: Fund,
  cases: Cases,
  case: CaseDetail,
  loanApply: LoanApply,
  certificate: Certificate,
  dispute: Dispute,
  identity: Identity,
  closeAccount: CloseAccount,
  appointment: Appointment,
  reportCard: ReportCard,
  inflation: Inflation,
  consents: Consents,
  consentRequest: ConsentRequest,
  passport: IncomePassport,
  ewa: EarnedWage,
  devPortal: DevPortal,
  rentGuarantee: RentGuarantee,
  delegation: Delegation,
  groupGuarantee: GroupGuarantee,
  p2pLoan: P2PLoan,
  employerMatch: EmployerMatch,
  medical: MedicalInstallment,
}
const TABS = ['home', 'accounts', 'cards', 'profile']

const load = (k, d) => {
  try {
    const v = localStorage.getItem(k)
    return v == null ? d : JSON.parse(v)
  } catch {
    return d
  }
}
const save = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {}
}

export default function App() {
  const [phase, setPhase] = useState('splash')
  const [stack, setStack] = useState([{ name: 'home', key: 0 }])
  const [toastMsg, setToastMsg] = useState(null)
  const [theme, setTheme] = useState(() => load('yar-theme', 'light'))
  const [simple, setSimple] = useState(() => load('yar-simple', false))
  const [hideBal, setHideBal] = useState(() => load('yar-hide', true))
  const [frozen, setFrozen] = useState({})
  const [crowd, setCrowd] = useState(() => load('yar-crowd', false))
  const [devicePending, setDevicePending] = useState(false)
  const [cases, setCases] = useState(seedCases)
  const [consents, setConsents] = useState(seedConsents)
  const [devMode, setDevMode] = useState(() => load('yar-dev', false))
  useEffect(() => save('yar-dev', devMode), [devMode])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    save('yar-theme', theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.dataset.simple = simple ? '1' : '0'
    save('yar-simple', simple)
  }, [simple])
  useEffect(() => save('yar-hide', hideBal), [hideBal])
  useEffect(() => {
    document.documentElement.dataset.crowd = crowd ? '1' : '0'
    save('yar-crowd', crowd)
  }, [crowd])

  const push = useCallback((name, params) => setStack((s) => [...s, { name, params, key: Date.now() }]), [])
  const pop = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), [])
  const reset = useCallback((name = 'home', params) => setStack([{ name, params, key: Date.now() }]), [])
  const toast = useCallback((m) => {
    setToastMsg(m)
    clearTimeout(window.__toastT)
    window.__toastT = setTimeout(() => setToastMsg(null), 2600)
  }, [])

  // هر درخواست یک «پرونده» می‌شود که مثل مرسوله‌ی پستی رهگیری می‌شود
  const addCase = useCallback((c) => {
    const id = `C-${Math.floor(42000 + Math.random() * 900)}`
    setCases((cs) => [{ ...c, id, created: 'امروز', at: c.at ?? 1 }, ...cs])
    setTimeout(() => {
      setCases((cs) =>
        cs.map((x) => {
          // فقط یک مرحله جلو می‌رود و هیچ‌وقت خودکار «تمام» نمی‌شود
          if (x.id !== id || x.at >= x.steps.length - 2) return x
          toast(`پرونده‌ی «${x.title}»: ${x.steps[x.at][0]} ✓`)
          return { ...x, at: x.at + 1 }
        }),
      )
    }, 6000)
    return id
  }, [toast])

  const ctx = useMemo(
    () => ({
      push, pop, reset, toast,
      theme, setTheme, simple, setSimple, hideBal, setHideBal, frozen, setFrozen,
      crowd, setCrowd, devicePending, setDevicePending, cases, addCase, consents, setConsents, devMode, setDevMode,
      lock: () => setPhase('lock'),
      logout: () => {
        save('yar-registered', false)
        reset('home')
        setPhase('login')
      },
    }),
    [push, pop, reset, toast, theme, simple, hideBal, frozen, crowd, devicePending, cases, addCase, consents, devMode],
  )

  useEffect(() => {
    if (phase !== 'splash') return
    const t = setTimeout(() => setPhase(load('yar-registered', false) ? 'lock' : 'onboard'), 1600)
    return () => clearTimeout(t)
  }, [phase])

  const top = stack[stack.length - 1]
  const S = SCREENS[top.name] || Home
  const isTab = TABS.includes(top.name) && stack.length === 1

  return (
    <AppCtx.Provider value={ctx}>
      <div className="device">
        {phase !== 'app' ? (
          <Auth
            phase={phase}
            setPhase={setPhase}
            done={() => {
              save('yar-registered', true)
              reset('home')
              setPhase('app')
            }}
          />
        ) : (
          <>
            <div className="view" key={top.key}>
              <S {...(top.params || {})} />
            </div>
            {isTab && <TabBar current={top.name} />}
            {devMode && <ApiPanel screen={top.name} key={top.name} />}
          </>
        )}
        {toastMsg && (
          <div className="toast" role="status">
            {toastMsg}
          </div>
        )}
      </div>
    </AppCtx.Provider>
  )
}

function TabBar({ current }) {
  const { reset, push } = useApp()
  const items = [
    ['home', 'home', 'خانه'],
    ['accounts', 'bank', 'حساب‌ها'],
    null,
    ['cards', 'card', 'کارت‌ها'],
    ['profile', 'user', 'من'],
  ]
  return (
    <nav className="tabbar">
      {items.map((it, i) =>
        !it ? (
          <button key="c" className="tab-center" onClick={() => push('transfer')} aria-label="انتقال وجه">
            <Icon name="send" size={24} stroke={2.1} />
            <span>انتقال</span>
          </button>
        ) : (
          <button key={it[0]} className={`tab ${current === it[0] ? 'on' : ''}`} onClick={() => reset(it[0])}>
            <Icon name={it[1]} size={22} />
            <span>{it[2]}</span>
          </button>
        ),
      )}
    </nav>
  )
}
