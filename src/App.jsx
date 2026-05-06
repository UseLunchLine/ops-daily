import React, { useState, useEffect } from "react"
import { supabase } from "./supabase.js"
import { LayoutDashboard, PlusCircle, Building2, BarChart3, ShieldCheck, ClipboardList, BookOpen, LogOut, X, Check, CheckCircle, AlertCircle, Eye, EyeOff, Edit2, StickyNote, Plus, Printer, RefreshCw, Menu, CheckSquare, Calendar, Map, CalendarDays } from "lucide-react"

const SCHOOLS=[
  {id:"s1",name:"Adams High School",type:"hs",address:"808 S. Twyckenham Dr, South Bend, IN 46615",phone:"(574) 393-5348"},
  {id:"s3",name:"Riley High School",type:"hs",address:"1902 S. Fellows St, South Bend, IN 46613",phone:"(574) 393-5144"},
  {id:"s2",name:"Washington High School",type:"hs",address:"4747 W. Washington Ave, South Bend, IN 46615",phone:"(574) 393-5547"},
  {id:"s4",name:"Rise Up Academy",type:"hs",address:"740 N. Eddy St, South Bend, IN 46617",phone:"(574) 393-5000"},
  {id:"s23",name:"Clay International Academy",type:"ms",address:"52900 Lily Rd, South Bend, IN 46637",phone:"(574) 393-4318"},
  {id:"s9",name:"Dickson Academy",type:"ms",address:"4404 Elwood Ave, South Bend, IN 46628",phone:"(574) 393-3922"},
  {id:"s10",name:"Edison K-8 School",type:"ms",address:"2701 Eisenhower Dr, South Bend, IN 46615",phone:"(574) 393-4424"},
  {id:"s5",name:"Jackson Middle School",type:"ms",address:"5001 S. Miami St, South Bend, IN 46614",phone:"(574) 393-4521"},
  {id:"s6",name:"Jefferson Traditional School",type:"ms",address:"528 S. Eddy St, South Bend, IN 46617",phone:"(574) 393-4119"},
  {id:"s7",name:"LaSalle Academy",type:"ms",address:"2701 W. Elwood Ave, South Bend, IN 46628",phone:"(574) 393-4721"},
  {id:"s8",name:"Navarre",type:"ms",address:"4702 W. Ford St, South Bend, IN 46619",phone:"(574) 393-4620"},
  {id:"s16",name:"Coquillard Elementary",type:"es",address:"1245 N. Sheridan Ave, South Bend, IN 46628",phone:"(574) 393-2009"},
  {id:"s17",name:"Darden Elementary",type:"es",address:"18645 Janet St, South Bend, IN 46637",phone:"(574) 393-2912"},
  {id:"s15",name:"Harrison Elementary",type:"es",address:"3302 W. Western Ave, South Bend, IN 46619",phone:"(574) 393-3016"},
  {id:"s24",name:"Kennedy Academy",type:"es",address:"609 N. Olive St, South Bend, IN 46628",phone:"(574) 393-3112"},
  {id:"s25",name:"Lafayette Early Childhood Center",type:"es",address:"245 N. Lombardy Dr, South Bend, IN 46619",phone:"(574) 393-5862"},
  {id:"s11",name:"Lincoln Elementary",type:"es",address:"1425 E. Calvert St, South Bend, IN 46613",phone:"(574) 393-2313"},
  {id:"s26",name:"Madison S.T.E.A.M. Academy",type:"es",address:"832 N. Lafayette Blvd, South Bend, IN 46601",phone:"(574) 393-3213"},
  {id:"s21",name:"Marshall Traditional School",type:"es",address:"1433 Byron Dr, South Bend, IN 46614",phone:"(574) 393-2111"},
  {id:"s22",name:"Marquette Montessori Academy",type:"es",address:"1905 College St, South Bend, IN 46628",phone:"(574) 393-2410"},
  {id:"s12",name:"McKinley Elementary",type:"es",address:"228 N. Greenlawn Ave, South Bend, IN 46617",phone:"(574) 393-3313"},
  {id:"s13",name:"Monroe Elementary",type:"es",address:"312 E. Donmoyer Ave, South Bend, IN 46614",phone:"(574) 393-2511"},
  {id:"s14",name:"Muessel Elementary",type:"es",address:"1021 Blaine St, South Bend, IN 46628",phone:"(574) 393-3411"},
  {id:"s18",name:"Nuner Fine Arts Academy",type:"es",address:"2716 Pleasant St, South Bend, IN 46615",phone:"(574) 393-2614"},
  {id:"s4b",name:"Studebaker",type:"es",address:"724 Dubail Ave, South Bend, IN 46614",phone:"(574) 393-6253"},
  {id:"s19",name:"Swanson Traditional School",type:"es",address:"17677 Parker Dr, South Bend, IN 46635",phone:"(574) 393-2709"},
  {id:"s20",name:"Wilson Elementary School",type:"es",address:"56660 Oak Rd, South Bend, IN 46619",phone:"(574) 393-3712"},
  {id:"s27",name:"Brown (Home Office)",type:"office",address:"737 Beale Street, South Bend, IN 46637",phone:"(574) 393-5000"}
]
const TL={hs:"High School",ms:"Middle School",es:"Elementary School",office:"Office"}
const TC={hs:{bg:"#FFF3E0",tx:"#E65100",bd:"#FFB74D"},ms:{bg:"#E8EAF6",tx:"#283593",bd:"#9FA8DA"},es:{bg:"#E8F5E9",tx:"#1B5E20",bd:"#81C784"},office:{bg:"#F1F5F9",tx:"#334155",bd:"#CBD5E1"}}
const STATS=[{id:"green",label:"All Good",c:"#2E7D32",l:"#F1F8E9",b:"#AED581",t:"#33691E"},{id:"yellow",label:"Minor Issues",c:"#F57F17",l:"#FFFDE7",b:"#FFF176",t:"#F57F17"},{id:"red",label:"Major Problems",c:"#C62828",l:"#FFEBEE",b:"#EF9A9A",t:"#B71C1C"},{id:"partial",label:"Partial Service",c:"#6A1B9A",l:"#F3E5F5",b:"#CE93D8",t:"#6A1B9A"},{id:"delayed",label:"Delayed",c:"#00838F",l:"#E0F7FA",b:"#80DEEA",t:"#006064"},{id:"closed",label:"Closed",c:"#37474F",l:"#ECEFF1",b:"#B0BEC5",t:"#263238"}]
const SM=Object.fromEntries(STATS.map(s=>[s.id,s]))
const ISS=[{id:"food_out",label:"Ran out of food"},{id:"low_food",label:"Low food supply"},{id:"staffing",label:"Staffing issue"},{id:"equip",label:"Equipment issue"},{id:"delivery",label:"Delivery problem"},{id:"health",label:"Health/Safety"},{id:"power",label:"Power/Utilities"},{id:"behavior",label:"Student behavior"},{id:"pest",label:"Pest/Sanitation"},{id:"weather",label:"Weather-related"}]
const RC={admin:{bg:"#EDE7F6",t:"#4527A0"},director:{bg:"#E8EAF6",t:"#283593"},supervisor:{bg:"#E1F5FE",t:"#01579B"},chef:{bg:"#FFF3E0",t:"#E65100"},kitchen_manager:{bg:"#F0FDF4",t:"#15803D"}}
const CTB={calloff:{bg:"#E3F2FD",tx:"#1565C0",label:"Call-Off"},sick:{bg:"#FFFDE7",tx:"#F57F17",label:"Sick Day"},ncns:{bg:"#FFEBEE",tx:"#C62828",label:"No Call No Show"},tardy:{bg:"#FFF3E0",tx:"#E65100",label:"Tardy"}}
const DIR_ROLES=[{id:"all",label:"All",color:"#546E7A",bg:"#ECEFF1"},{id:"manager",label:"Managers",color:"#1565C0",bg:"#E3F2FD"},{id:"chef",label:"Chefs",color:"#E65100",bg:"#FFF3E0"},{id:"director",label:"Directors",color:"#6A1B9A",bg:"#F3E5F5"},{id:"asst_dir",label:"Asst. Directors",color:"#006064",bg:"#E0F7FA"},{id:"supervisor",label:"Op Supervisors",color:"#1B5E20",bg:"#E8F5E9"},{id:"csa",label:"CSAs",color:"#4E342E",bg:"#EFEBE9"},{id:"ppa",label:"PPAs",color:"#283593",bg:"#E8EAF6"},{id:"temp",label:"Temp Staff",color:"#7B1FA2",bg:"#F3E5F5"}]
const EMPTY_ENTRY={name:"",position:"",role_type:"manager",school_ids:[],phone:"",email:"",is_active:true,is_temp:false,temp_end_date:""}
const TODAY=new Date().toISOString().slice(0,10)
const uid=()=>Math.random().toString(36).slice(2,8)
const fd=d=>new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
const ft=ts=>new Date(ts).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})
const fmt=t=>{if(!t)return "";const[h,m]=t.split(":");const hr=parseInt(h);return(hr===0?12:hr>12?hr-12:hr)+":"+m+(hr<12?" AM":" PM")}

async function callAI(messages,systemPrompt=""){
  try{
    const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,...(systemPrompt?{system:systemPrompt}:{}),messages})})
    const data=await res.json()
    return data.content?.[0]?.text||null
  }catch{return null}
}

const SU=[{id:"u1",name:"Admin User",email:"admin@demo.com",password:"demo",role:"admin",is_active:true},{id:"u2",name:"Maria Garcia",email:"mgarcia@demo.com",password:"demo",role:"supervisor",is_active:true},{id:"u3",name:"James Wilson",email:"jwilson@demo.com",password:"demo",role:"director",is_active:true},{id:"u4",name:"Sarah Chen",email:"schen@demo.com",password:"demo",role:"chef",is_active:true},{id:"u5",name:"Robert Davis",email:"rdavis@demo.com",password:"demo",role:"chef",is_active:true}]
const SS=SCHOOLS.map((s,i)=>({...s,chef_id:i<4?"u4":i<8?"u5":null,director_id:i<6?"u3":null,supervisor_id:i<10?"u2":null}))
const SR=[
  {id:"r1",date:TODAY,school_id:"s1",status:"green",issues:[],custom_issues:[],note:"Smooth service all around.",created_by:"u4",created_at:new Date().toISOString(),resolved:false,resolution_note:""},
  {id:"r2",date:TODAY,school_id:"s5",status:"yellow",issues:["food_out"],custom_issues:[],note:"Ran short on pizza slices.",created_by:"u2",created_at:new Date(Date.now()-3e5).toISOString(),resolved:false,resolution_note:""},
  {id:"r3",date:TODAY,school_id:"s2",status:"red",issues:["staffing","equip"],custom_issues:["Freezer alarm"],note:"Oven down, 2 staff out.",created_by:"u3",created_at:new Date(Date.now()-6e5).toISOString(),resolved:false,resolution_note:""},
  {id:"r4",date:TODAY,school_id:"s9",status:"delayed",issues:["delivery"],custom_issues:[],note:"Delivery 45 min late.",created_by:"u4",created_at:new Date(Date.now()-9e5).toISOString(),resolved:true,resolution_note:"Delivery arrived, service started at 11:30am."},
  {id:"r5",date:TODAY,school_id:"s3",status:"green",issues:[],custom_issues:[],note:null,created_by:"u5",created_at:new Date(Date.now()-1.2e6).toISOString(),resolved:false,resolution_note:""},
  {id:"r6",date:TODAY,school_id:"s11",status:"partial",issues:["staffing"],custom_issues:[],note:"Served cold items only.",created_by:"u2",created_at:new Date(Date.now()-1.5e6).toISOString(),resolved:false,resolution_note:""}
]
const SC=[
  {id:"c1",date:TODAY,school_id:"s2",staff_name:"Tom Bradley",staff_role:"Cook",type:"sick",note:"Flu symptoms",created_by:"u3",created_at:new Date(Date.now()-2e5).toISOString()},
  {id:"c2",date:TODAY,school_id:"s5",staff_name:"Lisa Ray",staff_role:"Manager",type:"calloff",note:"",created_by:"u2",created_at:new Date(Date.now()-5e5).toISOString()},
  {id:"c3",date:TODAY,school_id:"s9",staff_name:"Mike Jones",staff_role:"Cook",type:"ncns",note:"No response to calls",created_by:"u4",created_at:new Date(Date.now()-8e5).toISOString()}
]
const SD=[
  {id:"d1",name:"Maria Garcia",position:"Operations Supervisor",role_type:"supervisor",school_ids:["s5"],phone:"(574) 555-0101",email:"mgarcia@sbcsc.edu",is_active:true},
  {id:"d2",name:"James Wilson",position:"Director",role_type:"director",school_ids:["s1","s2"],phone:"(574) 555-0102",email:"jwilson@sbcsc.edu",is_active:true},
  {id:"d3",name:"Sarah Chen",position:"Chef",role_type:"chef",school_ids:["s1"],phone:"(574) 555-0103",email:"schen@sbcsc.edu",is_active:true},
  {id:"d4",name:"Robert Davis",position:"Chef",role_type:"chef",school_ids:["s5","s6"],phone:"(574) 555-0104",email:"rdavis@sbcsc.edu",is_active:true},
  {id:"d5",name:"Lisa Thompson",position:"Manager",role_type:"manager",school_ids:["s2"],phone:"(574) 555-0105",email:"lthompson@sbcsc.edu",is_active:true},
  {id:"d6",name:"Carlos Mendez",position:"Asst. Director",role_type:"asst_dir",school_ids:["s9"],phone:"(574) 555-0106",email:"cmendez@sbcsc.edu",is_active:true},
  {id:"d7",name:"Angela Brooks",position:"CSA",role_type:"csa",school_ids:["s3"],phone:"(574) 555-0107",email:"abrooks@sbcsc.edu",is_active:true},
  {id:"d8",name:"Derek Patel",position:"PPA",role_type:"ppa",school_ids:["s6"],phone:"(574) 555-0108",email:"dpatel@sbcsc.edu",is_active:true}
]

const C={primary:"#2563EB",surface:"#FFFFFF",border:"#E2E8F0",text:"#0F172A",textMuted:"#64748B",textLight:"#94A3B8",bg:"#F8FAFC"}
const R={sm:8,md:12,lg:16,xl:20,full:9999}
const SH={sm:"0 1px 3px rgba(0,0,0,.08)",md:"0 4px 12px rgba(0,0,0,.08)",lg:"0 8px 24px rgba(0,0,0,.10)"}
const inp={width:"100%",padding:"10px 14px",border:"1px solid #E2E8F0",borderRadius:R.md,fontSize:14,background:"#fff",color:"#0F172A",outline:"none",boxSizing:"border-box",fontFamily:"inherit"}
const lbl={fontSize:11,fontWeight:700,color:"#64748B",textTransform:"uppercase",letterSpacing:".07em",display:"block",marginBottom:6}

const Pill=({bg,tx,bd,children})=><span style={{background:bg,color:tx,border:"1px solid "+(bd||bg),padding:"2px 10px",borderRadius:R.full,fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",whiteSpace:"nowrap"}}>{children}</span>
const RP=({role})=>{const c=RC[role]||{bg:"#F1F5F9",t:"#64748B"};return <Pill bg={c.bg} tx={c.t}>{role}</Pill>}
const SBadge=({status})=>{const s=SM[status];if(!s)return null;return <Pill bg={s.l} tx={s.t} bd={s.b}>{s.label}</Pill>}
const L=({children})=><label style={lbl}>{children}</label>
const Inp=({value,onChange,placeholder,type="text"})=><input type={type} value={value} onChange={onChange} placeholder={placeholder} style={inp}/>
const Sel=({value,onChange,children})=><select value={value} onChange={onChange} style={{...inp,cursor:"pointer"}}>{children}</select>
const Box=({children,style={}})=><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:R.lg,padding:20,boxShadow:SH.sm,...style}}>{children}</div>
const SG=({schools,value,onChange,all=""})=><Sel value={value} onChange={onChange}>{all?<option value="">{all}</option>:<option value="">-- Select a school --</option>}{Object.entries(TL).map(([t,tl])=><optgroup key={t} label={tl}>{schools.filter(s=>s.type===t).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>)}</Sel>

const Btn=({onClick,children,variant="primary",sm=false,disabled=false})=>{
  const V={primary:{background:"#2563EB",color:"#fff",border:"none"},outline:{background:"#fff",color:"#64748B",border:"1px solid #E2E8F0"},danger:{background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA"},success:{background:"#F0FDF4",color:"#15803D",border:"1px solid #BBF7D0"}}
  const v=V[variant]||V.primary
  return <button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",gap:6,padding:sm?"7px 14px":"10px 20px",borderRadius:R.md,fontSize:sm?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,fontFamily:"inherit",...v}}>{children}</button>
}
const AIBtn=({onClick,loading,children})=><button onClick={onClick} disabled={loading} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:R.md,fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",opacity:loading?.6:1,border:"none",background:"#7C3AED",color:"#fff",whiteSpace:"nowrap",flexShrink:0,fontFamily:"inherit"}}>{children}</button>
const TabBar=({tabs,active,set})=><div style={{display:"flex",gap:4,background:"#F1F5F9",padding:4,borderRadius:R.lg,width:"fit-content",flexWrap:"wrap",marginBottom:24}}>{tabs.map(t=><button key={t.id} onClick={()=>set(t.id)} style={{padding:"8px 18px",borderRadius:R.md,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap",background:active===t.id?"#fff":"transparent",color:active===t.id?C.text:C.textMuted,boxShadow:active===t.id?SH.sm:"none",fontFamily:"inherit"}}>{t.label}</button>)}</div>
const AISummaryBox=({text})=>(
  <div style={{background:"#F5F3FF",border:"1px solid #DDD6FE",borderRadius:R.lg,padding:20,marginBottom:20}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
      <div style={{width:32,height:32,borderRadius:R.md,background:"#7C3AED",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#fff",fontWeight:900,fontSize:13}}>AI</span></div>
      <span style={{fontWeight:700,fontSize:14,color:"#4C1D95"}}>AI Summary</span>
    </div>
    <p style={{fontSize:14,color:C.text,lineHeight:1.75,margin:0}}>{text}</p>
  </div>
)
const PageHeader=({title,subtitle,action})=>(
  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:28}}>
    <div>
      <h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:"0 0 4px",letterSpacing:"-.3px"}}>{title}</h1>
      {subtitle&&<p style={{fontSize:13,color:C.textMuted,margin:0}}>{subtitle}</p>}
    </div>
    {action}
  </div>
)
const Toast=({msg,type="success"})=>msg?(
  <div style={{position:"fixed",top:20,right:20,zIndex:999,background:type==="success"?"#F0FDF4":"#FEF2F2",border:"1px solid "+(type==="success"?"#BBF7D0":"#FECACA"),color:type==="success"?"#15803D":"#DC2626",padding:"12px 20px",borderRadius:R.lg,fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:10,boxShadow:SH.lg,animation:"slideIn .2s ease"}}>
    {type==="success"?<CheckCircle size={18}/>:<AlertCircle size={18}/>}{msg}
  </div>
):null

function useToast(){
  const [msg,setMsg]=useState("")
  const [type,setType]=useState("success")
  const show=(m,t="success")=>{setMsg(m);setType(t);setTimeout(()=>setMsg(""),3500)}
  return{msg,type,show}
}

function ResolveModal({recap,onClose,onResolve}){
  const [note,setNote]=useState(recap.resolution_note||"")
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,zIndex:100}}>
      <div style={{background:"#fff",borderRadius:R.xl,width:"100%",maxWidth:440,boxShadow:SH.lg,padding:24}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <span style={{fontWeight:800,fontSize:16,color:C.text}}>Mark as Resolved</span>
          <button onClick={onClose} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,cursor:"pointer",color:C.textMuted,display:"flex",padding:8}}><X size={15}/></button>
        </div>
        <div style={{marginBottom:16}}>
          <L>Resolution Note (optional)</L>
          <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Describe how the issue was resolved..." style={{...inp,resize:"vertical",lineHeight:1.6}}/>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={onClose} variant="outline">Cancel</Btn>
          <Btn onClick={()=>onResolve(note)} variant="success"><CheckSquare size={15}/> Mark Resolved</Btn>
        </div>
      </div>
    </div>
  )
}

export default function App(){
  const [users]=useState(SU)
  const [schools,setSchools]=useState(SS)
  const [recaps,setRecaps]=useState([])
  const [calloffs,setCalloffs]=useState([])
  const [directory,setDirectory]=useState([])
  const [supaUsers,setSupaUsers]=useState([])
  const [events,setEvents]=useState([])
  const [dbReady,setDbReady]=useState(false)
  const [user,setUser]=useState(null)
  const [authLoading,setAuthLoading]=useState(true)

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){
        supabase.from("app_users").select("*").eq("id",session.user.id).maybeSingle().then(({data})=>{
          setUser({id:session.user.id,name:data?.name||session.user.email.split("@")[0],email:session.user.email,role:data?.role||"admin",school_ids:data?.school_ids||[],is_active:true})
        }).catch(()=>{
          setUser({id:session.user.id,name:session.user.email.split("@")[0],email:session.user.email,role:"admin",is_active:true,school_ids:[]})
        }).finally(()=>setAuthLoading(false))
      } else {
        setAuthLoading(false)
      }
    }).catch(()=>setAuthLoading(false))

    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){
        supabase.from("app_users").select("*").eq("id",session.user.id).maybeSingle().then(({data})=>{
          setUser({id:session.user.id,name:data?.name||session.user.email.split("@")[0],email:session.user.email,role:data?.role||"admin",school_ids:data?.school_ids||[],is_active:true})
          setAuthLoading(false)
        }).catch(()=>{
          setUser({id:session.user.id,name:session.user.email.split("@")[0],email:session.user.email,role:"admin",is_active:true,school_ids:[]})
          setAuthLoading(false)
        })
      } else {
        setUser(null)
        setAuthLoading(false)
      }
    })
    return()=>subscription.unsubscribe()
  },[])

  useEffect(()=>{
    async function loadData(){
      const [r,co,d,su,ev,sa]=await Promise.all([
        supabase.from("recaps").select("*").order("created_at",{ascending:false}),
        supabase.from("calloffs").select("*").order("created_at",{ascending:false}),
        supabase.from("directory").select("*").order("name"),
        supabase.from("app_users").select("*").order("name"),
        supabase.from("events").select("*").order("date"),
        supabase.from("school_assignments").select("*")
      ])
      if(r.data)setRecaps(r.data)
      if(co.data)setCalloffs(co.data)
      if(d.data!==null)setDirectory(d.data)
      if(su.data)setSupaUsers(su.data)
      if(ev&&ev.data)setEvents(ev.data)
      if(sa&&sa.data&&sa.data.length>0){
        setSchools(p=>p.map(s=>{
          const a=sa.data.find(x=>x.school_id===s.id)
          return a?{...s,chef_id:a.chef_id||null,director_id:a.director_id||null,supervisor_id:a.supervisor_id||null}:s
        }))
      }
      setDbReady(true)
    }
    loadData()
  },[])
  const [page,setPage]=useState(()=>sessionStorage.getItem('ops_page')||"dashboard")
  const [ctx,setCtx]=useState(null)
  const [sideOpen,setSideOpen]=useState(false)
  const [menuOpen,setMenuOpen]=useState(false)
  const go=(pg,c=null)=>{setPage(pg);sessionStorage.setItem('ops_page',pg);if(c)setCtx(c)}
  const [mobile,setMobile]=useState(window.innerWidth<768)
  const toast=useToast()
  useEffect(()=>{const fn=()=>setMobile(window.innerWidth<768);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn)},[])

  if(authLoading)return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"system-ui",color:"#64748B",gap:12,background:"#F8FAFC"}}>
      <div style={{width:40,height:40,borderRadius:10,background:"#111",border:"3px solid #3B82F6",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{width:18,height:18,borderRadius:"50%",border:"3px solid #fff"}}></div>
      </div>
      <div style={{fontSize:14,fontWeight:600}}>Loading Ops Daily...</div>
    </div>
  )
  if(!user)return <Login/>
  const isKM=user.role==="kitchen_manager"
  const perms={submit:!isKM,report:user.role!=="chef"&&!isKM,calloffs:user.role!=="chef"&&!isKM,directory:true,admin:user.role==="admin",kitchen:true}
  const sById=id=>schools.find(s=>s.id===id)
  const uById=id=>users.find(u=>u.id===id)||supaUsers.find(u=>u.id===id)||{name:"--"}

  const navItems=isKM?[
    {id:"kitchen",label:"Kitchen Hub",short:"Hub",I:ClipboardList},
    {id:"directory",label:"Directory",short:"Dir",I:BookOpen},
    {id:"announcements",label:"Announcements",short:"News",I:CalendarDays},
  ]:[
    {id:"dashboard",label:"Dashboard",short:"Home",I:LayoutDashboard},
    {id:"submit",label:"Submit Recap",short:"Submit",I:PlusCircle},
    {id:"school",label:"School Detail",short:"School",I:Building2},
    ...(perms.report?[{id:"report",label:"Monthly Report",short:"Report",I:BarChart3}]:[]),
    ...(perms.calloffs?[{id:"calloffs",label:"Call-Offs",short:"Calls",I:ClipboardList}]:[]),
    {id:"directory",label:"Directory",short:"Dir",I:BookOpen},
    {id:"map",label:"School Map",short:"Map",I:Map},
    {id:"events",label:"Meetings & Events",short:"Events",I:CalendarDays},
    {id:"kitchen",label:"Kitchen Hub",short:"Kitchen",I:ClipboardList},
    {id:"inbox",label:"Kitchen Messages",short:"Messages",I:StickyNote},
    ...(perms.admin?[{id:"admin",label:"Admin Panel",short:"Admin",I:ShieldCheck}]:[]),
  ]

  const props={toast,user,schools,setSchools,recaps,setRecaps,calloffs,setCalloffs,directory,setDirectory,users,supaUsers,setSupaUsers,events,setEvents,go,sById,uById,ctx,isAdmin:perms.admin}

  const PageEl=()=>{
    if(page==="dashboard")return <DashPage {...props}/>
    if(page==="submit") return <SubmitPage {...props}/>
    if(page==="school") return <SchoolPage {...props}/>
    if(page==="report") return <ReportPage {...props}/>
    if(page==="calloffs") return <CalloffsPage {...props}/>
    if(page==="directory")return <DirPage {...props}/>
    if(page==="map")return <MapPage {...props}/>
    if(page==="events")return <EventsPage {...props}/>
    if(page==="kitchen")return <KitchenPage {...props}/>
    if(page==="announcements")return <KitchenPage {...props} kmAnnouncementsOnly={true}/>
    if(page==="inbox")return <InboxPage {...props}/>
    if(page==="admin") return <AdminPage {...props}/>
    return null
  }

  if(mobile){
    const currentNav=navItems.find(n=>n.id===page)||navItems[0]
    return(
      <div style={{background:C.bg,minHeight:"100vh",fontFamily:"system-ui,sans-serif"}}>
        <style>{"@keyframes slideIn{from{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}"}</style>
        <Toast msg={toast.msg} type={toast.type}/>
        <div style={{background:"#fff",borderBottom:"1px solid #E2E8F0",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:30,boxShadow:SH.sm}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setMenuOpen(v=>!v)} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,color:C.text,cursor:"pointer",display:"flex",padding:8}}>
              <Menu size={18}/>
            </button>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:26,height:26,borderRadius:7,background:"#111",border:"2.5px solid #3B82F6",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:12,height:12,borderRadius:"50%",border:"2.5px solid #fff"}}></div>
              </div>
              <span style={{fontWeight:900,fontSize:14,letterSpacing:"-.3px"}}>
                <span style={{color:"#111"}}>OPS</span><span style={{color:"#3B82F6"}}>DAILY</span>
              </span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:12,fontWeight:700,color:C.textMuted,maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentNav?.label}</span>
          </div>
        </div>

        {menuOpen&&<>
          <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:40,animation:"fadeIn .15s ease"}}/>
          <div style={{position:"fixed",top:0,left:0,bottom:0,width:260,background:"#fff",zIndex:50,boxShadow:"4px 0 24px rgba(0,0,0,.15)",display:"flex",flexDirection:"column",animation:"slideIn .2s ease"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid #E2E8F0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:28,borderRadius:8,background:"#111",border:"2.5px solid #3B82F6",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:13,height:13,borderRadius:"50%",border:"2.5px solid #fff"}}></div>
                </div>
                <span style={{fontWeight:900,fontSize:15}}><span style={{color:"#111"}}>OPS</span><span style={{color:"#3B82F6"}}>DAILY</span></span>
              </div>
              <button onClick={()=>setMenuOpen(false)} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,cursor:"pointer",color:C.textMuted,display:"flex",padding:7}}><X size={15}/></button>
            </div>
            <div style={{padding:"10px 12px",background:"#F8FAFC",margin:"10px 12px",borderRadius:R.md,border:"1px solid #E2E8F0"}}>
              <div style={{fontSize:12,color:C.text,fontWeight:700}}>{user.name||user.email}</div>
              <div style={{marginTop:4}}><RP role={user.role}/></div>
            </div>
            <nav style={{flex:1,overflowY:"auto",padding:"4px 8px"}}>
              {navItems.map(({id,label,I})=>{const a=page===id;return(
                <button key={id} onClick={()=>{go(id);setMenuOpen(false)}} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:R.md,border:"none",background:a?"#EFF6FF":"transparent",color:a?"#2563EB":C.textMuted,cursor:"pointer",fontSize:14,fontWeight:a?700:500,marginBottom:2,fontFamily:"inherit",textAlign:"left"}}>
                  <I size={18} style={{flexShrink:0}}/>{label}
                </button>
              )})}
            </nav>
            <div style={{padding:"12px",borderTop:"1px solid #E2E8F0"}}>
              <button onClick={async()=>{await supabase.auth.signOut()}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:"#FEF2F2",border:"none",borderRadius:R.md,color:"#DC2626",cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"inherit"}}>
                <LogOut size={16}/>Sign Out
              </button>
            </div>
          </div>
        </>}

        <div style={{padding:"12px 14px",paddingBottom:32}}><PageEl/></div>
      </div>
    )
  }

  return(
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"system-ui,sans-serif",width:"100%"}}>
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
      <Toast msg={toast.msg} type={toast.type}/>
      <aside style={{width:sideOpen?220:60,transition:"width .2s",background:"#fff",borderRight:"1px solid #E2E8F0",display:"flex",flexDirection:"column",flexShrink:0,position:"sticky",top:0,height:"100vh",overflow:"hidden",boxShadow:"2px 0 8px rgba(0,0,0,.04)"}}>
        <div style={{height:60,display:"flex",alignItems:"center",padding:"0 12px",gap:10,borderBottom:"1px solid #E2E8F0",flexShrink:0}}>
          <button onClick={()=>setSideOpen(v=>!v)} style={{width:36,height:36,borderRadius:R.md,background:"#F8FAFC",border:"1px solid #E2E8F0",color:C.textMuted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Menu size={16}/></button>
          {sideOpen&&<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:22,height:22,borderRadius:6,background:"#111",border:"2px solid #3B82F6",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:10,height:10,borderRadius:"50%",border:"2px solid #fff"}}></div></div><span style={{fontWeight:900,fontSize:13,letterSpacing:"-.3px"}}><span style={{color:"#111"}}>OPS</span><span style={{color:"#3B82F6"}}>DAILY</span></span></div>}
        </div>
        <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:1,overflowY:"auto"}}>
          {navItems.map(({id,label,I})=>{
            const a=page===id
            return <button key={id} onClick={()=>go(id)} title={!sideOpen?label:undefined}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:R.md,border:"none",background:a?"#EFF6FF":"transparent",color:a?"#2563EB":C.textMuted,cursor:"pointer",fontSize:13,fontWeight:a?700:500,justifyContent:sideOpen?"flex-start":"center",whiteSpace:"nowrap",width:"100%",fontFamily:"inherit"}}>
              <I size={17} style={{flexShrink:0}}/>{sideOpen&&label}
            </button>
          })}
        </nav>
        <div style={{padding:"8px",borderTop:"1px solid #E2E8F0",flexShrink:0}}>
          {sideOpen&&<div style={{padding:"8px 10px",background:"#F8FAFC",borderRadius:R.md,marginBottom:4,border:"1px solid #E2E8F0"}}>
            <div style={{color:C.text,fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
            <div style={{marginTop:3}}><RP role={user.role}/></div>
          </div>}
          <button onClick={async()=>{await supabase.auth.signOut()}} title={!sideOpen?"Sign Out":undefined} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:sideOpen?"flex-start":"center",gap:10,padding:"9px 10px",background:"transparent",border:"none",color:C.textMuted,cursor:"pointer",borderRadius:R.md,fontSize:13,fontWeight:500,fontFamily:"inherit"}}>
            <LogOut size={16}/>{sideOpen&&"Sign Out"}
          </button>
        </div>
      </aside>
      <main style={{flex:1,background:C.bg,overflowX:"hidden",minWidth:0}}><PageEl/></main>
    </div>
  )
}

function Login(){
  const [email,setEmail]=useState("")
  const [pw,setPw]=useState("")
  const [show,setShow]=useState(false)
  const [err,setErr]=useState("")
  const [loading,setLoading]=useState(false)
  const try_=async(e,p)=>{
    setLoading(true);setErr("")
    const {error}=await supabase.auth.signInWithPassword({email:e,password:p})
    if(error){setErr("Invalid email or password.");setLoading(false);return}
    setLoading(false)
  }
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#EFF6FF 0%,#F5F3FF 100%)",padding:16,fontFamily:"system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",gap:10}}><div style={{width:52,height:52,borderRadius:14,background:"#111",border:"3px solid #3B82F6",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 24px rgba(59,130,246,.3)"}}><div style={{width:24,height:24,borderRadius:"50%",border:"3px solid #fff",background:"transparent"}}></div></div></div>
          <h1 style={{fontSize:26,fontWeight:900,color:C.text,margin:"0 0 4px"}}>Ops Daily</h1>
          <p style={{fontSize:13,color:C.textMuted,margin:0}}>South Bend Community School Corporation</p>
        </div>
        <Box style={{boxShadow:SH.lg,borderRadius:R.xl,padding:24}}>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div><L>Email</L><Inp type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@sbcsc.k12.in.us"/></div>
            <div><L>Password</L>
              <div style={{position:"relative"}}>
                <input type={show?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" style={{...inp,paddingRight:40}}/>
                <button onClick={()=>setShow(v=>!v)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.textLight,display:"flex"}}>{show?<EyeOff size={14}/>:<Eye size={14}/>}</button>
              </div>
            </div>
            {err&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626",padding:"9px 12px",borderRadius:R.md,fontSize:13,display:"flex",alignItems:"center",gap:8}}><AlertCircle size={14}/>{err}</div>}
            <button onClick={()=>try_(email,pw)} disabled={loading} style={{padding:11,borderRadius:R.md,background:"#2563EB",color:"#fff",fontWeight:700,fontSize:14,border:"none",cursor:loading?"not-allowed":"pointer",opacity:loading?.7:1,fontFamily:"inherit"}}>{loading?"Signing in...":"Sign In"}</button>
          </div>
          <p style={{textAlign:"center",fontSize:11,color:C.textLight,marginTop:14}}>Contact your administrator for access.</p>
        </Box>
      </div>
    </div>
  )
}

function DashPage({recaps,setRecaps,schools,users,go,sById,uById,toast,user,isAdmin}){
  const [dateFrom,setDateFrom]=useState(TODAY)
  const [dateTo,setDateTo]=useState(TODAY)
  const [fSchool,setFSchool]=useState("")
  const [fStatus,setFStatus]=useState("")
  const [on,setOn]=useState(new Set())
  const [mobile,setMobile]=useState(window.innerWidth<768)
  const [resolveId,setResolveId]=useState(null)
  useEffect(()=>{const fn=()=>setMobile(window.innerWidth<768);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn)},[])

  const filtered=recaps.filter(r=>{
    const inRange=(!dateFrom||r.date>=dateFrom)&&(!dateTo||r.date<=dateTo)
    const inSchool=!fSchool||r.school_id===fSchool
    const inStatus=!fStatus||r.status===fStatus
    return inRange&&inSchool&&inStatus
  }).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))

  const counts=STATS.reduce((a,s)=>({...a,[s.id]:filtered.filter(r=>r.status===s.id).length}),{})
  const tog=id=>setOn(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n})
  const totalShown=filtered.length
  const goodShown=filtered.filter(r=>r.status==="green").length
  const issueShown=filtered.filter(r=>r.status==="red"||r.status==="yellow").length

  const handleResolve=async(rid,note)=>{
    setRecaps(p=>p.map(x=>x.id===rid?{...x,resolved:true,resolution_note:note}:x))
    await supabase.from("recaps").update({resolved:true,resolution_note:note}).eq("id",rid)
    toast.show("Issue marked as resolved!")
  }

  const handleDeleteRecap=async(r)=>{
    const canDelete=isAdmin||r.created_by===user?.id
    if(!canDelete){toast.show("You can only delete your own recaps.","error");return}
    if(!window.confirm("Delete this recap? This cannot be undone."))return
    const{error}=await supabase.from("recaps").delete().eq("id",r.id)
    if(error){toast.show("Delete failed.","error");return}
    setRecaps(p=>p.filter(x=>x.id!==r.id))
    toast.show("Recap deleted.")
  }

  const reset=()=>{setDateFrom(TODAY);setDateTo(TODAY);setFSchool("");setFStatus("")}
  const isMultiDay=dateFrom!==dateTo

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Dashboard" subtitle={isMultiDay?fd(dateFrom)+" to "+fd(dateTo):fd(dateFrom)+" - "+totalShown+" recap"+(totalShown!==1?"s":"")} action={<Btn onClick={()=>go("submit")}><PlusCircle size={14}/> Submit Recap</Btn>}/>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
        {[{label:"Total Recaps",val:totalShown,color:"#2563EB",bg:"#EFF6FF",bd:"#BFDBFE"},{label:"All Good",val:goodShown,color:"#16A34A",bg:"#F0FDF4",bd:"#BBF7D0"},{label:"Need Attention",val:issueShown,color:"#DC2626",bg:"#FEF2F2",bd:"#FECACA"}].map(c=>(
          <div key={c.label} style={{background:c.bg,borderRadius:R.lg,padding:"16px 18px",border:"1px solid "+c.bd}}>
            <div style={{fontSize:28,fontWeight:900,color:c.color,lineHeight:1}}>{c.val}</div>
            <div style={{fontSize:12,fontWeight:600,color:C.textMuted,marginTop:4}}>{c.label}</div>
          </div>
        ))}
      </div>

      <Box style={{marginBottom:16,padding:"14px 18px"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"flex-end"}}>
          <div>
            <L>From Date</L>
            <input type="date" value={dateFrom} onChange={e=>{setDateFrom(e.target.value);if(e.target.value>dateTo)setDateTo(e.target.value)}} style={{...inp,width:"100%",maxWidth:180}}/>
          </div>
          <div>
            <L>To Date</L>
            <input type="date" value={dateTo} onChange={e=>{setDateTo(e.target.value);if(e.target.value<dateFrom)setDateFrom(e.target.value)}} style={{...inp,width:"100%",maxWidth:180}}/>
          </div>
          <div style={{flex:"1 1 160px",maxWidth:260}}>
            <L>School</L>
            <SG schools={schools} value={fSchool} onChange={e=>setFSchool(e.target.value)} all="All Schools"/>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",paddingBottom:2}}>
            <button onClick={()=>{setDateFrom(TODAY);setDateTo(TODAY)}} style={{padding:"5px 10px",borderRadius:R.md,border:"1px solid #E2E8F0",background:"#fff",color:C.textMuted,cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>Today</button>
            <button onClick={()=>{const d=new Date();d.setDate(d.getDate()-6);setDateFrom(d.toISOString().slice(0,10));setDateTo(TODAY)}} style={{padding:"5px 10px",borderRadius:R.md,border:"1px solid #E2E8F0",background:"#fff",color:C.textMuted,cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>Last 7 Days</button>
            <button onClick={()=>{const d=new Date();d.setDate(1);setDateFrom(d.toISOString().slice(0,10));setDateTo(TODAY)}} style={{padding:"5px 10px",borderRadius:R.md,border:"1px solid #E2E8F0",background:"#fff",color:C.textMuted,cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>This Month</button>
            <Btn onClick={reset} variant="outline" sm><RefreshCw size={11}/> Reset</Btn>
          </div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:12}}>
          {STATS.map(s=><button key={s.id} onClick={()=>setFStatus(fStatus===s.id?"":s.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:R.full,fontSize:11,fontWeight:600,cursor:"pointer",border:"1.5px solid "+(fStatus===s.id?s.c:C.border),background:fStatus===s.id?s.c:"#fff",color:fStatus===s.id?"#fff":C.textMuted,fontFamily:"inherit"}}>
            {s.label}<span style={{background:fStatus===s.id?"rgba(255,255,255,.25)":"rgba(0,0,0,.06)",borderRadius:R.full,padding:"0 5px",fontSize:10,fontWeight:700}}>{counts[s.id]||0}</span>
          </button>)}
        </div>
      </Box>

      {mobile?(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.length===0?<Box style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontWeight:600,color:C.textMuted}}>No recaps found</div></Box>
          :filtered.flatMap(r=>{
            const sch=sById(r.school_id),cr=uById(r.created_by)
            const st=SM[r.status]||SM.green
            const ai=[...(r.issues||[]).map(id=>ISS.find(p=>p.id===id)?.label).filter(Boolean),...(r.custom_issues||[])]
            const hn=!!r.note,no=on.has(r.id)
            const needsResolve=r.status!=="green"&&!r.resolved
                        return [
              <div key={r.id}>
                {resolveId===r.id&&<ResolveModal recap={r} onClose={()=>setResolveId(null)} onResolve={(note)=>{handleResolve(r.id,note);setResolveId(null)}}/>}
                <Box style={{padding:14,borderLeft:"4px solid "+(r.resolved?"#16A34A":st.c)}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:8}}>
                    <button onClick={()=>go("school",{school:sch})} style={{background:"none",border:"none",cursor:"pointer",color:C.text,fontWeight:700,fontSize:14,padding:0,textAlign:"left",fontFamily:"inherit"}}>{sch?.name||"--"}</button>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                      {r.resolved?<Pill bg="#F0FDF4" tx="#15803D" bd="#BBF7D0">Resolved</Pill>:<SBadge status={r.status}/>}
                      {sch&&TC[sch.type]&&<Pill bg={TC[sch.type].bg} tx={TC[sch.type].tx} bd={TC[sch.type].bd}>{TL[sch.type]}</Pill>}
                    </div>
                  </div>
                  {ai.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:8}}>{ai.map(i=><span key={i} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",color:C.textMuted,padding:"2px 7px",borderRadius:5,fontSize:11,fontWeight:600}}>{i}</span>)}</div>}
                  {r.resolved&&r.resolution_note&&<div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:R.md,padding:"6px 10px",fontSize:11,color:"#15803D",marginBottom:8}}>Resolution: {r.resolution_note}</div>}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                    <div style={{fontSize:11,color:C.textMuted}}><span style={{fontWeight:700,color:C.text}}>{cr?.name||"--"}</span> - {isMultiDay?fd(r.date)+" ":""}{ft(r.created_at)}</div>
                    <div style={{display:"flex",gap:4}}>
                      {hn&&<button onClick={()=>tog(r.id)} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:R.md,border:"1px solid #E2E8F0",cursor:"pointer",fontSize:11,fontWeight:600,background:no?"#EFF6FF":"#fff",color:no?"#2563EB":C.textMuted,fontFamily:"inherit"}}><StickyNote size={10}/>{no?"Hide":"Note"}</button>}
                      {needsResolve&&<button onClick={()=>setResolveId(r.id)} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:R.md,border:"1px solid #BBF7D0",cursor:"pointer",fontSize:11,fontWeight:600,background:"#F0FDF4",color:"#15803D",fontFamily:"inherit"}}><CheckSquare size={10}/>Resolve</button>}
                      {(isAdmin||r.created_by===user.id)&&<button onClick={()=>handleDeleteRecap(r)} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:R.md,border:"1px solid #FECACA",cursor:"pointer",fontSize:11,fontWeight:600,background:"#FEF2F2",color:"#DC2626",fontFamily:"inherit"}}><X size={10}/>Delete</button>}
                    </div>
                  </div>
                </Box>
              </div>,
              hn&&no&&<div key={r.id+"n"} style={{marginTop:-6,paddingBottom:4}}><div style={{padding:"8px 14px",borderRadius:R.md,fontSize:12,color:C.text,background:"#F0F9FF",borderLeft:"3px solid #2563EB",lineHeight:1.6,margin:"0 4px"}}>{r.note}</div></div>
            ].filter(Boolean)
          })}
        </div>
      ):(
        <Box style={{padding:0,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"#F8FAFC",borderBottom:"2px solid #E2E8F0"}}>
                  {["School","Type","Status","Issues","Submitted By",isMultiDay?"Date":"Time","Action"].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:11,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length===0?(
                  <tr><td colSpan={7} style={{textAlign:"center",padding:"48px 0",color:C.textMuted}}><div style={{fontWeight:600}}>No recaps found</div></td></tr>
                ):filtered.flatMap(r=>{
                  const sch=sById(r.school_id),cr=uById(r.created_by),st=SM[r.status]||SM.green,tc=sch?TC[sch.type]:null
                  const ai=[...(r.issues||[]).map(id=>ISS.find(p=>p.id===id)?.label).filter(Boolean),...(r.custom_issues||[])]
                  const hn=!!r.note,no=on.has(r.id)
                  const needsResolve=r.status!=="green"&&!r.resolved
                                    return [
                    <tr key={r.id} style={{borderBottom:"1px solid #F1F5F9",background:r.resolved?"#FAFFFE":"#fff"}}>
                      {resolveId===r.id&&<ResolveModal recap={r} onClose={()=>setResolveId(null)} onResolve={(note)=>{handleResolve(r.id,note);setResolveId(null)}}/>}
                      <td style={{padding:"11px 14px",fontWeight:700,whiteSpace:"nowrap",maxWidth:200}}>
                        <button onClick={()=>go("school",{school:sch})} style={{background:"none",border:"none",cursor:"pointer",color:C.text,fontWeight:700,fontSize:13,padding:0,fontFamily:"inherit",textAlign:"left"}}>{sch?.name||"--"}</button>
                        {hn&&<button onClick={()=>tog(r.id)} style={{display:"inline-flex",alignItems:"center",gap:2,marginLeft:6,padding:"1px 6px",borderRadius:4,border:"1px solid #E2E8F0",cursor:"pointer",fontSize:10,fontWeight:600,background:no?"#EFF6FF":"#F8FAFC",color:no?"#2563EB":C.textLight,fontFamily:"inherit"}}><StickyNote size={9}/></button>}
                      </td>
                      <td style={{padding:"11px 14px"}}>{tc&&<Pill bg={tc.bg} tx={tc.tx} bd={tc.bd}>{TL[sch.type]}</Pill>}</td>
                      <td style={{padding:"11px 14px"}}>{r.resolved?<Pill bg="#F0FDF4" tx="#15803D" bd="#BBF7D0">Resolved</Pill>:<SBadge status={r.status}/>}</td>
                      <td style={{padding:"11px 14px",maxWidth:180}}>
                        {ai.length>0?(
                          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                            {ai.slice(0,2).map(i=><span key={i} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",color:C.textMuted,padding:"1px 6px",borderRadius:5,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{i}</span>)}
                            {ai.length>2&&<span style={{fontSize:11,color:C.textLight,alignSelf:"center"}}>+{ai.length-2}</span>}
                          </div>
                        ):<span style={{color:C.border,fontSize:12}}>--</span>}
                      </td>
                      <td style={{padding:"11px 14px",fontSize:12,fontWeight:600,color:C.text,whiteSpace:"nowrap"}}>{cr?.name||"--"}</td>
                      <td style={{padding:"11px 14px",fontSize:12,color:C.textMuted,whiteSpace:"nowrap"}}>{isMultiDay?fd(r.date):ft(r.created_at)}</td>
                      <td style={{padding:"11px 14px"}}>
                        {needsResolve&&<button onClick={()=>setResolveId(r.id)} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:R.md,border:"1px solid #BBF7D0",cursor:"pointer",fontSize:11,fontWeight:600,background:"#F0FDF4",color:"#15803D",whiteSpace:"nowrap",fontFamily:"inherit"}}><CheckSquare size={11}/>Resolve</button>}
                        {(isAdmin||r.created_by===user.id)&&<button onClick={()=>handleDeleteRecap(r)} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:R.md,border:"1px solid #FECACA",cursor:"pointer",fontSize:11,fontWeight:600,background:"#FEF2F2",color:"#DC2626",whiteSpace:"nowrap",fontFamily:"inherit",marginLeft:4}}><X size={11}/>Del</button>}
                      </td>
                    </tr>,
                    hn&&no&&<tr key={r.id+"n"} style={{borderBottom:"1px solid #F1F5F9",background:"#FAFFFE"}}><td colSpan={7} style={{padding:"0 14px 10px 28px"}}><div style={{padding:"8px 14px",borderRadius:R.md,fontSize:12,color:C.text,background:"#F0F9FF",borderLeft:"3px solid #2563EB",lineHeight:1.6}}>{r.note}</div></td></tr>
                  ].filter(Boolean)
                })}
              </tbody>
            </table>
          </div>
        </Box>
      )}
    </div>
  )
}

function SubmitPage({user,schools,setRecaps,toast}){
  const [date,setDate]=useState(TODAY)
  const [sid,setSid]=useState("")
  const [status,setStatus]=useState("")
  const [sel,setSel]=useState([])
  const [cust,setCust]=useState([])
  const [ci,setCi]=useState("")
  const [note,setNote]=useState("")
  const [err,setErr]=useState("")
  const [aiLoading,setAiLoading]=useState(false)

  const tog=id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])
  const addC=()=>{const v=ci.trim();if(!v)return;if(!cust.includes(v))setCust(p=>[...p,v]);setCi("")}

  const draftNote=async()=>{
    if(!status){setErr("Select a status first.");return}
    setErr("");setAiLoading(true)
    const school=schools.find(s=>s.id===sid)
    const issueList=[...sel.map(id=>ISS.find(p=>p.id===id)?.label).filter(Boolean),...cust]
    const result=await callAI([{role:"user",content:"Write a short (1-2 sentence) operational recap note for a school food service daily report. School: "+(school?.name||"Not selected")+" Status: "+(STATS.find(s=>s.id===status)?.label||status)+" Issues: "+(issueList.length>0?issueList.join(", "):"None")+". Write a clear, professional note a cafeteria manager would write."}])
    if(result)setNote(result.trim())
    else toast.show("AI unavailable. Write a note manually.","error")
    setAiLoading(false)
  }

  const sub=async()=>{
    if(!sid){setErr("Please select a school.");return}
    if(!status){setErr("Please select a status.");return}
    setErr("")
    const newRecap={id:uid(),date,school_id:sid,status,issues:sel,custom_issues:cust,note:note.trim()||null,created_by:user.id,created_at:new Date().toISOString(),resolved:false,resolution_note:""}
    setRecaps(p=>[newRecap,...p])
    await supabase.from("recaps").insert(newRecap)
    setSid("");setStatus("");setSel([]);setCust([]);setCi("");setNote("");setDate(TODAY)
    toast.show("Recap submitted successfully!")
  }

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Submit Recap" subtitle="Log today's food service status"/>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {err&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626",padding:"10px 14px",borderRadius:R.md,fontSize:13,display:"flex",alignItems:"center",gap:8}}><AlertCircle size={15}/>{err}</div>}
        <Box><L>Date</L><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{...inp,width:"100%",maxWidth:180}}/></Box>
        <Box><L>School *</L><SG schools={schools} value={sid} onChange={e=>setSid(e.target.value)}/></Box>
        <Box>
          <L>Status *</L>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {STATS.map(st=>{const a=status===st.id;return <button key={st.id} onClick={()=>setStatus(st.id)} style={{padding:"12px 6px",borderRadius:R.md,fontWeight:700,fontSize:12,cursor:"pointer",border:"2px solid "+(a?st.c:C.border),background:a?st.c:"#fff",color:a?"#fff":C.textMuted,fontFamily:"inherit"}}>{st.label}</button>})}
          </div>
        </Box>
        <Box>
          <L>Issues</L>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {ISS.map(iss=>{const a=sel.includes(iss.id);return <button key={iss.id} onClick={()=>tog(iss.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 11px",borderRadius:R.md,border:"1.5px solid "+(a?"#2563EB":C.border),background:a?"#EFF6FF":"#fff",color:a?"#2563EB":C.textMuted,cursor:"pointer",fontSize:12,fontWeight:600,textAlign:"left",fontFamily:"inherit"}}>
              <div style={{width:16,height:16,borderRadius:4,border:"2px solid "+(a?"#2563EB":C.border),background:a?"#2563EB":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{a&&<Check size={10} color="white" strokeWidth={3}/>}</div>
              {iss.label}
            </button>})}
          </div>
          {cust.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{cust.map(c=><span key={c} style={{background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#2563EB",padding:"3px 8px",borderRadius:R.full,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>{c}<button onClick={()=>setCust(p=>p.filter(x=>x!==c))} style={{background:"none",border:"none",cursor:"pointer",color:"inherit",display:"flex",padding:0}}><X size={10}/></button></span>)}</div>}
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <input value={ci} onChange={e=>setCi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addC())} placeholder="Add custom issue..." style={{...inp,flex:1}}/>
            <Btn onClick={addC} disabled={!ci.trim()} sm><Plus size={12}/>Add</Btn>
          </div>
        </Box>
        <Box>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <L>Note (optional)</L>
            <AIBtn onClick={draftNote} loading={aiLoading}>{aiLoading?"Writing...":"Draft with AI"}</AIBtn>
          </div>
          <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} maxLength={400} placeholder="Describe what happened today..." style={{...inp,resize:"vertical",lineHeight:1.6}}/>
        </Box>
        <Btn onClick={sub}><CheckCircle size={14}/> Submit Recap</Btn>
      </div>
    </div>
  )
}

function SchoolPage({ctx,schools,recaps,setRecaps,users,toast,user,isAdmin}){
  const [sid,setSid]=useState(ctx?.school?.id||"")
  const [on,setOn]=useState(new Set())
  const [resolveId,setResolveId]=useState(null)
  const uById=id=>users.find(u=>u.id===id)
  const sch=schools.find(s=>s.id===sid)
  const sr=recaps.filter(r=>r.school_id===sid).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))
  const tc=sch?TC[sch.type]:null
  const sn=role=>{const id=sch?.[`${role}_id`];return id?uById(id)?.name:null}
  const tog=id=>setOn(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n})
  const handleResolve=(rid,note)=>{setRecaps(p=>p.map(x=>x.id===rid?{...x,resolved:true,resolution_note:note,resolved_at:new Date().toISOString()}:x));toast.show("Issue marked as resolved!")}
  const handleDeleteRecap=async(r)=>{
    const canDelete=isAdmin||r.created_by===user.id
    if(!canDelete){toast.show("You can only delete your own recaps.","error");return}
    if(!window.confirm("Delete this recap?"))return
    await supabase.from("recaps").delete().eq("id",r.id)
    setRecaps(p=>p.filter(x=>x.id!==r.id))
    toast.show("Recap deleted.")
  }

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="School Detail" subtitle="View recap history for a school"/>
      <Box style={{marginBottom:14,maxWidth:300}}><L>Select School</L><SG schools={schools} value={sid} onChange={e=>setSid(e.target.value)}/></Box>
      {sch&&<>
        <div style={{marginBottom:14}}>
          {tc&&<div style={{marginBottom:10}}><Pill bg={tc.bg} tx={tc.tx} bd={tc.bd}>{TL[sch.type]}</Pill></div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[["chef","Chef"],["director","Director"],["supervisor","Supervisor"]].map(([r,lab])=>(
              <Box key={r} style={{padding:"12px 14px"}}><L>{lab}</L><div style={{fontWeight:700,fontSize:13,color:C.text,marginTop:2}}>{sn(r)||<em style={{fontWeight:400,color:C.textLight}}>Unassigned</em>}</div></Box>
            ))}
          </div>
        </div>
        <Box style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"10px 16px",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",fontSize:13,fontWeight:700,color:C.textMuted}}>{sr.length} recap{sr.length!==1?"s":""} total</div>
          {sr.length===0?<div style={{textAlign:"center",padding:40,color:C.textMuted,fontSize:13}}>No recaps yet.</div>
          :sr.flatMap(r=>{
            const st=SM[r.status]||SM.green
            const ai=[...(r.issues||[]).map(id=>ISS.find(p=>p.id===id)?.label).filter(Boolean),...(r.custom_issues||[])]
            const hn=!!r.note,no=on.has(r.id)
            const needsResolve=r.status!=="green"&&!r.resolved
                        return [
              <div key={r.id} style={{borderBottom:"1px solid #F8FAFC",borderLeft:"4px solid "+(r.resolved?"#16A34A":st.c)}}>
                {resolveId===r.id&&<ResolveModal recap={r} onClose={()=>setResolveId(null)} onResolve={(note)=>{handleResolve(r.id,note);setResolveId(null)}}/>}
                <div style={{padding:"10px 14px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
                  <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:6,flex:1}}>
                    {r.resolved?<Pill bg="#F0FDF4" tx="#15803D" bd="#BBF7D0">Resolved</Pill>:<SBadge status={r.status}/>}
                    {ai.map(i=><span key={i} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",color:C.textMuted,padding:"1px 7px",borderRadius:5,fontSize:11,fontWeight:600}}>{i}</span>)}
                    {hn&&<button onClick={()=>tog(r.id)} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:R.md,border:"1px solid #E2E8F0",cursor:"pointer",fontSize:11,fontWeight:600,background:no?"#EFF6FF":"#fff",color:no?"#2563EB":C.textMuted,fontFamily:"inherit"}}><StickyNote size={10}/>{no?"Hide":"Note"}</button>}
                    {needsResolve&&<button onClick={()=>setResolveId(r.id)} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:R.md,border:"1px solid #BBF7D0",cursor:"pointer",fontSize:11,fontWeight:600,background:"#F0FDF4",color:"#15803D",fontFamily:"inherit"}}><CheckSquare size={10}/>Resolve</button>}
                    {(isAdmin||r.created_by===user.id)&&<button onClick={()=>handleDeleteRecap(r)} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:R.md,border:"1px solid #FECACA",cursor:"pointer",fontSize:11,fontWeight:600,background:"#FEF2F2",color:"#DC2626",fontFamily:"inherit"}}><X size={10}/>Delete</button>}
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.text}}>{uById(r.created_by)?.name||"--"}</div>
                    <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{fd(r.date)} - {ft(r.created_at)}</div>
                  </div>
                </div>
                {r.resolved&&r.resolution_note&&<div style={{padding:"0 14px 8px 18px"}}><div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:R.md,padding:"6px 10px",fontSize:11,color:"#15803D"}}>Resolution: {r.resolution_note}</div></div>}
              </div>,
              hn&&no&&<div key={r.id+"n"} style={{borderBottom:"1px solid #F8FAFC",padding:"0 14px 10px 22px"}}><div style={{padding:"8px 12px",borderRadius:R.md,fontSize:12,background:"#F0F9FF",borderLeft:"3px solid #2563EB",color:C.text,lineHeight:1.6}}>{r.note}</div></div>
            ].filter(Boolean)
          })}
        </Box>
      </>}
    </div>
  )
}

function ReportPage({recaps,schools,users}){
  const now=new Date()
  const [month,setMonth]=useState(now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0"))
  const [sf,setSf]=useState("all")
  const [rep,setRep]=useState(null)
  const [aiSummary,setAiSummary]=useState(null)
  const [aiLoading,setAiLoading]=useState(false)
  const uById=id=>users.find(u=>u.id===id)

  const gen=()=>{
    const [yr,mo]=month.split("-").map(Number)
    const start=yr+"-"+String(mo).padStart(2,"0")+"-01",end=yr+"-"+String(mo).padStart(2,"0")+"-"+String(new Date(yr,mo,0).getDate()).padStart(2,"0")
    const all=recaps.filter(r=>r.date>=start&&r.date<=end)
    setAiSummary(null)
    setRep(schools.filter(s=>sf==="all"||s.id===sf).map(s=>{
      const sr=all.filter(r=>r.school_id===s.id)
      if(sr.length===0&&sf==="all")return null
      return{s,total:sr.length,counts:STATS.reduce((a,st)=>({...a,[st.id]:sr.filter(r=>r.status===st.id).length}),{}),resolved:sr.filter(r=>r.resolved).length,notes:sr.filter(r=>r.note).map(r=>({note:r.note,date:r.date,by:uById(r.created_by)?.name}))}
    }).filter(Boolean))
  }

  const getAISummary=async()=>{
    if(!rep||rep.length===0)return
    setAiLoading(true)
    const lines=rep.map(({s,total,counts,resolved})=>s.name+": "+total+" recaps -- "+(counts.green||0)+" All Good, "+(counts.yellow||0)+" Minor Issues, "+(counts.red||0)+" Major Problems, "+resolved+" resolved.")
    const result=await callAI([{role:"user",content:"Write a 3-4 sentence executive summary of this school district food service monthly report. Be specific, name standout schools, call out patterns. Professional tone.\n\nData:\n"+lines.join("\n")}])
    setAiSummary(result||"Could not generate summary.")
    setAiLoading(false)
  }

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Monthly Report" subtitle="Overview of food service performance"/>
      <Box style={{marginBottom:20,padding:"14px 18px",display:"flex",flexWrap:"wrap",gap:12,alignItems:"flex-end"}}>
        <div><L>Month</L><input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{...inp}}/></div>
        <div style={{flex:"1 1 180px",maxWidth:260}}><L>School</L><SG schools={schools} value={sf} onChange={e=>setSf(e.target.value)} all="All Schools"/></div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn onClick={gen} sm>Generate</Btn>
          {rep&&rep.length>0&&<AIBtn onClick={getAISummary} loading={aiLoading}>{aiLoading?"Writing...":"AI Narrative"}</AIBtn>}
          {rep&&<Btn onClick={()=>window.print()} variant="outline" sm><Printer size={12}/> Print</Btn>}
        </div>
      </Box>
      {aiSummary&&<AISummaryBox text={aiSummary}/>}
      {rep&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
        {rep.length===0?<Box style={{textAlign:"center",padding:32,color:C.textMuted}}>No recaps found.</Box>
        :rep.map(({s,total,counts,resolved,notes})=>{const tc=TC[s.type];return(
          <Box key={s.id} style={{padding:0,overflow:"hidden"}}>
            <div style={{background:"#1E293B",padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{color:"#fff",fontWeight:800,fontSize:14}}>{s.name}</span>{tc&&<Pill bg={tc.bg} tx={tc.tx}>{TL[s.type]}</Pill>}</div>
              <span style={{color:"#94A3B8",fontSize:13}}>{total} recap{total!==1?"s":""}</span>
            </div>
            <div style={{padding:"16px 18px"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                {STATS.slice(0,3).map(st=><div key={st.id} style={{textAlign:"center",padding:10,borderRadius:R.md,background:st.l,border:"1px solid "+st.b}}>
                  <div style={{fontSize:22,fontWeight:900,color:st.c}}>{counts[st.id]||0}</div>
                  <div style={{fontSize:10,fontWeight:600,color:st.t,marginTop:2}}>{st.label}</div>
                </div>)}
                <div style={{textAlign:"center",padding:10,borderRadius:R.md,background:"#F0FDF4",border:"1px solid #BBF7D0"}}>
                  <div style={{fontSize:22,fontWeight:900,color:"#16A34A"}}>{resolved}</div>
                  <div style={{fontSize:10,fontWeight:600,color:"#15803D",marginTop:2}}>Resolved</div>
                </div>
              </div>
              {notes.length>0&&<><p style={{...lbl,marginBottom:6}}>Notes</p>{notes.map((n,i)=><div key={i} style={{fontSize:12,color:C.textMuted,marginBottom:3,lineHeight:1.6}}><span style={{color:C.textLight,fontSize:11}}>{fd(n.date)}</span> {n.note}{n.by&&<span style={{color:C.textLight}}> - {n.by}</span>}</div>)}</>}
            </div>
          </Box>
        )})}
      </div>}
    </div>
  )
}

function CalloffsPage({user,calloffs,setCalloffs,schools,toast}){
  const [mobile,setMobile]=useState(window.innerWidth<768)
  useEffect(()=>{const fn=()=>setMobile(window.innerWidth<768);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn)},[])
  const [tab,setTab]=useState("log")
  const [form,setForm]=useState({school_id:"",staff_name:"",staff_role:"",type:"calloff",note:"",date:TODAY})
  const [err,setErr]=useState("")
  const [fS,setFS]=useState("")
  const [fT,setFT]=useState("")
  const sById=id=>schools.find(s=>s.id===id)

  const sub=async()=>{
    if(!form.school_id){setErr("Select a school.");return}
    if(!form.staff_name.trim()){setErr("Enter staff name.");return}
    setErr("")
    const newCalloff={id:uid(),...form,staff_name:form.staff_name.trim(),created_by:user.id,created_at:new Date().toISOString()}
    setCalloffs(p=>[newCalloff,...p])
    await supabase.from("calloffs").insert(newCalloff)
    setForm({school_id:"",staff_name:"",staff_role:"",type:"calloff",note:"",date:TODAY})
    toast.show("Call-off logged successfully!")
  }

  const filtered=calloffs.filter(c=>(!fS||c.school_id===fS)&&(!fT||c.type===fT)).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Call-Off Tracking" subtitle="Log and monitor staff absences"/>
      <TabBar tabs={[{id:"log",label:"Log Call-Off"},{id:"view",label:"View Records"},{id:"stats",label:"Statistics"}]} active={tab} set={setTab}/>
      {tab==="log"&&<div style={{maxWidth:640,display:"flex",flexDirection:"column",gap:14}}>
        {err&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626",padding:"10px 14px",borderRadius:R.md,fontSize:13,display:"flex",alignItems:"center",gap:8}}><AlertCircle size={15}/>{err}</div>}
        <Box style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><L>Date</L><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{...inp,width:"100%",maxWidth:180}}/></div>
          <div><L>School *</L><SG schools={schools} value={form.school_id} onChange={e=>setForm(f=>({...f,school_id:e.target.value}))}/></div>
          <div><L>Staff Name *</L><Inp value={form.staff_name} onChange={e=>setForm(f=>({...f,staff_name:e.target.value}))} placeholder="Full name"/></div>
          <div><L>Position</L><Inp value={form.staff_role} onChange={e=>setForm(f=>({...f,staff_role:e.target.value}))} placeholder="e.g. Cook, Manager"/></div>
          <div><L>Type *</L>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[{id:"calloff",l:"Call-Off"},{id:"sick",l:"Sick Day"},{id:"ncns",l:"No Call No Show"},{id:"tardy",l:"Tardy"}].map(t=>{
                const a=form.type===t.id,tb=CTB[t.id]
                return <button key={t.id} onClick={()=>setForm(f=>({...f,type:t.id}))} style={{padding:"11px 6px",borderRadius:R.md,border:"2px solid "+(a?tb.tx:C.border),background:a?tb.bg:"#fff",color:a?tb.tx:C.textMuted,cursor:"pointer",fontSize:12,fontWeight:700,textAlign:"center",fontFamily:"inherit"}}>{t.l}</button>
              })}
            </div>
          </div>
          <div><L>Note</L><Inp value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="Optional details..."/></div>
        </Box>
        <Btn onClick={sub}><CheckCircle size={14}/> Log Call-Off</Btn>
      </div>}
      {tab==="view"&&<div>
        <Box style={{marginBottom:14,padding:"12px 16px",display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
          <div style={{flex:"1 1 160px",maxWidth:260}}><L>School</L><SG schools={schools} value={fS} onChange={e=>setFS(e.target.value)} all="All Schools"/></div>
          <div><L>Type</L><select value={fT} onChange={e=>setFT(e.target.value)} style={{...inp}}><option value="">All Types</option><option value="calloff">Call-Off</option><option value="sick">Sick Day</option><option value="ncns">No Call No Show</option><option value="tardy">Tardy</option></select></div>
        </Box>
        {mobile?(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filtered.length===0?<Box style={{textAlign:"center",padding:32,color:C.textMuted}}>No records found.</Box>
            :filtered.map(c=>{const tb=CTB[c.type]||CTB.calloff,sch=sById(c.school_id);return(
              <Box key={c.id} style={{padding:14,borderLeft:"4px solid "+tb.tx}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:6}}>
                  <div><div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:2}}>{c.staff_name}</div>{c.staff_role&&<div style={{fontSize:12,color:C.textMuted}}>{c.staff_role}</div>}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    <Pill bg={tb.bg} tx={tb.tx}>{tb.label}</Pill>
                    <button onClick={async()=>{if(window.confirm("Delete?")){await supabase.from("calloffs").delete().eq("id",c.id);setCalloffs(p=>p.filter(x=>x.id!==c.id));toast.show("Deleted.")}}} style={{background:"#FEF2F2",border:"none",borderRadius:R.md,padding:"3px 8px",cursor:"pointer",color:"#DC2626",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>Del</button>
                  </div>
                </div>
                <div style={{fontSize:12,color:C.textMuted,display:"flex",flexWrap:"wrap",gap:6}}>
                  <span style={{fontWeight:700,color:C.text}}>{sch?.name||"--"}</span><span>-</span><span>{fd(c.date)}</span>
                  {c.note&&<><span>-</span><span style={{fontStyle:"italic"}}>{c.note}</span></>}
                </div>
              </Box>
            )})}
          </div>
        ):(
          <Box style={{padding:0,overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:480}}>
                <thead><tr style={{background:"#F8FAFC",borderBottom:"2px solid #E2E8F0"}}>{["Date","School","Staff","Position","Type","Note",""].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:11,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                <tbody>{filtered.length===0?<tr><td colSpan={7} style={{textAlign:"center",padding:40,color:C.textMuted}}>No records.</td></tr>:filtered.map(c=>{const tb=CTB[c.type]||CTB.calloff;return(
                  <tr key={c.id} style={{borderBottom:"1px solid #F1F5F9"}}>
                    <td style={{padding:"10px 14px",color:C.textMuted,fontSize:12,whiteSpace:"nowrap"}}>{fd(c.date)}</td>
                    <td style={{padding:"10px 14px",fontWeight:600,whiteSpace:"nowrap"}}>{sById(c.school_id)?.name||"--"}</td>
                    <td style={{padding:"10px 14px",fontWeight:600,whiteSpace:"nowrap"}}>{c.staff_name}</td>
                    <td style={{padding:"10px 14px",color:C.textMuted,fontSize:12}}>{c.staff_role||"--"}</td>
                    <td style={{padding:"10px 14px"}}><Pill bg={tb.bg} tx={tb.tx}>{tb.label}</Pill></td>
                    <td style={{padding:"10px 14px",color:C.textMuted,fontSize:12,maxWidth:160}}><span style={{display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.note||"--"}</span></td>
                    <td style={{padding:"10px 14px"}}><button onClick={async()=>{if(window.confirm("Delete this record?")){await supabase.from("calloffs").delete().eq("id",c.id);setCalloffs(p=>p.filter(x=>x.id!==c.id));toast.show("Record deleted.")}}} style={{background:"#FEF2F2",border:"none",borderRadius:R.md,padding:"4px 10px",cursor:"pointer",color:"#DC2626",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Delete</button></td>
                  </tr>
                )})}</tbody>
              </table>
            </div>
          </Box>
        )}
      </div>}
      {tab==="stats"&&<CalloffStats calloffs={calloffs} schools={schools} mobile={mobile}/>}
    </div>
  )
}

function CalloffStats({calloffs,schools,mobile}){
  const now=new Date()
  const [month,setMonth]=useState(now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0"))
  const [sf,setSf]=useState("all")
  const [data,setData]=useState(null)
  const [aiInsight,setAiInsight]=useState(null)
  const [aiLoading,setAiLoading]=useState(false)

  const generate=()=>{
    const [yr,mo]=month.split("-").map(Number)
    const start=yr+"-"+String(mo).padStart(2,"0")+"-01",end=yr+"-"+String(mo).padStart(2,"0")+"-"+String(new Date(yr,mo,0).getDate()).padStart(2,"0")
    let all=calloffs.filter(c=>c.date>=start&&c.date<=end)
    if(sf!=="all")all=all.filter(c=>c.school_id===sf)
    const bySchool=schools.map(s=>{const sr=all.filter(c=>c.school_id===s.id);if(!sr.length)return null;return{s,total:sr.length,calloff:sr.filter(c=>c.type==="calloff").length,sick:sr.filter(c=>c.type==="sick").length,ncns:sr.filter(c=>c.type==="ncns").length,tardy:sr.filter(c=>c.type==="tardy").length,staff:[...new Set(sr.map(c=>c.staff_name))]}}).filter(Boolean).sort((a,b)=>b.total-a.total)
    setData({total:all.length,calloff:all.filter(c=>c.type==="calloff").length,sick:all.filter(c=>c.type==="sick").length,ncns:all.filter(c=>c.type==="ncns").length,tardy:all.filter(c=>c.type==="tardy").length,bySchool})
    setAiInsight(null)
  }

  const getAIInsight=async()=>{
    if(!data)return
    setAiLoading(true)
    const lines=data.bySchool.map(r=>r.s.name+": "+r.total+" total ("+r.calloff+" call-offs, "+r.sick+" sick, "+r.ncns+" NCNS, "+r.tardy+" tardy). Staff: "+r.staff.join(", "))
    const result=await callAI([{role:"user",content:"Analyze call-off patterns for a school district food service. Write 2-3 sentences identifying concerning patterns. Be direct.\n\n"+lines.join("\n")}])
    setAiInsight(result||"Could not generate insight.")
    setAiLoading(false)
  }

  return(
    <div>
      <Box style={{marginBottom:14,padding:"12px 16px",display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
        <div><L>Month</L><input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{...inp}}/></div>
        <div style={{flex:"1 1 160px",maxWidth:260}}><L>School</L><SG schools={schools} value={sf} onChange={e=>setSf(e.target.value)} all="All Schools"/></div>
        <Btn onClick={generate} sm>Generate</Btn>
        {data&&<AIBtn onClick={getAIInsight} loading={aiLoading}>{aiLoading?"Analyzing...":"AI Patterns"}</AIBtn>}
      </Box>
      {aiInsight&&<AISummaryBox text={aiInsight}/>}
      {data&&<>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(5,1fr)",gap:10,marginBottom:14}}>
          {[{label:"Total",val:data.total,bg:"#F8FAFC",tx:C.text,bd:"#E2E8F0"},{label:"Call-Offs",val:data.calloff,bg:"#EFF6FF",tx:"#1D4ED8",bd:"#BFDBFE"},{label:"Sick Days",val:data.sick,bg:"#FFFBEB",tx:"#B45309",bd:"#FDE68A"},{label:"No Call No Show",val:data.ncns,bg:"#FEF2F2",tx:"#DC2626",bd:"#FECACA"},{label:"Tardy",val:data.tardy,bg:"#FFF3E0",tx:"#E65100",bd:"#FFCC80"}].map(c=>(
            <div key={c.label} style={{background:c.bg,borderRadius:R.lg,padding:"14px 16px",border:"1px solid "+c.bd}}>
              <div style={{fontSize:28,fontWeight:900,color:c.tx,lineHeight:1}}>{c.val}</div>
              <div style={{fontSize:11,fontWeight:600,color:C.textMuted,marginTop:4}}>{c.label}</div>
            </div>
          ))}
        </div>
        {data.bySchool.length===0?<Box style={{textAlign:"center",padding:32,color:C.textMuted}}>No call-offs this period.</Box>
        :<Box style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"10px 16px",background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",fontSize:11,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:".06em"}}>By School</div>
          {data.bySchool.map(row=>{const tc=TC[row.s.type];return(
            <div key={row.s.id} style={{borderBottom:"1px solid #F8FAFC",padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontWeight:800,fontSize:13,color:C.text}}>{row.s.name}</span>
                  {tc&&<Pill bg={tc.bg} tx={tc.tx} bd={tc.bd}>{TL[row.s.type]}</Pill>}
                </div>
                <span style={{fontWeight:900,fontSize:16,color:C.text,flexShrink:0}}>{row.total}</span>
              </div>
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",gap:3,height:10,borderRadius:R.full,overflow:"hidden",marginBottom:6}}>
                  {row.calloff>0&&<div style={{flex:row.calloff,background:"#3B82F6"}}/>}
                  {row.sick>0&&<div style={{flex:row.sick,background:"#F59E0B"}}/>}
                  {row.ncns>0&&<div style={{flex:row.ncns,background:"#EF4444"}}/>}
                  {row.tardy>0&&<div style={{flex:row.tardy,background:"#F97316"}}/>}
                </div>
                <div style={{display:"flex",gap:10,fontSize:12,flexWrap:"wrap"}}>
                  {row.calloff>0&&<span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:2,background:"#3B82F6",flexShrink:0,display:"inline-block"}}/><span style={{color:"#1D4ED8",fontWeight:700}}>Call-Off: {row.calloff}</span></span>}
                  {row.sick>0&&<span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:2,background:"#F59E0B",flexShrink:0,display:"inline-block"}}/><span style={{color:"#B45309",fontWeight:700}}>Sick: {row.sick}</span></span>}
                  {row.ncns>0&&<span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:2,background:"#EF4444",flexShrink:0,display:"inline-block"}}/><span style={{color:"#DC2626",fontWeight:700}}>NCNS: {row.ncns}</span></span>}
                  {row.tardy>0&&<span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:2,background:"#F97316",flexShrink:0,display:"inline-block"}}/><span style={{color:"#E65100",fontWeight:700}}>Tardy: {row.tardy}</span></span>}
                </div>
              </div>
              {row.staff.length>0&&<div style={{fontSize:11,color:C.textLight,marginTop:4}}>Staff: {row.staff.join(", ")}</div>}
            </div>
          )})}
        </Box>}
      </>}
    </div>
  )
}

function DirPage({directory,setDirectory,schools,isAdmin,toast}){
  const [tab,setTab]=useState("all")
  const [search,setSearch]=useState("")
  const [modal,setModal]=useState(null)
  const [form,setForm]=useState(EMPTY_ENTRY)
  const [mobile,setMobile]=useState(window.innerWidth<768)
  useEffect(()=>{const fn=()=>setMobile(window.innerWidth<768);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn)},[])
  const sById=id=>schools.find(s=>s.id===id)
  const filtered=directory.filter(e=>tab==="all"||e.role_type===tab).filter(e=>!search||e.name.toLowerCase().includes(search.toLowerCase())||e.position.toLowerCase().includes(search.toLowerCase())||((e.school_ids||[]).some(id=>(sById(id)?.name||"").toLowerCase().includes(search.toLowerCase())))).sort((a,b)=>a.name.localeCompare(b.name))
  const openAdd=()=>{setForm({...EMPTY_ENTRY,school_ids:[]});setModal("add")}
  const openEdit=e=>{setForm({...e,school_ids:e.school_ids||[]});setModal(e)}
  const save=async()=>{
    if(!form.name.trim())return
    if(modal==="add"){
      const newEntry={...form,id:uid(),name:form.name.trim(),school_ids:form.school_ids||[],is_temp:form.is_temp||false,temp_end_date:form.temp_end_date||""}
      const{error}=await supabase.from("directory").insert(newEntry)
      if(error){toast.show("Save failed: "+error.message,"error");return}
      setDirectory(p=>[...p,newEntry])
      toast.show("Staff member added!")
    } else {
      const updated={...form,id:modal.id,name:form.name.trim(),school_ids:form.school_ids||[]}
      const{error}=await supabase.from("directory").update(updated).eq("id",modal.id)
      if(error){toast.show("Save failed: "+error.message,"error");return}
      setDirectory(p=>p.map(e=>e.id===modal.id?updated:e))
      toast.show("Staff member updated!")
    }
    setModal(null)
  }
  const del=async e=>{if(window.confirm("Remove "+e.name+"?")){const{error}=await supabase.from("directory").delete().eq("id",e.id);if(error){toast.show("Could not delete: "+error.message,"error");return}setDirectory(p=>p.filter(x=>x.id!==e.id));toast.show(e.name+" removed successfully!")}}
  const roleMeta=id=>DIR_ROLES.find(r=>r.id===id)||{label:"Staff",color:C.textMuted,bg:C.bg}
  const toggleSchool=(sid)=>{const ids=form.school_ids||[];setForm(f=>({...f,school_ids:ids.includes(sid)?ids.filter(x=>x!==sid):[...ids,sid]}))}
  const getSchoolNames=e=>{
    const ids=e.school_ids||[]
    if(!ids.length)return null
    return ids.map(id=>sById(id)?.name).filter(Boolean).join(", ")
  }

  return(
    <div style={{padding:"24px 20px",position:"relative"}}>
      <PageHeader title="Staff Directory" subtitle={directory.length+" staff members"} action={isAdmin&&<Btn onClick={openAdd}><Plus size={14}/> Add Staff</Btn>}/>
      <Box style={{marginBottom:14,padding:"10px 14px"}}><Inp value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, position, or school..."/></Box>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:16}}>
        {DIR_ROLES.map(r=>{const active=tab===r.id,cnt=r.id==="all"?directory.length:directory.filter(e=>e.role_type===r.id).length;return(
          <button key={r.id} onClick={()=>setTab(r.id)} style={{padding:"6px 12px",borderRadius:R.full,border:"1.5px solid "+(active?r.color:C.border),cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap",flexShrink:0,background:active?r.color:"#fff",color:active?"#fff":r.color,fontFamily:"inherit"}}>
            {r.label}{cnt>0?" ("+cnt+")":""}</button>
        )})}
      </div>
      {filtered.length===0?(
        <Box style={{textAlign:"center",padding:"48px 20px"}}>
          <div style={{fontWeight:700,color:C.textMuted,marginBottom:4}}>No staff found</div>
          {isAdmin&&<div style={{marginTop:14}}><Btn onClick={openAdd}><Plus size={14}/> Add First Staff Member</Btn></div>}
        </Box>
      ):mobile?(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(e=>{const rm=roleMeta(e.role_type);const schoolNames=getSchoolNames(e);return(
            <Box key={e.id} style={{padding:16}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:10}}>
                <div>
                  <div style={{fontWeight:800,fontSize:15,color:C.text,marginBottom:2}}>{e.name}</div>
                  <div style={{fontSize:12,color:C.textMuted,marginBottom:6}}>{e.position}</div>
                  <Pill bg={rm.bg} tx={rm.color}>{rm.label.endsWith("s")?rm.label.slice(0,-1):rm.label}</Pill>
                </div>
                {isAdmin&&<div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button onClick={()=>openEdit(e)} style={{background:"#EFF6FF",border:"none",borderRadius:R.md,padding:"5px 10px",cursor:"pointer",color:"#1565C0",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Edit</button>
                  <button onClick={()=>del(e)} style={{background:"#FEF2F2",border:"none",borderRadius:R.md,padding:"5px 10px",cursor:"pointer",color:"#DC2626",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Delete</button>
                </div>}
              </div>
              {schoolNames&&<div style={{fontSize:12,color:C.text,fontWeight:600,marginBottom:8}}>Schools: {schoolNames}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {e.phone&&<a href={"tel:"+e.phone} style={{fontSize:13,color:C.primary,textDecoration:"none",fontWeight:600}}>{e.phone}</a>}
                {e.email&&<a href={"mailto:"+e.email} style={{fontSize:12,color:C.primary,textDecoration:"none"}}>{e.email}</a>}
              </div>
              <div style={{marginTop:8}}><Pill bg={e.is_active?"#F0FDF4":"#F1F5F9"} tx={e.is_active?"#15803D":C.textMuted}>{e.is_active?"Active":"Inactive"}</Pill></div>
            </Box>
          )})}
        </div>
      ):(
        <Box style={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#F8FAFC",borderBottom:"2px solid #E2E8F0"}}>
              {["Name","Position","Role","Schools","Phone","Email","Status",...(isAdmin?["Actions"]:[])].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:11,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{h}</th>)}
            </tr></thead>
            <tbody>{filtered.map(e=>{
              const rm=roleMeta(e.role_type)
              const roleLabel=rm.label.endsWith("s")?rm.label.slice(0,-1):rm.label
              const schoolNames=getSchoolNames(e)
              return(
                <tr key={e.id} style={{borderBottom:"1px solid #F1F5F9"}}>
                  <td style={{padding:"11px 14px",fontWeight:700,color:C.text,whiteSpace:"nowrap"}}>{e.name}</td>
                  <td style={{padding:"11px 14px",color:C.textMuted,fontSize:12}}>{e.position}</td>
                  <td style={{padding:"11px 14px"}}><Pill bg={rm.bg} tx={rm.color}>{roleLabel}</Pill></td>
                  <td style={{padding:"11px 14px",fontSize:12,color:C.text,maxWidth:220}}>
                    {(e.school_ids||[]).length>0?(
                      <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                        {(e.school_ids||[]).slice(0,2).map(id=>{const s=sById(id);const tc=s?TC[s.type]:null;return s?<span key={id} style={{background:tc?tc.bg:"#F8FAFC",color:tc?tc.tx:C.textMuted,border:"1px solid "+(tc?tc.bd:"#E2E8F0"),padding:"1px 7px",borderRadius:R.full,fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>{s.name}</span>:null})}
                        {(e.school_ids||[]).length>2&&<span style={{fontSize:11,color:C.textLight,alignSelf:"center"}}>+{(e.school_ids||[]).length-2} more</span>}
                      </div>
                    ):<span style={{color:C.textLight}}>--</span>}
                  </td>
                  <td style={{padding:"11px 14px",whiteSpace:"nowrap"}}>{e.phone?<a href={"tel:"+e.phone} style={{color:C.primary,textDecoration:"none",fontSize:13,fontWeight:600}}>{e.phone}</a>:<span style={{color:C.textLight}}>--</span>}</td>
                  <td style={{padding:"11px 14px"}}>{e.email?<a href={"mailto:"+e.email} style={{color:C.primary,textDecoration:"none",fontSize:12}}>{e.email}</a>:<span style={{color:C.textLight}}>--</span>}</td>
                  <td style={{padding:"11px 14px"}}><Pill bg={e.is_active?"#F0FDF4":"#F1F5F9"} tx={e.is_active?"#15803D":C.textMuted}>{e.is_active?"Active":"Inactive"}</Pill></td>
                  {isAdmin&&<td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:6}}>
                    <button onClick={()=>openEdit(e)} style={{background:"#EFF6FF",border:"none",borderRadius:R.md,padding:"4px 10px",cursor:"pointer",color:"#1565C0",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Edit</button>
                    <button onClick={()=>del(e)} style={{background:"#FEF2F2",border:"none",borderRadius:R.md,padding:"4px 10px",cursor:"pointer",color:"#DC2626",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Delete</button>
                  </div></td>}
                </tr>
              )
            })}</tbody>
          </table>
        </Box>
      )}

      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",zIndex:50,overflowY:"auto"}}>
          <div style={{background:"#fff",borderRadius:R.xl,width:"100%",maxWidth:500,boxShadow:SH.lg,marginTop:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:"1px solid #E2E8F0",position:"sticky",top:0,background:"#fff",borderRadius:R.xl+" "+R.xl+" 0 0"}}>
              <span style={{fontWeight:800,fontSize:15,color:C.text}}>{modal==="add"?"Add Staff Member":"Edit: "+modal.name}</span>
              <button onClick={()=>setModal(null)} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,cursor:"pointer",color:C.textMuted,display:"flex",padding:7}}><X size={14}/></button>
            </div>
            <div style={{padding:22,display:"flex",flexDirection:"column",gap:14}}>
              <div><L>Full Name *</L><Inp value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Jane Smith"/></div>
              <div><L>Position / Title</L><Inp value={form.position} onChange={e=>setForm(f=>({...f,position:e.target.value}))} placeholder="e.g. Chef, Director"/></div>
              <div><L>Role Category</L>
                <Sel value={form.role_type} onChange={e=>setForm(f=>({...f,role_type:e.target.value}))}>
                  {DIR_ROLES.filter(r=>r.id!=="all").map(r=><option key={r.id} value={r.id}>{r.label.endsWith("s")?r.label.slice(0,-1):r.label}</option>)}
                </Sel>
              </div>
              <div>
                <L>Assigned Schools (select multiple)</L>
                <div style={{border:"1px solid #E2E8F0",borderRadius:R.md,overflow:"hidden",maxHeight:180,overflowY:"auto"}}>
                  {Object.entries(TL).map(([type,typelabel])=>[
                    <div key={type} style={{padding:"5px 12px",background:"#F8FAFC",fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:".05em"}}>{typelabel}</div>,
                    ...schools.filter(s=>s.type===type).map(s=>{
                      const checked=(form.school_ids||[]).includes(s.id)
                      return <label key={s.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",cursor:"pointer",borderTop:"1px solid #F1F5F9",background:checked?"#EFF6FF":"#fff"}}>
                        <input type="checkbox" checked={checked} onChange={()=>toggleSchool(s.id)} style={{width:14,height:14,accentColor:"#2563EB"}}/>
                        <span style={{fontSize:13,color:checked?"#2563EB":C.text,fontWeight:checked?600:400}}>{s.name}</span>
                      </label>
                    })
                  ])}
                </div>
                {(form.school_ids||[]).length>0&&<div style={{marginTop:4,fontSize:11,color:C.textMuted}}>{(form.school_ids||[]).length} school{(form.school_ids||[]).length!==1?"s":""} selected</div>}
              </div>
              <div><L>Phone</L><Inp value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="(574) 555-0100"/></div>
              <div><L>Email</L><Inp type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="name@sbcsc.edu"/></div>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                <input type="checkbox" checked={form.is_temp||false} onChange={e=>setForm(f=>({...f,is_temp:e.target.checked}))} style={{width:15,height:15,accentColor:"#7B1FA2"}}/>
                <span style={{fontSize:13,fontWeight:600,color:C.text}}>Temporary Staff Member</span>
              </label>
              {form.is_temp&&<div><L>End Date</L><input type="date" value={form.temp_end_date||""} onChange={e=>setForm(f=>({...f,temp_end_date:e.target.value}))} style={{...inp,width:"auto"}}/></div>}
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                <input type="checkbox" checked={form.is_active} onChange={e=>setForm(f=>({...f,is_active:e.target.checked}))} style={{width:15,height:15,accentColor:"#2563EB"}}/>
                <span style={{fontSize:13,fontWeight:600,color:C.text}}>Active staff member</span>
              </label>
              <div style={{display:"flex",gap:10,paddingTop:4}}>
                <Btn onClick={()=>setModal(null)} variant="outline">Cancel</Btn>
                <Btn onClick={save} disabled={!form.name.trim()}>Save Changes</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminPage({schools,setSchools,users,supaUsers,setSupaUsers,toast}){
  const [tab,setTab]=useState("users")
  const [es,setEs]=useState(null)
  const [assignSearch,setAssignSearch]=useState("")
  const [af,setAf]=useState({chef_id:"",director_id:"",supervisor_id:""})
  const [userModal,setUserModal]=useState(null)
  const [userForm,setUserForm]=useState({name:"",email:"",password:"",role:"chef",phone:"",school_ids:[],is_active:true})
  const [userLoading,setUserLoading]=useState(false)
  const [userErr,setUserErr]=useState("")

  const loadUsers=async()=>{
    const {data}=await supabase.from("app_users").select("*").order("name")
    if(data)setSupaUsers(data)
  }

  const openAddUser=()=>{
    setUserForm({name:"",email:"",password:"",role:"chef",phone:"",school_ids:[],is_active:true})
    setUserErr("")
    setUserModal("add")
  }

  const saveUser=async()=>{
    if(!userForm.name.trim()||!userForm.email.trim()){setUserErr("Name and email are required.");return}
    if(userModal==="add"&&!userForm.password.trim()){setUserErr("Password is required.");return}
    if(userModal==="add"&&userForm.password.length<6){setUserErr("Password must be at least 6 characters.");return}
    setUserLoading(true);setUserErr("")
    try{
      let userId=userModal==="add"?null:userModal.id
      if(userModal==="add"){
        const {data,error}=await supabase.auth.signUp({email:userForm.email,password:userForm.password})
        if(error)throw error
        userId=data.user?.id
        if(!userId)throw new Error("Could not create user")
        const newUser={id:userId,name:userForm.name,email:userForm.email,role:userForm.role,phone:userForm.phone,school_ids:userForm.school_ids||[],is_active:true}
        await supabase.from("app_users").insert(newUser)
        setSupaUsers(p=>[...p,newUser])
        toast.show("User created! They'll receive a confirmation email.")
      } else {
        await supabase.from("app_users").update({name:userForm.name,role:userForm.role,phone:userForm.phone,school_ids:userForm.school_ids||[],is_active:userForm.is_active}).eq("id",userId)
        setSupaUsers(p=>p.map(u=>u.id===userId?{...u,...userForm}:u))
        toast.show("User updated!")
      }
      // Sync school assignments - update schools state and save to supabase
      const roleKey=userForm.role+"_id"
      if(["chef","director","supervisor"].includes(userForm.role)&&(userForm.school_ids||[]).length>0){
        setSchools(p=>p.map(s=>(userForm.school_ids||[]).includes(s.id)?{...s,[roleKey]:userId}:s))
        // Save each assignment to supabase
        for(const sid of userForm.school_ids){
          await supabase.from("school_assignments").upsert({school_id:sid,[roleKey]:userId},{onConflict:"school_id"})
        }
      }
      loadUsers()
      setUserModal(null)
    }catch(e){
      setUserErr(e.message||"Error saving user.")
    }
    setUserLoading(false)
  }

  const toggleUserSchool=(sid)=>{
    const ids=userForm.school_ids||[]
    setUserForm(f=>({...f,school_ids:ids.includes(sid)?ids.filter(x=>x!==sid):[...ids,sid]}))
  }

  const byRole=r=>[...users.filter(u=>u.role===r&&u.is_active),...supaUsers.filter(u=>u.role===r&&u.is_active)].filter((u,i,a)=>a.findIndex(x=>x.id===u.id)===i)
  const uB=id=>users.find(u=>u.id===id)
  const save=async()=>{
    const updated={chef_id:af.chef_id||null,director_id:af.director_id||null,supervisor_id:af.supervisor_id||null}
    setSchools(p=>p.map(s=>s.id===es.id?{...s,...updated}:s))
    await supabase.from("school_assignments").upsert({school_id:es.id,...updated},{onConflict:"school_id"})
    toast.show("Assignment saved!")
    setEs(null)
  }

  const ROLES=["admin","director","supervisor","chef","kitchen_manager","csa","ppa"]

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Admin Panel" subtitle="Manage users and school assignments"/>
      <TabBar tabs={[{id:"users",label:"User Management"},{id:"assign",label:"Staff Assignments"}]} active={tab} set={id=>{setTab(id);setEs(null)}}/>

      {userModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",zIndex:50,overflowY:"auto"}}>
          <div style={{background:"#fff",borderRadius:R.xl,width:"100%",maxWidth:500,boxShadow:SH.lg,marginTop:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:"1px solid #E2E8F0"}}>
              <span style={{fontWeight:800,fontSize:15,color:C.text}}>{userModal==="add"?"Add New User":"Edit User"}</span>
              <button onClick={()=>setUserModal(null)} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,cursor:"pointer",color:C.textMuted,display:"flex",padding:7}}><X size={14}/></button>
            </div>
            <div style={{padding:22,display:"flex",flexDirection:"column",gap:14}}>
              {userErr&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626",padding:"10px 14px",borderRadius:R.md,fontSize:13}}>{userErr}</div>}
              <div><L>Full Name *</L><Inp value={userForm.name} onChange={e=>setUserForm(f=>({...f,name:e.target.value}))} placeholder="Jane Smith"/></div>
              <div><L>Email *</L><Inp type="email" value={userForm.email} onChange={e=>setUserForm(f=>({...f,email:e.target.value}))} placeholder="jane@sbcsc.edu"/></div>
              {userModal==="add"&&<div><L>Password *</L><Inp type="password" value={userForm.password} onChange={e=>setUserForm(f=>({...f,password:e.target.value}))} placeholder="Minimum 6 characters"/></div>}
              <div><L>Phone</L><Inp value={userForm.phone} onChange={e=>setUserForm(f=>({...f,phone:e.target.value}))} placeholder="(574) 555-0100"/></div>
              <div><L>Role</L>
                <Sel value={userForm.role} onChange={e=>setUserForm(f=>({...f,role:e.target.value}))}>
                  {ROLES.map(r=><option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                </Sel>
              </div>
              <div>
                <L>Assigned Schools</L>
                <div style={{border:"1px solid #E2E8F0",borderRadius:R.md,overflow:"hidden",maxHeight:180,overflowY:"auto"}}>
                  {Object.entries(TL).map(([type,typelabel])=>[
                    <div key={type} style={{padding:"5px 12px",background:"#F8FAFC",fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase"}}>{typelabel}</div>,
                    ...schools.filter(s=>s.type===type).map(s=>{
                      const checked=(userForm.school_ids||[]).includes(s.id)
                      return <label key={s.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",cursor:"pointer",borderTop:"1px solid #F1F5F9",background:checked?"#EFF6FF":"#fff"}}>
                        <input type="checkbox" checked={checked} onChange={()=>toggleUserSchool(s.id)} style={{width:14,height:14,accentColor:"#2563EB"}}/>
                        <span style={{fontSize:13,color:checked?"#2563EB":C.text,fontWeight:checked?600:400}}>{s.name}</span>
                      </label>
                    })
                  ])}
                </div>
              </div>
              {userModal!=="add"&&<label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                <input type="checkbox" checked={userForm.is_active} onChange={e=>setUserForm(f=>({...f,is_active:e.target.checked}))} style={{width:15,height:15,accentColor:"#2563EB"}}/>
                <span style={{fontSize:13,fontWeight:600,color:C.text}}>Active user</span>
              </label>}
              <div style={{display:"flex",gap:10,paddingTop:4}}>
                <Btn onClick={()=>setUserModal(null)} variant="outline">Cancel</Btn>
                <Btn onClick={saveUser} disabled={userLoading}>{userLoading?"Saving...":"Save User"}</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="users"&&<div>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
          <Btn onClick={openAddUser}><Plus size={14}/> Add User</Btn>
        </div>
        <Box style={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#F8FAFC",borderBottom:"2px solid #E2E8F0"}}>{["Name","Email","Phone","Role","Schools","Status","Actions"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:11,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
            <tbody>{supaUsers.length===0?<tr><td colSpan={7} style={{textAlign:"center",padding:40,color:C.textMuted}}>No users yet. Click Add User to get started.</td></tr>:supaUsers.map(u=><tr key={u.id} style={{borderBottom:"1px solid #F1F5F9"}}>
              <td style={{padding:"10px 14px",fontWeight:700,color:C.text,whiteSpace:"nowrap"}}>{u.name}</td>
              <td style={{padding:"10px 14px",color:C.textMuted,fontSize:12}}>{u.email}</td>
              <td style={{padding:"10px 14px",color:C.textMuted,fontSize:12}}>{u.phone||"--"}</td>
              <td style={{padding:"10px 14px"}}><RP role={u.role}/></td>
              <td style={{padding:"10px 14px",fontSize:12,color:C.textMuted}}>{(u.school_ids||[]).length>0?(u.school_ids||[]).length+" school"+(u.school_ids.length!==1?"s":""):"--"}</td>
              <td style={{padding:"10px 14px"}}><Pill bg={u.is_active?"#F0FDF4":"#F1F5F9"} tx={u.is_active?"#15803D":C.textMuted}>{u.is_active?"Active":"Inactive"}</Pill></td>
              <td style={{padding:"10px 14px"}}><div style={{display:"flex",gap:6}}>
                <button onClick={()=>{setUserForm({...u,password:""});setUserErr("");setUserModal(u)}} style={{background:"#EFF6FF",border:"none",borderRadius:R.md,padding:"4px 10px",cursor:"pointer",color:"#1565C0",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Edit</button>
                <button onClick={async()=>{if(!window.confirm("Delete "+u.name+"? This cannot be undone."))return;await supabase.from("app_users").delete().eq("id",u.id);setSupaUsers(p=>p.filter(x=>x.id!==u.id));toast.show(u.name+" deleted.")}} style={{background:"#FEF2F2",border:"none",borderRadius:R.md,padding:"4px 10px",cursor:"pointer",color:"#DC2626",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Delete</button>
              </div></td>
            </tr>)}</tbody>
          </table>
        </Box>
      </div>}
      {tab==="assign"&&<div>
        <Box style={{marginBottom:14,padding:"10px 14px"}}>
          <Inp value={assignSearch||""} onChange={e=>setAssignSearch(e.target.value)} placeholder="Search by school name or staff name..."/>
        </Box>
        {!es&&<Box style={{padding:0,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:580}}>
              <thead><tr style={{background:"#F8FAFC",borderBottom:"2px solid #E2E8F0"}}>{["School","Type","Chef","Director","Supervisor","Edit"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:11,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>{schools.filter(s=>!assignSearch||s.name.toLowerCase().includes(assignSearch.toLowerCase())||(s.chef_id&&(uB(s.chef_id)?.name||"").toLowerCase().includes(assignSearch.toLowerCase()))||(s.director_id&&(uB(s.director_id)?.name||"").toLowerCase().includes(assignSearch.toLowerCase()))||(s.supervisor_id&&(uB(s.supervisor_id)?.name||"").toLowerCase().includes(assignSearch.toLowerCase()))).map(s=>{const tc=TC[s.type];return(
                <tr key={s.id} style={{borderBottom:"1px solid #F1F5F9"}}>
                  <td style={{padding:"10px 14px",fontWeight:700,whiteSpace:"nowrap",color:C.text}}>{s.name}</td>
                  <td style={{padding:"10px 14px"}}>{tc&&<Pill bg={tc.bg} tx={tc.tx} bd={tc.bd}>{TL[s.type]}</Pill>}</td>
                  {["chef","director","supervisor"].map(r=><td key={r} style={{padding:"10px 14px",whiteSpace:"nowrap"}}>{s[r+"_id"]?<span style={{fontWeight:600,color:C.text}}>{uB(s[r+"_id"])?.name||supaUsers.find(u=>u.id===s[r+"_id"])?.name||"--"}</span>:<em style={{color:C.textLight,fontWeight:400,fontSize:12}}>Unassigned</em>}</td>)}
                  <td style={{padding:"10px 14px"}}><button onClick={()=>{setAf({chef_id:s.chef_id||"",director_id:s.director_id||"",supervisor_id:s.supervisor_id||""});setEs(s)}} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,cursor:"pointer",color:C.primary,display:"flex",padding:7}}><Edit2 size={13}/></button></td>
                </tr>
              )})}</tbody>
            </table>
          </div>
        </Box>}
        {es&&<Box style={{maxWidth:420}}>
          <h3 style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:18}}>Assign Staff - {es.name}</h3>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[{r:"chef",l:"Chef",f:"chef_id"},{r:"director",l:"Director",f:"director_id"},{r:"supervisor",l:"Supervisor",f:"supervisor_id"}].map(({r,l,f})=><div key={r}><L>{l}</L><Sel value={af[f]} onChange={e=>setAf(p=>({...p,[f]:e.target.value}))}><option value="">-- Unassigned --</option>{[...byRole(r),...supaUsers.filter(u=>u.role===r&&u.is_active)].filter((u,i,a)=>a.findIndex(x=>x.id===u.id)===i).map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></div>)}
            <div style={{display:"flex",gap:10,marginTop:4}}>
              <Btn onClick={()=>setEs(null)} variant="outline">Cancel</Btn>
              <Btn onClick={save}>Save Assignment</Btn>
            </div>
          </div>
        </Box>}
      </div>}
    </div>
  )
}

const SCHOOL_COORDS={
  "s1":{lat:41.6583,lng:-86.2285},  // 808 S. Twyckenham Dr
  "s3":{lat:41.6612,lng:-86.2401},  // 1902 S. Fellows St
  "s2":{lat:41.6889,lng:-86.3012},  // 4747 W. Washington Ave
  "s4":{lat:41.6923,lng:-86.2523},  // 740 N. Eddy St
  "s23":{lat:41.7389,lng:-86.2134}, // 52900 Lily Rd
  "s9":{lat:41.6756,lng:-86.2934},  // 4404 Elwood Ave
  "s10":{lat:41.6823,lng:-86.2312}, // 2701 Eisenhower Dr
  "s5":{lat:41.6234,lng:-86.2256},  // 5001 S. Miami St
  "s6":{lat:41.6712,lng:-86.2489},  // 528 S. Eddy St
  "s7":{lat:41.6756,lng:-86.3023},  // 2701 W. Elwood Ave
  "s8":{lat:41.6712,lng:-86.3089},  // 4702 W. Ford St
  "s16":{lat:41.6978,lng:-86.2734}, // 1245 N. Sheridan Ave
  "s17":{lat:41.7412,lng:-86.2023}, // 18645 Janet St
  "s15":{lat:41.6812,lng:-86.3045}, // 3302 W. Western Ave
  "s24":{lat:41.6934,lng:-86.2623}, // 609 N. Olive St
  "s25":{lat:41.6756,lng:-86.3012}, // 245 N. Lombardy Dr
  "s11":{lat:41.6634,lng:-86.2178}, // 1425 E. Calvert St
  "s26":{lat:41.6889,lng:-86.2634}, // 832 N. Lafayette Blvd
  "s21":{lat:41.6578,lng:-86.2434}, // 1433 Byron Dr
  "s22":{lat:41.6756,lng:-86.2589}, // 1905 College St
  "s12":{lat:41.6812,lng:-86.2734}, // 228 N. Greenlawn Ave
  "s13":{lat:41.6534,lng:-86.2356}, // 312 E. Donmoyer Ave
  "s14":{lat:41.6812,lng:-86.2845}, // 1021 Blaine St
  "s18":{lat:41.6745,lng:-86.2312}, // 2716 Pleasant St
  "s4b":{lat:41.6534,lng:-86.2478}, // 724 Dubail Ave
  "s19":{lat:41.7312,lng:-86.1823}, // 17677 Parker Dr
  "s20":{lat:41.6823,lng:-86.3156},  // 56660 Oak Rd
  "s27":{lat:41.6845,lng:-86.2523}   // 737 Beale St - Home Office
}

function MapPage({schools,recaps}){
  const today=TODAY
  const todayRecaps=recaps.filter(r=>r.date===today)
  const getStatus=sid=>{const r=todayRecaps.find(x=>x.school_id===sid);return r?r.status:null}
  const [sel,setSel]=useState(null)
  const selSchool=schools.find(s=>s.id===sel)
  const selRecap=sel?todayRecaps.find(r=>r.school_id===sel):null
  const statusCount=STATS.reduce((a,s)=>({...a,[s.id]:todayRecaps.filter(r=>r.status===s.id).length}),{})
  const noRecap=schools.filter(s=>s.type!=="office"&&!todayRecaps.find(r=>r.school_id===s.id)).length
  const mapRef=React.useRef(null)
  const leafRef=React.useRef(null)
  const markersRef=React.useRef({})

  const getColor=status=>status?SM[status]?.c||"#94A3B8":"#94A3B8"

  const makeIcon=(L,color,name="")=>L.divIcon({
    html:"<div style='display:flex;flex-direction:column;align-items:center;'><div style='background:"+color+";color:#fff;font-size:10px;font-weight:800;padding:3px 7px;border-radius:4px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.35);border:1.5px solid rgba(255,255,255,0.8);max-width:110px;overflow:hidden;text-overflow:ellipsis;text-align:center;font-family:system-ui,sans-serif;'>"+name+"</div><div style='width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid "+color+";'></div></div>",
    className:"",iconSize:[120,40],iconAnchor:[60,40]
  })

  React.useEffect(()=>{
    if(leafRef.current)return
    const link=document.createElement("link")
    link.rel="stylesheet"
    link.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)
    const script=document.createElement("script")
    script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload=()=>{
      const L=window.L
      const map=L.map(mapRef.current,{center:[41.676,-86.268],zoom:12})
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map)
      leafRef.current=map
      schools.forEach(s=>{
        const coords=SCHOOL_COORDS[s.id]
        if(!coords)return
        const status=todayRecaps.find(r=>r.school_id===s.id)?.status
        const color=getColor(status)
        const shortName=s.name.replace(/Elementary|Academy|Traditional|Montessori|International|Early Childhood Center|S\.T\.E\.A\.M\.|Fine Arts/g,"").replace(/\s+/g," ").trim()
        const marker=L.marker([coords.lat,coords.lng],{icon:makeIcon(L,color,shortName)})
          .addTo(map)
          .bindTooltip(s.name,{permanent:false,direction:"top"})
          .bindPopup("<b>"+s.name+"</b><br/><small>"+(s.address||"")+"</small>"+(s.phone?"<br/><a href='tel:"+s.phone+"'>"+s.phone+"</a>":"")+"<br/><small style='color:"+color+"'>"+(status?SM[status]?.label:"No recap today")+"</small>")
        marker.on("click",()=>setSel(s.id))
        markersRef.current[s.id]=marker
      })
    }
    document.head.appendChild(script)
  },[])

  React.useEffect(()=>{
    if(!leafRef.current||!window.L)return
    const L=window.L
    schools.forEach(s=>{
      const marker=markersRef.current[s.id]
      if(!marker)return
      const status=todayRecaps.find(r=>r.school_id===s.id)?.status
      marker.setIcon(makeIcon(L,getColor(status),s.name.replace(/Elementary|Academy|Traditional|Montessori|International|Early Childhood/g,"").trim()))
    })
  },[recaps])

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="School Map" subtitle="All SBCSC schools pinned — click any pin for details and today's status"/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:C.textMuted}}><span style={{width:10,height:10,borderRadius:"50%",background:"#94A3B8",display:"inline-block"}}/> No recap</div>
        {STATS.map(s=><div key={s.id} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:C.textMuted}}><span style={{width:10,height:10,borderRadius:"50%",background:s.c,display:"inline-block"}}/>{s.label}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginBottom:16}}>
        <div style={{background:"#F8FAFC",borderRadius:R.lg,padding:"12px 16px",border:"1px solid #E2E8F0",textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:900,color:C.text}}>{schools.filter(s=>s.type!=="office").length}</div>
          <div style={{fontSize:11,fontWeight:600,color:C.textMuted,marginTop:2}}>Schools</div>
        </div>
        {STATS.slice(0,3).map(s=>(
          <div key={s.id} style={{background:s.l,borderRadius:R.lg,padding:"12px 16px",border:"1px solid "+s.b,textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:900,color:s.c}}>{statusCount[s.id]||0}</div>
            <div style={{fontSize:11,fontWeight:600,color:s.t,marginTop:2}}>{s.label}</div>
          </div>
        ))}
        <div style={{background:"#F8FAFC",borderRadius:R.lg,padding:"12px 16px",border:"1px solid #E2E8F0",textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:900,color:"#94A3B8"}}>{noRecap}</div>
          <div style={{fontSize:11,fontWeight:600,color:C.textMuted,marginTop:2}}>No Recap</div>
        </div>
      </div>
      <div ref={mapRef} style={{width:"100%",height:500,borderRadius:R.lg,border:"1px solid #E2E8F0",overflow:"hidden",zIndex:0}}/>
      {sel&&selSchool&&(
        <Box style={{marginTop:14,padding:16,borderLeft:"4px solid "+(SM[getStatus(sel)]?.c||"#94A3B8")}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:10}}>
            <div style={{fontWeight:800,fontSize:15,color:C.text}}>{selSchool.name}</div>
            <button onClick={()=>setSel(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:18,padding:0,fontFamily:"inherit",flexShrink:0}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              {selSchool.type!=="office"&&TC[selSchool.type]&&<div style={{marginBottom:6}}><Pill bg={TC[selSchool.type].bg} tx={TC[selSchool.type].tx} bd={TC[selSchool.type].bd}>{TL[selSchool.type]}</Pill></div>}
              {selSchool.address&&<div style={{fontSize:12,color:C.textMuted,marginBottom:6}}>📍 {selSchool.address}</div>}
              {selSchool.phone&&<a href={"tel:"+selSchool.phone} style={{fontSize:13,color:C.primary,fontWeight:700,textDecoration:"none"}}>{selSchool.phone}</a>}
            </div>
            <div>
              {selRecap?(
                <div>
                  <SBadge status={selRecap.status}/>
                  {selRecap.note&&<div style={{fontSize:12,color:C.text,lineHeight:1.6,background:"#F0F9FF",borderLeft:"3px solid #2563EB",padding:"8px 10px",borderRadius:R.md,marginTop:8}}>{selRecap.note}</div>}
                  {selRecap.resolved&&<div style={{marginTop:6}}><Pill bg="#F0FDF4" tx="#15803D" bd="#BBF7D0">Resolved</Pill></div>}
                </div>
              ):<div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:R.md,padding:"8px 10px",fontSize:12,color:"#C2410C",fontWeight:600}}>No recap submitted today</div>}
            </div>
          </div>
        </Box>
      )}
    </div>
  )
}


const EVENT_TYPES=[
  {id:"meeting",label:"Meeting",color:"#2563EB",bg:"#EFF6FF",bd:"#BFDBFE"},
  {id:"training",label:"Training",color:"#7C3AED",bg:"#F5F3FF",bd:"#DDD6FE"},
  {id:"inspection",label:"Inspection",color:"#D97706",bg:"#FFFBEB",bd:"#FDE68A"},
  {id:"event",label:"Event",color:"#059669",bg:"#ECFDF5",bd:"#A7F3D0"},
  {id:"deadline",label:"Deadline",color:"#DC2626",bg:"#FEF2F2",bd:"#FECACA"},
  {id:"other",label:"Other",color:"#64748B",bg:"#F8FAFC",bd:"#E2E8F0"}
]
const ET=Object.fromEntries(EVENT_TYPES.map(e=>[e.id,e]))

function EventsPage({user,events,setEvents,schools,isAdmin,toast}){
  const [view,setView]=useState("calendar")
  const [modal,setModal]=useState(null)
  const [form,setForm]=useState({title:"",date:"",time:"",end_time:"",type:"meeting",location:"",school_ids:[],description:"",created_by:""})
  const [selDate,setSelDate]=useState(null)
  const [curMonth,setCurMonth]=useState(()=>{const n=new Date();return{y:n.getFullYear(),m:n.getMonth()}})
  const [mobile,setMobile]=useState(window.innerWidth<768)
  useEffect(()=>{const fn=()=>setMobile(window.innerWidth<768);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn)},[])
  const canManage=isAdmin||user.role==="director"||user.role==="supervisor"

  const openAdd=(date="")=>{
    setForm({title:"",date:date||TODAY,time:"08:00",end_time:"09:00",type:"meeting",location:"",school_ids:[],description:"",created_by:user.id})
    setModal("add")
  }
  const openEdit=e=>{setForm({...e,school_ids:e.school_ids||[]});setModal(e)}

  const save=async()=>{
    if(!form.title.trim()||!form.date){return}
    if(modal==="add"){
      const ne={id:uid(),...form,title:form.title.trim(),created_by:user.id,created_at:new Date().toISOString()}
      setEvents(p=>[...p,ne].sort((a,b)=>a.date.localeCompare(b.date)))
      await supabase.from("events").insert(ne)
      toast.show("Event created!")
    } else {
      const up={...form,title:form.title.trim()}
      setEvents(p=>p.map(e=>e.id===modal.id?{...e,...up}:e))
      await supabase.from("events").update(up).eq("id",modal.id)
      toast.show("Event updated!")
    }
    setModal(null)
  }

  const del=async e=>{
    if(!window.confirm("Delete \""+e.title+"\"?"))return
    setEvents(p=>p.filter(x=>x.id!==e.id))
    await supabase.from("events").delete().eq("id",e.id)
    toast.show("Event deleted.")
  }

  const toggleSchool=sid=>{const ids=form.school_ids||[];setForm(f=>({...f,school_ids:ids.includes(sid)?ids.filter(x=>x!==sid):[...ids,sid]}))}

  // Calendar helpers
  const daysInMonth=(y,m)=>new Date(y,m+1,0).getDate()
  const firstDay=(y,m)=>new Date(y,m,1).getDay()
  const {y,m}=curMonth
  const days=daysInMonth(y,m)
  const startDay=firstDay(y,m)
  const monthStr=new Date(y,m,1).toLocaleDateString("en-US",{month:"long",year:"numeric"})
  const pad=n=>String(n).padStart(2,"0")
  const dateStr=(y,m,d)=>y+"-"+pad(m+1)+"-"+pad(d)
  const eventsOnDay=d=>events.filter(e=>e.date===dateStr(y,m,d))
  const upcomingEvents=events.filter(e=>e.date>=TODAY).sort((a,b)=>a.date.localeCompare(b.date))
  const pastEvents=events.filter(e=>e.date<TODAY).sort((a,b)=>b.date.localeCompare(a.date))

  const EventCard=({e,compact=false})=>{
    const et=ET[e.type]||ET.other
    const sNames=(e.school_ids||[]).map(id=>schools.find(s=>s.id===id)?.name).filter(Boolean)
    return(
      <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:R.md,padding:compact?"10px 12px":"14px 16px",borderLeft:"4px solid "+et.color}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:compact?13:14,color:C.text,marginBottom:4}}>{e.title}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>
              <Pill bg={et.bg} tx={et.color} bd={et.bd}>{et.label}</Pill>
              <span style={{fontSize:11,color:C.textMuted,display:"flex",alignItems:"center",gap:3}}>
                <Calendar size={10}/>{fd(e.date)}{e.time&&" at "+fmt(e.time)}{e.end_time&&" - "+fmt(e.end_time)}
              </span>
            </div>
            {e.location&&<div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>📍 {e.location}</div>}
            {sNames.length>0&&<div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>Schools: {sNames.join(", ")}</div>}
            {e.description&&!compact&&<div style={{fontSize:12,color:C.textMuted,lineHeight:1.6,marginTop:6}}>{e.description}</div>}
          </div>
          {canManage&&<div style={{display:"flex",gap:4,flexShrink:0}}>
            <button onClick={()=>openEdit(e)} style={{background:"#EFF6FF",border:"none",borderRadius:R.md,padding:"4px 8px",cursor:"pointer",color:"#1565C0",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>Edit</button>
            <button onClick={()=>del(e)} style={{background:"#FEF2F2",border:"none",borderRadius:R.md,padding:"4px 8px",cursor:"pointer",color:"#DC2626",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>Del</button>
          </div>}
        </div>
      </div>
    )
  }

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Meetings & Events" subtitle="Schedule and track meetings, training, and events"
        action={canManage&&<Btn onClick={()=>openAdd()}><Plus size={14}/> Add Event</Btn>}/>

      <TabBar tabs={[{id:"calendar",label:"Calendar"},{id:"upcoming",label:"Upcoming"},{id:"past",label:"Past"}]} active={view} set={setView}/>

      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",zIndex:50,overflowY:"auto"}}>
          <div style={{background:"#fff",borderRadius:R.xl,width:"100%",maxWidth:520,boxShadow:SH.lg,marginTop:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:"1px solid #E2E8F0"}}>
              <span style={{fontWeight:800,fontSize:15,color:C.text}}>{modal==="add"?"Add Event":"Edit Event"}</span>
              <button onClick={()=>setModal(null)} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,cursor:"pointer",color:C.textMuted,display:"flex",padding:7}}><X size={14}/></button>
            </div>
            <div style={{padding:22,display:"flex",flexDirection:"column",gap:14,maxHeight:"75vh",overflowY:"auto"}}>
              <div><L>Title *</L><Inp value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Monthly Team Meeting"/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <div><L>Date *</L><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{...inp}}/></div>
                <div><L>Start Time</L><input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} style={{...inp}}/></div>
                <div><L>End Time</L><input type="time" value={form.end_time} onChange={e=>setForm(f=>({...f,end_time:e.target.value}))} style={{...inp}}/></div>
              </div>
              <div><L>Type</L>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                  {EVENT_TYPES.map(t=>{const a=form.type===t.id;return(
                    <button key={t.id} onClick={()=>setForm(f=>({...f,type:t.id}))} style={{padding:"8px 6px",borderRadius:R.md,border:"2px solid "+(a?t.color:C.border),background:a?t.bg:"#fff",color:a?t.color:C.textMuted,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>{t.label}</button>
                  )})}
                </div>
              </div>
              <div><L>Location</L><Inp value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="e.g. District Office, Room 204"/></div>
              <div>
                <L>Schools (optional)</L>
                <div style={{border:"1px solid #E2E8F0",borderRadius:R.md,overflow:"hidden",maxHeight:150,overflowY:"auto"}}>
                  {Object.entries(TL).map(([type,typelabel])=>[
                    <div key={type} style={{padding:"4px 10px",background:"#F8FAFC",fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase"}}>{typelabel}</div>,
                    ...schools.filter(s=>s.type===type).map(s=>{
                      const checked=(form.school_ids||[]).includes(s.id)
                      return <label key={s.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",cursor:"pointer",borderTop:"1px solid #F1F5F9",background:checked?"#EFF6FF":"#fff"}}>
                        <input type="checkbox" checked={checked} onChange={()=>toggleSchool(s.id)} style={{width:13,height:13,accentColor:"#2563EB"}}/>
                        <span style={{fontSize:12,color:checked?"#2563EB":C.text,fontWeight:checked?600:400}}>{s.name}</span>
                      </label>
                    })
                  ])}
                </div>
              </div>
              <div><L>Description / Notes</L><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} placeholder="Add any details, agenda items, or notes..." style={{...inp,resize:"vertical",lineHeight:1.6}}/></div>
              <div style={{display:"flex",gap:10,paddingTop:4}}>
                <Btn onClick={()=>setModal(null)} variant="outline">Cancel</Btn>
                <Btn onClick={save} disabled={!form.title.trim()||!form.date}>Save Event</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {view==="calendar"&&(
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <button onClick={()=>setCurMonth(p=>{const d=new Date(p.y,p.m-1);return{y:d.getFullYear(),m:d.getMonth()}})} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,padding:"8px 14px",cursor:"pointer",fontWeight:700,fontSize:14,fontFamily:"inherit"}}>← Prev</button>
            <span style={{fontWeight:800,fontSize:18,color:C.text}}>{monthStr}</span>
            <button onClick={()=>setCurMonth(p=>{const d=new Date(p.y,p.m+1);return{y:d.getFullYear(),m:d.getMonth()}})} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,padding:"8px 14px",cursor:"pointer",fontWeight:700,fontSize:14,fontFamily:"inherit"}}>Next →</button>
          </div>
          {mobile?(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {Array.from({length:days}).map((_,i)=>{
                const d=i+1,ds=dateStr(y,m,d),dayEvents=eventsOnDay(d),isToday=ds===TODAY
                if(!dayEvents.length&&!isToday)return null
                return(
                  <div key={d}>
                    <div style={{fontSize:12,fontWeight:700,color:isToday?"#2563EB":C.textMuted,marginBottom:4,display:"flex",alignItems:"center",gap:6}}>
                      <span style={{width:22,height:22,borderRadius:"50%",background:isToday?"#2563EB":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:isToday?"#fff":C.textMuted,fontSize:11,fontWeight:800}}>{d}</span>
                      {new Date(y,m,d).toLocaleDateString("en-US",{weekday:"short"})}
                      {isToday&&<span style={{fontSize:10,background:"#EFF6FF",color:"#2563EB",padding:"1px 6px",borderRadius:R.full,fontWeight:700}}>Today</span>}
                    </div>
                    {dayEvents.map(e=>{const et=ET[e.type]||ET.other;return(
                      <div key={e.id} style={{background:et.bg,borderLeft:"3px solid "+et.color,borderRadius:R.md,padding:"8px 12px",marginBottom:4}}>
                        <div style={{fontWeight:700,fontSize:13,color:et.color}}>{e.title}</div>
                        {e.time&&<div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{fmt(e.time)}{e.end_time&&" - "+e.end_time}</div>}
                        {e.location&&<div style={{fontSize:11,color:C.textMuted}}>📍 {e.location}</div>}
                      </div>
                    )})}
                  </div>
                )
              }).filter(Boolean)}
              {Array.from({length:days}).every((_,i)=>!eventsOnDay(i+1).length)&&(
                <Box style={{textAlign:"center",padding:32,color:C.textMuted}}>No events this month.</Box>
              )}
            </div>
          ):(
          <Box style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:"2px solid #E2E8F0"}}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div key={d} style={{padding:"10px 4px",textAlign:"center",fontSize:11,fontWeight:700,color:C.textLight,textTransform:"uppercase"}}>{d}</div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
              {Array.from({length:startDay}).map((_,i)=><div key={"e"+i} style={{minHeight:60,borderRight:"1px solid #F1F5F9",borderBottom:"1px solid #F1F5F9",background:"#FAFAFA"}}/>)}
              {Array.from({length:days}).map((_,i)=>{
                const d=i+1
                const ds=dateStr(y,m,d)
                const dayEvents=eventsOnDay(d)
                const isToday=ds===TODAY
                const isSel=ds===selDate
                return(
                  <div key={d} onClick={()=>{setSelDate(isSel?null:ds);if(canManage&&dayEvents.length===0)openAdd(ds)}} style={{minHeight:60,borderRight:"1px solid #F1F5F9",borderBottom:"1px solid #F1F5F9",padding:"4px 3px",cursor:"pointer",background:isSel?"#EFF6FF":isToday?"#FFFBEB":"#fff",position:"relative"}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:isToday?"#2563EB":"transparent",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:isToday?800:500,color:isToday?"#fff":C.text}}>{d}</span>
                    </div>
                    {dayEvents.slice(0,2).map(e=>{const et=ET[e.type]||ET.other;return(
                      <div key={e.id} style={{background:et.bg,color:et.color,fontSize:10,fontWeight:700,padding:"2px 5px",borderRadius:4,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",borderLeft:"2px solid "+et.color}}>{e.title}</div>
                    )})}
                    {dayEvents.length>2&&<div style={{fontSize:9,color:C.textLight,fontWeight:600}}>+{dayEvents.length-2} more</div>}
                  </div>
                )
              })}
            </div>
          </Box>
          )}
          {selDate&&events.filter(e=>e.date===selDate).length>0&&(
            <div style={{marginTop:16}}>
              <div style={{fontSize:13,fontWeight:700,color:C.textMuted,marginBottom:8}}>{fd(selDate)}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {events.filter(e=>e.date===selDate).map(e=><EventCard key={e.id} e={e}/>)}
              </div>
            </div>
          )}
        </div>
      )}

      {view==="upcoming"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {upcomingEvents.length===0?<Box style={{textAlign:"center",padding:40,color:C.textMuted}}>No upcoming events. {canManage&&<button onClick={()=>openAdd()} style={{background:"none",border:"none",cursor:"pointer",color:C.primary,fontWeight:700,fontFamily:"inherit"}}>Add one?</button>}</Box>
          :upcomingEvents.map(e=><EventCard key={e.id} e={e}/>)}
        </div>
      )}

      {view==="past"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {pastEvents.length===0?<Box style={{textAlign:"center",padding:40,color:C.textMuted}}>No past events.</Box>
          :pastEvents.map(e=><EventCard key={e.id} e={e}/>)}
        </div>
      )}
    </div>
  )
}

const KITCHEN_ISSUE_TYPES=[
  {id:"equipment",label:"Equipment Down",icon:"🔧",color:"#DC2626",bg:"#FEF2F2"},
  {id:"pest",label:"Pest/Sanitation",icon:"🐛",color:"#92400E",bg:"#FFFBEB"},
  {id:"staffing",label:"Staff Issue",icon:"👤",color:"#1D4ED8",bg:"#EFF6FF"},
  {id:"supply",label:"Supply/Food Shortage",icon:"📦",color:"#7C3AED",bg:"#F5F3FF"},
  {id:"safety",label:"Health & Safety",icon:"⚠️",color:"#B45309",bg:"#FFFBEB"},
  {id:"facility",label:"Facility/Building",icon:"🏫",color:"#0F766E",bg:"#F0FDFA"},
  {id:"coverage",label:"Coverage Request",icon:"🙋",color:"#15803D",bg:"#F0FDF4"},
  {id:"weather",label:"Weather Delay",icon:"🌧️",color:"#334155",bg:"#F8FAFC"},
  {id:"utilities",label:"Power/Utilities",icon:"⚡",color:"#D97706",bg:"#FFFBEB"},
  {id:"other",label:"Other Issue",icon:"📋",color:"#64748B",bg:"#F8FAFC"},
]
const KIT=Object.fromEntries(KITCHEN_ISSUE_TYPES.map(t=>[t.id,t]))
const ANN_TYPES={
  general:{label:"General",color:"#2563EB",bg:"#EFF6FF"},
  weather:{label:"Weather Delay",color:"#0891B2",bg:"#E0F2FE"},
  closure:{label:"Closure",color:"#DC2626",bg:"#FEF2F2"},
  coverage:{label:"Coverage Needed",color:"#15803D",bg:"#F0FDF4"},
  training:{label:"Training",color:"#7C3AED",bg:"#F5F3FF"},
  urgent:{label:"Urgent",color:"#B45309",bg:"#FFFBEB"},
}

function KitchenPage({user,schools,supaUsers,isAdmin,toast,kmAnnouncementsOnly=false,events=[]}){
  const isKM=user.role==="kitchen_manager"
  const canManageAll=["admin","director","supervisor","chef"].includes(user.role)

  // If KM accessed via announcements route, show announcements only
  const [tab,setTab]=useState(kmAnnouncementsOnly?"announcements":isKM?"report":"issues")
  const [issues,setIssues]=useState([])
  const [announcements,setAnnouncements]=useState([])
  const [messages,setMessages]=useState([])
  const [form,setForm]=useState({type:"equipment",title:"",description:"",priority:"normal",school_id:""})
  const [annForm,setAnnForm]=useState({title:"",body:"",type:"general"})
  const [msgForm,setMsgForm]=useState({to_school_id:"",body:""})
  const [annModal,setAnnModal]=useState(false)
  const [msgModal,setMsgModal]=useState(false)
  const [loading,setLoading]=useState(false)
  const [mobile,setMobile]=useState(window.innerWidth<768)
  useEffect(()=>{const fn=()=>setMobile(window.innerWidth<768);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn)},[])

  const userSchoolIds=supaUsers.find(u=>u.id===user.id)?.school_ids||[]
  const mySchool=schools.find(s=>userSchoolIds.includes(s.id))

  useEffect(()=>{loadIssues();loadAnnouncements();loadMessages()},[])

  const loadIssues=async()=>{
    const{data}=await supabase.from("kitchen_issues").select("*").order("created_at",{ascending:false})
    if(data)setIssues(data)
  }
  const loadAnnouncements=async()=>{
    const{data}=await supabase.from("announcements").select("*").order("created_at",{ascending:false})
    if(data)setAnnouncements(data)
  }
  const loadMessages=async()=>{
    const{data}=await supabase.from("kitchen_messages").select("*").order("created_at",{ascending:false})
    if(data)setMessages(data)
  }

  const submitIssue=async()=>{
    if(!form.title.trim()){toast.show("Please add a title.","error");return}
    const schoolId=canManageAll?form.school_id:(mySchool?.id||"")
    if(!schoolId){toast.show("No school assigned.","error");return}
    setLoading(true)
    const ni={id:uid(),type:form.type,title:form.title.trim(),description:form.description.trim(),priority:form.priority,school_id:schoolId,created_by:user.id,created_by_name:user.name||user.email,created_at:new Date().toISOString(),resolved:false,resolution_note:""}
    const{error}=await supabase.from("kitchen_issues").insert(ni)
    if(error){toast.show("Failed: "+error.message,"error");setLoading(false);return}
    setIssues(p=>[ni,...p])
    setForm({type:"equipment",title:"",description:"",priority:"normal",school_id:""})
    toast.show("Issue reported!")
    setLoading(false)
  }

  const resolveIssue=async(issue,note)=>{
    await supabase.from("kitchen_issues").update({resolved:true,resolution_note:note,resolved_at:new Date().toISOString()}).eq("id",issue.id)
    setIssues(p=>p.map(x=>x.id===issue.id?{...x,resolved:true,resolution_note:note}:x))
    toast.show("Issue resolved!")
  }

  const submitAnn=async()=>{
    if(!annForm.title.trim())return
    const na={id:uid(),...annForm,title:annForm.title.trim(),created_by:user.id,created_by_name:user.name||user.email,created_at:new Date().toISOString()}
    await supabase.from("announcements").insert(na)
    setAnnouncements(p=>[na,...p])
    setAnnForm({title:"",body:"",type:"general"})
    setAnnModal(false)
    toast.show("Announcement posted!")
  }

  const sendMessage=async()=>{
    if(!msgForm.body.trim())return
    const nm={id:uid(),from_user_id:user.id,from_name:user.name||user.email,to_school_id:msgForm.to_school_id||null,body:msgForm.body.trim(),created_at:new Date().toISOString(),read:false}
    await supabase.from("kitchen_messages").insert(nm)
    setMessages(p=>[nm,...p])
    setMsgForm({to_school_id:"",body:""})
    setMsgModal(false)
    toast.show("Message sent!")
  }

  const myIssues=canManageAll?issues:issues.filter(i=>userSchoolIds.includes(i.school_id))
  const openIssues=myIssues.filter(i=>!i.resolved)
  const resolvedIssues=myIssues.filter(i=>i.resolved)
  const myMessages=isKM?messages.filter(m=>!m.to_school_id||userSchoolIds.includes(m.to_school_id)):messages

  // KM tabs: Report, Announcements, Inbox
  // Others: Issues, Announcements, Send Message
  const kmTabs=[{id:"report",label:"Report Issue"},{id:"announcements",label:"Announcements"},{id:"calendar",label:"Calendar"},{id:"inbox",label:"Inbox"}]
  const staffTabs=[{id:"issues",label:"Open Issues"+(openIssues.length>0?" ("+openIssues.length+")":"")},{id:"resolved",label:"Resolved"},{id:"announcements",label:"Announcements"},{id:"messages",label:"Messages"}]

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader
        title="Kitchen Hub"
        subtitle={isKM?(mySchool?.name||"Your Kitchen"):"District Kitchen Issues & Communications"}
        action={
          <div style={{display:"flex",gap:8}}>
            {canManageAll&&<Btn onClick={()=>setAnnModal(true)} sm><Plus size={13}/> Announcement</Btn>}
            {canManageAll&&<Btn onClick={()=>setMsgModal(true)} variant="outline" sm><Plus size={13}/> Message Kitchen</Btn>}
          </div>
        }
      />

      {isKM&&announcements.length>0&&(
        <div style={{background:"linear-gradient(135deg,#1D4ED8,#2563EB)",borderRadius:R.lg,padding:"14px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:14,boxShadow:"0 4px 12px rgba(37,99,235,.3)",cursor:"pointer"}} onClick={()=>setTab("announcements")}>
          <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>📢</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:13,color:"#fff",marginBottom:2}}>{announcements[0].title}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.75)"}}>Latest announcement · tap to see all {announcements.length}</div>
          </div>
          <div style={{color:"rgba(255,255,255,.6)",fontSize:20}}>›</div>
        </div>
      )}

      {canManageAll&&(
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:10,marginBottom:20}}>
          <div style={{background:"#FEF2F2",borderRadius:R.lg,padding:"14px 16px",border:"1px solid #FECACA",textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:900,color:"#DC2626"}}>{openIssues.filter(i=>i.priority==="urgent").length}</div>
            <div style={{fontSize:11,fontWeight:600,color:"#B91C1C",marginTop:3}}>Urgent</div>
          </div>
          <div style={{background:"#FFF7ED",borderRadius:R.lg,padding:"14px 16px",border:"1px solid #FED7AA",textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:900,color:"#C2410C"}}>{openIssues.length}</div>
            <div style={{fontSize:11,fontWeight:600,color:"#9A3412",marginTop:3}}>Open Issues</div>
          </div>
          <div style={{background:"#F0FDF4",borderRadius:R.lg,padding:"14px 16px",border:"1px solid #BBF7D0",textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:900,color:"#15803D"}}>{resolvedIssues.length}</div>
            <div style={{fontSize:11,fontWeight:600,color:"#14532D",marginTop:3}}>Resolved</div>
          </div>
          <div style={{background:"#EFF6FF",borderRadius:R.lg,padding:"14px 16px",border:"1px solid #BFDBFE",textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:900,color:"#1D4ED8"}}>{[...new Set(openIssues.map(i=>i.school_id))].length}</div>
            <div style={{fontSize:11,fontWeight:600,color:"#1E40AF",marginTop:3}}>Schools Affected</div>
          </div>
        </div>
      )}

      <TabBar tabs={isKM?kmTabs:staffTabs} active={tab} set={setTab}/>

      {/* REPORT ISSUE - KM only */}
      {tab==="report"&&isKM&&(
        <div style={{maxWidth:580,display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:R.md,padding:"12px 16px",fontSize:13,color:"#92400E",display:"flex",gap:10}}>
            <span style={{fontSize:18,flexShrink:0}}>⏰</span>
            <span><strong>Reminder:</strong> Time off requests must still be submitted on the kitchen computer time clock system. This form is for operational issues only.</span>
          </div>
          {mySchool&&<div style={{background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:R.md,padding:"10px 14px",fontSize:13,fontWeight:600,color:"#0369A1"}}>📍 Reporting for: {mySchool.name}</div>}
          <Box style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <L>Issue Type</L>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:7}}>
                {KITCHEN_ISSUE_TYPES.map(t=>{const a=form.type===t.id;return(
                  <button key={t.id} onClick={()=>setForm(f=>({...f,type:t.id}))} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:R.md,border:"2px solid "+(a?t.color:C.border),background:a?t.bg:"#fff",color:a?t.color:C.textMuted,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",textAlign:"left"}}>
                    <span style={{fontSize:16}}>{t.icon}</span>{t.label}
                  </button>
                )})}
              </div>
            </div>
            <div><L>Title / Summary *</L><Inp value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Oven not heating, pest sighting in dry storage..."/></div>
            <div><L>Details</L><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} placeholder="Describe the issue in detail..." style={{...inp,resize:"vertical",lineHeight:1.6}}/></div>
            <div>
              <L>Priority</L>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[{id:"low",l:"Low",c:"#16A34A",bg:"#F0FDF4"},{id:"normal",l:"Normal",c:"#2563EB",bg:"#EFF6FF"},{id:"urgent",l:"Urgent 🔴",c:"#DC2626",bg:"#FEF2F2"}].map(p=>{const a=form.priority===p.id;return(
                  <button key={p.id} onClick={()=>setForm(f=>({...f,priority:p.id}))} style={{padding:"10px",borderRadius:R.md,border:"2px solid "+(a?p.c:C.border),background:a?p.bg:"#fff",color:a?p.c:C.textMuted,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>{p.l}</button>
                )})}
              </div>
            </div>
          </Box>
          <Btn onClick={submitIssue} disabled={loading}><CheckCircle size={14}/>{loading?"Submitting...":"Submit Issue"}</Btn>
        </div>
      )}

      {/* OPEN ISSUES - Staff view */}
      {tab==="issues"&&canManageAll&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {openIssues.length===0?(
            <Box style={{textAlign:"center",padding:48,color:C.textMuted}}><div style={{fontSize:32,marginBottom:8}}>✅</div><div style={{fontWeight:700}}>No open issues!</div></Box>
          ):openIssues.sort((a,b)=>{const p={urgent:0,normal:1,low:2};return(p[a.priority]||1)-(p[b.priority]||1)}).map(issue=>(
            <KitchenIssueCard key={issue.id} issue={issue} schools={schools} canManage={true} onResolve={resolveIssue}/>
          ))}
        </div>
      )}

      {/* RESOLVED - Staff view */}
      {tab==="resolved"&&canManageAll&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {resolvedIssues.length===0?(
            <Box style={{textAlign:"center",padding:40,color:C.textMuted}}>No resolved issues yet.</Box>
          ):resolvedIssues.map(issue=>(
            <KitchenIssueCard key={issue.id} issue={issue} schools={schools} canManage={false} onResolve={resolveIssue}/>
          ))}
        </div>
      )}

      {/* ANNOUNCEMENTS - both KM and staff see this */}
      {tab==="announcements"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {canManageAll&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:4}}><Btn onClick={()=>setAnnModal(true)} sm><Plus size={13}/> Post Announcement</Btn></div>}
          {announcements.length===0?(
            <Box style={{textAlign:"center",padding:40,color:C.textMuted}}><div style={{fontSize:32,marginBottom:8}}>📢</div><div style={{fontWeight:700}}>No announcements yet.</div></Box>
          ):announcements.map(ann=>{
            const at=ANN_TYPES[ann.type]||ANN_TYPES.general
            return(
              <Box key={ann.id} style={{padding:16,borderLeft:"4px solid "+at.color}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:8}}>
                      <Pill bg={at.bg} tx={at.color}>{at.label}</Pill>
                      <span style={{fontSize:11,color:C.textLight}}>{fd(ann.created_at?.slice(0,10)||TODAY)}</span>
                      {ann.created_by_name&&<span style={{fontSize:11,color:C.textLight}}>by {ann.created_by_name}</span>}
                    </div>
                    <div style={{fontWeight:800,fontSize:15,color:C.text,marginBottom:6}}>{ann.title}</div>
                    {ann.body&&<div style={{fontSize:13,color:C.textMuted,lineHeight:1.7}}>{ann.body}</div>}
                  </div>
                  {canManageAll&&<button onClick={async()=>{if(!window.confirm("Delete?"))return;await supabase.from("announcements").delete().eq("id",ann.id);setAnnouncements(p=>p.filter(x=>x.id!==ann.id));toast.show("Deleted.")}} style={{background:"#FEF2F2",border:"none",borderRadius:R.md,padding:"4px 8px",cursor:"pointer",color:"#DC2626",fontSize:11,fontWeight:700,fontFamily:"inherit",flexShrink:0}}>Del</button>}
                </div>
              </Box>
            )
          })}
        </div>
      )}

      {/* CALENDAR - KM sees events */}
      {tab==="calendar"&&isKM&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          
          {events.filter(e=>!e.school_ids?.length||e.school_ids.includes(mySchool?.id)).length===0?(
            <Box style={{textAlign:"center",padding:40,color:C.textMuted}}><div style={{fontSize:32,marginBottom:8}}>📅</div><div style={{fontWeight:700}}>No upcoming events.</div></Box>
          ):events.filter(e=>!e.school_ids?.length||e.school_ids.includes(mySchool?.id)).sort((a,b)=>a.date.localeCompare(b.date)).map(e=>{
            const et=ET[e.type]||ET.other
            return(
              <Box key={e.id} style={{padding:16,borderLeft:"4px solid "+et.color}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>
                  <Pill bg={et.bg} tx={et.color} bd={et.bd}>{et.label}</Pill>
                  <span style={{fontSize:12,color:C.textMuted}}>{fd(e.date)}{e.time&&" at "+fmt(e.time)}{e.end_time&&" - "+fmt(e.end_time)}</span>
                </div>
                <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>{e.title}</div>
                {e.location&&<div style={{fontSize:12,color:C.textMuted,marginBottom:4}}>📍 {e.location}</div>}
                {e.description&&<div style={{fontSize:12,color:C.textMuted,lineHeight:1.6}}>{e.description}</div>}
              </Box>
            )
          })}
        </div>
      )}

      {/* INBOX - KM sees messages */}
      {tab==="inbox"&&isKM&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {myMessages.length===0?(
            <Box style={{textAlign:"center",padding:40,color:C.textMuted}}><div style={{fontSize:32,marginBottom:8}}>📬</div><div style={{fontWeight:700}}>No messages yet.</div><div style={{fontSize:13,color:C.textLight,marginTop:6}}>Messages from Admin, Directors and Supervisors will appear here.</div></Box>
          ):myMessages.map(msg=>(
            <KitchenMessageCard key={msg.id} msg={msg} user={user} onReply={async(body)=>{
              const nm={id:uid(),from_user_id:user.id,from_name:user.name||user.email,to_school_id:msg.to_school_id,body:"↩ Re: "+msg.body.slice(0,30)+"...\n\n"+body,created_at:new Date().toISOString(),read:false,reply_to:msg.id}
              await supabase.from("kitchen_messages").insert(nm)
              setMessages(p=>[nm,...p])
              toast.show("Reply sent!")
            }} onAck={async()=>{
              await supabase.from("kitchen_messages").update({read:true}).eq("id",msg.id)
              setMessages(p=>p.map(x=>x.id===msg.id?{...x,read:true}:x))
              toast.show("Acknowledged!")
            }}/>
          ))}
        </div>
      )}

      {/* MESSAGES - Staff sends to kitchens */}
      {tab==="messages"&&canManageAll&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:4}}><Btn onClick={()=>setMsgModal(true)} sm><Plus size={13}/> Send Message</Btn></div>
          {myMessages.length===0?(
            <Box style={{textAlign:"center",padding:40,color:C.textMuted}}><div style={{fontSize:32,marginBottom:8}}>💬</div><div style={{fontWeight:700}}>No messages sent yet.</div></Box>
          ):myMessages.map(msg=>{
            const sch=schools.find(s=>s.id===msg.to_school_id)
            return(
              <Box key={msg.id} style={{padding:14,borderLeft:"3px solid #7C3AED"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontWeight:700,fontSize:13,color:C.text}}>To: {sch?.name||"All Kitchens"}</span>
                    <span style={{fontSize:11,color:C.textMuted}}>from {msg.from_name}</span>
                  </div>
                  <span style={{fontSize:11,color:C.textLight}}>{ft(msg.created_at)}</span>
                </div>
                <div style={{fontSize:13,color:C.textMuted,lineHeight:1.6}}>{msg.body}</div>
              </Box>
            )
          })}
        </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {annModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",zIndex:50,overflowY:"auto"}}>
          <div style={{background:"#fff",borderRadius:R.xl,width:"100%",maxWidth:480,boxShadow:SH.lg,marginTop:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:"1px solid #E2E8F0"}}>
              <span style={{fontWeight:800,fontSize:15,color:C.text}}>Post Announcement</span>
              <button onClick={()=>setAnnModal(false)} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,cursor:"pointer",color:C.textMuted,display:"flex",padding:7}}><X size={14}/></button>
            </div>
            <div style={{padding:22,display:"flex",flexDirection:"column",gap:14}}>
              <div><L>Title *</L><Inp value={annForm.title} onChange={e=>setAnnForm(f=>({...f,title:e.target.value}))} placeholder="e.g. 2-Hour Delay Tomorrow - Weather"/></div>
              <div><L>Type</L>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                  {Object.entries(ANN_TYPES).map(([id,t])=>{const a=annForm.type===id;return(
                    <button key={id} onClick={()=>setAnnForm(f=>({...f,type:id}))} style={{padding:"8px 4px",borderRadius:R.md,border:"2px solid "+(a?t.color:C.border),background:a?t.bg:"#fff",color:a?t.color:C.textMuted,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>{t.label}</button>
                  )})}
                </div>
              </div>
              <div><L>Message</L><textarea value={annForm.body} onChange={e=>setAnnForm(f=>({...f,body:e.target.value}))} rows={4} placeholder="Write your announcement..." style={{...inp,resize:"vertical",lineHeight:1.6}}/></div>
              <div style={{display:"flex",gap:10}}><Btn onClick={()=>setAnnModal(false)} variant="outline">Cancel</Btn><Btn onClick={submitAnn} disabled={!annForm.title.trim()}>Post</Btn></div>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE MODAL */}
      {msgModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",zIndex:50,overflowY:"auto"}}>
          <div style={{background:"#fff",borderRadius:R.xl,width:"100%",maxWidth:480,boxShadow:SH.lg,marginTop:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:"1px solid #E2E8F0"}}>
              <span style={{fontWeight:800,fontSize:15,color:C.text}}>Send Message to Kitchen</span>
              <button onClick={()=>setMsgModal(false)} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,cursor:"pointer",color:C.textMuted,display:"flex",padding:7}}><X size={14}/></button>
            </div>
            <div style={{padding:22,display:"flex",flexDirection:"column",gap:14}}>
              <div><L>Send To</L><SG schools={schools} value={msgForm.to_school_id} onChange={e=>setMsgForm(f=>({...f,to_school_id:e.target.value}))} all="All Kitchens"/></div>
              <div><L>Message *</L><textarea value={msgForm.body} onChange={e=>setMsgForm(f=>({...f,body:e.target.value}))} rows={4} placeholder="Type your message..." style={{...inp,resize:"vertical",lineHeight:1.6}}/></div>
              <div style={{display:"flex",gap:10}}><Btn onClick={()=>setMsgModal(false)} variant="outline">Cancel</Btn><Btn onClick={sendMessage} disabled={!msgForm.body.trim()}>Send</Btn></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function KitchenIssueCard({issue,schools,canManage,onResolve}){
  const [showResolve,setShowResolve]=useState(false)
  const [note,setNote]=useState("")
  const kit=KIT[issue.type]||KIT.other
  const sch=schools.find(s=>s.id===issue.school_id)
  const pri={urgent:{bg:"#FEF2F2",tx:"#DC2626",bd:"#FECACA",label:"🔴 Urgent"},normal:{bg:"#EFF6FF",tx:"#2563EB",bd:"#BFDBFE",label:"Normal"},low:{bg:"#F0FDF4",tx:"#16A34A",bd:"#BBF7D0",label:"Low"}}[issue.priority]||{bg:"#EFF6FF",tx:"#2563EB",bd:"#BFDBFE",label:"Normal"}
  return(
    <Box style={{padding:16,borderLeft:"4px solid "+(issue.resolved?"#16A34A":kit.color)}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:8}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:6}}>
            <span style={{fontSize:18}}>{kit.icon}</span>
            <Pill bg={kit.bg} tx={kit.color}>{kit.label}</Pill>
            <Pill bg={pri.bg} tx={pri.tx} bd={pri.bd}>{pri.label}</Pill>
            {issue.resolved&&<Pill bg="#F0FDF4" tx="#15803D" bd="#BBF7D0">✅ Resolved</Pill>}
          </div>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>{issue.title}</div>
          {issue.description&&<div style={{fontSize:12,color:C.textMuted,lineHeight:1.6,marginBottom:6}}>{issue.description}</div>}
          {issue.resolved&&issue.resolution_note&&<div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:R.md,padding:"6px 10px",fontSize:12,color:"#15803D",marginBottom:6}}>Resolution: {issue.resolution_note}</div>}
          <div style={{fontSize:11,color:C.textLight,display:"flex",gap:10,flexWrap:"wrap"}}>
            <span>📍 {sch?.name||"--"}</span>
            <span>By {issue.created_by_name||"--"}</span>
            <span>{ft(issue.created_at)}</span>
          </div>
        </div>
        {canManage&&!issue.resolved&&(
          <button onClick={()=>setShowResolve(v=>!v)} style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:R.md,padding:"5px 10px",cursor:"pointer",color:"#15803D",fontSize:12,fontWeight:700,fontFamily:"inherit",flexShrink:0,display:"flex",alignItems:"center",gap:4}}><CheckSquare size={12}/> Resolve</button>
        )}
      </div>
      {showResolve&&(
        <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:R.md,padding:14,marginTop:4}}>
          <L>Resolution Note (optional)</L>
          <textarea value={note} onChange={e=>setNote(e.target.value)} rows={2} placeholder="How was this resolved?" style={{...inp,resize:"vertical",marginBottom:10}}/>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={()=>setShowResolve(false)} variant="outline" sm>Cancel</Btn>
            <Btn onClick={()=>{onResolve(issue,note);setShowResolve(false)}} variant="success" sm>Mark Resolved</Btn>
          </div>
        </div>
      )}
    </Box>
  )
}

function KitchenMessageCard({msg,user,onReply,onAck}){
  const [showReply,setShowReply]=useState(false)
  const [replyText,setReplyText]=useState("")
  const isOwn=msg.from_user_id===user.id
  return(
    <Box style={{padding:14,borderLeft:"3px solid "+(msg.read?"#E2E8F0":"#2563EB"),background:msg.read?"#FAFAFA":"#fff"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontWeight:700,fontSize:13,color:C.text}}>{msg.from_name||"Staff"}</span>
          {!msg.read&&!isOwn&&<span style={{background:"#2563EB",color:"#fff",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:R.full}}>NEW</span>}
        </div>
        <span style={{fontSize:11,color:C.textLight}}>{ft(msg.created_at)}</span>
      </div>
      <div style={{fontSize:13,color:C.text,lineHeight:1.6,marginBottom:10,whiteSpace:"pre-wrap"}}>{msg.body}</div>
      {!isOwn&&(
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {!msg.read&&<button onClick={onAck} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:R.md,border:"1px solid #BBF7D0",background:"#F0FDF4",color:"#15803D",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><Check size={11}/>Acknowledge</button>}
          <button onClick={()=>setShowReply(v=>!v)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:R.md,border:"1px solid #BFDBFE",background:"#EFF6FF",color:"#1D4ED8",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>↩ Reply</button>
        </div>
      )}
      {showReply&&(
        <div style={{marginTop:10,background:"#F8FAFC",borderRadius:R.md,padding:12}}>
          <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} rows={3} placeholder="Type your reply..." style={{...inp,resize:"vertical",marginBottom:8}}/>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={()=>setShowReply(false)} variant="outline" sm>Cancel</Btn>
            <Btn onClick={()=>{onReply(replyText);setReplyText("");setShowReply(false)}} disabled={!replyText.trim()} sm>Send Reply</Btn>
          </div>
        </div>
      )}
    </Box>
  )
}

function InboxPage({user,schools,supaUsers,toast}){
  const [messages,setMessages]=useState([])
  const [loading,setLoading]=useState(true)
  const [msgModal,setMsgModal]=useState(false)
  const [msgForm,setMsgForm]=useState({to_school_id:"",to_user_id:"",body:""})
  const [replyModal,setReplyModal]=useState(null)
  const [replyText,setReplyText]=useState("")
  const canSend=["admin","director","supervisor","chef"].includes(user.role)
  const isKM=user.role==="kitchen_manager"
  const mySchoolIds=supaUsers.find(u=>u.id===user.id)?.school_ids||[]

  useEffect(()=>{
    supabase.from("kitchen_messages").select("*").order("created_at",{ascending:false}).then(({data})=>{
      if(data)setMessages(data)
      setLoading(false)
    })
  },[])

  const sendMessage=async(toSchoolId,toUserId,body,replyToId=null)=>{
    if(!body.trim())return
    const nm={id:uid(),from_user_id:user.id,from_name:user.name||user.email,from_role:user.role,to_school_id:toSchoolId||null,to_user_id:toUserId||null,body:body.trim(),created_at:new Date().toISOString(),read:false,acknowledged:false,reply_to:replyToId||null}
    const{error}=await supabase.from("kitchen_messages").insert(nm)
    if(error){toast.show("Failed to send: "+error.message,"error");return}
    setMessages(p=>[nm,...p])
    toast.show("Message sent!")
  }

  const acknowledge=async(msg)=>{
    await supabase.from("kitchen_messages").update({acknowledged:true,read:true}).eq("id",msg.id)
    setMessages(p=>p.map(x=>x.id===msg.id?{...x,acknowledged:true,read:true}:x))
    toast.show("Acknowledged!")
  }

  // Filter messages relevant to current user
  const myMessages=isKM
    ?messages.filter(m=>!m.to_school_id||mySchoolIds.includes(m.to_school_id)||m.from_user_id===user.id)
    :messages // staff see all

  const unread=myMessages.filter(m=>!m.read&&m.from_user_id!==user.id).length

  const getSchoolName=id=>schools.find(s=>s.id===id)?.name||"All Kitchens"

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader
        title="Kitchen Messages"
        subtitle={unread>0?unread+" unread":(myMessages.length+" message"+(myMessages.length!==1?"s":""))}
        action={canSend&&<Btn onClick={()=>setMsgModal(true)}><Plus size={14}/> New Message</Btn>}
      />

      {/* SEND MESSAGE MODAL */}
      {msgModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",zIndex:50,overflowY:"auto"}}>
          <div style={{background:"#fff",borderRadius:R.xl,width:"100%",maxWidth:480,boxShadow:SH.lg,marginTop:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:"1px solid #E2E8F0"}}>
              <span style={{fontWeight:800,fontSize:15,color:C.text}}>New Message to Kitchen</span>
              <button onClick={()=>setMsgModal(false)} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,cursor:"pointer",color:C.textMuted,display:"flex",padding:7}}><X size={14}/></button>
            </div>
            <div style={{padding:22,display:"flex",flexDirection:"column",gap:14}}>
              <div><L>Send To</L><SG schools={schools} value={msgForm.to_school_id} onChange={e=>setMsgForm(f=>({...f,to_school_id:e.target.value}))} all="All Kitchens"/></div>
              <div><L>Message *</L><textarea value={msgForm.body} onChange={e=>setMsgForm(f=>({...f,body:e.target.value}))} rows={4} placeholder="Type your message to the kitchen..." style={{...inp,resize:"vertical",lineHeight:1.6}}/></div>
              <div style={{display:"flex",gap:10}}>
                <Btn onClick={()=>setMsgModal(false)} variant="outline">Cancel</Btn>
                <Btn onClick={async()=>{await sendMessage(msgForm.to_school_id,"",msgForm.body,null);setMsgForm({to_school_id:"",body:""});setMsgModal(false)}} disabled={!msgForm.body.trim()}>Send</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPLY MODAL */}
      {replyModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",zIndex:50,overflowY:"auto"}}>
          <div style={{background:"#fff",borderRadius:R.xl,width:"100%",maxWidth:480,boxShadow:SH.lg,marginTop:20}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:"1px solid #E2E8F0"}}>
              <span style={{fontWeight:800,fontSize:15,color:C.text}}>Reply to {replyModal.from_name}</span>
              <button onClick={()=>{setReplyModal(null);setReplyText("")}} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,cursor:"pointer",color:C.textMuted,display:"flex",padding:7}}><X size={14}/></button>
            </div>
            <div style={{padding:22,display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,padding:"10px 14px",fontSize:13,color:C.textMuted,lineHeight:1.6,fontStyle:"italic"}}>"{replyModal.body.slice(0,120)}{replyModal.body.length>120?"...":""}"</div>
              <div><L>Your Reply *</L><textarea value={replyText} onChange={e=>setReplyText(e.target.value)} rows={4} placeholder="Type your reply..." style={{...inp,resize:"vertical",lineHeight:1.6}}/></div>
              <div style={{display:"flex",gap:10}}>
                <Btn onClick={()=>{setReplyModal(null);setReplyText("")}} variant="outline">Cancel</Btn>
                <Btn onClick={async()=>{
                  await sendMessage(replyModal.to_school_id,replyModal.from_user_id,replyText,replyModal.id)
                  setReplyModal(null);setReplyText("")
                }} disabled={!replyText.trim()}>Send Reply</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading?(
        <Box style={{textAlign:"center",padding:40,color:C.textMuted}}>Loading...</Box>
      ):myMessages.length===0?(
        <Box style={{textAlign:"center",padding:40,color:C.textMuted}}>
          <div style={{fontSize:32,marginBottom:8}}>📬</div>
          <div style={{fontWeight:700}}>No messages yet.</div>
          {canSend&&<div style={{marginTop:12}}><Btn onClick={()=>setMsgModal(true)} sm><Plus size={13}/> Send First Message</Btn></div>}
        </Box>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {myMessages.map(msg=>{
            const isOwn=msg.from_user_id===user.id
            const isReply=!!msg.reply_to
            const originalMsg=msg.reply_to?myMessages.find(m=>m.id===msg.reply_to):null
            const canReply=!isOwn
            const canAck=!isOwn&&isKM&&!msg.acknowledged
            return(
              <Box key={msg.id} style={{padding:16,borderLeft:"4px solid "+(isOwn?"#7C3AED":msg.acknowledged?"#16A34A":msg.read?"#E2E8F0":"#2563EB"),background:isOwn?"#FAFAFA":"#fff"}}>
                {/* Header */}
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:8}}>
                  <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:8}}>
                    {isOwn?(
                      <span style={{fontWeight:700,fontSize:13,color:"#7C3AED"}}>You → {msg.to_school_id?getSchoolName(msg.to_school_id):"All Kitchens"}</span>
                    ):(
                      <span style={{fontWeight:700,fontSize:13,color:C.text}}>{msg.from_name||"Staff"}</span>
                    )}
                    {isReply&&<span style={{fontSize:10,background:"#F5F3FF",color:"#7C3AED",padding:"1px 6px",borderRadius:R.full,fontWeight:700}}>↩ Reply</span>}
                    {!isOwn&&!msg.read&&<span style={{fontSize:10,background:"#2563EB",color:"#fff",padding:"1px 6px",borderRadius:R.full,fontWeight:700}}>NEW</span>}
                    {msg.acknowledged&&<span style={{fontSize:10,background:"#F0FDF4",color:"#15803D",padding:"1px 6px",borderRadius:R.full,fontWeight:700}}>✓ Acknowledged</span>}
                  </div>
                  <span style={{fontSize:11,color:C.textLight,flexShrink:0}}>{ft(msg.created_at)}</span>
                </div>

                {/* Quoted reply */}
                {isReply&&originalMsg&&(
                  <div style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,padding:"6px 10px",fontSize:11,color:C.textMuted,marginBottom:8,fontStyle:"italic"}}>
                    Re: "{originalMsg.body.slice(0,80)}{originalMsg.body.length>80?"...":""}"
                  </div>
                )}

                {/* Message body */}
                <div style={{fontSize:13,color:C.text,lineHeight:1.7,marginBottom:10,whiteSpace:"pre-wrap"}}>{msg.body}</div>

                {/* Actions */}
                {(canReply||canAck)&&(
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {canAck&&(
                      <button onClick={()=>acknowledge(msg)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:R.md,border:"1px solid #BBF7D0",background:"#F0FDF4",color:"#15803D",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                        <Check size={11}/>Acknowledge
                      </button>
                    )}
                    {canReply&&(
                      <button onClick={()=>setReplyModal(msg)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:R.md,border:"1px solid #BFDBFE",background:"#EFF6FF",color:"#1D4ED8",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                        ↩ Reply
                      </button>
                    )}
                  </div>
                )}
              </Box>
            )
          })}
        </div>
      )}
    </div>
  )
}
