import { eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from 'date-fns'
import { useHolidays } from '../hooks/useHolidays'

const countries = { HK:{zh:'香港',en:'Hong Kong',cls:'hk'}, US:{zh:'美國',en:'United States',cls:'us'}, JP:{zh:'日本',en:'Japan',cls:'jp'}, TW:{zh:'台灣',en:'Taiwan',cls:'tw'}, CN:{zh:'中國',en:'China',cls:'cn'} }
const monthNames = { zh:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'], en:['January','February','March','April','May','June','July','August','September','October','November','December'] }
const weekdays = { zh:['日','一','二','三','四','五','六'], en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] }
const localKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }

export function MonthDetail({ year, month, lang, onBack }) {
  const { holidays, loading } = useHolidays(year)
  const start = startOfMonth(new Date(year, month - 1, 1))
  const days = eachDayOfInterval({ start, end: endOfMonth(start) })
  const today = localKey()
  const byDate = {}
  Object.entries(holidays).forEach(([country, list]) => (list || []).forEach((item) => { (byDate[item.date] ||= []).push({ ...item, country }) }))

  return <main className="detail-page"><button className="back-button" onClick={onBack}>← {lang === 'zh' ? '返回全年總覽' : 'Back to overview'}</button><h1>{year} {monthNames[lang][month - 1]}</h1><div className="legend">{Object.entries(countries).map(([code, c]) => <span key={code}><i className={`dot ${c.cls}`} />{c[lang]}</span>)}<span><i className="dot today-marker" />{lang === 'zh' ? '今天' : 'Today'}</span></div>{loading ? <p className="loading">Loading…</p> : <section className="detail-calendar">{weekdays[lang].map((day) => <div className="detail-weekday" key={day}>{day}</div>)}{Array.from({ length: getDay(start) }).map((_, i) => <div className="detail-empty" key={i} />)}{days.map((day) => { const date = format(day, 'yyyy-MM-dd'); const list = byDate[date] || []; const hk = list.some((item) => item.country === 'HK'); return <div className={['detail-day', day.getDay() === 0 ? 'sunday' : '', hk ? 'hk-holiday' : '', date === today ? 'today' : ''].filter(Boolean).join(' ')} key={date}><strong className="detail-date">{format(day, 'd')}</strong>{list.map((item) => <span className={`holiday-label ${countries[item.country].cls}`} key={`${item.country}-${item.name}`}>{countries[item.country][lang]} · {item.name}</span>)}</div> })}</section>}</main>
}
