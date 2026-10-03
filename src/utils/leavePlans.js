import { addDays, differenceInCalendarDays, endOfYear, format, getDay, startOfYear } from 'date-fns'
const key=d=>format(d,'yyyy-MM-dd')
const weekend=d=>getDay(d)===0||getDay(d)===6
const range=(a,b)=>{const out=[];for(let d=a;d<=b;d=addDays(d,1))out.push(d);return out}

export function getLeavePlans(year,hkHolidays){
 const holidayMap=new Map(hkHolidays.map(x=>[x.date,x.name]))
 const first=startOfYear(new Date(year,0,1)),last=endOfYear(new Date(year,0,1)),candidates=[]
 for(let start=first;start<=last;start=addDays(start,1)){
  for(let end=start;end<=last&&differenceInCalendarDays(end,start)<16;end=addDays(end,1)){
   const days=range(start,end), leaveDates=days.filter(d=>!weekend(d)&&!holidayMap.has(key(d))).map(key), labels=[...new Set(days.map(d=>holidayMap.get(key(d))).filter(Boolean))]
   if(!labels.length||leaveDates.length<1||leaveDates.length>5||days.length<4)continue
   candidates.push({start:key(start),end:key(end),totalDays:days.length,leaveDays:leaveDates.length,leaveDates,allDates:days.map(key),holidayLabels:labels})
  }
 }
 const selected=[]
 for(let n=1;n<=5;n++){const options=candidates.filter(x=>x.leaveDays===n).sort((a,b)=>b.totalDays-a.totalDays||a.start.localeCompare(b.start));const best=options.find(x=>!selected.some(y=>!(x.end<y.start||x.start>y.end)));if(best)selected.push({...best,id:`${best.start}-${best.end}`})}
 return selected.sort((a,b)=>a.start.localeCompare(b.start))
}
export function leaveMaps(year,hkHolidays){
 const plans=getLeavePlans(year,hkHolidays),leave=new Set(),included=new Set()
 plans.forEach(plan=>{plan.allDates.forEach(d=>included.add(d));plan.leaveDates.forEach(d=>leave.add(d))})
 return {plans,leave,included}
}
