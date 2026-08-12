import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Activity, AlertTriangle, BarChart3, Scan,
  FileText, Settings, DollarSign, Cpu, Home, Menu, X,
  Bell, ChevronDown, LogOut, Shield, Globe,
} from 'lucide-react';

import { ThemeProvider } from './context/ThemeContext';
import { LangProvider, useLang } from './context/LangContext';
import ThemeToggle  from './components/ThemeToggle';
import LangSelector from './components/LangSelector';

import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import Dashboard      from './pages/Dashboard';

import ViolationsPage from './pages/ViolationsPage';
import AnalyticsPage  from './pages/AnalyticsPage';
import DetectionPage  from './pages/DetectionPage';
import ModelPage      from './pages/ModelPage';
import BusinessPage   from './pages/BusinessPage';
import BudgetPage     from './pages/BudgetPage';
import ApiDocsPage    from './pages/ApiDocsPage';
import SettingsPage   from './pages/SettingsPage';

import { alerts } from './data/mockData';

/*  SafeScan SVG Logo  */
function SafeScanLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="url(#brand-grad)"/>
      <path d="M16 6L8 9.5V16C8 20.4 11.5 24.5 16 26C20.5 24.5 24 20.4 24 16V9.5L16 6Z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M11 16L14.5 19.5L21 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="12" x2="20" y2="12" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2 2"/>
      <defs>
        <linearGradient id="brand-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316"/>
          <stop offset="1" stopColor="#ea580c"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/*  App Shell  */
function AppShell({ user, onLogout, children }) {
  const location = useLocation();
  const { t }    = useLang();
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);

  const publicRoutes = ['/', '/login'];
  const isPublic = publicRoutes.includes(location.pathname);

  useEffect(() => {
    setSidebarOpen(false);
    setNotifOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#notif-btn')     && !e.target.closest('.notif-dropdown'))    setNotifOpen(false);
      if (!e.target.closest('#user-menu-btn') && !e.target.closest('.user-menu-dropdown')) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (isPublic) return children;

  const navItems = [
    { to: '/dashboard',  icon: <Home size={16}/>,          label: t('nav.overview') },

    { to: '/violations', icon: <AlertTriangle size={16}/>,  label: t('nav.violations'), badge: 3 },
    { to: '/analytics',  icon: <BarChart3 size={16}/>,      label: t('nav.analytics') },
    { to: '/detect',     icon: <Scan size={16}/>,           label: t('nav.detect') },
  ];

  const systemItems = [
    { to: '/model',    icon: <Cpu size={16}/>,       label: t('nav.model') },
    { to: '/business', icon: <DollarSign size={16}/>, label: t('nav.business') },
    { to: '/budget',   icon: <Activity size={16}/>,   label: t('nav.budget') },
    { to: '/api-docs', icon: <FileText size={16}/>,   label: t('nav.apidocs') },
    { to: '/settings', icon: <Settings size={16}/>,   label: t('nav.settings') },
  ];

  const criticalCount = alerts.filter(a => a.type === 'critical').length;
  const currentUser = user || { name: 'Site Manager', role: 'Manager', avatar: 'SM' };

  return (
    <div className="page-wrapper">
      <div className="bg-mesh" />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/*  Navbar  */}
      <nav className="navbar">
        <button className="btn btn-ghost btn-sm mobile-menu-btn" id="mobile-menu-btn"
          aria-label="Toggle sidebar" onClick={() => setSidebarOpen(v => !v)}>
          {sidebarOpen ? <X size={16}/> : <Menu size={16}/>}
        </button>

        <div className="navbar-brand">
          <SafeScanLogo size={30}/>
          Safe<span style={{ color: 'var(--accent-orange)' }}>Scan</span>
        </div>

        <div className="navbar-nav desktop-nav">
          {navItems.map(n => (
            <NavLink key={n.to} to={n.to} className={({isActive}) => isActive ? 'active' : ''}>
              {n.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions">
          {/* Theme toggle */}
          <ThemeToggle/>

          {/* Language selector */}
          <LangSelector/>

          {/* Notification bell */}
          <div style={{ position: 'relative' }}>
            <button id="notif-btn" className="btn btn-ghost btn-sm"
              style={{ position: 'relative' }} aria-label="Notifications"
              onClick={() => setNotifOpen(v => !v)}>
              <Bell size={16}/>
              {criticalCount > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2,
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--accent-red)',
                  border: '2px solid var(--color-bg-0)',
                  animation: 'live-pulse 1.5s infinite',
                }}/>
              )}
            </button>

            {notifOpen && (
              <div className="glass-card notif-dropdown" style={{
                position: 'absolute', right: 0, top: '110%',
                width: 340, zIndex: 600, padding: 0, overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Alerts</span>
                  <span className="badge badge-red">{criticalCount} critical</span>
                </div>
                {alerts.map(a => (
                  <div key={a.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                      background: a.type === 'critical' ? 'var(--accent-red)' : a.type === 'high' ? 'var(--accent-orange)' : 'var(--accent-blue)',
                    }}/>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.msg}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User menu */}
          <div style={{ position: 'relative' }}>
            <button id="user-menu-btn" className="navbar-user"
              onClick={() => setUserMenuOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <div className="avatar">{currentUser.avatar}</div>
              <span className="navbar-user-name">{currentUser.name}</span>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}/>
            </button>

            {userMenuOpen && (
              <div className="glass-card user-menu-dropdown" style={{
                position: 'absolute', right: 0, top: '110%',
                width: 220, zIndex: 600, padding: 8,
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{currentUser.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{currentUser.role}</div>
                </div>
                <NavLink to="/settings" className="sidebar-link" style={{ borderRadius: 6, marginBottom: 2 }}>
                  <span className="sidebar-icon"><Settings size={14}/></span> {t('nav.settings')}
                </NavLink>
                <button onClick={onLogout} className="sidebar-link"
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', borderRadius: 6 }}>
                  <span className="sidebar-icon"><LogOut size={14}/></span> {t('nav.signout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/*  Sidebar  */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`} id="app-sidebar">
        <div className="sidebar-logo">
          <SafeScanLogo size={26}/>
          <span>Safe<span style={{ color: 'var(--accent-orange)' }}>Scan</span></span>
        </div>

        <div style={{ padding: '10px 12px', marginBottom: 8, background: currentUser.isGuest ? 'rgba(59,130,246,0.06)' : 'rgba(249,115,22,0.06)', borderRadius: 'var(--radius-md)', border: `1px solid ${currentUser.isGuest ? 'rgba(59,130,246,0.2)' : 'rgba(249,115,22,0.15)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, flexShrink: 0, background: currentUser.isGuest ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : undefined }}>{currentUser.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name}</div>
              <div style={{ fontSize: 10, color: currentUser.isGuest ? 'var(--accent-blue)' : 'var(--accent-orange)' }}>{currentUser.role}</div>
            </div>
            {currentUser.isGuest && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100, background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue)', border: '1px solid rgba(59,130,246,0.3)', flexShrink: 0 }}>GUEST</span>
            )}
          </div>
          {currentUser.isGuest && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }}>
              Viewing as guest · {currentUser.email}
            </div>
          )}
        </div>

        <div className="sidebar-section-title">Monitoring</div>
        {navItems.map(n => (
          <NavLink key={n.to} to={n.to} className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''} ${n.highlight ? 'sidebar-link-highlight' : ''}`}>
            <span className="sidebar-icon">{n.icon}</span>
            {n.label}
            {n.badge && <span className="sidebar-badge">{n.badge}</span>}
            {n.highlight && <span className="badge badge-orange" style={{ marginLeft: 'auto', fontSize: 9, padding: '1px 6px' }}>NEW</span>}
          </NavLink>
        ))}

        <div className="sidebar-section-title">System</div>
        {systemItems.map(n => {
          const isLocked = currentUser.isGuest && n.to === '/settings';
          return (
            <NavLink key={n.to} to={isLocked ? '#' : n.to}
              onClick={e => isLocked && e.preventDefault()}
              className={({isActive}) => `sidebar-link ${isActive && !isLocked ? 'active' : ''}`}
              style={isLocked ? { opacity: 0.45, cursor: 'not-allowed' } : {}}>
              <span className="sidebar-icon">{n.icon}</span>
              {n.label}
              {isLocked && <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: 'var(--accent-red)', opacity: 0.8 }}>LOCKED</span>}
            </NavLink>
          );
        })}

        <div style={{ marginTop: 'auto', paddingTop: 12 }}>
          <div className="divider" />
          <button onClick={onLogout} className="sidebar-link"
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)' }}>
            <span className="sidebar-icon"><LogOut size={16}/></span>
            {t('nav.signout')}
          </button>
        </div>
      </aside>

      {/*  Main content  */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

/*  Protected Route  */
function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/*  Guest-locked Route — shows a friendly locked message for guests  */
function GuestLockedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (user.isGuest) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Shield size={28} style={{ color: 'var(--accent-red)' }}/>
      </div>
      <div style={{ fontSize: 22, fontWeight: 900 }}>Access Restricted</div>
      <div style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 340 }}>
        Settings are only available to registered staff accounts.<br/>Sign in with a staff account to access this page.
      </div>
      <a href="/login" style={{ marginTop: 8, padding: '10px 24px', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
        Sign in as Staff
      </a>
    </div>
  );
  return children;
}

/*  Root App  */
function AppInner() {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('safesite_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const handleLogin  = (u) => { setUser(u); sessionStorage.setItem('safesite_user', JSON.stringify(u)); };
  const handleLogout = ()  => { setUser(null); sessionStorage.removeItem('safesite_user'); };

  return (
    <BrowserRouter>
      <AppShell user={user} onLogout={handleLogout}>
        <Routes>
          {/* Public */}
          <Route path="/"      element={<LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />

          {/* Protected */}
          <Route path="/dashboard"  element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />

          <Route path="/violations" element={<ProtectedRoute user={user}><ViolationsPage /></ProtectedRoute>} />
          <Route path="/analytics"  element={<ProtectedRoute user={user}><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/detect"     element={<ProtectedRoute user={user}><DetectionPage /></ProtectedRoute>} />
          <Route path="/model"      element={<ProtectedRoute user={user}><ModelPage /></ProtectedRoute>} />
          <Route path="/business"   element={<ProtectedRoute user={user}><BusinessPage /></ProtectedRoute>} />
          <Route path="/budget"     element={<ProtectedRoute user={user}><BudgetPage /></ProtectedRoute>} />
          <Route path="/api-docs"   element={<ProtectedRoute user={user}><ApiDocsPage /></ProtectedRoute>} />
          <Route path="/settings"   element={<GuestLockedRoute user={user}><SettingsPage /></GuestLockedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AppInner />
      </LangProvider>
    </ThemeProvider>
  );
}
