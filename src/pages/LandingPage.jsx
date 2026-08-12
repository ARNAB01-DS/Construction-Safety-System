import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Eye, Bell, BarChart3, Lock, ChevronRight,
  CheckCircle, X, Play, ArrowRight, Star, Zap, Camera, FileText,
  Scan, AlertTriangle, Layers, Video, Cpu, Server, Database,
  Cloud, Code, Wifi, Filter, HardDrive, Globe, Monitor,
  ShieldCheck, FileCheck, KeyRound, Scale,
} from 'lucide-react';

/*  Data  */

const features = [
  {
    icon: <Scan size={22}/>,
    cls: 'feature-icon-blue',   title: 'Real-Time Detection',      desc: 'YOLOv8m inference at 90 FPS — detects helmets, vests & persons in under 50ms across every camera feed simultaneously.' },
  {
    icon: <Bell size={22}/>,
    cls: 'feature-icon-red',    title: 'Instant Violation Alerts',  desc: 'Automatic email, SMS & webhook notifications the moment a No-Helmet or No-Vest detection is confirmed.' },
  {
    icon: <BarChart3 size={22}/>,
    cls: 'feature-icon-cyan',   title: 'Analytics & Heatmaps',     desc: 'Violation hotspots, hourly trends, weekly patterns, and compliance rates per camera zone and shift.' },
  {
    icon: <Video size={22}/>,
    cls: 'feature-icon-purple', title: 'Multi-Camera Management',   desc: 'Connect unlimited IP cameras via RTSP. Manage feeds, zones, and inference schedules from one dashboard.' },
  {
    icon: <FileText size={22}/>,
    cls: 'feature-icon-amber',  title: 'OSHA Compliance Reports',   desc: 'Auto-generate audit-ready PDFs with annotated frames, violation timelines, and chain-of-custody records.' },
  {
    icon: <Lock size={22}/>,
    cls: 'feature-icon-green',  title: 'Enterprise Security',       desc: 'SOC 2 roadmap, AES-256 encryption, GDPR/CCPA tools, face blurring, and customer-managed keys.' },
];

const pricingTiers = [
  {
    tier: 'Starter', price: 199, cameras: 'Up to 5 cameras', users: '3 users',
    features: [
      { text: 'Real-time PPE detection', ok: true },
      { text: 'Dashboard & violation log', ok: true },
      { text: 'Email alerts', ok: true },
      { text: 'Weekly compliance reports', ok: true },
      { text: 'API access', ok: false },
      { text: 'SSO & white-label', ok: false },
    ]
  },
  {
    tier: 'Professional', price: 599, cameras: 'Up to 20 cameras', users: '10 users', featured: true,
    features: [
      { text: 'Real-time PPE detection', ok: true },
      { text: 'Dashboard & violation log', ok: true },
      { text: 'Email + SMS alerts', ok: true },
      { text: 'Daily & custom reports', ok: true },
      { text: 'Full API access', ok: true },
      { text: 'SSO & white-label', ok: false },
    ]
  },
  {
    tier: 'Enterprise', price: 1999, cameras: 'Unlimited cameras', users: 'Unlimited',
    features: [
      { text: 'Real-time PPE detection', ok: true },
      { text: 'Dashboard & violation log', ok: true },
      { text: 'All alert channels', ok: true },
      { text: 'OSHA PDF + audit reports', ok: true },
      { text: 'Full API + webhooks', ok: true },
      { text: 'SSO, white-label & SLA', ok: true },
    ]
  }
];

const techStack = [
  { cat: 'Frontend',      icon: <Monitor size={20} style={{ color: '#3b82f6' }}/>,
    items: ['React 19 + Vite 8', 'Recharts', 'React Router 7', 'Vanilla CSS'] },
  { cat: 'Backend',       icon: <Server size={20} style={{ color: '#8b5cf6' }}/>,
    items: ['FastAPI (Python)', 'Celery + Redis', 'PostgreSQL 15', 'WebSockets'] },
  { cat: 'ML / Inference', icon: <Cpu size={20} style={{ color: '#10b981' }}/>,
    items: ['YOLOv8m (Ultralytics)', 'ONNX Runtime', 'TensorRT (GPU)', 'OpenCV'] },
  { cat: 'Cloud / Infra',  icon: <Cloud size={20} style={{ color: '#06b6d4' }}/>,
    items: ['AWS ECS Fargate', 'EC2 G4dn (T4 GPU)', 'S3 + CloudFront', 'Terraform'] },
];

const testimonials = [
  { name: 'James Harrington', role: 'HSE Director, BuildCorp', text: 'SafeScan cut our violation incidents by 62% in the first month. The OSHA reports save us 8 hours every week.', stars: 5 },
  { name: 'Maria Gonzalez',   role: 'Site Manager, Apex Builders', text: "Camera setup was under 20 minutes. Now I get an instant alert on my phone the moment someone's missing their helmet.", stars: 5 },
  { name: 'Tom Wierstra',     role: 'Safety Officer, NordConstruct', text: 'The analytics heatmap showed us our gate entry zone was our riskiest area. We fixed it in days.', stars: 5 },
];

/* Hero detection box SVG icons — small premium inline SVGs */
const DetectionIcon = ({ type }) => {
  const size = 28;
  if (type === 'helmet') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18h20"/>
      <path d="M4 18v-2a8 8 0 1 1 16 0v2"/>
      <path d="M12 2v2"/>
    </svg>
  );
  if (type === 'nohelmet') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18h20"/>
      <path d="M4 18v-2a8 8 0 1 1 16 0v2"/>
      <line x1="4" y1="4" x2="20" y2="20" strokeWidth="2.5"/>
    </svg>
  );
  if (type === 'vest') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L2 8v14h6V2z"/>
      <path d="M18 2l4 6v14h-6V2z"/>
      <path d="M6 2h12"/>
      <line x1="8" y1="8" x2="8" y2="14"/>
      <line x1="16" y1="8" x2="16" y2="14"/>
    </svg>
  );
  // novest
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L2 8v14h6V2z"/>
      <path d="M18 2l4 6v14h-6V2z"/>
      <path d="M6 2h12"/>
      <line x1="4" y1="4" x2="20" y2="20" strokeWidth="2.5"/>
    </svg>
  );
};

/* How-It-Works step icons */
const stepIcons = [
  <Camera size={16} style={{ color: '#3b82f6' }}/>,
  <Layers size={16} style={{ color: '#8b5cf6' }}/>,
  <Cpu size={16} style={{ color: '#10b981' }}/>,
  <Filter size={16} style={{ color: '#06b6d4' }}/>,
  <AlertTriangle size={16} style={{ color: '#f59e0b' }}/>,
  <HardDrive size={16} style={{ color: '#ef4444' }}/>,
];

/*  Component  */

export default function LandingPage() {
  const [annualBilling, setAnnualBilling] = useState(false);

  const getPrice = (p) => annualBilling ? Math.floor(p * 0.8) : p;

  return (
    <div style={{ overflowX: 'hidden' }}>
      <div className="bg-mesh" />

      {/*  NAVBAR  */}
      <nav className="navbar" style={{ background: 'rgba(4,8,18,0.75)', backdropFilter: 'blur(24px)' }}>
        <div className="navbar-brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
            <rect width="32" height="32" rx="8" fill="url(#lp-grad)"/>
            <path d="M16 6L8 9.5V16C8 20.4 11.5 24.5 16 26C20.5 24.5 24 20.4 24 16V9.5L16 6Z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
            <path d="M11 16L14.5 19.5L21 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="lp-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#f97316"/><stop offset="1" stopColor="#ea580c"/></linearGradient></defs>
          </svg>
          Safe<span style={{ color: 'var(--accent-orange)' }}>Scan</span>
        </div>
        <div className="navbar-nav desktop-nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#tech">Tech Stack</a>
        </div>
        <div className="navbar-actions">
          <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link to="/login" className="btn btn-primary btn-sm">
            Get Started <ArrowRight size={13}/>
          </Link>
        </div>
      </nav>

      {/*  HERO  */}
      <section className="hero-section" id="home" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container">
          {/* Eyebrow */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div className="hero-eyebrow">
              <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:'var(--accent-green)', animation:'live-pulse 1s infinite' }}/>
              YOLOv8 Powered · Real-Time Inference · 83% mAP
            </div>
          </div>

          {/* Title */}
          <h1 className="hero-title" style={{ marginBottom: 20 }}>
            AI-Powered Safety<br/>
            <span className="gradient-text">for Every Construction Site</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Deploy real-time PPE detection across all your cameras. Detect helmet & vest violations
            instantly — reduce OSHA fines, protect workers, and generate audit-ready reports automatically.
          </p>

          {/* CTA buttons */}
          <div className="hero-cta" style={{ marginBottom: 56 }}>
            <Link to="/login" className="btn btn-primary btn-lg">
              <Shield size={18}/> Start Free Trial
            </Link>
            <Link to="/dashboard" className="btn btn-ghost btn-lg">
              <Play size={16}/> View Live Demo
            </Link>
          </div>

          {/* Hero stats */}
          <div className="hero-stats" style={{ marginTop: 0, marginBottom: 48 }}>
            {[
              { num: '83%',    lbl: 'Overall mAP@0.5' },
              { num: '90 FPS', lbl: 'Inference Speed (T4)' },
              { num: '5',      lbl: 'PPE Classes Detected' },
              { num: '<50ms',  lbl: 'Detection Latency' },
            ].map((s, i) => (
              <div key={i} className="hero-stat-item">
                <div className="hero-stat-number">{s.num}</div>
                <div className="hero-stat-label">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Detection demo box — with SVG PPE icons */}
          <div style={{ maxWidth: 780, margin: '0 auto', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-glow-blue)' }}>
            <div style={{ background: 'linear-gradient(135deg,#0a1628,#040812)', aspectRatio: '16/7', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 40 }}>
              {/* Grid */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }}/>
              {/* Boxes */}
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                {[
                  { label: 'Helmet 94%',    color: '#10b981', type: 'helmet'   },
                  { label: 'No Helmet 91%', color: '#ef4444', type: 'nohelmet' },
                  { label: 'Vest 88%',      color: '#3b82f6', type: 'vest'     },
                  { label: 'No Vest 85%',   color: '#f97316', type: 'novest'   },
                ].map((box, i) => (
                  <div key={i} style={{ border:`2px solid ${box.color}`, borderRadius:8, padding:'16px 18px', position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:8, background:`${box.color}10`, boxShadow:`0 0 24px ${box.color}25`, animation:`fade-up 0.5s ${i*0.15}s ease both` }}>
                    <div style={{ position:'absolute', top:-24, left:-1, background:box.color, color:'#fff', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:'4px 4px 4px 0', fontFamily:'var(--font-mono)', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:4, boxShadow:`0 2px 8px ${box.color}40` }}>
                      {box.label}
                    </div>
                    <DetectionIcon type={box.type}/>
                  </div>
                ))}
              </div>
              {/* LIVE badge */}
              <div style={{ position:'absolute', top:10, left:10, display:'flex', alignItems:'center', gap:6, padding:'4px 10px', background:'rgba(0,0,0,0.65)', borderRadius:100, fontSize:11, fontWeight:700 }}>
                <div className="live-dot"/> LIVE · Gate-A Cam 1 · 30 FPS
              </div>
              {/* Inference tag */}
              <div style={{ position:'absolute', bottom:10, right:10, fontFamily:'var(--font-mono)', fontSize:10, color:'rgba(255,255,255,0.35)' }}>
                YOLOv8m · ONNX · 42ms
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  HOW IT WORKS  */}
      <section className="section" id="how-it-works" style={{ background: 'var(--color-bg-1)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">How It Works</div>
            <h2 className="section-title">From camera to alert in milliseconds</h2>
            <p className="section-desc">Six-step inference pipeline, fully automated — no manual review required.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {[
              { step:'01', title:'Frame Capture',    desc:'RTSP/HTTP stream → FFmpeg frame buffer',      color:'#3b82f6' },
              { step:'02', title:'Pre-processing',   desc:'Resize 640×640, normalize, batch frames',    color:'#8b5cf6' },
              { step:'03', title:'YOLOv8 Inference', desc:'ONNX Runtime / TensorRT on T4 GPU',          color:'#10b981' },
              { step:'04', title:'Post-processing',  desc:'NMS, conf=0.45, IoU=0.5 filtering',          color:'#06b6d4' },
              { step:'05', title:'Violation Check',  desc:'No-Helmet / No-Vest → trigger alert',        color:'#f59e0b' },
              { step:'06', title:'Store & Push',     desc:'Annotated frame to S3 + WebSocket push',    color:'#ef4444' },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding:20, borderTop:`3px solid ${s.color}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:11, fontWeight:700, color:s.color, opacity:0.6 }}>{s.step}</div>
                  <div style={{ width:28, height:28, borderRadius:6, background:`${s.color}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {stepIcons[i]}
                  </div>
                </div>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>{s.title}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  FEATURES  */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Platform Features</div>
            <h2 className="section-title">Everything You Need to Protect Your Site</h2>
            <p className="section-desc">From real-time inference to compliance reporting — SafeScan covers the full PPE monitoring workflow.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="glass-card feature-card">
                <div className={`feature-icon ${f.cls}`}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  MODEL METRICS  */}
      <section className="section" style={{ background: 'var(--color-bg-1)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">ML Model</div>
            <h2 className="section-title">YOLOv8m — Optimized for PPE</h2>
            <p className="section-desc">Fine-tuned on 10,000+ construction site images across 5 PPE classes.</p>
          </div>
          <div className="grid-2">
            {/* Per-class bars */}
            <div className="glass-card" style={{ padding:28 }}>
              <div className="chart-title" style={{ marginBottom:20 }}>Per-Class Performance</div>
              {[
                { cls:'Person',    val:0.89, color:'#8b5cf6' },
                { cls:'Helmet',    val:0.84, color:'#10b981' },
                { cls:'No Helmet', val:0.81, color:'#ef4444' },
                { cls:'Vest',      val:0.83, color:'#3b82f6' },
                { cls:'No Vest',   val:0.79, color:'#f97316' },
              ].map(m => (
                <div key={m.cls} className="metric-row">
                  <div className="metric-class">{m.cls}</div>
                  <div className="metric-bar-wrapper">
                    <div className="metric-bar" style={{ width:`${m.val*100}%`, background:m.color }}/>
                  </div>
                  <div className="metric-value">{(m.val*100).toFixed(0)}%</div>
                </div>
              ))}
              <div style={{ display:'flex', gap:12, marginTop:18, flexWrap:'wrap' }}>
                {[['83%','mAP@0.5'],['0.86','Precision'],['0.81','Recall']].map(([v,l]) => (
                  <div key={l} className="glass-card" style={{ padding:'10px 16px', flex:1, textAlign:'center', minWidth:70 }}>
                    <div style={{ fontSize:22, fontWeight:900 }} className="text-gradient">{v}</div>
                    <div className="text-xs text-muted mt-2">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Pipeline */}
            <div className="glass-card" style={{ padding:28 }}>
              <div className="chart-title" style={{ marginBottom:20 }}>Inference Pipeline</div>
              {[
                { step:'01', label:'Frame Capture',    desc:'RTSP/HTTP stream → FFmpeg frame buffer', color:'#3b82f6' },
                { step:'02', label:'Pre-processing',   desc:'Resize 640×640, normalize, batch',       color:'#8b5cf6' },
                { step:'03', label:'YOLOv8 Inference', desc:'ONNX Runtime / TensorRT GPU',            color:'#10b981' },
                { step:'04', label:'Post-processing',  desc:'NMS, conf=0.45, IoU=0.5 threshold',     color:'#06b6d4' },
                { step:'05', label:'Violation Check',  desc:'No-Helmet / No-Vest class → Alert',     color:'#f59e0b' },
                { step:'06', label:'Store & Push',     desc:'Annotated frame → S3 + WebSocket',      color:'#ef4444' },
              ].map((s, i) => (
                <div key={i} style={{ display:'flex', gap:12, marginBottom:12, alignItems:'flex-start' }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:`${s.color}20`, border:`1px solid ${s.color}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {stepIcons[i]}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{s.label}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*  TESTIMONIALS  */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Trusted by Safety Teams</div>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card" style={{ padding:24 }}>
                <div style={{ display:'flex', gap:2, marginBottom:14 }}>
                  {Array(t.stars).fill(0).map((_,j) => <Star key={j} size={14} style={{ color:'#f59e0b', fill:'#f59e0b' }}/>)}
                </div>
                <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.7, marginBottom:16, fontStyle:'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div className="avatar" style={{ width:36, height:36, flexShrink:0 }}>
                    {t.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  PRICING  */}
      <section className="section" id="pricing" style={{ background: 'var(--color-bg-1)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Pricing</div>
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-desc">Break-even at just 1 prevented OSHA fine per quarter. ROI from day one.</p>
            {/* Billing toggle */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:12, marginTop:20, padding:'8px 16px', background:'rgba(255,255,255,0.04)', borderRadius:100, border:'1px solid var(--color-border)' }}>
              <span style={{ fontSize:13, color: annualBilling?'var(--text-muted)':'var(--text-primary)', fontWeight:600 }}>Monthly</span>
              <button
                onClick={() => setAnnualBilling(v => !v)}
                style={{ width:44, height:24, borderRadius:100, background: annualBilling?'var(--accent-blue)':'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', position:'relative', transition:'background 0.2s' }}
              >
                <div style={{ position:'absolute', top:3, left: annualBilling?23:3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }}/>
              </button>
              <span style={{ fontSize:13, color: annualBilling?'var(--text-primary)':'var(--text-muted)', fontWeight:600 }}>Annual</span>
              {annualBilling && <span className="badge badge-green" style={{ fontSize:10 }}>Save 20%</span>}
            </div>
          </div>
          <div className="pricing-grid">
            {pricingTiers.map((t, i) => (
              <div key={i} className={`glass-card pricing-card ${t.featured ? 'featured' : ''}`}>
                {t.featured && <div className="pricing-featured-badge">Most Popular</div>}
                <div className="pricing-tier">{t.tier}</div>
                <div className="pricing-price">
                  <span>$</span>{getPrice(t.price).toLocaleString()}
                </div>
                <div className="pricing-cycle">/month · {t.cameras} · {t.users}</div>
                <ul className="pricing-features">
                  {t.features.map((f, j) => (
                    <li key={j}>
                      {f.ok
                        ? <CheckCircle size={14} className="pricing-check"/>
                        : <X size={14} className="pricing-x"/>
                      }
                      <span style={{ color: f.ok?'var(--text-secondary)':'var(--text-muted)' }}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/login" className={`btn w-full ${t.featured?'btn-primary':'btn-ghost'}`} style={{ justifyContent:'center' }}>
                  Get Started <ChevronRight size={14}/>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  TECH STACK  */}
      <section className="section" id="tech">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Tech Stack</div>
            <h2 className="section-title">Built on Production-Grade Infrastructure</h2>
            <p className="section-desc">Enterprise-ready architecture designed for scale, security, and sub-50ms inference.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
            {techStack.map((s, i) => (
              <div key={i} className="glass-card" style={{ padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.04)', border:'1px solid var(--color-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--accent-blue)' }}>{s.cat}</div>
                </div>
                {s.items.map((item, j) => (
                  <div key={j} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom: j<s.items.length-1?'1px solid var(--color-border)':'none', fontSize:13 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent-blue)', flexShrink:0 }}/>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  CTA BANNER  */}
      <section style={{ padding:'80px 0', background:'linear-gradient(135deg,rgba(59,130,246,0.08),rgba(6,182,212,0.05))' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--accent-blue)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>
            Start protecting your team today
          </div>
          <h2 className="section-title">Ready to Protect Your Site?</h2>
          <p className="section-desc" style={{ margin:'0 auto 32px' }}>
            14-day free trial · No credit card required · Full access to all features
          </p>
          <div style={{ display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
            <Link to="/login" className="btn btn-primary btn-lg">
              <Shield size={18}/> Start Free Trial
            </Link>
            <Link to="/dashboard" className="btn btn-ghost btn-lg">
              <Eye size={18}/> Explore Dashboard
            </Link>
          </div>
          {/* Trust indicators */}
          <div style={{ display:'flex', justifyContent:'center', gap:24, marginTop:32, flexWrap:'wrap' }}>
            {[
              { label: 'SOC 2 In Progress',  icon: <ShieldCheck size={14} style={{ color:'var(--accent-green)' }}/> },
              { label: 'OSHA 29 CFR 1926',    icon: <FileCheck size={14} style={{ color:'var(--accent-blue)' }}/> },
              { label: 'AES-256 Encrypted',   icon: <KeyRound size={14} style={{ color:'var(--accent-cyan)' }}/> },
              { label: 'GDPR / CCPA Ready',   icon: <Scale size={14} style={{ color:'var(--accent-purple)' }}/> },
            ].map((t,i) => (
              <div key={i} style={{ fontSize:12, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:6 }}>
                {t.icon} {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  FOOTER  */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand" style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Shield size={18} style={{ color:'var(--accent-orange)' }}/>
                SafeScan
              </div>
              <p className="footer-desc">Real-time AI-powered PPE detection for construction sites. Reduce injuries, stay OSHA compliant, and protect every worker.</p>
            </div>
            <div>
              <div className="footer-col-title">Product</div>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><Link to="/api-docs">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Platform</div>
              <ul className="footer-links">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/model">ML Model</Link></li>
                <li><Link to="/business">Business Plan</Link></li>
                <li><Link to="/budget">Budget & ROI</Link></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Legal</div>
              <ul className="footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">GDPR / CCPA</a></li>
                <li><a href="#">SOC 2 Status</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2026 SafeScan. All rights reserved.</span>
            <span>YOLOv8m · ONNX Runtime · FastAPI · React 19</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
