import { eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from 'date-fns'
import { useRef, useState } from 'react'
import { useHolidays } from '../hooks/useHolidays'
import { getLeavePlans, recommendedLeaveDates } from '../utils/leavePlans'

const monthNames = {
  zh: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December']
}
const weekdays = { zh: ['日','一','二','三','四','五','六'], en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] }
const localKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
const dateText = (key, lang) => { const [y,m,d] = key.split('-').map(Number); return lang === 'zh' ? `${m}月${d}日` : `${d}/${m}` }

function MiniMonth({ year, index, holidays, leaveDates, lang, onClick }) {
  const start = startOfMonth(new Date(year, index, 1))
  const days = eachDayOfInterval({ start, end: endOfMonth(start) })
  const hk = new Set((holidays.HK || []).map((item) => item.date))
  const today = localKey()
  const holidayCount = days.filter((day) => hk.has(format(day, 'yyyy-MM-dd'))).length

  return <button className="month-card" onClick={() => onClick(index + 1)} aria-label={`${monthNames[lang][index]} details`}>
    <div className="month-card-header"><h2>{monthNames[lang][index]}</h2>{holidayCount > 0 && <span>{holidayCount} {lang === 'zh' ? '日假期' : holidayCount === 1 ? 'holiday' : 'holidays'}</span>}</div>
    <div className="weekday-row">{weekdays[lang].map((day) => <span key={day}>{day}</span>)}</div>
    <div className="month-days">
      {Array.from({ length: getDay(start) }).map((_, i) => <span className="empty-day" key={`e-${i}`} />)}
      {days.map((day) => {
        const date = format(day, 'yyyy-MM-dd')
        const isHoliday = hk.has(date)
        const isLeaveDay = leaveDates.has(date)
        const isToday = date === today
        const classes = ['day', day.getDay() === 0 ? 'sunday' : '', isHoliday ? 'holiday' : '', isLeaveDay ? 'leave-day' : '', isToday ? 'today' : ''].filter(Boolean).join(' ')
        return <span className={classes} key={date}>{format(day, 'd')}</span>
      })}
    </div>
  </button>
}

export function MonthGrid({ year, lang, theme, onYearChange, onMonthClick, onLanguageChange, onThemeChange }) {
  const { holidays, loading } = useHolidays(year)
  const [showPlans, setShowPlans] = useState(true)
  const plansRef = useRef(null)
  const leaveDates = recommendedLeaveDates(year, holidays.HK || [])
  const plans = getLeavePlans(year, holidays.HK || [])
  const openPlans = () => { setShowPlans(true); setTimeout(() => plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0) }

  return <main className="calendar-page">
    <nav className="toolbar">
      {[2026, 2027].map((value) => <button className={`year-button${year === value ? ' active' : ''}`} key={value} onClick={() => onYearChange(value)}>{value}</button>)}
      <button className="theme-toggle" onClick={onThemeChange}><span className={`switch${theme === 'dark' ? ' on' : ''}`}><span /></span><span>{lang === 'zh' ? (theme === 'dark' ? '最佳觀' : '淺色') : (theme === 'dark' ? 'Dark' : 'Light')}</span></button>
      <button className="planner-button" onClick={openPlans}>{lang === 'zh' ? '請假攻略' : 'Leave plans'}</button>
      <button className="language-button" onClick={onLanguageChange}>{lang === 'zh' ? 'EN' : '中'}</button>
    </nav>

    <header className="calendar-header"><h1>{year}</h1><p>{lang === 'zh' ? '全年總覽・香港假期實心紅圈・建議請假日金色虛線圈' : 'Year overview · HK holidays solid red · recommended leave days dashed gold'}</p></header>

    {loading ? <p className="loading">Loading…</p> : <>
      <section className="month-grid">{Array.from({ length: 12 }, (_, index) => <MiniMonth key={index} year={year} index={index} holidays={holidays} leaveDates={leaveDates} lang={lang} onClick={onMonthClick} />)}</section>
      <div className="calendar-legend"><span><i className="legend-dot holiday-dot" />{lang === 'zh' ? '香港公眾假期' : 'HK public holiday'}</span><span><i className="legend-dot leave-dot" />{lang === 'zh' ? '建議請假日' : 'Recommended leave'}</span><span><i className="legend-dot today-dot" />{lang === 'zh' ? '今天' : 'Today'}</span></div>
      {showPlans && <section className="plans-section" ref={plansRef}><h2>{year} {lang === 'zh' ? '最佳請假方案' : 'Best leave plans'}</h2><p>{lang === 'zh' ? '預設星期六、日及香港公眾假期為休息日；金色虛線日期為建議使用年假的工作日。' : 'Saturdays, Sundays and Hong Kong public holidays are days off; gold dashed dates are recommended annual-leave days.'}</p><div className="plans-list">{plans.map((plan, index) => <article className="plan-item" key={plan.id}><b className="plan-code">{String.fromCharCode(65 + index)}</b><div><strong>{plan.holidayLabels.join('＋') || (lang === 'zh' ? '連假方案' : 'Leave plan')}</strong><span>{dateText(plan.start, lang)}–{dateText(plan.end, lang)} · {lang === 'zh' ? `連休 ${plan.totalDays} 日，請 ${plan.leaveDays} 日` : `${plan.totalDays} days off, take ${plan.leaveDays}`}</span><small>{lang === 'zh' ? '請假：' : 'Leave: '}{plan.leaveDates.map((date) => dateText(date, lang)).join(lang === 'zh' ? '、' : ', ')}</small></div></article>)}</div></section>}
    </>}
  </main>
}
