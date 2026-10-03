import { useEffect, useState } from 'react'
export function useHolidays(year){
 const [holidays,setHolidays]=useState({}),[loading,setLoading]=useState(true)
 useEffect(()=>{setLoading(true);fetch(`${import.meta.env.BASE_URL}holidays.json`).then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json()}).then(d=>setHolidays(d[String(year)]||{})).catch(e=>{console.error(e);setHolidays({})}).finally(()=>setLoading(false))},[year])
 return {holidays,loading}
}
