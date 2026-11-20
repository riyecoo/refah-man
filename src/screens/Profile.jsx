import { useState } from 'react'
import Icon from '../components/Icon'
import { Avatar, Btn, Card, Row, Screen, Section, Sheet, Toggle, useApp } from '../components/ui'
import { contacts, devices, notifications, pendingDevice, user } from '../data/mock'
import { toFa } from '../utils/fa'

export function Profile() {
  const { push, theme, setTheme, simple, setSimple, hideBal, setHideBal, lock, logout } = useApp()
  const [out, setOut] = useState(false)
  return (
    <Screen title="من" back={false}>
      <Card className="me-card">
        <Avatar c={{ id: 'reza', name: user.first }} size={64} />
        <div className="grow">
          <b className="me-name">{user.name}</b>
          <div className="muted small ltr-num">{user.mobile}</div>
          <div className="muted small">مشتری از {user.since} · {user.branch}</div>
        </div>
      </Card>

      <Section title="حساب کاربری">
        <Card className="list">
          <Row icon="shield" title="مرکز رضایت‌ها" sub="اپ‌هایی که با «رفاه باز» به حسابتان وصل‌اند" onClick={() => push('consents')} chevron />
          <Row icon="code" title="رفاه باز · پرتال API" sub="حالت توسعه‌دهنده و فهرست APIها" onClick={() => push('devPortal')} chevron />
          <Row icon="box" title="پرونده‌های من" sub="رهگیری همه‌ی درخواست‌ها، مرحله‌به‌مرحله" onClick={() => push('cases')} chevron />
          <Row icon="user" title="اطلاعات شخصی و شماره همراه" sub={`کد ملی ${user.nationalId}`} onClick={() => push('identity')} chevron />
          <Row icon="star" title="کارنامه‌ی ماه" sub="معدل آبان: ۱۶٫۵" onClick={() => push('reportCard')} chevron />
          <Row icon="shield" title="امنیت و رمزها" onClick={() => push('security')} chevron />
          <Row icon="phone" title="دستگاه‌های فعال" sub={`${toFa(devices.length)} دستگاه`} onClick={() => push('devices')} chevron />
          <Row icon="users" title="مخاطبین" onClick={() => push('contacts')} chevron />
          <Row icon="bell" title="اعلان‌ها" onClick={() => push('notifs')} chevron />
        </Card>
      </Section>

      <Section title="نمایش">
        <Card className="list">
          <Row icon="moon" title="حالت تاریک" end={<Toggle on={theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} label="حالت تاریک" />} />
          <Row icon="text" title="حالت ساده" sub="متن درشت و فقط کارهای اصلی؛ مناسب پدر و مادرها" end={<Toggle on={simple} onChange={setSimple} label="حالت ساده" />} />
          <Row icon="eyeOff" title="پنهان کردن موجودی در خانه" end={<Toggle on={hideBal} onChange={setHideBal} label="پنهان کردن موجودی" />} />
        </Card>
      </Section>

      <Section title="پشتیبانی">
        <Card className="list">
          <Row icon="help" title="پشتیبانی و سؤالات متداول" onClick={() => push('support')} chevron />
          <Row icon="info" title="درباره‌ی رفاه من" sub="نسخه‌ی ۱٫۰٫۰" />
        </Card>
      </Section>

      <Card className="list">
        <Row icon="lock" title="قفل کردن برنامه" onClick={lock} />
        <Row icon="logout" title="خروج از حساب" onClick={() => setOut(true)} danger />
      </Card>

      <Sheet open={out} onClose={() => setOut(false)} title="خروج از حساب">
        <p className="muted">برای ورود دوباره باید کد تأیید پیامکی بگیرید.</p>
        <div className="two">
          <Btn kind="ghost" onClick={() => setOut(false)}>
            انصراف
          </Btn>
          <Btn kind="danger" onClick={logout}>
            خروج
          </Btn>
        </div>
      </Sheet>
    </Screen>
  )
}

export function Security() {
  const { toast } = useApp()
  const [bio, setBio] = useState(true)
  const [guard, setGuard] = useState(true)
  const [night, setNight] = useState(false)
  const [fresh, setFresh] = useState(true)
  return (
    <Screen title="امنیت و رمزها">
      <Card className="list">
        <Row icon="lock" title="تغییر رمز ورود" onClick={() => toast('تغییر رمز ۴ رقمی ورود')} chevron />
        <Row icon="finger" title="ورود با اثر انگشت" end={<Toggle on={bio} onChange={setBio} label="اثر انگشت" />} />
        <Row icon="key" title="رمز دوم پویا" sub="فعال در برنامه — بدون نیاز به پیامک" onClick={() => toast('رمزساز داخل برنامه فعال است')} chevron />
      </Card>
      <Section title="محافظت از انتقال">
        <Card className="list">
          <Row icon="shield" title="محافظ مقصد جدید" sub="انتقال بالای ۵ میلیون به مقصد جدید، با ۳۰ دقیقه تأخیر قابل لغو" end={<Toggle on={guard} onChange={setGuard} label="محافظ مقصد جدید" />} />
          <Row icon="phone" title="احتیاط دستگاه تازه" sub="۲۴ ساعت اول روی گوشی تازه: سقف انتقال ۲ میلیون و فقط به مخاطبین قبلی؛ ورود باید از گوشی قبلی تأیید شود" end={<Toggle on={fresh} onChange={setFresh} label="احتیاط دستگاه تازه" />} />
          <Row icon="clock" title="محدودیت شبانه" sub="از ۲۳ تا ۶ صبح، سقف انتقال ۲ میلیون" end={<Toggle on={night} onChange={setNight} label="محدودیت شبانه" />} />
          <Row icon="gear" title="سقف انتقال روزانه" sub="کارت به کارت: ۱۰ میلیون · شبا: ۲۰۰ میلیون" onClick={() => toast('تنظیم سقف انتقال')} chevron />
        </Card>
      </Section>
    </Screen>
  )
}

export function NewDeviceCard() {
  const { toast, devicePending, setDevicePending, push } = useApp()
  if (devicePending !== true) return null
  return (
    <div className="card newdev fade-in">
      <div className="nd-head">
        <Icon name="alert" size={20} /> ورود از یک گوشی تازه
      </div>
      <p>
        <b>{pendingDevice.name}</b> · {pendingDevice.where} · {pendingDevice.when}
        <br />
        شما بودید؟ تا وقتی از همین گوشی تأیید نکنید، آن گوشی نمی‌تواند پول جابه‌جا کند.
      </p>
      <div className="two">
        <Btn
          kind="danger"
          onClick={() => {
            setDevicePending(false)
            toast('آن گوشی خارج و حساب قفل شد. لطفاً رمزتان را عوض کنید.')
            push('security')
          }}
        >
          نه، قفل کن
        </Btn>
        <Btn
          kind="soft"
          onClick={() => {
            setDevicePending('ok')
            toast('تأیید شد. تا ۲۴ ساعت روی آن گوشی سقف انتقال ۲ میلیون است.')
          }}
        >
          بله، خودم بودم
        </Btn>
      </div>
    </div>
  )
}

export function Devices() {
  const { toast, devicePending } = useApp()
  const [list, setList] = useState(devices)
  const shown = devicePending === 'ok' ? [{ id: 'dn', name: pendingDevice.name, where: pendingDevice.where, last: 'اکنون', fresh: true }, ...list] : list
  return (
    <Screen title="دستگاه‌های فعال">
      <NewDeviceCard />
      <p className="muted small">اگر دستگاهی را نمی‌شناسید، همین الان خارجش کنید و رمزتان را عوض کنید.</p>
      <Card className="list">
        {shown.map((d) => (
          <Row
            key={d.id}
            icon="phone"
            title={d.name}
            sub={d.fresh ? `${d.where} · دستگاه تازه: تا ۲۴ ساعت سقف انتقال ۲ میلیون` : `${d.where} · آخرین فعالیت ${d.last}`}
            end={
              !d.current && (
                <button
                  className="link danger-t"
                  onClick={() => {
                    setList(list.filter((x) => x.id !== d.id))
                    toast('دستگاه خارج شد')
                  }}
                >
                  خروج
                </button>
              )
            }
          />
        ))}
      </Card>
      {list.length > 1 && (
        <Btn
          kind="ghost"
          onClick={() => {
            setList(list.filter((x) => x.current))
            toast('همه‌ی دستگاه‌های دیگر خارج شدند')
          }}
        >
          خروج از همه‌ی دستگاه‌های دیگر
        </Btn>
      )}
    </Screen>
  )
}

export function Notifications() {
  const tone = { ok: ['download', 'ok'], info: ['bell', ''], warn: ['alert', 'warn'] }
  return (
    <Screen title="اعلان‌ها">
      <Card className="list">
        {notifications.map((n) => (
          <Row key={n.id} icon={tone[n.kind][0]} tone={tone[n.kind][1]} title={n.t} sub={`${n.d} · ${n.time}`} />
        ))}
      </Card>
    </Screen>
  )
}

export function Contacts() {
  const { push, toast } = useApp()
  const [q, setQ] = useState('')
  const list = contacts.filter((c) => !q || c.full.includes(q) || c.name.includes(q))
  return (
    <Screen
      title="مخاطبین"
      action={
        <button className="hdr-btn" onClick={() => toast('افزودن مخاطب با شماره کارت یا شبا')} aria-label="افزودن مخاطب">
          <Icon name="plus" size={22} />
        </button>
      }
    >
      <label className="search">
        <Icon name="search" size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی مخاطب" />
      </label>
      <Card className="list">
        {list.map((c) => (
          <Row
            key={c.id}
            lead={<Avatar c={c} size={44} />}
            title={c.full}
            sub={<>{c.bank} · <span className="ltr-num">{c.card}</span></>}
            end={c.fav && <Icon name="heart" size={16} className="fav-ic" />}
            onClick={() => push('transfer', { mode: 'card', to: c.id })}
            chevron
          />
        ))}
      </Card>
    </Screen>
  )
}

export function Support() {
  const { toast } = useApp()
  const faq = ['رمز دوم پویا را چطور فعال کنم؟', 'کارتم را گم کرده‌ام، چه کار کنم؟', 'سقف کارت به کارت روزانه چقدر است؟', 'انتقال با تأخیر را چطور لغو کنم؟']
  return (
    <Screen title="پشتیبانی">
      <div className="support-grid">
        <a className="sup" href="tel:0218525">
          <Icon name="call" size={24} />
          <b>تماس</b>
          <span className="muted small ltr-num">۰۲۱-۸۵۲۵ (فراد)</span>
        </a>
        <button className="sup" onClick={() => toast('گفت‌وگو با کارشناس بانک (ساعت ۸ تا ۲۰)')}>
          <Icon name="chat" size={24} />
          <b>پیام به کارشناس</b>
          <span className="muted small">پاسخ در کمتر از ۱۰ دقیقه</span>
        </button>
      </div>
      <Section title="سؤالات متداول">
        <Card className="list">
          {faq.map((f) => (
            <Row key={f} icon="help" title={f} onClick={() => toast('پاسخ این سؤال')} chevron />
          ))}
        </Card>
      </Section>
      <Card className="list">
        <Row icon="bank" title="شعبه‌های نزدیک من" sub="نزدیک‌ترین: شعبه‌ی ونک — ۸۰۰ متر" onClick={() => toast('نقشه‌ی شعبه‌ها و خودپردازها')} chevron />
      </Card>
    </Screen>
  )
}

