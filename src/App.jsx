import { useState } from 'react'
import { MonthGrid } from './components/MonthGrid'
import { MonthDetail } from './components/MonthDetail'

export default function App(){
  const [year,setYear]=useState(2026)
  const [month,setMonth]=useState(null)
  const [lang,setLang]=useState('zh')
  const [theme,setTheme]=useState('dark')
  return <div className={`app theme-${theme}`}>{month ? <MonthDetail year={year} month={month} lang={lang} onBack={()=>setMonth(null)} /> : <MonthGrid year={year} lang={lang} theme={theme} onYearChange={setYear} onMonthClick={setMonth} onLanguageChange={()=>setLang(lang==='zh'?'en':'zh')} onThemeChange={()=>setTheme(theme==='dark'?'light':'dark')} />}</div>
}
