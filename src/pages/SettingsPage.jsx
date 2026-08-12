import { useState, useRef } from 'react';
import { Save, Bell, Shield, Camera, Sliders, User, Key, Upload, CheckCircle, Globe } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import { countries } from '../data/countries';
import { useLang } from '../context/LangContext';

const Toggle = ({ id, defaultOn = false, label }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
      <label htmlFor={id} style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>{label}</label>
      <button
        id={id}
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        style={{
          width: 44, height: 24, borderRadius: 100,
          background: on ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s',
          boxShadow: on ? '0 0 12px var(--accent-blue-glow)' : 'none',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: on ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
        }}/>
      </button>
    </div>
  );
};

const InputField = ({ id, label, defaultValue, type = 'text', mono = false }) => (
  <div style={{ marginBottom: 16 }}>
    <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</label>
    <input
      id={id}
      type={type}
      defaultValue={defaultValue}
      style={{
        width: '100%', padding: '10px 14px',
        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 13,
        fontFamily: mono ? 'var(--font-mono)' : 'inherit',
        outline: 'none', transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
    />
  </div>
);

const sections = ['Profile', 'Alerts', 'Detection', 'Cameras', 'Security', 'API Keys'];
const sectionIcons = { Profile: <User size={15}/>, Alerts: <Bell size={15}/>, Detection: <Sliders size={15}/>, Cameras: <Camera size={15}/>, Security: <Shield size={15}/>, 'API Keys': <Key size={15}/> };

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('Profile');
  const [saved, setSaved]                 = useState(false);
  const [logoPreview, setLogoPreview]     = useState(null);
  const [logoName, setLogoName]           = useState('');
  const logoInputRef                      = useRef(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  //  Logo upload: supports SVG, PNG, WebP
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/svg+xml', 'image/png', 'image/webp', 'image/jpeg'];
    if (!allowed.includes(file.type)) { alert('Please upload SVG, PNG, or WebP files only.'); return; }
    setLogoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const { t } = useLang();

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Configure your site, detection parameters, and alerts</p>
          </div>
          <button id="save-settings-btn" className="btn btn-primary" onClick={handleSave}>
            <Save size={14}/> {saved ? ' Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="alert-banner alert-info" style={{ marginBottom: 16 }}>
           Settings saved successfully
        </div>
      )}

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Sidebar Nav */}
        <div className="glass-card" style={{ width: 200, flexShrink: 0, padding: 12 }}>
          {sections.map(s => (
            <button
              key={s}
              id={`settings-nav-${s.toLowerCase().replace(' ', '-')}`}
              className={`sidebar-link ${activeSection === s ? 'active' : ''}`}
              onClick={() => setActiveSection(s)}
            >
              <span className="sidebar-icon">{sectionIcons[s]}</span>
              {s}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-card" style={{ flex: 1, padding: 28 }}>
          {activeSection === 'Profile' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Organization Profile</div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {logoPreview
                    ? <img src={logoPreview} alt="org logo" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-blue)' }}/>
                    : <div className="avatar" style={{ width: 64, height: 64, fontSize: 24 }}>SM</div>
                  }
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Construction Site Alpha</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Professional Plan · 20 cameras max</div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept=".svg,.png,.webp,image/svg+xml,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleLogoChange}
                    id="logo-file-input"
                  />
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => logoInputRef.current?.click()}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Upload size={13}/> Change Logo
                  </button>
                  {logoName && (
                    <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={11}/> {logoName}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid-2">
                <InputField id="org-name"      label={t('label.orgname')}  defaultValue="Site Alpha Construction Ltd." />
                <InputField id="site-name"     label={t('label.sitename')} defaultValue="Construction Site Alpha" />
                <InputField id="contact-email" label={t('label.email')}    defaultValue="safety@sitealpha.com" type="email" />
                {/*  International phone with country code picker */}
                <div style={{ marginBottom: 16 }}>
                  <PhoneInput id="contact-phone" label={t('label.phone')} defaultCountry="BD" />
                </div>
                <InputField id="site-address"  label={t('label.address')}  defaultValue="123 Builder Ave, New York, NY 10001" />
                {/*  Alphanumeric postal code — works globally (e.g. SW1A 1AA, 1000, 10001) */}
                <InputField id="postal-code"   label={t('label.postal')}   defaultValue="10001" />
              </div>

              {/* Country selector */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                  <Globe size={12} style={{ display: 'inline', marginRight: 4 }}/>{t('label.country')}
                </label>
                <select
                  id="country-select"
                  defaultValue="BD"
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', cursor: 'pointer' }}
                >
                  {countries.map(c => (
                    <option key={c.iso} value={c.iso}>{c.flag} {c.name} ({c.dial})</option>
                  ))}
                </select>
              </div>

              {/* Timezone */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Timezone</label>
                <select id="timezone" defaultValue="Asia/Dhaka" style={{ width: '100%', padding: '10px 14px', background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                  {['Asia/Dhaka','America/New_York','America/Los_Angeles','Europe/London','Europe/Berlin','Asia/Tokyo','Asia/Singapore','Asia/Kolkata','Australia/Sydney','UTC'].map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeSection === 'Alerts' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Alert Configuration</div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>Alert Channels</div>
                <Toggle id="alert-email" defaultOn={true} label="Email alerts for violations" />
                <Toggle id="alert-sms" defaultOn={false} label="SMS alerts (requires Pro plan)" />
                <Toggle id="alert-webhook" defaultOn={false} label="Webhook POST to custom URL" />
                <Toggle id="alert-critical-only" defaultOn={false} label="Critical violations only (suppress medium/low)" />
              </div>
              <InputField id="alert-email-addr" label="Alert Email Address" defaultValue="safety@sitealpha.com" type="email"/>
              <InputField id="alert-webhook-url" label="Webhook URL" defaultValue="https://hooks.mysite.com/safety-alerts" mono />
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>Alert Timing</div>
                <Toggle id="alert-realtime" defaultOn={true} label="Real-time alerts (instant, per violation)" />
                <Toggle id="alert-digest" defaultOn={true} label="Daily digest email (8am summary)" />
                <Toggle id="alert-weekend" defaultOn={false} label="Send alerts on weekends" />
              </div>
            </div>
          )}

          {activeSection === 'Detection' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Detection Parameters</div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Confidence Threshold: <strong style={{ color: 'var(--accent-blue)' }}>0.45</strong>
                </label>
                <input id="conf-threshold" type="range" min="0.1" max="0.9" step="0.05" defaultValue="0.45" style={{ width: '100%', accentColor: 'var(--accent-blue)' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>0.1 (sensitive)</span><span>0.9 (strict)</span>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  IoU Threshold: <strong style={{ color: 'var(--accent-blue)' }}>0.50</strong>
                </label>
                <input id="iou-threshold" type="range" min="0.1" max="0.9" step="0.05" defaultValue="0.5" style={{ width: '100%', accentColor: 'var(--accent-blue)' }}/>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>Active Detection Classes</div>
              {['Person', 'Helmet', 'No Helmet', 'Vest', 'No Vest'].map((cls, i) => (
                <Toggle key={cls} id={`class-${i}`} defaultOn={true} label={`Detect: ${cls}`} />
              ))}
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12, marginTop: 20 }}>Processing Mode</div>
              <Toggle id="detect-realtime" defaultOn={true} label="Real-time stream inference (per frame)" />
              <Toggle id="detect-batch" defaultOn={false} label="Batch mode (inference every N seconds)" />
              <Toggle id="detect-night" defaultOn={true} label="Night vision enhancement (low-light preprocessing)" />
            </div>
          )}

          {activeSection === 'Cameras' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Camera Settings</div>
              <Toggle id="cam-autorecord" defaultOn={true} label="Auto-record 10s clips on violation" />
              <Toggle id="cam-autoreconnect" defaultOn={true} label="Auto-reconnect offline cameras (every 30s)" />
              <Toggle id="cam-blur-faces" defaultOn={false} label="Blur faces in stored frames (GDPR)" />
              <Toggle id="cam-annotations" defaultOn={true} label="Show bounding box annotations in dashboard" />
              <div style={{ marginTop: 20 }}>
                <InputField id="cam-retention" label="Frame Retention Period (days)" defaultValue="90" type="number"/>
                <InputField id="cam-fps-limit" label="Max FPS per Camera" defaultValue="30" type="number"/>
              </div>
            </div>
          )}

          {activeSection === 'Security' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Security & Privacy</div>
              <Toggle id="sec-2fa" defaultOn={false} label="Require 2FA for all team members" />
              <Toggle id="sec-sso" defaultOn={false} label="Enable SSO (Google Workspace / Microsoft Entra)" />
              <Toggle id="sec-audit-log" defaultOn={true} label="Audit log all user actions" />
              <Toggle id="sec-ip-restrict" defaultOn={false} label="IP allowlist (restrict dashboard access)" />
              <div style={{ marginTop: 20 }}>
                <div style={{ padding: 16, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}> AES-256 Encryption Active</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>All video frames and violation data are encrypted at rest using AES-256. Key managed by SafeScan (CMK upgrade available on Enterprise).</div>
                </div>
                <div style={{ padding: 16, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}> SOC 2 Type II In Progress</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Audit scheduled Q3 2026. Controls mapped, evidence collection underway. Report available post-audit.</div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'API Keys' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>API Keys</div>
              <div className="glass-card" style={{ padding: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Production Key</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Created June 1, 2026 · Last used 2 minutes ago</div>
                  </div>
                  <span className="badge badge-green badge-dot">Active</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: 8, color: 'var(--accent-cyan)' }}>
                  sk-live-••••••••••••••••••••••••••••••••
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="btn btn-ghost btn-sm">Reveal</button>
                  <button className="btn btn-ghost btn-sm">Rotate</button>
                  <button className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }}>Revoke</button>
                </div>
              </div>
              <button id="create-api-key-btn" className="btn btn-primary btn-sm">+ Create New API Key</button>

              <div className="divider" style={{ marginTop: 24 }}/>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Quick Integration</div>
              <div className="code-block" style={{ fontSize: 12 }}>
                <span className="code-comment">// Python SDK example</span>{'\n'}
                {'from safescan import Client\n\n'}
                <span className="code-keyword">client</span> = Client(api_key=<span className="code-string">"sk-live-..."</span>){'\n'}
                <span className="code-keyword">result</span> = client.detect.image(<span className="code-string">"path/to/frame.jpg"</span>){'\n'}
                <span className="code-keyword">print</span>(result.violations)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
