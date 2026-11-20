import Icon from '../components/Icon'
import Art from '../components/Art'
import { Amount, Btn, Card, useApp } from '../components/ui'
import { KV } from './Accounts'

export default function Receipt({ title = 'عملیات موفق', amount, rows = [], note, pending }) {
  const { reset, toast } = useApp()
  return (
    <div className="scr receipt">
      <div className="scr-body">
        <div className="rc-head">
          <Art name={pending ? 'st-waiting' : 'st-success'} size={128} pop />
          <h1>{title}</h1>
          {amount != null && <Amount value={amount} big />}
          {note && <p className={`rc-note ${pending ? 'warn' : ''}`}>{note}</p>}
        </div>
        <Card className="list kv rc-card">
          {rows.map(([k, v, copy]) => (
            <KV key={k} k={k} v={v} copy={copy} />
          ))}
        </Card>
        <div className="two">
          <Btn kind="soft" onClick={() => toast('رسید در گالری ذخیره شد')}>
            <Icon name="download" size={18} /> ذخیره
          </Btn>
          <Btn kind="soft" onClick={() => toast('اشتراک‌گذاری رسید')}>
            <Icon name="share" size={18} /> اشتراک
          </Btn>
        </div>
      </div>
      <div className="scr-foot">
        <Btn onClick={() => reset('home')}>بازگشت به خانه</Btn>
      </div>
    </div>
  )
}
