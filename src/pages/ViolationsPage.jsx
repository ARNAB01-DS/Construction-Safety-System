import { useState, useRef } from 'react';
import { Download, Search, AlertTriangle, CheckCircle, X, FileText } from 'lucide-react';
import { violationsData } from '../data/mockData';

const SEV_COLORS = { critical: 'badge-red', high: 'badge-amber', medium: 'badge-blue' };

/*  Reusable helpers  */
function downloadCSV(data, filename) {
  const headers = ['ID', 'Date/Time', 'Camera', 'Type', 'Confidence %', 'Zone', 'Severity', 'Worker'];
  const rows = data.map(v => [
    v.id, v.time, v.camera, v.type,
    `${(v.confidence * 100).toFixed(0)}`,
    v.zone, v.severity, v.worker ?? 'Unknown Worker',
  ]);
  const csv = [headers, ...rows]
    .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function openOSHAReport(data) {
  const now = new Date().toLocaleString();
  const hash = Math.random().toString(36).slice(2, 12).toUpperCase();
  const rows = data.map(v => `
    <tr class="${v.severity}">
      <td>${v.id}</td>
      <td>${v.time}</td>
      <td>${v.camera}</td>
      <td><span class="badge ${v.type === 'No Helmet' ? 'nh' : 'nv'}">${v.type}</span></td>
      <td>${(v.confidence * 100).toFixed(0)}%</td>
      <td>${v.zone}</td>
      <td><span class="sev ${v.severity}">${v.severity.toUpperCase()}</span></td>
      <td>${v.worker ?? 'Unknown Worker'}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>OSHA Compliance Report — SafeScan</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #1e293b; padding: 40px; font-size: 13px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; border-bottom:3px solid #3b82f6; padding-bottom:16px; }
    .logo { font-size:20px; font-weight:900; color:#1e3a5f; }
    .logo span { color:#3b82f6; }
    .report-meta { text-align:right; font-size:11px; color:#64748b; }
    .report-meta strong { display:block; font-size:20px; color:#1e3a5f; font-weight:900; }
    .cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin:20px 0; }
    .card { background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:14px; text-align:center; }
    .card .num { font-size:28px; font-weight:900; }
    .card .lbl { font-size:10px; color:#64748b; text-transform:uppercase; letter-spacing:.06em; margin-top:4px; }
    .card.red .num { color:#dc2626; }
    .card.amber .num { color:#d97706; }
    .card.blue .num { color:#2563eb; }
    .card.green .num { color:#059669; }
    h2 { font-size:13px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:.06em; margin:20px 0 10px; }
    table { width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,.08); }
    thead tr { background:#1e3a5f; color:#fff; }
    th { padding:10px 12px; text-align:left; font-size:11px; font-weight:700; letter-spacing:.04em; }
    td { padding:9px 12px; border-bottom:1px solid #f1f5f9; font-size:12px; }
    tr.critical td { border-left:3px solid #dc2626; }
    tr.high td    { border-left:3px solid #d97706; }
    tr.medium td  { border-left:3px solid #2563eb; }
    .badge { padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; display:inline-block; }
    .badge.nh { background:#fee2e2; color:#dc2626; }
    .badge.nv { background:#fff7ed; color:#c2410c; }
    .sev { padding:2px 8px; border-radius:4px; font-size:10px; font-weight:800; display:inline-block; }
    .sev.critical { background:#fee2e2; color:#dc2626; }
    .sev.high     { background:#fef3c7; color:#d97706; }
    .sev.medium   { background:#dbeafe; color:#1d4ed8; }
    .findings { background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:18px 20px; margin-top:16px; }
    .findings li { margin-bottom:8px; padding-left:4px; }
    .footer { margin-top:32px; padding-top:14px; border-top:1px solid #e2e8f0; font-size:10px; color:#94a3b8; display:flex; justify-content:space-between; }
    @media print {
      body { padding:20px; background:#fff; }
      .no-print { display:none; }
      tr.critical td, tr.high td, tr.medium td { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    }
    .print-btn { position:fixed; bottom:24px; right:24px; padding:12px 22px; background:#3b82f6; color:#fff; border:none; border-radius:8px; font-weight:700; cursor:pointer; font-size:13px; box-shadow:0 4px 12px rgba(59,130,246,.4); }
    .print-btn:hover { background:#2563eb; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo"> Safe<span style={{ color: "var(--accent-orange)" }}>Scan</span><span>AI</span></div>
      <div style="font-size:11px;color:#64748b;margin-top:4px;">Construction Safety Management Platform</div>
    </div>
    <div class="report-meta">
      <strong>OSHA COMPLIANCE REPORT</strong>
      29 CFR 1926 — Subpart E (Personal Protective Equipment)<br/>
      Site: Construction Site Alpha<br/>
      Generated: ${now}<br/>
      Document Hash: <code>${hash}</code>
    </div>
  </div>

  <div class="cards">
    <div class="card blue">
      <div class="num">${data.length}</div>
      <div class="lbl">Total Violations</div>
    </div>
    <div class="card red">
      <div class="num">${data.filter(v=>v.severity==='critical').length}</div>
      <div class="lbl">Critical</div>
    </div>
    <div class="card amber">
      <div class="num">${data.filter(v=>v.severity==='high').length}</div>
      <div class="lbl">High Severity</div>
    </div>
    <div class="card green">
      <div class="num">${(data.reduce((s,v)=>s+v.confidence,0)/data.length*100).toFixed(1)}%</div>
      <div class="lbl">Avg. Detection Confidence</div>
    </div>
  </div>

  <h2>Violation Log — All PPE Non-Compliance Events</h2>
  <table>
    <thead>
      <tr>
        <th>ID</th><th>Date / Time</th><th>Camera</th><th>Violation Type</th>
        <th>Confidence</th><th>Zone</th><th>Severity</th><th>Worker</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <h2>Required Corrective Actions</h2>
  <div class="findings">
    <ul>
      <li><strong>Immediate:</strong> All <em>critical</em> violations require workers to be removed from the hazard zone (OSHA 29 CFR 1926.100(a)).</li>
      <li><strong>24h:</strong> Conduct re-safety briefing for any worker detected without PPE. Document in site safety log.</li>
      <li><strong>Weekly:</strong> Review camera zones with repeat violations. Consider additional signage or physical barriers.</li>
      <li><strong>Monthly:</strong> Submit corrective action summary to Safety Officer and archive this report per OSHA record-keeping requirements (29 CFR 1904).</li>
      <li><strong>Detection system:</strong> YOLOv8m model · confidence threshold 0.45 · inference on ONNX Runtime · 5-class PPE detection.</li>
    </ul>
  </div>

  <div class="footer">
    <span>SafeScan — YOLOv8m PPE Detection · OSHA 29 CFR 1926 · Report Chain-of-Custody Hash: ${hash}</span>
    <span>This document is audit-ready for OSHA inspection.</span>
  </div>

  <button class="print-btn no-print" onclick="window.print()"> Print / Save PDF</button>
  <script>setTimeout(() => window.print(), 800);<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 120000);
}

/*  Toast  */
function Toast({ msg, type, onClose }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 999,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '13px 18px',
      background: type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
      border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
      borderRadius: 'var(--radius-md)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      color: 'var(--text-primary)',
      fontSize: 13, fontWeight: 600,
      animation: 'fade-up 0.3s ease',
      minWidth: 280,
    }}>
      {type === 'success'
        ? <CheckCircle size={16} style={{ color: 'var(--accent-green)', flexShrink: 0 }}/>
        : <AlertTriangle size={16} style={{ color: 'var(--accent-red)', flexShrink: 0 }}/>}
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:2 }}>
        <X size={14}/>
      </button>
    </div>
  );
}

/*  ViolationsPage  */
export default function ViolationsPage() {
  const [search,     setSearch]     = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSev,  setFilterSev]  = useState('All');
  const [toast,      setToast]      = useState(null);

  // Combine live saved detections from Detection page with base mock data
  const [allData, setAllData] = useState(() => {
    try {
      const live = JSON.parse(localStorage.getItem('safesite_real_violations') || '[]');
      return [...live, ...violationsData];
    } catch (e) {
      return violationsData;
    }
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const types = ['All', 'No Helmet', 'No Vest'];
  const sevs  = ['All', 'critical', 'high', 'medium'];

  const filtered = allData.filter(v => {

    const matchSearch = v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.camera.toLowerCase().includes(search.toLowerCase()) ||
      v.zone.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || v.type === filterType;
    const matchSev  = filterSev  === 'All' || v.severity === filterSev;
    return matchSearch && matchType && matchSev;
  });

  /*  Button handlers  */
  const handleExportCSV = () => {
    const filename = `safesite-violations-${new Date().toISOString().slice(0,10)}.csv`;
    downloadCSV(filtered, filename);
    showToast(` Exported ${filtered.length} violations to ${filename}`, 'success');
  };

  const handleOSHAPDF = () => {
    openOSHAReport(filtered);
    showToast(' OSHA report opened — use Print → Save as PDF to download', 'success');
  };

  const handleGeneratePDF = () => handleOSHAPDF();

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">Violation Log</h1>
            <p className="page-subtitle">All PPE non-compliance events with annotated evidence</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {/*  WORKING: Downloads CSV of currently filtered violations */}
            <button id="export-csv-btn" className="btn btn-ghost btn-sm" onClick={handleExportCSV}>
              <Download size={14}/> Export CSV
            </button>
            {/*  WORKING: Opens OSHA PDF report in new tab with Print dialog */}
            <button id="osha-pdf-btn" className="btn btn-primary btn-sm" onClick={handleOSHAPDF}>
              <FileText size={14}/> OSHA Report PDF
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Today', val: violationsData.length, color: 'var(--accent-blue)' },
          { label: 'No Helmet',   val: violationsData.filter(v=>v.type==='No Helmet').length, color: 'var(--accent-red)' },
          { label: 'No Vest',     val: violationsData.filter(v=>v.type==='No Vest').length,   color: 'var(--accent-orange)' },
          { label: 'Critical',    val: violationsData.filter(v=>v.severity==='critical').length, color: 'var(--accent-red)' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '14px 20px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
          <input
            id="violation-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search violations…"
            style={{ width: '100%', padding: '9px 14px 9px 34px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>Type:</span>
          {types.map(t => (
            <button key={t} id={`filter-type-${t}`} className={`btn btn-sm ${filterType === t ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '5px 12px' }} onClick={() => setFilterType(t)}>{t}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>Severity:</span>
          {sevs.map(s => (
            <button key={s} id={`filter-sev-${s}`} className={`btn btn-sm ${filterSev === s ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '5px 12px', textTransform: 'capitalize' }} onClick={() => setFilterSev(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card">
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{filtered.length} violations found</div>
          <span className="badge badge-red badge-dot">{violationsData.filter(v=>v.severity==='critical').length} critical</span>
        </div>
        <div className="violations-table-wrapper">
          <table className="violations-table">
            <thead>
              <tr>
                <th>Thumbnail</th><th>ID</th><th>Date/Time</th><th>Camera</th>
                <th>Type</th><th>Confidence</th><th>Zone</th><th>Severity</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, idx) => (
                <tr key={`${v.id}-${idx}`}>

                  <td><div className="violation-thumbnail">{v.thumbnail}</div></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-blue)' }}>{v.id}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, whiteSpace: 'nowrap' }}>
                    <div>{v.time.split(' ')[0]}</div>
                    <div style={{ color: 'var(--accent-amber)' }}>{v.time.split(' ')[1]}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{v.camera}</td>
                  <td>
                    <span className={`badge ${v.type === 'No Helmet' ? 'badge-red' : 'badge-amber'}`}>{v.type}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ width: `${v.confidence * 100}%`, height: '100%', background: v.confidence > 0.9 ? 'var(--accent-green)' : 'var(--accent-amber)', borderRadius: 100 }}/>
                      </div>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{(v.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.zone}</td>
                  <td>
                    <span className={`badge ${SEV_COLORS[v.severity] || 'badge-blue'}`}>{v.severity}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 11 }}
                        onClick={() => alert(`Violation ${v.id}\nTime: ${v.time}\nCamera: ${v.camera}\nZone: ${v.zone}\nType: ${v.type}\nConfidence: ${(v.confidence*100).toFixed(0)}%\nSeverity: ${v.severity}`)}>
                        View
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 11 }}
                        onClick={() => showToast(`Violation ${v.id} assigned to Safety Officer`, 'success')}>
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertTriangle size={32} style={{ marginBottom: 12, opacity: 0.4 }}/>
            <div>No violations match your filters</div>
          </div>
        )}
      </div>

      {/* OSHA export note */}
      <div className="glass-card" style={{ padding: '16px 20px', marginTop: 16, display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.25)' }}>
        <span style={{ fontSize: 22 }}></span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>OSHA 29 CFR 1926 Compliance Report Available</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Includes violation timeline, chain-of-custody hash, and corrective action log. Use browser Print → Save as PDF.</div>
        </div>
        <button id="generate-pdf-btn" className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', flexShrink: 0 }} onClick={handleGeneratePDF}>
          Generate PDF
        </button>
      </div>
    </div>
  );
}
