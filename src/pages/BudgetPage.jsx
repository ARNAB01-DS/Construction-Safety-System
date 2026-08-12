import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import { budgetPhases, roadmilestones } from '../data/mockData';

const revenueData = [
  { q: 'Q1', customers: 5, mrr: 2500, cost: 62000 },
  { q: 'Q2', customers: 25, mrr: 14500, cost: 28000 },
  { q: 'Q3', customers: 60, mrr: 38000, cost: 32000 },
  { q: 'Q4', customers: 120, mrr: 82000, cost: 36000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card" style={{ padding: '10px 14px' }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: 'var(--text-muted)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color }}>{p.name}: <strong>{typeof p.value === 'number' && p.value > 999 ? '$' + p.value.toLocaleString() : p.value}</strong></div>
      ))}
    </div>
  );
};

const risks = [
  { risk: 'Model accuracy below expectations', prob: 'Medium', impact: 'High', mit: 'Continuous retraining with active learning; human review SLA', color: '#f59e0b' },
  { risk: 'Camera connectivity / RTSP issues', prob: 'Medium', impact: 'Medium', mit: 'Multi-protocol support (RTSP, HTTP, ONVIF); auto-reconnect logic', color: '#f59e0b' },
  { risk: 'Customer data privacy breach', prob: 'Low', impact: 'Critical', mit: 'AES-256 encryption, VPC isolation, annual pen tests, SOC 2', color: '#ef4444' },
  { risk: 'Slow customer acquisition', prob: 'Medium', impact: 'High', mit: 'Free 14-day trial, OSHA fine ROI calculator, channel partnerships', color: '#f59e0b' },
  { risk: 'GPU cost overruns', prob: 'Low', impact: 'Medium', mit: 'Reserved instances + spot instances for batch; cost alerts at 80%', color: '#3b82f6' },
  { risk: 'Model drift in new environments', prob: 'High', impact: 'Medium', mit: 'Automated drift detection; monthly retraining; customer feedback loop', color: '#ef4444' },
];

export default function BudgetPage() {
  const totalBudget = budgetPhases.reduce((s, p) => s + p.total, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Budget & Roadmap</h1>
        <p className="page-subtitle">Phase-wise investment plan, revenue projections, milestones, and risk register</p>
      </div>

      {/* Total Budget Banner */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20, display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Total 12-Month Investment</div>
          <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--accent-blue)' }}>${totalBudget.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          {budgetPhases.map(p => (
            <div key={p.phase} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{p.phase}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: p.color }}>${p.total.toLocaleString()}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ width: `${(p.total / totalBudget) * 100}%`, height: '100%', background: p.color, borderRadius: 100 }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        {budgetPhases.map((p, i) => (
          <div key={i} className="glass-card" style={{ padding: 24, borderTop: `3px solid ${p.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{p.phase}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.period}</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: p.color }}>${(p.total / 1000).toFixed(0)}K</div>
            </div>
            {p.items.map((item, j) => (
              <div key={j} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '6px 0', borderBottom: j < p.items.length - 1 ? '1px solid rgba(56,100,180,0.1)' : 'none' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>${item.cost.toLocaleString()}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Revenue Projections */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="glass-card chart-container">
          <div className="chart-header">
            <div>
              <div className="chart-title">Revenue vs Cost Projections</div>
              <div className="chart-subtitle">Monthly Recurring Revenue and quarterly burn</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="gMRR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,100,180,0.12)"/>
              <XAxis dataKey="q" tick={{ fill: '#4a6080', fontSize: 12 }} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={v => `$${v/1000}K`} tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />}/>
              <Legend wrapperStyle={{ fontSize: 12 }}/>
              <Area type="monotone" dataKey="mrr" name="MRR" stroke="#10b981" fill="url(#gMRR)" strokeWidth={2}/>
              <Area type="monotone" dataKey="cost" name="Quarterly Cost" stroke="#ef4444" fill="url(#gCost)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card chart-container">
          <div className="chart-header">
            <div>
              <div className="chart-title">Customer Growth Projection</div>
              <div className="chart-subtitle">Paying customers per quarter</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,100,180,0.12)"/>
              <XAxis dataKey="q" tick={{ fill: '#4a6080', fontSize: 12 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />}/>
              <Bar dataKey="customers" name="Customers" fill="#3b82f6" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
            {revenueData.map(d => (
              <div key={d.q} style={{ textAlign: 'center', padding: '8px', background: 'rgba(59,130,246,0.07)', borderRadius: 8 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-blue)' }}>{d.customers}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.q} customers</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Phased Roadmap</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {roadmilestones.map((m, i) => (
            <div key={i} style={{
              padding: '16px',
              background: m.active ? 'rgba(245,158,11,0.07)' : m.done ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${m.active ? 'rgba(245,158,11,0.3)' : m.done ? 'rgba(16,185,129,0.25)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{m.q}</div>
                <span className={`badge ${m.done ? 'badge-green' : m.active ? 'badge-amber badge-dot' : 'badge-purple'}`}>
                  {m.done ? ' Done' : m.active ? 'In Progress' : 'Planned'}
                </span>
              </div>
              {m.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 7, alignItems: 'flex-start' }}>
                  <span style={{ color: m.done ? 'var(--accent-green)' : m.active ? 'var(--accent-amber)' : 'var(--text-muted)', flexShrink: 0 }}>
                    {m.done ? '' : m.active ? '⟳' : ''}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Risk Register */}
      <div className="glass-card">
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Risk Register & Mitigation</div>
        </div>
        <div className="violations-table-wrapper">
          <table className="violations-table">
            <thead>
              <tr>
                <th>Risk</th>
                <th>Probability</th>
                <th>Impact</th>
                <th>Mitigation Strategy</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 13, maxWidth: 220 }}>{r.risk}</td>
                  <td><span className={`badge ${r.prob === 'High' ? 'badge-red' : r.prob === 'Medium' ? 'badge-amber' : 'badge-green'}`}>{r.prob}</span></td>
                  <td><span className={`badge ${r.impact === 'Critical' ? 'badge-red' : r.impact === 'High' ? 'badge-amber' : 'badge-blue'}`}>{r.impact}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 320 }}>{r.mit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
