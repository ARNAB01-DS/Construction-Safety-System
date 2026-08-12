import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell, PieChart, Pie
} from 'recharts';
import { hourlyData, weeklyViolationData, classDistributionData, modelMetrics } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card" style={{ padding: '10px 14px' }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: 'var(--text-muted)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
};

const radarData = [
  { metric: 'Precision', value: 86 },
  { metric: 'Recall', value: 81 },
  { metric: 'F1-Score', value: 83 },
  { metric: 'mAP@0.5', value: 83 },
  { metric: 'mAP@0.5:0.95', value: 56 },
  { metric: 'FPS Score', value: 90 },
];

const trendData = [
  { week: 'W-8', compliance: 71, violations: 28 },
  { week: 'W-7', compliance: 74, violations: 24 },
  { week: 'W-6', compliance: 76, violations: 21 },
  { week: 'W-5', compliance: 73, violations: 25 },
  { week: 'W-4', compliance: 78, violations: 19 },
  { week: 'W-3', compliance: 80, violations: 17 },
  { week: 'W-2', compliance: 84, violations: 14 },
  { week: 'W-1', compliance: 82, violations: 16 },
];

export default function AnalyticsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics & Insights</h1>
        <p className="page-subtitle">Trends, heatmaps, and model performance analytics</p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Avg Compliance', val: '82%', trend: '↑ +4% MoM', color: 'var(--accent-green)' },
          { label: 'Violations / Day', val: '17.4', trend: '↓ -3.2 MoM', color: 'var(--accent-red)' },
          { label: 'Detections / Day', val: '1,840', trend: '↑ +180 MoM', color: 'var(--accent-blue)' },
          { label: 'Avg Confidence', val: '88%', trend: '→ stable', color: 'var(--accent-amber)' },
          { label: 'Alert Response', val: '4.2 min', trend: '↓ -0.8 min', color: 'var(--accent-cyan)' },
        ].map((k, i) => (
          <div key={i} className="glass-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: k.color, marginBottom: 4 }}>{k.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{k.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Hourly activity */}
        <div className="glass-card chart-container">
          <div className="chart-header">
            <div>
              <div className="chart-title">Hourly Activity — Today</div>
              <div className="chart-subtitle">Detection count vs violations per hour</div>
            </div>
            <span className="badge badge-green">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="gDet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gVio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,100,180,0.12)"/>
              <XAxis dataKey="hour" tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />}/>
              <Legend wrapperStyle={{ fontSize: 12 }}/>
              <Area type="monotone" dataKey="detections" stroke="#3b82f6" fill="url(#gDet)" strokeWidth={2} name="Detections"/>
              <Area type="monotone" dataKey="violations" stroke="#ef4444" fill="url(#gVio)" strokeWidth={2} name="Violations"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance trend */}
        <div className="glass-card chart-container">
          <div className="chart-header">
            <div>
              <div className="chart-title">8-Week Compliance Trend</div>
              <div className="chart-subtitle">Compliance rate & violations over time</div>
            </div>
            <span className="badge badge-amber">Historical</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,100,180,0.12)"/>
              <XAxis dataKey="week" tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />}/>
              <Legend wrapperStyle={{ fontSize: 12 }}/>
              <Line type="monotone" dataKey="compliance" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 3 }} name="Compliance %"/>
              <Line type="monotone" dataKey="violations" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 3 }} name="Violations"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Model performance radar */}
        <div className="glass-card chart-container">
          <div className="chart-header">
            <div>
              <div className="chart-title">Model Performance Radar</div>
              <div className="chart-subtitle">YOLOv8m key metrics overview</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(56,100,180,0.2)"/>
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }}/>
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#4a6080', fontSize: 9 }} axisLine={false}/>
              <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Zone heatmap */}
        <div className="glass-card chart-container">
          <div className="chart-header">
            <div>
              <div className="chart-title">Violation Hotspot Heatmap</div>
              <div className="chart-subtitle">Violations by zone (simulated)</div>
            </div>
          </div>
          <div style={{ position: 'relative', margin: '8px auto', maxWidth: 360 }}>
            {/* Site map mock */}
            <div style={{
              background: 'rgba(15,28,53,0.5)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              minHeight: 200,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}> Site Alpha — Floor Plan</div>
              {[
                { zone: 'Entry Zone', x: '5%', y: '30%', size: 65, count: 6, color: '#ef4444' },
                { zone: 'Tower-B', x: '55%', y: '10%', size: 50, count: 4, color: '#f97316' },
                { zone: 'Foundation', x: '25%', y: '55%', size: 58, count: 5, color: '#ef4444' },
                { zone: 'Crane Ops', x: '68%', y: '50%', size: 40, count: 3, color: '#f59e0b' },
                { zone: 'Parking', x: '10%', y: '70%', size: 30, count: 1, color: '#10b981' },
                { zone: 'Roof L4', x: '75%', y: '70%', size: 22, count: 0, color: '#10b981' },
              ].map((z, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  left: z.x, top: z.y,
                  width: z.size, height: z.size,
                  borderRadius: '50%',
                  background: `${z.color}25`,
                  border: `2px solid ${z.color}60`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  transform: 'translate(-50%, -50%)',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: z.color }}>{z.count}</div>
                  <div style={{ fontSize: 8, color: z.color, textAlign: 'center', lineHeight: 1.2, padding: '0 4px' }}>{z.zone.split(' ')[0]}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['#ef4444','High Risk'],['#f59e0b','Medium'],['#10b981','Clear']].map(([c,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>
                  <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Per-class metrics */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="chart-header">
          <div>
            <div className="chart-title">Per-Class Precision & Recall</div>
            <div className="chart-subtitle">YOLOv8m baseline evaluation on 5-class PPE dataset</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={modelMetrics} barSize={16} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,100,180,0.12)"/>
            <XAxis dataKey="cls" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false}/>
            <YAxis domain={[0.5, 1]} tickFormatter={v => `${(v*100).toFixed(0)}%`} tick={{ fill: '#4a6080', fontSize: 11 }} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip />}/>
            <Legend wrapperStyle={{ fontSize: 12 }}/>
            <Bar dataKey="precision" name="Precision" fill="#3b82f6" radius={[3,3,0,0]}>
              {modelMetrics.map((_, i) => <Cell key={i} fill={modelMetrics[i].color + 'cc'}/>)}
            </Bar>
            <Bar dataKey="recall" name="Recall" fill="#06b6d4" radius={[3,3,0,0]}>
              {modelMetrics.map((_, i) => <Cell key={i} fill={modelMetrics[i].color + '80'}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
