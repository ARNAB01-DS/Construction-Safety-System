import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock, Mail, ArrowRight, Loader, Globe } from 'lucide-react';

// Demo credentials
const DEMO_USERS = [
  { email: 'admin@safescan.ai',   password: 'admin123',  name: 'Admin User',   role: 'Administrator', avatar: 'AU' },
  { email: 'manager@safescan.ai', password: 'manager123',name: 'Site Manager', role: 'Site Manager',  avatar: 'SM' },
  { email: 'viewer@safescan.ai',  password: 'viewer123', name: 'Site Viewer',  role: 'Site Officer',  avatar: 'SV' },
  { email: 'demo@safescan.ai',    password: 'demo',      name: 'Demo User',    role: 'Viewer',        avatar: 'DU' },
];

/* Derive display name from email: "john.doe@gmail.com" → "John Doe" */
function nameFromEmail(email) {
  const local = email.split('@')[0];
  return local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/* Derive initials: "John Doe" → "JD" */
function initialsFromName(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  // --- Private login state ---
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);
  const [touched,  setTouched]  = useState({ email: false, password: false });

  // --- Public (guest) login state ---
  const [guestEmail,   setGuestEmail]   = useState('');
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError,   setGuestError]   = useState('');
  const [guestTouched, setGuestTouched] = useState(false);

  const emailValid    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 4;
  const guestEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail);

  /* ── Private login ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });
    if (!emailValid || !passwordValid) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      setSuccess(true);
      if (onLogin) onLogin(user);
      setTimeout(() => navigate('/dashboard'), 900);
    } else {
      setError('Invalid email or password. Try one of the demo accounts below.');
      setLoading(false);
    }
  };

  const fillDemo = (u) => { setEmail(u.email); setPassword(u.password); setError(''); };

  /* ── Public / guest login ── */
  const handleGuestLogin = async (e) => {
    e.preventDefault();
    setGuestTouched(true);
    if (!guestEmailValid) return;

    setGuestLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const name    = nameFromEmail(guestEmail);
    const avatar  = initialsFromName(name);
    const domain  = guestEmail.split('@')[1];

    const guestUser = {
      email:  guestEmail,
      name,
      avatar,
      role:   'Guest Viewer',
      isGuest: true,
      domain,
    };

    if (onLogin) onLogin(guestUser);
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="bg-mesh" />
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className="login-layout">
        {/* ── Left panel ── */}
        <div className="login-left">
          <div className="login-brand">
            <svg width="46" height="46" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
              <rect width="32" height="32" rx="8" fill="url(#login-grad)"/>
              <path d="M16 6L8 9.5V16C8 20.4 11.5 24.5 16 26C20.5 24.5 24 20.4 24 16V9.5L16 6Z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              <path d="M11 16L14.5 19.5L21 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs><linearGradient id="login-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#f97316"/><stop offset="1" stopColor="#ea580c"/></linearGradient></defs>
            </svg>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>
                Safe<span style={{ color: 'var(--accent-orange)' }}>Scan</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Construction Safety Platform</div>
            </div>
          </div>

          <div className="login-left-hero">
            <div className="login-left-eyebrow">
              <span className="pulse-dot-green" /> AI-Powered · YOLOv8 · 83% mAP
            </div>
            <h2 className="login-left-title">
              Protect every<br/>
              <span className="text-gradient">worker on site</span>
            </h2>
            <p className="login-left-desc">
              Real-time PPE detection across all your cameras. Catch violations before they become incidents — automatically.
            </p>

            <div className="login-stats">
              {[
                { val: '83%',   label: 'mAP Accuracy' },
                { val: '90 FPS',label: 'Inference Speed' },
                { val: '<50ms', label: 'Latency' },
              ].map((s, i) => (
                <div key={i} className="login-stat">
                  <div className="login-stat-val">{s.val}</div>
                  <div className="login-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="login-detection-preview glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div className="live-dot" />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>GATE-A CAM 1 · LIVE</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { label: 'Helmet',    conf: 94, color: '#10b981' },
                  { label: 'No Helmet', conf: 91, color: '#ef4444' },
                  { label: 'Vest',      conf: 88, color: '#3b82f6' },
                ].map((d, i) => (
                  <div key={i} style={{
                    padding: '4px 10px', border: `1.5px solid ${d.color}`,
                    borderRadius: 6, fontSize: 11, fontWeight: 700, color: d.color,
                    background: `${d.color}15`, fontFamily: 'var(--font-mono)',
                    animation: `fade-up 0.4s ${i*0.1}s ease both`,
                  }}>
                    {d.label} {d.conf}%
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="login-features">
            {[
              'Real-time violation detection & instant alerts',
              'OSHA-ready compliance reports, auto-generated',
              'Multi-camera management with bounding boxes',
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <CheckCircle size={15} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="login-right">
          <div className="login-card glass-card">

            {/* ════════════════════════════════════════
                PUBLIC / GUEST ACCESS SECTION
            ════════════════════════════════════════ */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(234,88,12,0.04))',
              border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 22px',
              marginBottom: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Globe size={16} style={{ color: 'var(--accent-orange)', flexShrink: 0 }}/>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Public Access</span>
                <span style={{
                  marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                  background: 'rgba(249,115,22,0.15)', color: 'var(--accent-orange)',
                  padding: '2px 8px', borderRadius: 100, border: '1px solid rgba(249,115,22,0.3)',
                }}>FREE</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
                Enter your email to instantly view the platform — no password needed.
              </p>

              <form onSubmit={handleGuestLogin} noValidate>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Mail size={14} style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--text-muted)', pointerEvents: 'none',
                    }}/>
                    <input
                      id="guest-email-input"
                      type="email"
                      value={guestEmail}
                      onChange={e => { setGuestEmail(e.target.value); setGuestError(''); }}
                      placeholder="yourname@gmail.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        background: 'rgba(255,255,255,0.06)',
                        border: `1px solid ${guestTouched && !guestEmailValid ? 'var(--accent-red)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: 13,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <button
                    id="guest-access-btn"
                    type="submit"
                    disabled={guestLoading}
                    style={{
                      padding: '10px 18px',
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      opacity: guestLoading ? 0.7 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {guestLoading
                      ? <><Loader size={13} style={{ animation: 'spin 0.8s linear infinite' }}/> Loading…</>
                      : <>View Site <ArrowRight size={13}/></>
                    }
                  </button>
                </div>
                {guestTouched && !guestEmailValid && (
                  <p style={{ fontSize: 11, color: 'var(--accent-red)', marginTop: 6 }}>
                    Please enter a valid email address (e.g. yourname@gmail.com)
                  </p>
                )}
              </form>

              {/* What guests can access */}
              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Dashboard', 'Live Feed', 'Violations', 'Analytics', 'Detection'].map(item => (
                  <span key={item} style={{
                    fontSize: 10, fontWeight: 600,
                    padding: '2px 8px', borderRadius: 100,
                    background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)',
                    border: '1px solid rgba(16,185,129,0.2)',
                  }}>
                    {item}
                  </span>
                ))}
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  padding: '2px 8px', borderRadius: 100,
                  background: 'rgba(239,68,68,0.08)', color: 'var(--accent-red)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}>
                  Settings — locked
                </span>
              </div>
            </div>

            {/* ════════════════════════════════════════
                PRIVATE LOGIN SECTION
            ════════════════════════════════════════ */}
            <div className="login-card-header" style={{ paddingTop: 0 }}>
              <h1 className="login-card-title">Staff Sign In</h1>
              <p className="login-card-subtitle">Use your SafeScan staff credentials</p>
            </div>

            {error && (
              <div className="login-alert login-alert-error">
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}
            {success && (
              <div className="login-alert login-alert-success">
                <CheckCircle size={15} style={{ flexShrink: 0 }} />
                Login successful! Redirecting…
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor="login-email" className="login-label">Email address</label>
                <div className="login-input-wrap">
                  <Mail size={15} className="login-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    placeholder="you@company.com"
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    onBlur={() => setTouched(t => ({ ...t, email: true }))}
                    className={`login-input ${touched.email && !emailValid ? 'login-input-error' : ''}`}
                  />
                </div>
                {touched.email && !emailValid && (
                  <p className="login-field-err">Please enter a valid email address</p>
                )}
              </div>

              <div className="login-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label htmlFor="login-password" className="login-label" style={{ margin: 0 }}>Password</label>
                  <a href="#" style={{ fontSize: 12, color: 'var(--accent-blue)' }}>Forgot password?</a>
                </div>
                <div className="login-input-wrap">
                  <Lock size={15} className="login-input-icon" />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    placeholder="••••••••"
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    onBlur={() => setTouched(t => ({ ...t, password: true }))}
                    className={`login-input ${touched.password && !passwordValid ? 'login-input-error' : ''}`}
                  />
                  <button type="button" className="login-eye-btn"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {touched.password && !passwordValid && (
                  <p className="login-field-err">Password must be at least 4 characters</p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <input type="checkbox" id="remember" style={{ accentColor: 'var(--accent-blue)', width: 14, height: 14 }} />
                <label htmlFor="remember" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Keep me signed in for 30 days
                </label>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading || success}
                className="btn btn-primary w-full"
                style={{ height: 46, fontSize: 15, justifyContent: 'center', borderRadius: 'var(--radius-md)' }}
              >
                {loading ? (
                  <><Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Signing in…</>
                ) : success ? (
                  <><CheckCircle size={16} /> Redirecting…</>
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>or use a demo account</span>
            </div>

            <div className="login-demo-grid">
              {DEMO_USERS.map((u, i) => (
                <button key={i} id={`demo-user-${i}`} type="button"
                  className="login-demo-btn glass-card" onClick={() => fillDemo(u)}>
                  <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, flexShrink: 0 }}>{u.avatar}</div>
                  <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{u.role}</div>
                  </div>
                  <ArrowRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </button>
              ))}
            </div>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12.5, color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Start free trial</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes orb-float-1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(60px,-80px) scale(1.1); }
        }
        @keyframes orb-float-2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-50px,60px) scale(0.9); }
        }
        @keyframes orb-float-3 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(40px,40px) scale(1.05); }
          66% { transform: translate(-30px,-20px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
