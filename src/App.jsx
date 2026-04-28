import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

/* ─── Theme ──────────────────────────────────────────────────────────────────── */
const T = {
  bg:"#ffffff", surface:"#f5f5f5", card:"#efefef", border:"#e0e0e0",
  accent:"#c8f135", accentDim:"#8faa22", text:"#111111", muted:"#888",
  danger:"#ff4d4d", yt:"#FF0000",
};

const Logo = ({ size=32 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <polygon points="40,3 75,21.5 75,58.5 40,77 5,58.5 5,21.5" fill={T.accent}/>
    <rect x="17" y="35" width="9" height="10" rx="2.5" fill={T.bg}/>
    <rect x="54" y="35" width="9" height="10" rx="2.5" fill={T.bg}/>
    <rect x="26" y="37.5" width="28" height="5" rx="2.5" fill={T.bg}/>
    <rect x="17" y="27" width="9" height="7" rx="2" fill={T.bg}/>
    <rect x="54" y="27" width="9" height="7" rx="2" fill={T.bg}/>
    <rect x="17" y="46" width="9" height="7" rx="2" fill={T.bg}/>
    <rect x="54" y="46" width="9" height="7" rx="2" fill={T.bg}/>
  </svg>
);

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0a0a0f;color:#f0f0f0;font-family:'DM Sans',sans-serif;}
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#0a0a0f;}::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:2px;}
  input::placeholder{color:#444;}
  select option{background:#1a1a24;color:#f0f0f0;}
`;

/* ─── Constants ──────────────────────────────────────────────────────────────── */
const USERS = [
  { email:"alex@mfc.com",  password:"alex123",  name:"Alex Martin",     avatar:"AM", role:"client", coach:"Coach Sophie", level:"Intermediate" },
  { email:"coach@mfc.com", password:"coach123", name:"Sophie Tremblay", avatar:"ST", role:"coach" },
];

const DAY_TYPES = [
  { id:"upper",  label:"Upper Body", icon:"💪", color:"#4a9eff", bg:"#0a1a2e" },
  { id:"lower",  label:"Lower Body", icon:"🦵", color:"#ff9f4a", bg:"#2e1a0a" },
  { id:"full",   label:"Full Body",  icon:"⚡", color:"#c8f135", bg:"#1a2e0a" },
  { id:"cardio", label:"Cardio",     icon:"🏃", color:"#ff4a8a", bg:"#2e0a1a" },
];
const getDT = id => DAY_TYPES.find(t=>t.id===id)||DAY_TYPES[0];

const MUSCLES = ["All","Chest","Back","Shoulders","Legs","Biceps","Triceps","Core","Cardio"];

const SUPERSET_COLORS = ["#a78bfa","#34d399","#f87171","#60a5fa","#fbbf24","#f472b6"];

/* ─── Exercise DB ─────────────────────────────────────────────────────────────── */
const INIT_DB = [
  { id:1,  name:"Barbell Bench Press",       muscle:"Chest",     youtube:"" },
  { id:2,  name:"Incline Dumbbell Press",    muscle:"Chest",     youtube:"" },
  { id:3,  name:"Cable Chest Fly",           muscle:"Chest",     youtube:"" },
  { id:4,  name:"Weighted Dips",             muscle:"Chest",     youtube:"" },
  { id:5,  name:"Weighted Push-ups",         muscle:"Chest",     youtube:"" },
  { id:6,  name:"Weighted Pull-ups",         muscle:"Back",      youtube:"" },
  { id:7,  name:"Barbell Row",               muscle:"Back",      youtube:"" },
  { id:8,  name:"Lat Pulldown",              muscle:"Back",      youtube:"" },
  { id:9,  name:"Single-Arm Dumbbell Row",   muscle:"Back",      youtube:"" },
  { id:10, name:"Deadlift",                  muscle:"Back",      youtube:"" },
  { id:11, name:"Seated Cable Row",          muscle:"Back",      youtube:"" },
  { id:12, name:"Barbell Overhead Press",    muscle:"Shoulders", youtube:"" },
  { id:13, name:"Lateral Raises",            muscle:"Shoulders", youtube:"" },
  { id:14, name:"Face Pull",                 muscle:"Shoulders", youtube:"" },
  { id:15, name:"Rear Delt Fly",             muscle:"Shoulders", youtube:"" },
  { id:16, name:"Arnold Press",              muscle:"Shoulders", youtube:"" },
  { id:17, name:"Barbell Squat",             muscle:"Legs",      youtube:"" },
  { id:18, name:"Leg Press",                 muscle:"Legs",      youtube:"" },
  { id:19, name:"Walking Lunges",            muscle:"Legs",      youtube:"" },
  { id:20, name:"Lying Leg Curl",            muscle:"Legs",      youtube:"" },
  { id:21, name:"Standing Calf Raises",      muscle:"Legs",      youtube:"" },
  { id:22, name:"Romanian Deadlift",         muscle:"Legs",      youtube:"" },
  { id:23, name:"Leg Extension",             muscle:"Legs",      youtube:"" },
  { id:24, name:"Hip Thrust",                muscle:"Legs",      youtube:"" },
  { id:25, name:"EZ Bar Curl",               muscle:"Biceps",    youtube:"" },
  { id:26, name:"Hammer Curl",               muscle:"Biceps",    youtube:"" },
  { id:27, name:"Concentration Curl",        muscle:"Biceps",    youtube:"" },
  { id:28, name:"Cable Curl",                muscle:"Biceps",    youtube:"" },
  { id:29, name:"Cable Tricep Pushdown",     muscle:"Triceps",   youtube:"" },
  { id:30, name:"Skull Crusher",             muscle:"Triceps",   youtube:"" },
  { id:31, name:"Overhead Tricep Extension", muscle:"Triceps",   youtube:"" },
  { id:32, name:"Tricep Kickback",           muscle:"Triceps",   youtube:"" },
  { id:33, name:"Cable Crunch",              muscle:"Core",      youtube:"" },
  { id:34, name:"Hanging Leg Raise",         muscle:"Core",      youtube:"" },
  { id:35, name:"Plank",                     muscle:"Core",      youtube:"" },
  { id:36, name:"Ab Wheel Rollout",          muscle:"Core",      youtube:"" },
  { id:37, name:"Russian Twist",             muscle:"Core",      youtube:"" },
  { id:38, name:"Treadmill Run",             muscle:"Cardio",    youtube:"" },
  { id:39, name:"Rowing Machine",            muscle:"Cardio",    youtube:"" },
  { id:40, name:"Jump Rope",                 muscle:"Cardio",    youtube:"" },
  { id:41, name:"Assault Bike",              muscle:"Cardio",    youtube:"" },
  { id:42, name:"Stairmaster",               muscle:"Cardio",    youtube:"" },
];

/*
  DATA MODEL
  ──────────
  program = [ TrainingDay ]
  TrainingDay = { id, type, label, done, blocks: [ Block ] }
  Block = { id, isSuperset, sets, exercises: [ BlockEx ] }
    - isSuperset=false → 1 exercise, tracked via "sets" array
    - isSuperset=true  → 2+ exercises, same "sets" array shared (one row per set)
  BlockEx = { exId, name, youtube, reps, weight }   (per-exercise params, no sets here)
  sets = [ { done: bool, ...perExWeight: { [exId]: { reps, weight } } } ]

  Simpler for coach to build, and client sees set-by-set tracking.
*/

const makeSet = (exercises) => {
  const s = { done: false };
  exercises.forEach(e => { s["r_"+e.exId] = e.reps||"10"; s["w_"+e.exId] = e.weight||""; });
  return s;
};

const makeBlock = (exercises, numSets=3, isSuperset=false, blockId=Date.now()) => ({
  id: blockId,
  isSuperset,
  exercises: exercises.map(e => ({ exId:e.id||e.exId, name:e.name, youtube:e.youtube||"", reps:"10", weight:"" })),
  sets: Array.from({length:numSets}, () => makeSet(exercises.map(e=>({exId:e.id||e.exId})))),
});

const INIT_PROGRAM = [
  {
    id:1, type:"upper", label:"Upper Body A", done:true,
    blocks:[
      makeBlock([{id:1,name:"Barbell Bench Press",youtube:""},{id:29,name:"Cable Tricep Pushdown",youtube:""}], 4, true, 11),
      makeBlock([{id:6,name:"Weighted Pull-ups",youtube:""}], 4, false, 12),
      makeBlock([{id:12,name:"Barbell Overhead Press",youtube:""},{id:13,name:"Lateral Raises",youtube:""}], 3, true, 13),
      makeBlock([{id:25,name:"EZ Bar Curl",youtube:""},{id:30,name:"Skull Crusher",youtube:""}], 3, true, 14),
    ]
  },
  {
    id:2, type:"lower", label:"Lower Body A", done:false, active:true,
    blocks:[
      makeBlock([{id:17,name:"Barbell Squat",youtube:""}], 5, false, 21),
      makeBlock([{id:18,name:"Leg Press",youtube:""},{id:20,name:"Lying Leg Curl",youtube:""}], 4, true, 22),
      makeBlock([{id:19,name:"Walking Lunges",youtube:""}], 3, false, 23),
      makeBlock([{id:21,name:"Standing Calf Raises",youtube:""},{id:33,name:"Cable Crunch",youtube:""}], 3, true, 24),
    ]
  },
];

const INIT_MSGS = [
  { from:"coach", text:"Great session yesterday Alex! Your pull-ups are really improving 💪", time:"Tue 9:12am" },
  { from:"client", text:"Thanks! Slight shoulder pain on the right side though.", time:"Tue 11:30am" },
  { from:"coach", text:"Got it — avoid overhead movements for now. Let's reassess Friday.", time:"Tue 11:45am" },
];

/* ─── Style helpers ──────────────────────────────────────────────────────────── */
const S = {
  inp: (x={}) => ({ background:T.card, border:`1px solid ${T.border}`, borderRadius:9, padding:"9px 12px", color:T.text, fontSize:13, outline:"none", fontFamily:"'DM Sans'", width:"100%", ...x }),
  card: (x={}) => ({ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"12px 13px", ...x }),
};

/* ══════════════════════════════════ LOGIN ══════════════════════════════════ */
function Login({ onLogin }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const [err,setErr]=useState(""); const [busy,setBusy]=useState(false);
  const go = async () => {
  if (!email.trim() || !pass.trim()) { setErr("Please fill in all fields."); return; }
  setErr(""); setBusy(true);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: pass,
  });
  if (error) { setErr("Incorrect email or password."); setBusy(false); return; }
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
  if (profile) onLogin({ ...data.user, name: profile.name, avatar: profile.name.split(' ').map(n=>n[0]).join(''), role: profile.role });
  else { setErr("Profile not found."); setBusy(false); }
};
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",maxWidth:440,margin:"0 auto"}}>
      <Logo size={64}/><div style={{fontFamily:"'Bebas Neue'",fontSize:48,letterSpacing:8,color:T.accent,lineHeight:1,marginTop:8}}>MFC</div>
      <div style={{fontFamily:"'DM Mono'",fontSize:10,letterSpacing:4,color:T.muted,marginBottom:44,marginTop:4}}>MOVE · FORGE · CONQUER</div>
      <div style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"28px 24px"}}>
        <div style={{fontSize:20,fontWeight:700,marginBottom:4}}>Sign In</div>
        <div style={{color:T.muted,fontSize:13,marginBottom:22}}>Access your training space</div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,color:T.muted,marginBottom:6,fontFamily:"'DM Mono'",letterSpacing:1}}>EMAIL</div>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="your@email.com" style={S.inp()}/>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,color:T.muted,marginBottom:6,fontFamily:"'DM Mono'",letterSpacing:1}}>PASSWORD</div>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••" style={S.inp()}/>
        </div>
        {err&&<div style={{color:T.danger,fontSize:12,marginBottom:12,textAlign:"center"}}>{err}</div>}
        <div onClick={!busy?go:undefined} style={{background:busy?T.accentDim:T.accent,color:T.bg,borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,textAlign:"center",cursor:busy?"not-allowed":"pointer",userSelect:"none"}}>
          {busy?"Signing in...":"Sign in →"}
        </div>
        <div style={{marginTop:18,padding:"13px",background:T.bg,borderRadius:10,border:`1px solid ${T.border}`}}>
          <div style={{fontSize:10,color:T.muted,marginBottom:6,fontFamily:"'DM Mono'",letterSpacing:1}}>DEMO ACCOUNTS</div>
          <div style={{fontSize:12,color:T.muted}}>👤 Client : alex@mfc.com / alex123</div>
          <div style={{fontSize:12,color:T.muted,marginTop:4}}>🏋️ Coach  : coach@mfc.com / coach123</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════ EXERCISE LIBRARY ═══════════════════════════ */
function ExerciseDB({ db, setDb }) {
  const [filter,setFilter]=useState("All"); const [search,setSearch]=useState("");
  const [editId,setEditId]=useState(null); const [editYT,setEditYT]=useState("");
  const [adding,setAdding]=useState(false);
  const [nName,setNName]=useState(""); const [nMus,setNMus]=useState("Chest"); const [nYT,setNYT]=useState("");
  const [nextId,setNextId]=useState(200);

  const visible=db.filter(e=>(filter==="All"||e.muscle===filter)&&e.name.toLowerCase().includes(search.toLowerCase()));
  const saveAdd=()=>{
    if(!nName.trim())return;
    setDb(d=>[...d,{id:nextId,name:nName.trim(),muscle:nMus,youtube:nYT.trim()}]);
    setNextId(n=>n+1);setNName("");setNMus("Chest");setNYT("");setAdding(false);
  };
  const saveYT=id=>{setDb(d=>d.map(e=>e.id===id?{...e,youtube:editYT.trim()}:e));setEditId(null);setEditYT("");};
  const del=id=>setDb(d=>d.filter(e=>e.id!==id));

  return(
    <div style={{padding:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div>
          <div style={{fontWeight:700,fontSize:17}}>Exercise Library</div>
          <div style={{color:T.muted,fontSize:11,marginTop:1}}>{db.filter(e=>e.youtube).length}/{db.length} videos linked</div>
        </div>
        <div onClick={()=>{setAdding(true);setNName("");setNMus("Chest");setNYT("");}} style={{background:T.accent,color:T.bg,borderRadius:10,padding:"8px 14px",fontWeight:700,fontSize:13,cursor:"pointer",userSelect:"none"}}>+ Add</div>
      </div>
      {adding&&(
        <div style={{...S.card(),marginBottom:12,border:`1.5px solid ${T.accent}55`}}>
          <div style={{fontSize:13,fontWeight:600,color:T.accent,marginBottom:10}}>New Exercise</div>
          <div style={{marginBottom:8}}>
            <div style={{fontSize:10,color:T.muted,marginBottom:4,fontFamily:"'DM Mono'",letterSpacing:1}}>NAME</div>
            <input value={nName} onChange={e=>setNName(e.target.value)} placeholder="e.g. Cable Chest Fly" style={S.inp()}/>
          </div>
          <div style={{marginBottom:8}}>
            <div style={{fontSize:10,color:T.muted,marginBottom:4,fontFamily:"'DM Mono'",letterSpacing:1}}>MUSCLE GROUP</div>
            <select value={nMus} onChange={e=>setNMus(e.target.value)} style={{...S.inp(),appearance:"none"}}>
              {MUSCLES.filter(m=>m!=="All").map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,color:T.muted,marginBottom:4,fontFamily:"'DM Mono'",letterSpacing:1}}>YOUTUBE LINK (optional)</div>
            <input value={nYT} onChange={e=>setNYT(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={S.inp()}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div onClick={saveAdd} style={{flex:1,background:T.accent,color:T.bg,borderRadius:9,padding:"11px",fontWeight:700,fontSize:13,textAlign:"center",cursor:"pointer",userSelect:"none"}}>✓ Save</div>
            <div onClick={()=>setAdding(false)} style={{flex:1,background:T.surface,color:T.muted,border:`1px solid ${T.border}`,borderRadius:9,padding:"11px",fontSize:13,textAlign:"center",cursor:"pointer",userSelect:"none"}}>Cancel</div>
          </div>
        </div>
      )}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search exercises..." style={{...S.inp(),marginBottom:10}}/>
      <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:4}}>
        {MUSCLES.map(m=>(
          <div key={m} onClick={()=>setFilter(m)} style={{flex:"0 0 auto",background:filter===m?T.accent:T.card,color:filter===m?T.bg:T.muted,border:`1px solid ${filter===m?T.accent:T.border}`,borderRadius:20,padding:"5px 13px",fontSize:11,cursor:"pointer",userSelect:"none",fontWeight:filter===m?700:400,whiteSpace:"nowrap"}}>{m}</div>
        ))}
      </div>
      {visible.length===0&&<div style={{textAlign:"center",color:T.muted,fontSize:13,padding:24}}>No exercises found</div>}
      {visible.map(ex=>(
        <div key={ex.id} style={{...S.card(),marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:500,fontSize:14}}>{ex.name}</div>
              <div style={{fontSize:10,color:T.accent,fontFamily:"'DM Mono'",marginTop:3}}>{ex.muscle}</div>
            </div>
            <div onClick={()=>del(ex.id)} style={{color:T.muted,fontSize:18,cursor:"pointer",padding:"0 4px",opacity:.5,lineHeight:1}}>✕</div>
          </div>
          {editId===ex.id?(
            <div style={{display:"flex",gap:6,marginTop:10}}>
              <input value={editYT} onChange={e=>setEditYT(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveYT(ex.id)} placeholder="https://youtube.com/watch?v=..." autoFocus style={{...S.inp({flex:1,fontSize:11,padding:"7px 10px",fontFamily:"'DM Mono'"})}}/>
              <div onClick={()=>saveYT(ex.id)} style={{background:T.accent,color:T.bg,borderRadius:8,padding:"7px 12px",fontWeight:700,cursor:"pointer",userSelect:"none"}}>✓</div>
              <div onClick={()=>{setEditId(null);setEditYT("");}} style={{background:T.surface,color:T.muted,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 10px",cursor:"pointer",userSelect:"none"}}>✕</div>
            </div>
          ):(
            <div onClick={()=>{setEditId(ex.id);setEditYT(ex.youtube||"");}} style={{display:"inline-flex",alignItems:"center",gap:6,background:ex.youtube?"#1a0808":T.surface,border:`1px solid ${ex.youtube?T.yt+"44":T.border}`,borderRadius:8,padding:"5px 11px",color:ex.youtube?T.yt:T.muted,fontSize:11,marginTop:8,cursor:"pointer",userSelect:"none",fontFamily:"'DM Mono'"}}>
              ▶ {ex.youtube?"YouTube linked ✓ — Edit":"+ Add YouTube link"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════ PROGRAM BUILDER ════════════════════════════ */
function ProgramBuilder({ db, program, setProgram }) {
  const [activeId,setActiveId]=useState(program[0]?.id||null);
  const [showAddDay,setShowAddDay]=useState(false);
  const [newDayType,setNewDayType]=useState("upper");
  const [newDayLabel,setNewDayLabel]=useState("");
  const [nextDayId,setNextDayId]=useState(100);
  const [nextBlockId,setNextBlockId]=useState(500);
  const [editingLabel,setEditingLabel]=useState(false);

  // picker state
  const [pickerOpen,setPickerOpen]=useState(false);
  const [pickerMode,setPickerMode]=useState("single"); // "single"|"superset"
  const [pickerFilter,setPickerFilter]=useState("All");
  const [pickerSearch,setPickerSearch]=useState("");
  const [pickerSelected,setPickerSelected]=useState([]); // exIds selected for superset
  const [pickerNumSets,setPickerNumSets]=useState(3);

  const activeDay=program.find(d=>d.id===activeId);

  /* ── Day ops ── */
  const addDay=()=>{
    const dt=getDT(newDayType);
    const lbl=newDayLabel.trim()||dt.label;
    setProgram(p=>[...p,{id:nextDayId,type:newDayType,label:lbl,done:false,blocks:[]}]);
    setActiveId(nextDayId);setNextDayId(n=>n+1);setNewDayLabel("");setNewDayType("upper");setShowAddDay(false);
  };
  const removeDay=id=>{setProgram(p=>p.filter(d=>d.id!==id));if(activeId===id)setActiveId(program.find(d=>d.id!==id)?.id||null);};
  const setLabel=val=>setProgram(p=>p.map(d=>d.id!==activeId?d:{...d,label:val}));

  /* ── Block ops ── */
  const addBlock=(exList,numSets,isSuperset)=>{
    const b=makeBlock(exList,numSets,isSuperset,nextBlockId);
    setProgram(p=>p.map(d=>d.id!==activeId?d:{...d,blocks:[...d.blocks,b]}));
    setNextBlockId(n=>n+1);
  };
  const removeBlock=bid=>setProgram(p=>p.map(d=>d.id!==activeId?d:{...d,blocks:d.blocks.filter(b=>b.id!==bid)}));

  const updateBlockEx=(bid,exId,field,val)=>setProgram(p=>p.map(d=>d.id!==activeId?d:{...d,blocks:d.blocks.map(b=>b.id!==bid?b:{
    ...b,
    exercises:b.exercises.map(e=>e.exId!==exId?e:{...e,[field]:val}),
    sets:b.sets.map(s=>({...s,[`${field==="reps"?"r":"w"}_${exId}`]:val})),
  })}));

  const updateNumSets=(bid,n)=>setProgram(p=>p.map(d=>d.id!==activeId?d:{...d,blocks:d.blocks.map(b=>{
    if(b.id!==bid)return b;
    const cur=b.sets.length;
    if(n>cur) return {...b,sets:[...b.sets,...Array.from({length:n-cur},()=>makeSet(b.exercises))]};
    return {...b,sets:b.sets.slice(0,n)};
  })}));

  const removeExFromBlock=(bid,exId)=>{
    const rKey="r_"+exId;
    const wKey="w_"+exId;
    setProgram(p=>p.map(d=>{
      if(d.id!==activeId)return d;
      const blocks=d.blocks.map(b=>{
        if(b.id!==bid)return b;
        const exs=b.exercises.filter(e=>e.exId!==exId);
        if(exs.length===0)return null;
        const newSets=b.sets.map(s=>{
          const ns=Object.assign({},s);
          delete ns[rKey];
          delete ns[wKey];
          return ns;
        });
        return {...b,isSuperset:exs.length>1,exercises:exs,sets:newSets};
      }).filter(Boolean);
      return {...d,blocks};
    }));
  };

  /* ── Picker ── */
  const typeToMuscles={upper:["All","Chest","Back","Shoulders","Biceps","Triceps"],lower:["All","Legs","Core"],full:["All","Chest","Back","Shoulders","Legs","Biceps","Triceps","Core"],cardio:["All","Cardio"]};
  const allowedMuscles=activeDay?(typeToMuscles[activeDay.type]||MUSCLES):MUSCLES;
  const usedExIds=activeDay?.blocks.flatMap(b=>b.exercises.map(e=>e.exId))||[];

  const pickerList=db.filter(e=>{
    if(!allowedMuscles.includes("All")&&!allowedMuscles.includes(e.muscle))return false;
    if(pickerFilter!=="All"&&e.muscle!==pickerFilter)return false;
    if(!e.name.toLowerCase().includes(pickerSearch.toLowerCase()))return false;
    if(usedExIds.includes(e.id)&&!pickerSelected.includes(e.id))return false;
    if(activeDay?.type==="cardio"&&e.muscle!=="Cardio")return false;
    if(activeDay?.type==="lower"&&!["Legs","Core"].includes(e.muscle))return false;
    if(activeDay?.type==="upper"&&!["Chest","Back","Shoulders","Biceps","Triceps"].includes(e.muscle))return false;
    return true;
  });

  const togglePickerSel=id=>setPickerSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);

  const confirmPicker=()=>{
    const exList=pickerSelected.map(id=>db.find(e=>e.id===id)).filter(Boolean);
    if(exList.length===0)return;
    addBlock(exList,pickerNumSets,pickerSelected.length>1);
    setPickerOpen(false);setPickerSelected([]);setPickerNumSets(3);
  };

  if(!activeDay&&program.length===0) return(
    <div style={{padding:14}}>
      <div style={{fontWeight:700,fontSize:17,marginBottom:4}}>Build Program</div>
      <div style={{...S.card({textAlign:"center",padding:32,marginTop:12})}}>
        <div style={{fontSize:32,marginBottom:12}}>📋</div>
        <div style={{fontWeight:600,fontSize:15,marginBottom:6}}>No training days yet</div>
        <div style={{color:T.muted,fontSize:13,marginBottom:16}}>Add your first training day to get started</div>
        <div onClick={()=>setShowAddDay(true)} style={{background:T.accent,color:T.bg,borderRadius:10,padding:"11px 20px",fontWeight:700,fontSize:14,cursor:"pointer",userSelect:"none",display:"inline-block"}}>+ Add Training Day</div>
      </div>
      {showAddDay&&<AddDayModal newDayType={newDayType} setNewDayType={setNewDayType} newDayLabel={newDayLabel} setNewDayLabel={setNewDayLabel} onAdd={addDay} onClose={()=>setShowAddDay(false)}/>}
    </div>
  );

  return(
    <div style={{padding:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div>
          <div style={{fontWeight:700,fontSize:17}}>Build Program</div>
          <div style={{color:T.muted,fontSize:11,marginTop:1}}>Week 14 — Strength Cycle</div>
        </div>
        <div onClick={()=>setShowAddDay(true)} style={{background:T.accent,color:T.bg,borderRadius:10,padding:"8px 14px",fontWeight:700,fontSize:13,cursor:"pointer",userSelect:"none"}}>+ Day</div>
      </div>

      {/* Day pills */}
      <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:14,paddingBottom:4}}>
        {program.map(d=>{const dt=getDT(d.type);const act=d.id===activeId;return(
          <div key={d.id} onClick={()=>setActiveId(d.id)} style={{flex:"0 0 auto",background:act?dt.color:T.card,color:act?T.bg:dt.color,border:`1.5px solid ${act?dt.color:T.border}`,borderRadius:12,padding:"8px 12px",cursor:"pointer",userSelect:"none",minWidth:80,textAlign:"center",transition:"all .15s"}}>
            <div style={{fontSize:16}}>{dt.icon}</div>
            <div style={{fontFamily:"'DM Mono'",fontSize:9,letterSpacing:.5,marginTop:2,fontWeight:700}}>{d.label.length>10?d.label.slice(0,9)+"…":d.label.toUpperCase()}</div>
            <div style={{fontSize:9,marginTop:1,opacity:.8}}>{d.blocks.length>0?`${d.blocks.length} blk`:""}</div>
          </div>
        );})}
      </div>

      {activeDay&&(
        <>
          {/* Day header */}
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:14}}>
            {editingLabel?(
              <input value={activeDay.label} onChange={e=>setLabel(e.target.value)} onBlur={()=>setEditingLabel(false)} onKeyDown={e=>e.key==="Enter"&&setEditingLabel(false)} autoFocus style={{...S.inp({flex:1,fontWeight:600,fontSize:14})}}/>
            ):(
              <div style={{flex:1,fontWeight:600,fontSize:15,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18}}>{getDT(activeDay.type).icon}</span>
                {activeDay.label}
                <span style={{fontSize:10,color:getDT(activeDay.type).color,fontFamily:"'DM Mono'",background:getDT(activeDay.type).bg,border:`1px solid ${getDT(activeDay.type).color}44`,borderRadius:8,padding:"2px 8px"}}>{getDT(activeDay.type).label}</span>
              </div>
            )}
            <div onClick={()=>setEditingLabel(v=>!v)} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 10px",fontSize:12,color:T.muted,cursor:"pointer",userSelect:"none"}}>✏️</div>
            <div onClick={()=>removeDay(activeId)} style={{background:"#1a0808",border:`1px solid ${T.danger}44`,borderRadius:8,padding:"6px 10px",fontSize:12,color:T.danger,cursor:"pointer",userSelect:"none"}}>🗑</div>
          </div>

          {/* Blocks */}
          {activeDay.blocks.map((block,bi)=>{
            const ssColor=block.isSuperset?SUPERSET_COLORS[bi%SUPERSET_COLORS.length]:null;
            return(
              <div key={block.id} style={{marginBottom:12}}>
                {/* Block header */}
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  {block.isSuperset&&(
                    <div style={{background:ssColor+"22",border:`1px solid ${ssColor}55`,borderRadius:8,padding:"2px 10px",fontSize:10,fontWeight:700,color:ssColor,fontFamily:"'DM Mono'",letterSpacing:1}}>
                      SUPERSET
                    </div>
                  )}
                  {!block.isSuperset&&(
                    <div style={{fontSize:10,color:T.muted,fontFamily:"'DM Mono'",letterSpacing:1}}>BLOCK {bi+1}</div>
                  )}
                  <div style={{flex:1}}/>
                  {/* Sets count */}
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <div style={{fontSize:10,color:T.muted}}>Sets:</div>
                    <div onClick={()=>updateNumSets(block.id,Math.max(1,block.sets.length-1))} style={{width:24,height:24,borderRadius:6,background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",userSelect:"none",color:T.muted}}>−</div>
                    <div style={{fontSize:13,fontWeight:700,minWidth:16,textAlign:"center",fontFamily:"'DM Mono'"}}>{block.sets.length}</div>
                    <div onClick={()=>updateNumSets(block.id,block.sets.length+1)} style={{width:24,height:24,borderRadius:6,background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",userSelect:"none",color:T.muted}}>+</div>
                  </div>
                  <div onClick={()=>removeBlock(block.id)} style={{color:T.danger,fontSize:16,cursor:"pointer",opacity:.6,userSelect:"none"}}>🗑</div>
                </div>

                {/* Per-exercise config */}
                <div style={{background:T.card,border:`1.5px solid ${ssColor||T.border}`,borderRadius:12,overflow:"hidden"}}>
                  {block.exercises.map((ex,ei)=>(
                    <div key={ex.exId} style={{padding:"10px 12px",borderBottom:ei<block.exercises.length-1?`1px solid ${T.border}`:"none"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <div style={{fontWeight:500,fontSize:13,flex:1}}>{ex.name}</div>
                        {block.isSuperset&&<div onClick={()=>removeExFromBlock(block.id,ex.exId)} style={{color:T.muted,fontSize:14,cursor:"pointer",opacity:.5,userSelect:"none",marginLeft:8}}>✕</div>}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                        <div>
                          <div style={{fontSize:9,color:T.muted,fontFamily:"'DM Mono'",letterSpacing:1,marginBottom:3}}>REPS (default)</div>
                          <input value={ex.reps} onChange={e=>updateBlockEx(block.id,ex.exId,"reps",e.target.value)} style={S.inp({fontSize:12,padding:"6px 8px",textAlign:"center"})}/>
                        </div>
                        <div>
                          <div style={{fontSize:9,color:T.muted,fontFamily:"'DM Mono'",letterSpacing:1,marginBottom:3}}>WEIGHT (default)</div>
                          <input value={ex.weight} onChange={e=>updateBlockEx(block.id,ex.exId,"weight",e.target.value)} placeholder="e.g. 135 lbs" style={S.inp({fontSize:12,padding:"6px 8px",textAlign:"center"})}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Add block buttons */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:4}}>
            <div onClick={()=>{setPickerOpen(true);setPickerMode("single");setPickerSelected([]);setPickerFilter("All");setPickerSearch("");setPickerNumSets(3);}}
              style={{background:T.surface,border:`1.5px dashed ${T.border}`,borderRadius:12,padding:"12px",color:T.muted,fontSize:12,textAlign:"center",cursor:"pointer",userSelect:"none"}}>
              + Single Exercise
            </div>
            <div onClick={()=>{setPickerOpen(true);setPickerMode("superset");setPickerSelected([]);setPickerFilter("All");setPickerSearch("");setPickerNumSets(3);}}
              style={{background:"#120a1a",border:`1.5px dashed #a78bfa55`,borderRadius:12,padding:"12px",color:"#a78bfa",fontSize:12,textAlign:"center",cursor:"pointer",userSelect:"none"}}>
              ⚡ Superset
            </div>
          </div>
        </>
      )}

      {/* Add Day Modal */}
      {showAddDay&&<AddDayModal newDayType={newDayType} setNewDayType={setNewDayType} newDayLabel={newDayLabel} setNewDayLabel={setNewDayLabel} onAdd={addDay} onClose={()=>setShowAddDay(false)}/>}

      {/* Exercise Picker Modal */}
      {pickerOpen&&activeDay&&(
        <div onClick={()=>setPickerOpen(false)} style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:480,background:T.surface,borderRadius:"20px 20px 0 0",border:`1px solid ${T.border}`,maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"16px 16px 0"}}>
              <div style={{width:36,height:4,background:T.border,borderRadius:2,margin:"0 auto 14px"}}/>
              {pickerMode==="superset"?(
                <div style={{marginBottom:10}}>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:2}}>⚡ Build Superset</div>
                  <div style={{fontSize:12,color:T.muted}}>Select 2 or more exercises to superset together</div>
                  {pickerSelected.length>0&&(
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                      {pickerSelected.map(id=>{const ex=db.find(e=>e.id===id);return ex?(
                        <div key={id} style={{background:"#1a0a2e",border:"1px solid #a78bfa55",borderRadius:8,padding:"3px 9px",fontSize:11,color:"#a78bfa",display:"flex",alignItems:"center",gap:5}}>
                          {ex.name}
                          <span onClick={()=>togglePickerSel(id)} style={{cursor:"pointer",opacity:.7}}>✕</span>
                        </div>
                      ):null;})}
                    </div>
                  )}
                </div>
              ):(
                <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>Pick Exercise</div>
              )}

              {/* Sets selector */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{fontSize:12,color:T.muted}}>Sets:</div>
                {[2,3,4,5,6].map(n=>(
                  <div key={n} onClick={()=>setPickerNumSets(n)}
                    style={{width:30,height:30,borderRadius:8,background:pickerNumSets===n?T.accent:T.card,color:pickerNumSets===n?T.bg:T.muted,border:`1px solid ${pickerNumSets===n?T.accent:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,cursor:"pointer",userSelect:"none"}}>
                    {n}
                  </div>
                ))}
              </div>

              <input value={pickerSearch} onChange={e=>setPickerSearch(e.target.value)} placeholder="🔍  Search..." style={{...S.inp({marginBottom:10})}}/>
              <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:10}}>
                {allowedMuscles.map(m=>(
                  <div key={m} onClick={()=>setPickerFilter(m)} style={{flex:"0 0 auto",background:pickerFilter===m?T.accent:T.card,color:pickerFilter===m?T.bg:T.muted,border:`1px solid ${pickerFilter===m?T.accent:T.border}`,borderRadius:20,padding:"4px 12px",fontSize:11,cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"}}>{m}</div>
                ))}
              </div>
            </div>

            <div style={{overflowY:"auto",padding:"0 16px 16px"}}>
              {pickerList.length===0&&<div style={{textAlign:"center",color:T.muted,fontSize:13,padding:20}}>No exercises available</div>}
              {pickerList.map(ex=>{
                const sel=pickerSelected.includes(ex.id);
                return(
                  <div key={ex.id} onClick={()=>pickerMode==="superset"?togglePickerSel(ex.id):setPickerSelected([ex.id])}
                    style={{...S.card({cursor:"pointer",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",border:`1.5px solid ${sel?"#a78bfa":T.border}`,background:sel?"#120a1a":T.card,transition:"all .15s"})}}>
                    <div>
                      <div style={{fontWeight:500,fontSize:13}}>{ex.name}</div>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginTop:2}}>
                        <div style={{fontSize:10,color:T.accent,fontFamily:"'DM Mono'"}}>{ex.muscle}</div>
                        {ex.youtube&&<div style={{fontSize:10,color:T.yt}}>▶ YouTube</div>}
                      </div>
                    </div>
                    <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${sel?"#a78bfa":T.border}`,background:sel?"#a78bfa":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:sel?T.bg:"transparent",flexShrink:0}}>✓</div>
                  </div>
                );
              })}
            </div>

            {/* Confirm button */}
            <div style={{padding:"12px 16px",borderTop:`1px solid ${T.border}`}}>
              <div onClick={confirmPicker}
                style={{background:pickerSelected.length===0?T.surface:T.accent,color:pickerSelected.length===0?T.muted:T.bg,borderRadius:12,padding:"13px",fontWeight:700,fontSize:14,textAlign:"center",cursor:pickerSelected.length===0?"not-allowed":"pointer",userSelect:"none",transition:"all .2s"}}>
                {pickerMode==="superset"
                  ?pickerSelected.length<2?`Select at least 2 (${pickerSelected.length} selected)`:`Add Superset (${pickerSelected.length} exercises × ${pickerNumSets} sets)`
                  :pickerSelected.length===0?"Select an exercise":`Add Exercise × ${pickerNumSets} sets`
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddDayModal({newDayType,setNewDayType,newDayLabel,setNewDayLabel,onAdd,onClose}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:T.surface,borderRadius:20,border:`1px solid ${T.border}`,padding:22}}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:14}}>Add Training Day</div>
        <div style={{fontSize:10,color:T.muted,marginBottom:8,fontFamily:"'DM Mono'",letterSpacing:1}}>TYPE</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          {DAY_TYPES.map(t=>(
            <div key={t.id} onClick={()=>{setNewDayType(t.id);setNewDayLabel(t.label);}} style={{background:newDayType===t.id?t.bg:T.card,border:`2px solid ${newDayType===t.id?t.color:T.border}`,borderRadius:12,padding:"12px",cursor:"pointer",userSelect:"none",textAlign:"center",transition:"all .15s"}}>
              <div style={{fontSize:22}}>{t.icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:newDayType===t.id?t.color:T.muted,marginTop:4}}>{t.label}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:10,color:T.muted,marginBottom:6,fontFamily:"'DM Mono'",letterSpacing:1}}>CUSTOM LABEL (optional)</div>
        <input value={newDayLabel} onChange={e=>setNewDayLabel(e.target.value)} placeholder={getDT(newDayType).label} style={{...S.inp({marginBottom:16})}}/>
        <div style={{display:"flex",gap:8}}>
          <div onClick={onAdd} style={{flex:1,background:T.accent,color:T.bg,borderRadius:10,padding:"12px",fontWeight:700,fontSize:14,textAlign:"center",cursor:"pointer",userSelect:"none"}}>Add Day</div>
          <div onClick={onClose} style={{flex:1,background:T.surface,color:T.muted,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px",fontSize:14,textAlign:"center",cursor:"pointer",userSelect:"none"}}>Cancel</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════ CLIENT PROGRAM ════════════════════════════ */
function ClientProgram({ program, setProgram }) {
  const [activeId,setActiveId]=useState(program.find(d=>d.active)?.id||program[0]?.id);
  const day=program.find(d=>d.id===activeId);
  const dt=day?getDT(day.type):null;

  const totalSets=day?.blocks.reduce((a,b)=>a+b.sets.length,0)||0;
  const doneSets=day?.blocks.reduce((a,b)=>a+b.sets.filter(s=>s.done).length,0)||0;
  const pct=totalSets?Math.round((doneSets/totalSets)*100):0;

  const toggleSet=(bid,si)=>setProgram(p=>p.map(d=>d.id!==activeId?d:{...d,blocks:d.blocks.map(b=>b.id!==bid?b:{...b,sets:b.sets.map((s,i)=>i!==si?s:{...s,done:!s.done})})}));

  const updateSetVal=(bid,si,key,val)=>setProgram(p=>p.map(d=>d.id!==activeId?d:{...d,blocks:d.blocks.map(b=>b.id!==bid?b:{...b,sets:b.sets.map((s,i)=>i!==si?s:{...s,[key]:val})})}));

  return(
    <div>
      {/* Banner */}
      <div style={{margin:"14px 14px 0",background:`linear-gradient(135deg,${T.card},#1e1e2e)`,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,color:T.accent,fontFamily:"'DM Mono'",letterSpacing:1}}>ACTIVE PROGRAM</div>
          <div style={{fontSize:15,fontWeight:600,marginTop:3}}>Week 14 — Strength Cycle</div>
          <div style={{fontSize:11,color:T.muted,marginTop:2}}>{program.filter(d=>d.done).length}/{program.length} sessions done</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:28,color:T.accent,lineHeight:1}}>{Math.round((program.filter(d=>d.done).length/Math.max(1,program.length))*100)}%</div>
          <div style={{fontSize:10,color:T.muted}}>complete</div>
        </div>
      </div>

      {/* Day pills */}
      <div style={{display:"flex",gap:7,padding:"13px 14px 0",overflowX:"auto"}}>
        {program.map(d=>{const dt=getDT(d.type);const act=d.id===activeId;return(
          <div key={d.id} onClick={()=>setActiveId(d.id)} style={{flex:"0 0 auto",background:act?dt.color:d.done?"#1c2a0a":T.card,color:act?T.bg:d.done?T.accentDim:dt.color,border:`1.5px solid ${act?dt.color:T.border}`,borderRadius:12,padding:"8px 12px",cursor:"pointer",userSelect:"none",minWidth:70,textAlign:"center"}}>
            <div style={{fontSize:14}}>{dt.icon}</div>
            <div style={{fontFamily:"'DM Mono'",fontSize:8,letterSpacing:.5,marginTop:2,fontWeight:700}}>{d.label.length>9?d.label.slice(0,8)+"…":d.label}</div>
            <div style={{fontSize:10,marginTop:1}}>{d.done?"✓":d.active?"●":"○"}</div>
          </div>
        );})}
      </div>

      <div style={{margin:"11px 14px 20px"}}>
        {!day?<div style={{...S.card({textAlign:"center",padding:28})}}>No session selected</div>:(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div>
                <div style={{fontWeight:600,fontSize:15,display:"flex",alignItems:"center",gap:8}}>
                  <span>{dt.icon}</span>{day.label}
                </div>
                <div style={{fontSize:11,color:dt.color,fontFamily:"'DM Mono'",marginTop:2}}>{dt.label} · {doneSets}/{totalSets} sets done</div>
              </div>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:22,color:pct===100?T.accent:T.text}}>{pct}%</div>
            </div>
            <div style={{background:T.border,borderRadius:4,height:4,marginBottom:14}}>
              <div style={{width:`${pct}%`,background:dt.color,height:"100%",borderRadius:4,transition:"width .4s"}}/>
            </div>

            {day.blocks.map((block,bi)=>{
              const ssColor=block.isSuperset?SUPERSET_COLORS[bi%SUPERSET_COLORS.length]:null;
              return(
                <div key={block.id} style={{marginBottom:14}}>
                  {/* Block label */}
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    {block.isSuperset?(
                      <div style={{background:ssColor+"22",border:`1px solid ${ssColor}55`,borderRadius:8,padding:"2px 10px",fontSize:10,fontWeight:700,color:ssColor,fontFamily:"'DM Mono'",letterSpacing:1}}>⚡ SUPERSET</div>
                    ):(
                      <div style={{fontSize:10,color:T.muted,fontFamily:"'DM Mono'",letterSpacing:1}}>EXERCISE {bi+1}</div>
                    )}
                    <div style={{flex:1,height:1,background:ssColor||T.border,opacity:.3}}/>
                    <div style={{fontSize:10,color:T.muted,fontFamily:"'DM Mono'"}}>{block.sets.filter(s=>s.done).length}/{block.sets.length} sets</div>
                  </div>

                  {/* Exercise names for superset */}
                  {block.isSuperset&&(
                    <div style={{display:"flex",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                      {block.exercises.map(ex=>(
                        <div key={ex.exId} style={{fontSize:12,fontWeight:500,color:ssColor,background:ssColor+"15",border:`1px solid ${ssColor}33`,borderRadius:7,padding:"3px 9px"}}>
                          {ex.name}
                          {ex.youtube&&<a href={ex.youtube} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{color:T.yt,marginLeft:6,fontSize:10,textDecoration:"none"}}>▶</a>}
                        </div>
                      ))}
                    </div>
                  )}
                  {!block.isSuperset&&block.exercises[0]&&(
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <div style={{fontWeight:600,fontSize:14}}>{block.exercises[0].name}</div>
                      {block.exercises[0].youtube&&<a href={block.exercises[0].youtube} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,background:"#1a0808",border:`1px solid ${T.yt}44`,borderRadius:7,padding:"3px 9px",color:T.yt,fontSize:10,textDecoration:"none",fontFamily:"'DM Mono'"}}>▶ Demo</a>}
                    </div>
                  )}

                  {/* Set rows */}
                  {block.sets.map((set,si)=>(
                    <div key={si} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                      {/* Set number */}
                      <div style={{width:28,height:28,borderRadius:8,background:set.done?(ssColor||T.accent)+"22":T.surface,border:`1.5px solid ${set.done?(ssColor||T.accent):T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:set.done?(ssColor||T.accent):T.muted,flexShrink:0,fontFamily:"'DM Mono'"}}>
                        {si+1}
                      </div>

                      {/* Per-exercise reps/weight fields */}
                      <div style={{flex:1,display:"flex",gap:4}}>
                        {block.exercises.map((ex,ei)=>(
                          <div key={ex.exId} style={{flex:1,display:"flex",gap:3}}>
                            {block.isSuperset&&<div style={{width:3,borderRadius:2,background:ssColor,flexShrink:0,opacity:.5}}/>}
                            <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
                              <input value={set["r_"+ex.exId]||""} onChange={e=>updateSetVal(block.id,si,"r_"+ex.exId,e.target.value)} placeholder="Reps"
                                style={{...S.inp({fontSize:11,padding:"5px 6px",textAlign:"center",borderRadius:7})}}/>
                              <input value={set["w_"+ex.exId]||""} onChange={e=>updateSetVal(block.id,si,"w_"+ex.exId,e.target.value)} placeholder="lbs"
                                style={{...S.inp({fontSize:11,padding:"5px 6px",textAlign:"center",borderRadius:7})}}/>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Done toggle */}
                      <div onClick={()=>toggleSet(block.id,si)}
                        style={{width:32,height:32,borderRadius:9,border:`2px solid ${set.done?(ssColor||T.accent):T.border}`,background:set.done?(ssColor||T.accent):T.surface,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",userSelect:"none",flexShrink:0,fontSize:14,color:set.done?T.bg:T.muted,transition:"all .2s"}}>
                        {set.done?"✓":""}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

            {pct===100&&(
              <div style={{background:"linear-gradient(135deg,#1c2a0a,#2a3a10)",border:`1px solid ${T.accent}44`,borderRadius:12,padding:14,textAlign:"center",marginTop:8}}>
                <div style={{color:T.accent,fontWeight:700}}>🏆 Session Complete!</div>
                <div style={{color:T.muted,fontSize:12,marginTop:3}}>Outstanding work today</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════ STATS ══════════════════════════════════ */
function Stats({ program }) {
  const total=program.length;const doneCt=program.filter(d=>d.done).length;
  return(
    <div style={{padding:14}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {[{l:"Sessions",v:`${doneCt}/${total}`,s:`${total?Math.round((doneCt/total)*100):0}% completion`,i:"🗓"},{l:"Streak",v:"4 days",s:"Record: 12 days",i:"🔥"},{l:"Weekly Volume",v:"18.4t",s:"+2.1t vs W13",i:"📈"},{l:"PRs This Month",v:"3 PRs",s:"Squat, Pull-ups, BP",i:"🏆"}].map((s,i)=>(
          <div key={i} style={{...S.card({padding:13})}}>
            <div style={{fontSize:20,marginBottom:5}}>{s.i}</div>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:25,color:T.accent,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:11,fontWeight:600,marginTop:4}}>{s.l}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:2}}>{s.s}</div>
          </div>
        ))}
      </div>
      <div style={{...S.card({marginBottom:10})}}>
        <div style={{fontWeight:600,marginBottom:12,fontSize:14}}>Load Progression</div>
        {[{name:"Barbell Squat",start:185,current:225,max:275},{name:"Bench Press",start:145,current:180,max:225},{name:"Weighted Pull-ups",start:0,current:10,max:45},{name:"Barbell Row",start:115,current:155,max:185}].map((ex,i)=>{
          const p=Math.round(((ex.current-ex.start)/(ex.max-ex.start))*100);
          return(<div key={i} style={{marginBottom:13}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontSize:13}}>{ex.name}</div><div style={{fontFamily:"'DM Mono'",fontSize:12,color:T.accent}}>{ex.current} lbs</div></div>
            <div style={{background:T.border,borderRadius:4,height:5}}><div style={{width:`${p}%`,background:`linear-gradient(90deg,${T.accentDim},${T.accent})`,height:"100%",borderRadius:4}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}><div style={{fontSize:10,color:T.muted}}>Start {ex.start}</div><div style={{fontSize:10,color:T.muted}}>Goal {ex.max} lbs</div></div>
          </div>);
        })}
      </div>
      <div style={{...S.card()}}>
        <div style={{fontWeight:600,marginBottom:12,fontSize:14}}>Weekly Volume (tonnes)</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,height:72}}>
          {[12.1,14.3,15.8,13.2,16.3,18.4].map((v,i)=>{const h=Math.round((v/20)*100);const last=i===5;return(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{fontSize:9,color:last?T.accent:T.muted,fontFamily:"'DM Mono'"}}>{v}</div>
              <div style={{width:"100%",height:`${h}%`,background:last?T.accent:T.border,borderRadius:"3px 3px 0 0"}}/>
              <div style={{fontSize:9,color:T.muted}}>W{i+9}</div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════ MESSAGES ══════════════════════════════════ */
function Messages({ isCoach, messages, setMessages }) {
  const [txt,setTxt]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  const send=()=>{
    if(!txt.trim())return;
    setMessages(m=>[...m,{from:isCoach?"coach":"client",text:txt.trim(),time:"Now"}]);setTxt("");
    if(!isCoach)setTimeout(()=>setMessages(m=>[...m,{from:"coach",text:"Got it! I'll get back to you shortly 👍",time:"Just now"}]),1200);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 132px)"}}>
      <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:"50%",background:"#2a1a5a",border:`2px solid ${T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.accent}}>{isCoach?"AM":"ST"}</div>
        <div><div style={{fontWeight:600,fontSize:14}}>{isCoach?"Alex Martin":"Coach Sophie"}</div><div style={{fontSize:10,color:T.accent}}>● Online</div></div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
        {messages.map((m,i)=>{const mine=isCoach?m.from==="coach":m.from==="client";return(
          <div key={i} style={{display:"flex",flexDirection:mine?"row-reverse":"row",gap:7,alignItems:"flex-end"}}>
            {!mine&&<div style={{width:26,height:26,borderRadius:"50%",background:"#2a1a5a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:T.accent,flexShrink:0}}>{isCoach?"AM":"ST"}</div>}
            <div style={{maxWidth:"75%"}}>
              <div style={{background:mine?T.accent:T.card,color:mine?T.bg:T.text,padding:"9px 12px",borderRadius:mine?"13px 13px 4px 13px":"13px 13px 13px 4px",fontSize:13,lineHeight:1.5,border:!mine?`1px solid ${T.border}`:"none"}}>{m.text}</div>
              <div style={{fontSize:10,color:T.muted,marginTop:3,textAlign:mine?"right":"left"}}>{m.time}</div>
            </div>
          </div>
        );})}
        <div ref={ref}/>
      </div>
      <div style={{padding:"10px 14px",borderTop:`1px solid ${T.border}`,display:"flex",gap:8}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={isCoach?"Message Alex...":"Message Coach Sophie..."} style={{...S.inp({borderRadius:22,flex:1})}}/>
        <div onClick={send} style={{width:40,height:40,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0,cursor:"pointer",userSelect:"none"}}>➤</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════ PROFIL ══════════════════════════════════ */
function Profil({user,isCoach,db,program,onLogout}){
  const ytCt=db.filter(e=>e.youtube).length;
  const [showAddClient,setShowAddClient]=useState(false);
  const [clientName,setClientName]=useState("");
  const [clientEmail,setClientEmail]=useState("");
  const [clientPhone,setClientPhone]=useState("");
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");

  const addClient=async()=>{
    if(!clientName.trim()||!clientEmail.trim())return;
    setSaving(true);
    const {data,error}=await supabase.auth.admin.inviteUserByEmail(clientEmail.trim());
    if(!error){
      await supabase.from('clients').insert({
        coach_id:user.id,
        email:clientEmail.trim(),
        name:clientName.trim(),
        phone:clientPhone.trim(),
      });
      setMsg("✅ Client ajouté et invitation envoyée!");
      setClientName("");setClientEmail("");setClientPhone("");
      setShowAddClient(false);
    } else {
      setMsg("❌ Erreur: "+error.message);
    }
    setSaving(false);
  };

  const rows=isCoach
    ?[{l:"Exercises in Library",v:`${db.length}`},{l:"YouTube Videos Linked",v:`${ytCt} / ${db.length}`},{l:"Active Clients",v:"8 clients"},{l:"Sessions This Week",v:"24 sessions"}]
    :[{l:"Goal",v:"Strength + Muscle Mass"},{l:"Frequency",v:"5 sessions / week"},{l:"Current Cycle",v:"Strength — Phase 2/3"},{l:"Next Check-in",v:"Friday 10:00am"}];

  return(
    <div style={{padding:14}}>
      <div style={{background:`linear-gradient(135deg,${T.card},#1a1a30)`,border:`1px solid ${T.border}`,borderRadius:16,padding:22,textAlign:"center",marginBottom:12}}>
        <div style={{width:68,height:68,borderRadius:"50%",background:T.accent,color:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,margin:"0 auto 10px"}}>{user.avatar}</div>
        <div style={{fontSize:20,fontWeight:700}}>{user.name}</div>
        <div style={{color:T.muted,fontSize:12,marginTop:3}}>{isCoach?"Personal Coach — MFC":`Coached by ${user.coach}`}</div>
      </div>

      {isCoach&&(
        <div style={{marginBottom:12}}>
          {msg&&<div style={{padding:"10px 14px",borderRadius:10,background:T.card,border:`1px solid ${T.border}`,fontSize:13,marginBottom:10,textAlign:"center"}}>{msg}</div>}
          <div onClick={()=>setShowAddClient(v=>!v)} style={{background:T.accent,color:T.bg,borderRadius:12,padding:"12px",fontWeight:700,fontSize:14,textAlign:"center",cursor:"pointer",userSelect:"none",marginBottom:10}}>
            + Ajouter un client
          </div>
          {showAddClient&&(
            <div style={{...S.card(),border:`1.5px solid ${T.accent}55`}}>
              <div style={{fontSize:13,fontWeight:600,color:T.accent,marginBottom:10}}>Nouveau client</div>
              <div style={{marginBottom:8}}>
                <div style={{fontSize:10,color:T.muted,marginBottom:4,fontFamily:"'DM Mono'",letterSpacing:1}}>NOM</div>
                <input value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Nom complet" style={S.inp()}/>
              </div>
              <div style={{marginBottom:8}}>
                <div style={{fontSize:10,color:T.muted,marginBottom:4,fontFamily:"'DM Mono'",letterSpacing:1}}>EMAIL</div>
                <input value={clientEmail} onChange={e=>setClientEmail(e.target.value)} placeholder="client@email.com" style={S.inp()}/>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,color:T.muted,marginBottom:4,fontFamily:"'DM Mono'",letterSpacing:1}}>TÉLÉPHONE (optionnel)</div>
                <input value={clientPhone} onChange={e=>setClientPhone(e.target.value)} placeholder="514-000-0000" style={S.inp()}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <div onClick={!saving?addClient:undefined} style={{flex:1,background:saving?T.accentDim:T.accent,color:T.bg,borderRadius:9,padding:"11px",fontWeight:700,fontSize:13,textAlign:"center",cursor:saving?"not-allowed":"pointer",userSelect:"none"}}>
                  {saving?"Envoi...":"✓ Inviter"}
                </div>
                <div onClick={()=>setShowAddClient(false)} style={{flex:1,background:T.surface,color:T.muted,border:`1px solid ${T.border}`,borderRadius:9,padding:"11px",fontSize:13,textAlign:"center",cursor:"pointer",userSelect:"none"}}>Annuler</div>
              </div>
            </div>
          )}
        </div>
      )}

      {rows.map((r,i)=>(
        <div key={i} style={{...S.card({display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7})}}>
          <div style={{color:T.muted,fontSize:13}}>{r.l}</div>
          <div style={{fontSize:13,fontWeight:500,color:isCoach?T.accent:T.text,textAlign:"right",maxWidth:"60%"}}>{r.v}</div>
        </div>
      ))}
      <div onClick={onLogout} style={{background:"transparent",border:`1px solid ${T.danger}44`,color:T.danger,borderRadius:12,padding:13,fontSize:14,textAlign:"center",cursor:"pointer",userSelect:"none",marginTop:6}}>Sign Out</div>
    </div>
  );
}
/* ══════════════════════════════════ ROOT ═══════════════════════════════════ */
export default function App(){
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("programme");
  const [coachTab,setCoachTab]=useState("builder");
  const [db,setDb]=useState(INIT_DB);
  const [program,setProgram]=useState(INIT_PROGRAM);
  const [messages,setMessages]=useState(INIT_MSGS);

  useEffect(()=>{
    setProgram(p=>p.map(day=>({...day,blocks:day.blocks.map(b=>({...b,exercises:b.exercises.map(ex=>{const d=db.find(d=>d.id===ex.exId);return d?{...ex,youtube:d.youtube}:ex;})}))})));
  },[db]);

  if(!user) return <><style>{css}</style><Login onLogin={u=>{setUser(u);setTab("programme");}}/></>;
  const isCoach=user.role==="coach";
  const NAV=isCoach
    ?[{id:"programme",icon:"🗓",label:"Program"},{id:"messages",icon:"💬",label:"Messages"},{id:"profil",icon:"👤",label:"Profile"}]
    :[{id:"programme",icon:"🗓",label:"Program"},{id:"stats",icon:"📊",label:"Stats"},{id:"messages",icon:"💬",label:"Messages"},{id:"profil",icon:"👤",label:"Profile"}];

  return(
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto"}}>
        <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"11px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Logo size={30}/>
            <div>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:20,letterSpacing:3,color:T.accent,lineHeight:1}}>MFC</div>
              <div style={{fontSize:10,color:T.muted}}>{isCoach?"🏋️ Coach View":`Hey, ${user.name.split(" ")[0]} 👋`}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {isCoach&&<div style={{background:"#1c2a0a",border:`1px solid ${T.accentDim}`,borderRadius:8,padding:"2px 9px",fontSize:10,color:T.accent,fontFamily:"'DM Mono'"}}>COACH</div>}
            <div onClick={()=>setTab("profil")} style={{width:34,height:34,borderRadius:"50%",background:T.accent,color:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,fontFamily:"'DM Mono'",cursor:"pointer"}}>{user.avatar}</div>
          </div>
        </div>

        {isCoach&&tab==="programme"&&(
          <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,display:"flex",padding:"0 14px"}}>
            {[{id:"builder",label:"📋 Build Program"},{id:"db",label:"💾 Exercise Library"}].map(t=>(
              <div key={t.id} onClick={()=>setCoachTab(t.id)} style={{flex:1,padding:"10px 0",fontSize:12,fontWeight:coachTab===t.id?700:400,color:coachTab===t.id?T.accent:T.muted,borderBottom:coachTab===t.id?`2px solid ${T.accent}`:"2px solid transparent",textAlign:"center",cursor:"pointer",userSelect:"none"}}>
                {t.label}
              </div>
            ))}
          </div>
        )}

        <div style={{flex:1,overflowY:"auto",paddingBottom:80}}>
          {tab==="programme"&&isCoach&&coachTab==="db"      &&<ExerciseDB db={db} setDb={setDb}/>}
          {tab==="programme"&&isCoach&&coachTab==="builder" &&<ProgramBuilder db={db} program={program} setProgram={setProgram}/>}
          {tab==="programme"&&!isCoach                      &&<ClientProgram program={program} setProgram={setProgram}/>}
          {tab==="stats"    &&!isCoach                      &&<Stats program={program}/>}
          {tab==="messages"                                 &&<Messages isCoach={isCoach} messages={messages} setMessages={setMessages}/>}
          {tab==="profil"                                   &&<Profil user={user} isCoach={isCoach} db={db} program={program} onLogout={()=>{setUser(null);setTab("programme");}}/>}
        </div>

        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",padding:"7px 0 11px"}}>
          {NAV.map(t=>(
            <div key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"5px 0",cursor:"pointer",userSelect:"none"}}>
              <div style={{fontSize:19}}>{t.icon}</div>
              <div style={{fontSize:10,color:tab===t.id?T.accent:T.muted,fontWeight:tab===t.id?700:400}}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
