import { useState, useEffect } from "react"
import { supabase } from "./supabase.js"
import { LayoutDashboard, PlusCircle, Building2, BarChart3, ShieldCheck, ClipboardList, BookOpen, LogOut, X, Check, CheckCircle, AlertCircle, Eye, EyeOff, Edit2, StickyNote, Plus, Printer, RefreshCw, Menu, CheckSquare, Calendar } from "lucide-react"

const SCHOOLS=[{id:"s1",name:"Adams High School",type:"hs"},{id:"s2",name:"Washington High School",type:"hs"},{id:"s3",name:"Riley High School",type:"hs"},{id:"s4",name:"Rise Up Academy",type:"hs"},{id:"s4b",name:"Studebaker",type:"hs"},{id:"s5",name:"Jackson Middle School",type:"ms"},{id:"s6",name:"Jefferson Traditional School",type:"ms"},{id:"s7",name:"LaSalle Academy",type:"ms"},{id:"s8",name:"Navarre",type:"ms"},{id:"s9",name:"Dickson Academy",type:"es"},{id:"s10",name:"Edison K-8 School",type:"es"},{id:"s11",name:"Lincoln Elementary",type:"es"},{id:"s12",name:"McKinley Elementary",type:"es"},{id:"s13",name:"Monroe Elementary",type:"es"},{id:"s14",name:"Muessel Elementary",type:"es"},{id:"s15",name:"Harrison Elementary",type:"es"},{id:"s16",name:"Coquillard Elementary",type:"es"},{id:"s17",name:"Darden Elementary",type:"es"},{id:"s18",name:"Nuner Fine Arts Academy",type:"es"},{id:"s19",name:"Swanson Traditional School",type:"es"},{id:"s20",name:"Wilson Elementary School",type:"es"},{id:"s21",name:"Marshall Traditional School",type:"es"},{id:"s22",name:"Marquette Montessori Academy",type:"es"},{id:"s23",name:"Clay International Academy",type:"es"},{id:"s24",name:"Kennedy Academy",type:"es"},{id:"s25",name:"Lafayette Early Childhood Center",type:"es"},{id:"s26",name:"Madison S.T.E.A.M. Academy",type:"es"}]
const TL={hs:"High School",ms:"Middle School",es:"Elementary"}
const TC={hs:{bg:"#FFF3E0",tx:"#E65100",bd:"#FFB74D"},ms:{bg:"#E8EAF6",tx:"#283593",bd:"#9FA8DA"},es:{bg:"#E8F5E9",tx:"#1B5E20",bd:"#81C784"}}
const STATS=[{id:"green",label:"All Good",c:"#2E7D32",l:"#F1F8E9",b:"#AED581",t:"#33691E"},{id:"yellow",label:"Minor Issues",c:"#F57F17",l:"#FFFDE7",b:"#FFF176",t:"#F57F17"},{id:"red",label:"Major Problems",c:"#C62828",l:"#FFEBEE",b:"#EF9A9A",t:"#B71C1C"},{id:"partial",label:"Partial Service",c:"#6A1B9A",l:"#F3E5F5",b:"#CE93D8",t:"#6A1B9A"},{id:"delayed",label:"Delayed",c:"#00838F",l:"#E0F7FA",b:"#80DEEA",t:"#006064"},{id:"closed",label:"Closed",c:"#37474F",l:"#ECEFF1",b:"#B0BEC5",t:"#263238"}]
const SM=Object.fromEntries(STATS.map(s=>[s.id,s]))
const ISS=[{id:"food_out",label:"Ran out of food"},{id:"low_food",label:"Low food supply"},{id:"staffing",label:"Staffing issue"},{id:"equip",label:"Equipment issue"},{id:"delivery",label:"Delivery problem"},{id:"health",label:"Health/Safety"},{id:"power",label:"Power/Utilities"},{id:"behavior",label:"Student behavior"},{id:"pest",label:"Pest/Sanitation"},{id:"weather",label:"Weather-related"}]
const RC={admin:{bg:"#EDE7F6",t:"#4527A0"},supervisor:{bg:"#E1F5FE",t:"#01579B"},director:{bg:"#E8EAF6",t:"#283593"},chef:{bg:"#FFF3E0",t:"#E65100"}}
const CTB={calloff:{bg:"#E3F2FD",tx:"#1565C0",label:"Call-Off"},sick:{bg:"#FFFDE7",tx:"#F57F17",label:"Sick Day"},ncns:{bg:"#FFEBEE",tx:"#C62828",label:"No Call No Show"}}
const DIR_ROLES=[{id:"all",label:"All",color:"#546E7A",bg:"#ECEFF1"},{id:"manager",label:"Managers",color:"#1565C0",bg:"#E3F2FD"},{id:"chef",label:"Chefs",color:"#E65100",bg:"#FFF3E0"},{id:"director",label:"Directors",color:"#6A1B9A",bg:"#F3E5F5"},{id:"asst_dir",label:"Asst. Directors",color:"#006064",bg:"#E0F7FA"},{id:"supervisor",label:"Op Supervisors",color:"#1B5E20",bg:"#E8F5E9"},{id:"csa",label:"CSAs",color:"#4E342E",bg:"#EFEBE9"},{id:"ppa",label:"PPAs",color:"#283593",bg:"#E8EAF6"}]
const EMPTY_ENTRY={name:"",position:"",role_type:"manager",school_ids:[],phone:"",email:"",is_active:true}
const TODAY=new Date().toISOString().slice(0,10)
const uid=()=>Math.random().toString(36).slice(2,8)
const fd=d=>new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
const ft=ts=>new Date(ts).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})

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
  {id:"d3",name:"Sarah Chen",position:"Chef Manager",role_type:"chef",school_ids:["s1"],phone:"(574) 555-0103",email:"schen@sbcsc.edu",is_active:true},
  {id:"d4",name:"Robert Davis",position:"Chef Manager",role_type:"chef",school_ids:["s5","s6"],phone:"(574) 555-0104",email:"rdavis@sbcsc.edu",is_active:true},
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
  const [recaps,setRecaps]=useState(SR)
  const [calloffs,setCalloffs]=useState(SC)
  const [directory,setDirectory]=useState(SD)
  const [dbReady,setDbReady]=useState(false)
  const [user,setUser]=useState(null)
  const [authLoading,setAuthLoading]=useState(true)

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user)setUser({id:session.user.id,name:session.user.email.split("@")[0],email:session.user.email,role:"admin",is_active:true})
      setAuthLoading(false)
    })
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user)setUser({id:session.user.id,name:session.user.email.split("@")[0],email:session.user.email,role:"admin",is_active:true})
      else setUser(null)
    })
    return()=>subscription.unsubscribe()
  },[])

  useEffect(()=>{
    async function loadData(){
      const [r,co,d]=await Promise.all([
        supabase.from("recaps").select("*").order("created_at",{ascending:false}),
        supabase.from("calloffs").select("*").order("created_at",{ascending:false}),
        supabase.from("directory").select("*").order("name")
      ])
      if(r.data&&r.data.length>0)setRecaps(r.data)
      if(co.data&&co.data.length>0)setCalloffs(co.data)
      if(d.data&&d.data.length>0)setDirectory(d.data)
      setDbReady(true)
    }
    loadData()
  },[])
  const [page,setPage]=useState("dashboard")
  const [ctx,setCtx]=useState(null)
  const [sideOpen,setSideOpen]=useState(false)
  const [mobile,setMobile]=useState(window.innerWidth<768)
  const toast=useToast()
  useEffect(()=>{const fn=()=>setMobile(window.innerWidth<768);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn)},[])

  if(authLoading)return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui",fontSize:16,color:"#64748B",gap:12}}><div>Loading...</div></div>
  if(!user)return <Login/>
  const perms={submit:true,report:user.role!=="chef",calloffs:user.role!=="chef",directory:true,admin:user.role==="admin"}
  const sById=id=>schools.find(s=>s.id===id)
  const uById=id=>users.find(u=>u.id===id)
  const go=(pg,c=null)=>{setPage(pg);if(c)setCtx(c)}

  const navItems=[
    {id:"dashboard",label:"Dashboard",short:"Home",I:LayoutDashboard},
    {id:"submit",label:"Submit Recap",short:"Submit",I:PlusCircle},
    {id:"school",label:"School Detail",short:"School",I:Building2},
    ...(perms.report?[{id:"report",label:"Monthly Report",short:"Report",I:BarChart3}]:[]),
    ...(perms.calloffs?[{id:"calloffs",label:"Call-Offs",short:"Calls",I:ClipboardList}]:[]),
    {id:"directory",label:"Directory",short:"Dir",I:BookOpen},
    ...(perms.admin?[{id:"admin",label:"Admin Panel",short:"Admin",I:ShieldCheck}]:[]),
  ]

  const props={toast,user,schools,setSchools,recaps,setRecaps,calloffs,setCalloffs,directory,setDirectory,users,go,sById,uById,ctx,isAdmin:perms.admin}

  const PageEl=()=>{
    if(page==="dashboard")return <DashPage {...props}/>
    if(page==="submit") return <SubmitPage {...props}/>
    if(page==="school") return <SchoolPage {...props}/>
    if(page==="report") return <ReportPage {...props}/>
    if(page==="calloffs") return <CalloffsPage {...props}/>
    if(page==="directory")return <DirPage {...props}/>
    if(page==="admin") return <AdminPage {...props}/>
    return null
  }

  if(mobile){
    return(
      <div style={{background:C.bg,minHeight:"100vh",paddingBottom:72,fontFamily:"system-ui,sans-serif"}}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
        <Toast msg={toast.msg} type={toast.type}/>
        <div style={{background:"#fff",borderBottom:"1px solid #E2E8F0",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,boxShadow:SH.sm}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:10,background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontWeight:900,fontSize:14}}>O</span></div>
            <span style={{color:C.text,fontWeight:800,fontSize:16}}>Ops Daily</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}><RP role={user.role}/><button onClick={async()=>{await supabase.auth.signOut()}} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,color:C.textMuted,cursor:"pointer",display:"flex",padding:8}}><LogOut size={15}/></button></div>
        </div>
        <div style={{padding:16}}><PageEl/></div>
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #E2E8F0",zIndex:20,overflowX:"auto",boxShadow:"0 -2px 8px rgba(0,0,0,.06)"}}>
          <div style={{display:"flex",minWidth:"max-content"}}>
            {navItems.map(({id,short,I})=>{const a=page===id;return(
              <button key={id} onClick={()=>go(id)} style={{minWidth:64,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"10px 6px",border:"none",cursor:"pointer",background:"transparent",color:a?"#2563EB":"#94A3B8",borderTop:a?"2px solid #2563EB":"2px solid transparent",fontSize:10,fontWeight:700,fontFamily:"inherit"}}>
                <I size={18}/>{short}
              </button>
            )})}
          </div>
        </div>
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
          {sideOpen&&<span style={{color:C.text,fontWeight:800,fontSize:14,whiteSpace:"nowrap"}}>Ops Daily</span>}
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
          <div style={{width:56,height:56,borderRadius:16,background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 8px 24px rgba(37,99,235,.3)"}}><span style={{color:"#fff",fontWeight:900,fontSize:22}}>O</span></div>
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

function DashPage({recaps,setRecaps,schools,users,go,sById,uById,toast}){
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

  const reset=()=>{setDateFrom(TODAY);setDateTo(TODAY);setFSchool("");setFStatus("")}
  const isMultiDay=dateFrom!==dateTo

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Dashboard" subtitle={isMultiDay?fd(dateFrom)+" to "+fd(dateTo):fd(dateFrom)+" - "+totalShown+" recap"+(totalShown!==1?"s":"")} action={<Btn onClick={()=>go("submit")}><PlusCircle size={14}/> Submit Recap</Btn>}/>

      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(3,1fr)",gap:10,marginBottom:20}}>
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
    <div style={{padding:"24px 20px",maxWidth:580}}>
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

function SchoolPage({ctx,schools,recaps,setRecaps,users,toast}){
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

  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="School Detail" subtitle="View recap history for a school"/>
      <Box style={{marginBottom:14,maxWidth:300}}><L>Select School</L><SG schools={schools} value={sid} onChange={e=>setSid(e.target.value)}/></Box>
      {sch&&<>
        <div style={{marginBottom:14}}>
          {tc&&<div style={{marginBottom:10}}><Pill bg={tc.bg} tx={tc.tx} bd={tc.bd}>{TL[sch.type]}</Pill></div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[["chef","Chef Manager"],["director","Director"],["supervisor","Supervisor"]].map(([r,lab])=>(
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
      {tab==="log"&&<div style={{maxWidth:500,display:"flex",flexDirection:"column",gap:14}}>
        {err&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626",padding:"10px 14px",borderRadius:R.md,fontSize:13,display:"flex",alignItems:"center",gap:8}}><AlertCircle size={15}/>{err}</div>}
        <Box style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><L>Date</L><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{...inp,width:"100%",maxWidth:180}}/></div>
          <div><L>School *</L><SG schools={schools} value={form.school_id} onChange={e=>setForm(f=>({...f,school_id:e.target.value}))}/></div>
          <div><L>Staff Name *</L><Inp value={form.staff_name} onChange={e=>setForm(f=>({...f,staff_name:e.target.value}))} placeholder="Full name"/></div>
          <div><L>Position</L><Inp value={form.staff_role} onChange={e=>setForm(f=>({...f,staff_role:e.target.value}))} placeholder="e.g. Cook, Manager"/></div>
          <div><L>Type *</L>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[{id:"calloff",l:"Call-Off"},{id:"sick",l:"Sick Day"},{id:"ncns",l:"No Call No Show"}].map(t=>{
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
          <div><L>Type</L><select value={fT} onChange={e=>setFT(e.target.value)} style={{...inp}}><option value="">All Types</option><option value="calloff">Call-Off</option><option value="sick">Sick Day</option><option value="ncns">No Call No Show</option></select></div>
        </Box>
        {mobile?(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filtered.length===0?<Box style={{textAlign:"center",padding:32,color:C.textMuted}}>No records found.</Box>
            :filtered.map(c=>{const tb=CTB[c.type]||CTB.calloff,sch=sById(c.school_id);return(
              <Box key={c.id} style={{padding:14,borderLeft:"4px solid "+tb.tx}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:6}}>
                  <div><div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:2}}>{c.staff_name}</div>{c.staff_role&&<div style={{fontSize:12,color:C.textMuted}}>{c.staff_role}</div>}</div>
                  <Pill bg={tb.bg} tx={tb.tx}>{tb.label}</Pill>
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
                <thead><tr style={{background:"#F8FAFC",borderBottom:"2px solid #E2E8F0"}}>{["Date","School","Staff","Position","Type","Note"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:11,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                <tbody>{filtered.length===0?<tr><td colSpan={6} style={{textAlign:"center",padding:40,color:C.textMuted}}>No records.</td></tr>:filtered.map(c=>{const tb=CTB[c.type]||CTB.calloff;return(
                  <tr key={c.id} style={{borderBottom:"1px solid #F1F5F9"}}>
                    <td style={{padding:"10px 14px",color:C.textMuted,fontSize:12,whiteSpace:"nowrap"}}>{fd(c.date)}</td>
                    <td style={{padding:"10px 14px",fontWeight:600,whiteSpace:"nowrap"}}>{sById(c.school_id)?.name||"--"}</td>
                    <td style={{padding:"10px 14px",fontWeight:600,whiteSpace:"nowrap"}}>{c.staff_name}</td>
                    <td style={{padding:"10px 14px",color:C.textMuted,fontSize:12}}>{c.staff_role||"--"}</td>
                    <td style={{padding:"10px 14px"}}><Pill bg={tb.bg} tx={tb.tx}>{tb.label}</Pill></td>
                    <td style={{padding:"10px 14px",color:C.textMuted,fontSize:12,maxWidth:160}}><span style={{display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.note||"--"}</span></td>
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
    const bySchool=schools.map(s=>{const sr=all.filter(c=>c.school_id===s.id);if(!sr.length)return null;return{s,total:sr.length,calloff:sr.filter(c=>c.type==="calloff").length,sick:sr.filter(c=>c.type==="sick").length,ncns:sr.filter(c=>c.type==="ncns").length,staff:[...new Set(sr.map(c=>c.staff_name))]}}).filter(Boolean).sort((a,b)=>b.total-a.total)
    setData({total:all.length,calloff:all.filter(c=>c.type==="calloff").length,sick:all.filter(c=>c.type==="sick").length,ncns:all.filter(c=>c.type==="ncns").length,bySchool})
    setAiInsight(null)
  }

  const getAIInsight=async()=>{
    if(!data)return
    setAiLoading(true)
    const lines=data.bySchool.map(r=>r.s.name+": "+r.total+" total ("+r.calloff+" call-offs, "+r.sick+" sick, "+r.ncns+" NCNS). Staff: "+r.staff.join(", "))
    const result=await callAI([{role:"user",content:"Analyze call-off patterns for a school district food service. Write 2-3 sentences identifying concerning patterns. Be direct.\n\n"+lines.join("\n")}])
    setAiInsight(result||"Could not generate insight.")
    setAiLoading(false)
  }

  return(
    <div style={{maxWidth:680}}>
      <Box style={{marginBottom:14,padding:"12px 16px",display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
        <div><L>Month</L><input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{...inp}}/></div>
        <div style={{flex:"1 1 160px",maxWidth:260}}><L>School</L><SG schools={schools} value={sf} onChange={e=>setSf(e.target.value)} all="All Schools"/></div>
        <Btn onClick={generate} sm>Generate</Btn>
        {data&&<AIBtn onClick={getAIInsight} loading={aiLoading}>{aiLoading?"Analyzing...":"AI Patterns"}</AIBtn>}
      </Box>
      {aiInsight&&<AISummaryBox text={aiInsight}/>}
      {data&&<>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:10,marginBottom:14}}>
          {[{label:"Total",val:data.total,bg:"#F8FAFC",tx:C.text,bd:"#E2E8F0"},{label:"Call-Offs",val:data.calloff,bg:"#EFF6FF",tx:"#1D4ED8",bd:"#BFDBFE"},{label:"Sick Days",val:data.sick,bg:"#FFFBEB",tx:"#B45309",bd:"#FDE68A"},{label:"No Call No Show",val:data.ncns,bg:"#FEF2F2",tx:"#DC2626",bd:"#FECACA"}].map(c=>(
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
              <div style={{display:"flex",gap:3,height:7,borderRadius:R.full,overflow:"hidden",marginBottom:8}}>
                {row.calloff>0&&<div style={{flex:row.calloff,background:"#3B82F6"}}/>}
                {row.sick>0&&<div style={{flex:row.sick,background:"#F59E0B"}}/>}
                {row.ncns>0&&<div style={{flex:row.ncns,background:"#EF4444"}}/>}
              </div>
              <div style={{display:"flex",gap:14,fontSize:12}}>
                {row.calloff>0&&<span style={{color:"#1D4ED8",fontWeight:700}}>Call-Off: {row.calloff}</span>}
                {row.sick>0&&<span style={{color:"#B45309",fontWeight:700}}>Sick: {row.sick}</span>}
                {row.ncns>0&&<span style={{color:"#DC2626",fontWeight:700}}>NCNS: {row.ncns}</span>}
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
    if(modal==="add"){const newEntry={...form,id:uid(),name:form.name.trim()};setDirectory(p=>[...p,newEntry]);await supabase.from("directory").insert(newEntry);toast.show("Staff member added!")}
    else{const updated={...form,id:modal.id,name:form.name.trim()};setDirectory(p=>p.map(e=>e.id===modal.id?updated:e));await supabase.from("directory").update(updated).eq("id",modal.id);toast.show("Staff member updated!")}
    setModal(null)
  }
  const del=async e=>{if(window.confirm("Remove "+e.name+"?")){setDirectory(p=>p.filter(x=>x.id!==e.id));await supabase.from("directory").delete().eq("id",e.id);toast.show(e.name+" removed.")}}
  const roleMeta=id=>DIR_ROLES.find(r=>r.id===id)||{label:"Staff",color:C.textMuted,bg:C.bg}
  const toggleSchool=(sid)=>{const ids=form.school_ids||[];setForm(f=>({...f,school_ids:ids.includes(sid)?ids.filter(x=>x!==sid):[...ids,sid]}))}
  const getSchoolNames=e=>{const ids=e.school_ids||[];if(!ids.length)return null;if(ids.length===1)return sById(ids[0])?.name||"--";return ids.length+" schools"}

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
                  <td style={{padding:"11px 14px",fontSize:12,color:C.text,maxWidth:160}}>{schoolNames||<span style={{color:C.textLight}}>--</span>}</td>
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
              <div><L>Position / Title</L><Inp value={form.position} onChange={e=>setForm(f=>({...f,position:e.target.value}))} placeholder="e.g. Chef Manager, Director"/></div>
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

function AdminPage({schools,setSchools,users,toast}){
  const [tab,setTab]=useState("users")
  const [es,setEs]=useState(null)
  const [af,setAf]=useState({chef_id:"",director_id:"",supervisor_id:""})
  const byRole=r=>users.filter(u=>u.role===r&&u.is_active)
  const uB=id=>users.find(u=>u.id===id)
  const save=()=>{setSchools(p=>p.map(s=>s.id===es.id?{...s,chef_id:af.chef_id||null,director_id:af.director_id||null,supervisor_id:af.supervisor_id||null}:s));toast.show("Assignment saved!");setEs(null)}
  return(
    <div style={{padding:"24px 20px"}}>
      <PageHeader title="Admin Panel" subtitle="Manage users and school assignments"/>
      <TabBar tabs={[{id:"users",label:"User Management"},{id:"assign",label:"Staff Assignments"}]} active={tab} set={id=>{setTab(id);setEs(null)}}/>
      {tab==="users"&&<div>
        <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#1D4ED8",padding:"10px 14px",borderRadius:R.md,fontSize:13,marginBottom:14}}>In the live app, users are managed via the admin dashboard.</div>
        <Box style={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#F8FAFC",borderBottom:"2px solid #E2E8F0"}}>{["Name","Email","Role","Status"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:11,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:".06em"}}>{h}</th>)}</tr></thead>
            <tbody>{users.map(u=><tr key={u.id} style={{borderBottom:"1px solid #F1F5F9"}}>
              <td style={{padding:"10px 14px",fontWeight:700,color:C.text}}>{u.name}</td>
              <td style={{padding:"10px 14px",color:C.textMuted,fontSize:12}}>{u.email}</td>
              <td style={{padding:"10px 14px"}}><RP role={u.role}/></td>
              <td style={{padding:"10px 14px"}}><Pill bg={u.is_active?"#F0FDF4":"#F1F5F9"} tx={u.is_active?"#15803D":C.textMuted}>{u.is_active?"Active":"Inactive"}</Pill></td>
            </tr>)}</tbody>
          </table>
        </Box>
      </div>}
      {tab==="assign"&&!es&&<Box style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:580}}>
            <thead><tr style={{background:"#F8FAFC",borderBottom:"2px solid #E2E8F0"}}>{["School","Type","Chef","Director","Supervisor","Edit"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:11,fontWeight:700,color:C.textLight,textTransform:"uppercase",letterSpacing:".06em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
            <tbody>{schools.map(s=>{const tc=TC[s.type];return(
              <tr key={s.id} style={{borderBottom:"1px solid #F1F5F9"}}>
                <td style={{padding:"10px 14px",fontWeight:700,whiteSpace:"nowrap",color:C.text}}>{s.name}</td>
                <td style={{padding:"10px 14px"}}>{tc&&<Pill bg={tc.bg} tx={tc.tx} bd={tc.bd}>{TL[s.type]}</Pill>}</td>
                {["chef","director","supervisor"].map(r=><td key={r} style={{padding:"10px 14px",whiteSpace:"nowrap"}}>{s[r+"_id"]?<span style={{fontWeight:600,color:C.text}}>{uB(s[r+"_id"])?.name||"--"}</span>:<em style={{color:C.textLight,fontWeight:400,fontSize:12}}>Unassigned</em>}</td>)}
                <td style={{padding:"10px 14px"}}><button onClick={()=>{setAf({chef_id:s.chef_id||"",director_id:s.director_id||"",supervisor_id:s.supervisor_id||""});setEs(s)}} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:R.md,cursor:"pointer",color:C.primary,display:"flex",padding:7}}><Edit2 size={13}/></button></td>
              </tr>
            )})}</tbody>
          </table>
        </div>
      </Box>}
      {tab==="assign"&&es&&<Box style={{maxWidth:420}}>
        <h3 style={{fontSize:15,fontWeight:800,color:C.text,marginBottom:18}}>Assign Staff - {es.name}</h3>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[{r:"chef",l:"Chef Manager",f:"chef_id"},{r:"director",l:"Director",f:"director_id"},{r:"supervisor",l:"Supervisor",f:"supervisor_id"}].map(({r,l,f})=><div key={r}><L>{l}</L><Sel value={af[f]} onChange={e=>setAf(p=>({...p,[f]:e.target.value}))}><option value="">-- Unassigned --</option>{byRole(r).map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</Sel></div>)}
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <Btn onClick={()=>setEs(null)} variant="outline">Cancel</Btn>
            <Btn onClick={save}>Save Assignment</Btn>
          </div>
        </div>
      </Box>}
    </div>
  )
}
