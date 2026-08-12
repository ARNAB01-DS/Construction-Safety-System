import { CheckCircle, X, Users, Shield, TrendingUp, Globe, DollarSign, Zap, Award, FileText, Lock, Eye } from 'lucide-react';

const users = [
  { title: 'Site Managers',        desc: 'Real-time oversight of PPE compliance across all workers and zones without leaving the office.',           pain: 'Manual spot-checks miss 70% of violations' },
  { title: 'Safety Teams',         desc: 'Instant violation alerts with photographic evidence to take corrective action before incidents occur.',     pain: 'Reactive response to injuries after the fact' },
  { title: 'Insurance Companies',  desc: 'Objective, timestamped violation data for risk assessment and premium underwriting.',                       pain: 'Lack of quantitative safety data' },
  { title: 'Government / Inspectors', desc: 'Audit-ready OSHA compliance documentation with chain-of-custody records.',                             pain: 'Paper-based inspection processes' },
];

const valueProps = [
  { val: '$15,625', desc: 'Avg OSHA PPE citation fine — prevented per violation caught',            color: 'var(--accent-orange)' },
  { val: '$38,000', desc: 'Avg construction injury cost (medical + downtime)',                       color: 'var(--accent-orange)' },
  { val: '85%',     desc: 'Violation detection rate in real-time before incident occurs',            color: 'var(--accent-cyan)'   },
  { val: '1 fine',  desc: 'Break-even: prevent just 1 OSHA fine/quarter on Starter plan',           color: 'var(--accent-green)'  },
];

const pricingTiers = [
  { tier: 'Starter', price: 199, cameras: 5, users: 3, highlight: false,
    features: ['Real-time detection', 'Dashboard & violation log', 'Email alerts', 'Weekly reports', 'API access ✗', 'White-label ✗', 'SLA ✗'] },
  { tier: 'Professional', price: 599, cameras: 20, users: 10, highlight: true,
    features: ['Real-time detection', 'Dashboard & violation log', 'Email + SMS alerts', 'Daily & custom reports', 'Full API access', 'White-label ✗', 'SLA ✗'] },
  { tier: 'Enterprise', price: 1999, cameras: '∞', users: '∞', highlight: false,
    features: ['Real-time detection', 'Dashboard & violation log', 'All alert channels', 'OSHA PDF reports', 'Full API + webhooks', 'White-label & SSO', '99.9% SLA'] },
];

const compliance = [
  { title: 'OSHA 29 CFR 1926', desc: 'Auto-generate PPE compliance documentation per OSHA construction standards' },
  { title: 'GDPR / CCPA',      desc: 'Face blurring option, data retention controls, right to erasure workflows' },
  { title: 'SOC 2 Type II',    desc: 'In progress — audit scheduled Q3 2026. Controls mapped and evidence collected.' },
  { title: 'AES-256 + CMK',    desc: 'All frames encrypted at rest with optional customer-managed encryption keys' },
  { title: 'Data Residency',   desc: 'US-East (default) · EU Frankfurt option available for GDPR compliance' },
  { title: 'Privacy by Design',desc: 'Minimum data principle — frames retained 30/90/365 days per tier, auto-purge' },
];

export default function BusinessPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Business Model</h1>
        <p className="page-subtitle">Target users, value proposition, pricing, compliance, and ROI justification</p>
      </div>

      {/* Value Proposition */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20, textAlign: 'center', background: 'rgba(249,115,22,0.05)', borderColor: 'rgba(249,115,22,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Value Proposition</div>
        <div style={{ fontSize: 22, fontWeight: 800, maxWidth: 700, margin: '0 auto', lineHeight: 1.4 }}>
          "Real-time AI-driven PPE compliance that reduces workplace injuries by <span className="text-gradient">40%</span>, cuts OSHA fines, and provides audit-ready reports — without adding headcount."
        </div>
      </div>

      {/* Target Users */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Target Users</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {users.map((u, i) => (
            <div key={i} className="glass-card hover-lift" style={{ padding: 22 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>{u.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>{u.desc}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-red)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', padding: '5px 10px' }}>
                Pain: {u.pain}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Metrics */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>ROI Justification</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {valueProps.map((v, i) => (
            <div key={i} className="glass-card hover-lift" style={{ padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8, color: v.color }}>{v.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Pricing Tiers</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, alignItems: 'start' }}>
          {pricingTiers.map((t, i) => (
            <div key={i} className="glass-card" style={{ padding: 24, position: 'relative', ...(t.highlight ? { border: '1px solid var(--accent-orange)', background: 'rgba(249,115,22,0.06)' } : {}) }}>
              {t.highlight && <div className="pricing-featured-badge" style={{ background: 'var(--accent-orange)', color: '#fff', border: 'none' }}>Most Popular</div>}
              <div style={{ fontSize: 11, fontWeight: 700, color: t.highlight ? 'var(--accent-orange)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{t.tier}</div>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 4 }}>
                <span style={{ fontSize: 18, verticalAlign: 'super' }}>$</span>{t.price}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>per month · {t.cameras} cameras · {t.users} users</div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                {t.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, fontSize: 13, color: f.includes('✗') ? 'var(--text-muted)' : 'var(--text-secondary)', marginBottom: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: f.includes('✗') ? 'var(--text-muted)' : 'var(--accent-green)', flexShrink: 0, marginTop: 1 }}>{f.includes('✗') ? '✗' : '✓'}</span>
                    <span>{f.replace(' ✗', '')}</span>
                  </div>
                ))}
              </div>
              <button className="btn" style={{ width: '100%', marginTop: 16, background: t.highlight ? 'var(--gradient-brand)' : 'rgba(255,255,255,0.06)', border: t.highlight ? 'none' : '1px solid var(--color-border)', color: '#fff', fontWeight: 700 }}>
                {t.highlight ? 'Start Free Trial' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Compliance & Data Privacy</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {compliance.map((c, i) => (
            <div key={i} className="glass-card hover-lift" style={{ padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-orange)', flexShrink: 0, marginTop: 6 }}/>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 5 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 16 }}>Deployment Model</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Cloud SaaS', desc: 'AWS ECS Fargate + GPU inference (G4dn). Multi-tenant, auto-scaling, zero infrastructure management.' },
            { label: 'Edge Hybrid', desc: 'On-premise NVIDIA Jetson inference for air-gapped sites. Cloud sync for dashboard & reporting only.' },
          ].map((d, i) => (
            <div key={i} style={{ padding: '16px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: 'var(--accent-orange)' }}>{d.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
