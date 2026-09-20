import React, {useEffect, useState} from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./index.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Activity, AlertTriangle, Camera, CheckCircle2, ChevronRight, CircleDot, Eye, FileText, Gauge, Home, MapPin, Menu, RefreshCw, ShieldCheck, Trash2, Upload, X } from "lucide-react";
import { analyzeImage, createReport, deleteReport, getReports, getStats, resetDemo, seedDemo, updateStatus } from "./api";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const navy = "#10213a";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Layout({children}) {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen">
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 font-black text-xl" onClick={()=>setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white"><Eye size={21}/></span>
          Civic Eye <span className="text-blue-600">AI</span>
        </Link>
        <button className="md:hidden" onClick={()=>setOpen(!open)}><Menu/></button>
        <div className={`${open ? "flex" : "hidden"} absolute left-0 top-full w-full flex-col gap-2 border-b bg-white p-4 md:static md:flex md:w-auto md:flex-row md:border-0 md:p-0`}>
          <NavLink to="/" text="Home" setOpen={setOpen}/>
          <NavLink to="/report" text="Report Issue" setOpen={setOpen}/>
          <NavLink to="/map" text="Civic Map" setOpen={setOpen}/>
          <NavLink to="/dashboard" text="Dashboard" setOpen={setOpen}/>
          <NavLink to="/admin" text="Admin" setOpen={setOpen}/>
          <Link to="/report" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">Report an Issue</Link>
        </div>
      </div>
    </nav>
    {children}
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-7xl px-5 py-8 text-sm text-slate-500">© 2026 Civic Eye AI · “See it. Report it. Fix it.”</div>
    </footer>
  </div>
}
function NavLink({to,text,setOpen}) { return <Link onClick={()=>setOpen(false)} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100" to={to}>{text}</Link> }

function HomePage() {
  return <main>
    <section className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold"><Activity size={15}/> AI-POWERED CIVIC INTELLIGENCE</div>
          <h1 className="text-5xl font-black leading-tight md:text-7xl">See it.<br/><span className="text-blue-400">Report it.</span><br/>Fix it.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Civic Eye AI turns a photo of a civic problem into a structured, location-aware report in seconds.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/report" className="rounded-2xl bg-blue-500 px-6 py-4 font-black hover:bg-blue-400">Report an Issue <ChevronRight className="inline" size={18}/></Link>
            <Link to="/map" className="rounded-2xl border border-white/20 px-6 py-4 font-bold hover:bg-white/10">Explore Civic Map</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between"><span className="font-bold">Live Civic Intelligence</span><span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-300">DEMO LIVE</span></div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["128","Reports"],["31","High Severity"],["74","In Progress"],["23","Resolved"]
            ].map(([n,l])=><div className="rounded-2xl bg-white/10 p-5" key={l}><div className="text-3xl font-black">{n}</div><div className="mt-1 text-sm text-slate-400">{l}</div></div>)}
          </div>
          <div className="mt-3 rounded-2xl bg-white/10 p-5">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-red-500/20 text-red-300"><AlertTriangle size={20}/></span><div><b>High severity pothole</b><div className="text-xs text-slate-400">AI confidence 95% · Chennai</div></div></div>
          </div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-20">
      <h2 className="text-center text-3xl font-black">How it works</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-5">
        {[
          ["01","Capture","Take a photo of a civic problem."],
          ["02","Detect","AI classifies the issue and severity."],
          ["03","Locate","Attach the issue location."],
          ["04","Report","Generate a structured complaint."],
          ["05","Track","Monitor status through resolution."]
        ].map(([n,t,d])=><div className="rounded-3xl border bg-white p-6 shadow-sm" key={n}><span className="text-xs font-black text-blue-600">{n}</span><h3 className="mt-3 font-black">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p></div>)}
      </div>
    </section>
  </main>
}

function ReportPage() {
  const [step,setStep]=useState(1), [file,setFile]=useState(null), [preview,setPreview]=useState(""), [analysis,setAnalysis]=useState(null);
  const [loading,setLoading]=useState(false), [error,setError]=useState(""), [lat,setLat]=useState("13.0827"), [lng,setLng]=useState("80.2707"), [address,setAddress]=useState("Chennai, Tamil Nadu"), [result,setResult]=useState(null);
  const nav=useNavigate();

  async function runAI() {
    if(!file) return setError("Please choose an image first.");
    setError(""); setLoading(true);
    try { setAnalysis(await analyzeImage(file)); setStep(2); }
    catch(e){setError(e.message)}
    finally{setLoading(false)}
  }
  function locate() {
    if(!navigator.geolocation) return setError("Geolocation is unavailable. Enter coordinates manually.");
    setLoading(true); navigator.geolocation.getCurrentPosition(p=>{setLat(p.coords.latitude.toFixed(6));setLng(p.coords.longitude.toFixed(6));setAddress("Current browser location");setLoading(false);setStep(3)},()=>{setLoading(false);setError("Location permission was denied. You can still enter coordinates manually.");setStep(3)});
  }
  async function submit() {
    setLoading(true); setError("");
    try {
      const r=await createReport({...analysis,latitude:Number(lat),longitude:Number(lng),address,image_url:null});
      setResult(r); setStep(5);
    } catch(e){setError(e.message)} finally{setLoading(false)}
  }
  if(result) return <main className="mx-auto max-w-3xl px-5 py-16"><div className="rounded-3xl border bg-white p-8 text-center shadow-sm"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={34}/></div><h1 className="mt-5 text-3xl font-black">Complaint submitted</h1><p className="mt-2 text-slate-500">Your Civic Eye report has been saved successfully.</p><div className="my-8 rounded-2xl bg-slate-50 p-6"><div className="text-xs font-bold text-slate-400">CIVIC EYE ID</div><div className="mt-2 text-3xl font-black">{result.complaint_id}</div><div className="mt-3 font-bold">{result.category} · {result.severity}</div><div className="text-sm text-slate-500">{result.address}</div></div><div className="flex justify-center gap-3"><button onClick={()=>nav("/dashboard")} className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">View Dashboard</button><button onClick={()=>window.location.reload()} className="rounded-xl border px-5 py-3 font-bold">Report Another</button></div></div></main>;
  return <main className="mx-auto max-w-4xl px-5 py-12">
    <div className="mb-8"><p className="text-sm font-black text-blue-600">CIVIC REPORTER</p><h1 className="mt-2 text-4xl font-black">Report an issue</h1><p className="mt-2 text-slate-500">Photo → AI → Location → Review → Submit</p></div>
    <div className="mb-6 flex gap-2">{["Upload","AI Analysis","Location","Review","Done"].map((x,i)=><div key={x} className={`h-2 flex-1 rounded-full ${step>=i+1?"bg-blue-600":"bg-slate-200"}`}/>)}</div>
    {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    {step===1 && <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <div className="rounded-3xl border-2 border-dashed p-10 text-center">
        {preview ? <img src={preview} className="mx-auto max-h-72 rounded-2xl object-cover"/> : <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Camera/></div>}
        <h2 className="mt-5 text-xl font-black">Upload civic issue photo</h2>
        <p className="mt-2 text-sm text-slate-500">JPG, PNG or WEBP · Max 8 MB</p>
        <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"><Upload size={17}/> Choose Image<input hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const f=e.target.files?.[0];if(f){setFile(f);setPreview(URL.createObjectURL(f))}}}/></label>
      </div>
      <button disabled={!file||loading} onClick={runAI} className="mt-5 w-full rounded-2xl bg-blue-600 px-5 py-4 font-black text-white disabled:opacity-40">{loading?"AI is analyzing…":"Analyze with AI"}</button>
    </div>}
    {step===2 && analysis && <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-black">AI analysis</h2><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{analysis.source}</span></div>
      <div className="mt-6 grid gap-4 md:grid-cols-3"><Info label="Detected issue" value={analysis.category}/><Info label="Confidence" value={`${analysis.confidence}%`}/><Info label="Severity" value={analysis.severity}/></div>
      <div className="mt-5 rounded-2xl bg-slate-50 p-5"><b>Description</b><p className="mt-2 text-sm leading-6 text-slate-600">{analysis.description}</p><b className="mt-4 block">Recommended action</b><p className="mt-2 text-sm leading-6 text-slate-600">{analysis.recommended_action}</p></div>
      <button onClick={()=>setStep(3)} className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-4 font-black text-white">Continue to Location</button>
    </div>}
    {step===3 && <div className="rounded-3xl border bg-white p-8 shadow-sm"><h2 className="text-2xl font-black">Add location</h2><p className="mt-2 text-sm text-slate-500">Use your browser location or enter a demo location.</p><button onClick={locate} className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"><MapPin size={17}/> {loading?"Getting location…":"Use my location"}</button><div className="mt-6 grid gap-4 md:grid-cols-2"><label className="text-sm font-bold">Latitude<input value={lat} onChange={e=>setLat(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label><label className="text-sm font-bold">Longitude<input value={lng} onChange={e=>setLng(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label></div><label className="mt-4 block text-sm font-bold">Location label<input value={address} onChange={e=>setAddress(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label><button onClick={()=>setStep(4)} className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-4 font-black text-white">Review Report</button></div>}
    {step===4 && analysis && <div className="rounded-3xl border bg-white p-8 shadow-sm"><h2 className="text-2xl font-black">Review and submit</h2><div className="mt-6 grid gap-5 md:grid-cols-2"><img src={preview} className="h-64 w-full rounded-2xl object-cover"/><div><Info label="Issue" value={analysis.category}/><Info label="Severity" value={analysis.severity}/><Info label="Location" value={address}/><div className="mt-4"><b className="text-sm">Complaint</b><textarea defaultValue={analysis.complaint_text} id="complaint" className="mt-2 h-36 w-full rounded-xl border p-3 text-sm"/></div></div></div><button disabled={loading} onClick={()=>{const text=document.getElementById("complaint").value;setAnalysis({...analysis,complaint_text:text});setTimeout(submit,0)}} className="mt-6 w-full rounded-2xl bg-emerald-600 px-5 py-4 font-black text-white">{loading?"Submitting…":"Submit Complaint"}</button></div>}
  </main>
}
function Info({label,value}) {return <div className="rounded-2xl border p-4"><div className="text-xs font-bold uppercase text-slate-400">{label}</div><div className="mt-1 font-black">{value}</div></div>}

function Dashboard() {
  const [reports,setReports]=useState([]),[stats,setStats]=useState(null);
  async function load(){setReports(await getReports());setStats(await getStats())}
  useEffect(()=>{load()},[]);
  return <main className="mx-auto max-w-7xl px-5 py-12"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-black text-blue-600">OVERVIEW</p><h1 className="mt-2 text-4xl font-black">Civic Dashboard</h1></div><button onClick={load} className="rounded-xl border bg-white px-4 py-3 font-bold"><RefreshCw size={16} className="mr-2 inline"/>Refresh</button></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[stats?.total||0,"Total Reports",FileText],[stats?.high||0,"High Severity",AlertTriangle],[stats?.in_progress||0,"In Progress",Activity],[stats?.resolved||0,"Resolved",CheckCircle2]].map(([n,l,I])=><div className="rounded-3xl border bg-white p-6 shadow-sm" key={l}><I className="text-blue-600"/><div className="mt-4 text-4xl font-black">{n}</div><div className="mt-1 text-sm text-slate-500">{l}</div></div>)}</div>
    <div className="mt-8 grid gap-6 lg:grid-cols-2"><Chart title="Issues by category" data={Object.entries(stats?.categories||{}).map(([name,value])=>({name,value}))}/><SeverityChart stats={stats}/></div>
    <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm"><div className="flex justify-between"><h2 className="text-xl font-black">Recent Reports</h2><Link to="/map" className="text-sm font-bold text-blue-600">View map →</Link></div><div className="mt-5 space-y-3">{reports.slice(0,8).map(r=><ReportRow r={r} key={r.id}/>)}</div></section>
  </main>
}
function Chart({title,data}){return <div className="rounded-3xl border bg-white p-6 shadow-sm"><h2 className="font-black">{title}</h2><div className="mt-4 h-72"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" hide/><YAxis/><Tooltip/><Bar dataKey="value" fill="#2563eb" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></div>}
function SeverityChart({stats}){const data=Object.entries(stats?.severities||{}).map(([name,value])=>({name,value}));return <div className="rounded-3xl border bg-white p-6 shadow-sm"><h2 className="font-black">Severity mix</h2><div className="mt-4 h-72"><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={95} label>{data.map((_,i)=><Cell key={i} fill={["#22c55e","#f59e0b","#ef4444"][i%3]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></div>}
function ReportRow({r}){return <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4"><div><div className="font-black">{r.category}</div><div className="text-xs text-slate-500">{r.complaint_id} · {r.address||"Location not specified"}</div></div><div className="flex items-center gap-2"><Badge value={r.severity}/><Badge value={r.status}/></div></div>}
function Badge({value}){return <span className="rounded-full bg-white px-3 py-1 text-xs font-bold shadow-sm">{value}</span>}

function MapPage(){
  const [reports,setReports]=useState([]); useEffect(()=>{getReports().then(setReports)},[]);
  const valid=reports.filter(r=>r.latitude&&r.longitude);
  return <main className="mx-auto max-w-7xl px-5 py-10"><div><p className="text-sm font-black text-blue-600">LOCATION INTELLIGENCE</p><h1 className="mt-2 text-4xl font-black">Civic Issue Map</h1><p className="mt-2 text-slate-500">Interactive view of reported civic issues.</p></div><div className="mt-7 h-[650px] overflow-hidden rounded-3xl border bg-white shadow-sm"><MapContainer center={[13.0827,80.2707]} zoom={12}><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{valid.map(r=><Marker key={r.id} position={[r.latitude,r.longitude]}><Popup><b>{r.category}</b><br/>Severity: {r.severity}<br/>Status: {r.status}<br/>{r.complaint_id}</Popup></Marker>)}</MapContainer></div></main>
}

function Admin(){
 const [reports,setReports]=useState([]),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function load(){setReports(await getReports())} useEffect(()=>{load()},[]);
 async function seed(){setBusy(true);setMessage((await seedDemo()).message);await load();setBusy(false)}
 async function reset(){setBusy(true);await resetDemo();setMessage("Demo data reset.");await load();setBusy(false)}
 async function status(id,s){await updateStatus(id,s);await load()}
 async function del(id){if(confirm("Delete this report?")){await deleteReport(id);await load()}}
 return <main className="mx-auto max-w-7xl px-5 py-12"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-black text-blue-600">CONTROL CENTER</p><h1 className="mt-2 text-4xl font-black">Admin Dashboard</h1></div><div className="flex gap-2"><button disabled={busy} onClick={seed} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">Load Demo Data</button><button disabled={busy} onClick={reset} className="rounded-xl border bg-white px-4 py-3 text-sm font-bold">Reset</button></div></div>{message&&<div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">{message}</div>}<div className="mt-7 overflow-x-auto rounded-3xl border bg-white shadow-sm"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">ID</th><th>Category</th><th>Severity</th><th>Location</th><th>Status</th><th>Action</th></tr></thead><tbody>{reports.map(r=><tr className="border-t" key={r.id}><td className="p-4 font-bold">{r.complaint_id}</td><td>{r.category}</td><td><Badge value={r.severity}/></td><td>{r.address||"—"}</td><td><select value={r.status} onChange={e=>status(r.id,e.target.value)} className="rounded-lg border p-2"><option>REPORTED</option><option>UNDER REVIEW</option><option>IN PROGRESS</option><option>RESOLVED</option></select></td><td><button onClick={()=>del(r.id)} className="text-red-600"><Trash2 size={17}/></button></td></tr>)}</tbody></table></div></main>
}

function App(){return <Layout><Routes><Route path="/" element={<HomePage/>}/><Route path="/report" element={<ReportPage/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/map" element={<MapPage/>}/><Route path="/admin" element={<Admin/>}/></Routes></Layout>}
createRoot(document.getElementById("root")).render(<BrowserRouter><App/></BrowserRouter>);
