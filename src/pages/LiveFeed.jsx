import { useState, useEffect } from 'react';
import { Camera, Wifi, WifiOff, Plus, RefreshCw, Upload, Eye } from 'lucide-react';
import { cameras } from '../data/mockData';

const DETECTION_BOXES = [
  [
    { label: 'Helmet', conf: 94, color: '#10b981', x: '10%', y: '20%', w: '25%', h: '55%', type: 'box-helmet' },
    { label: 'Vest', conf: 91, color: '#3b82f6', x: '38%', y: '15%', w: '22%', h: '60%', type: 'box-vest' },
    { label: 'No Helmet', conf: 89, color: '#ef4444', x: '65%', y: '25%', w: '20%', h: '50%', type: 'box-nohelmet' },
  ],
  [
    { label: 'No Vest', conf: 85, color: '#f97316', x: '15%', y: '30%', w: '30%', h: '45%', type: 'box-nohelmet' },
    { label: 'Helmet', conf: 96, color: '#10b981', x: '55%', y: '10%', w: '25%', h: '60%', type: 'box-helmet' },
  ],
  [
    { label: 'Person', conf: 99, color: '#8b5cf6', x: '20%', y: '10%', w: '60%', h: '80%', type: 'box-person' },
    { label: 'No Helmet', conf: 92, color: '#ef4444', x: '25%', y: '12%', w: '20%', h: '30%', type: 'box-nohelmet' },
  ],
  [
    { label: 'Vest', conf: 93, color: '#3b82f6', x: '5%', y: '15%', w: '28%', h: '65%', type: 'box-vest' },
    { label: 'Helmet', conf: 97, color: '#10b981', x: '40%', y: '20%', w: '22%', h: '50%', type: 'box-helmet' },
    { label: 'No Vest', conf: 88, color: '#f97316', x: '68%', y: '22%', w: '25%', h: '55%', type: 'box-nohelmet' },
  ],
];

function CameraFeedCard({ cam, boxIndex }) {
  const [frameTime, setFrameTime] = useState(0);
  const isOnline = cam.status === 'online';
  const boxes = DETECTION_BOXES[boxIndex % DETECTION_BOXES.length];
  const hasViolation = boxes.some(b => b.label.startsWith('No'));

  useEffect(() => {
    if (!isOnline) return;
    const id = setInterval(() => setFrameTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [isOnline]);

  const zoneColors = ['#0f1c35', '#0a1420', '#121a2e', '#080f1e'];

  return (
    <div className="glass-card camera-card">
      <div className="camera-feed" style={{ background: isOnline ? zoneColors[boxIndex % 4] : '#050b14' }}>
        {/* Grid overlay */}
        {isOnline && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.03) 1px,transparent 1px)', backgroundSize: '30px 30px' }}/>
        )}

        {isOnline ? (
          <>
            {/* Detection boxes */}
            {boxes.map((b, i) => (
              <div key={i} className={`detection-box ${b.type}`} style={{ left: b.x, top: b.y, width: b.w, height: b.h }}>
                <div className="detection-box-label" style={{ background: b.color, color: b.color === '#10b981' || b.color === '#8b5cf6' ? '#000' : '#fff' }}>
                  {b.label} {b.conf}%
                </div>
              </div>
            ))}

            {/* Scan line animation */}
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)',
              animation: 'scan-line 3s linear infinite',
              zIndex: 2,
            }}/>

            {/* LIVE badge */}
            <div className="camera-live-badge">
              <div className="live-dot"/>
              LIVE · {cam.fps} FPS
            </div>

            {/* Violation warning */}
            {hasViolation && (
              <div style={{
                position: 'absolute', top: 10, right: 10,
                background: 'rgba(239,68,68,0.85)',
                borderRadius: 6, padding: '3px 8px',
                fontSize: 10, fontWeight: 700, color: '#fff',
                animation: 'fade-up 0.3s ease',
              }}>
                 VIOLATION
              </div>
            )}

            {/* FPS counter */}
            <div style={{
              position: 'absolute', bottom: 10, right: 10,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'rgba(255,255,255,0.4)',
            }}>
              {String(frameTime).padStart(5, '0')}f · t{(frameTime * 33).toFixed(0)}ms
            </div>
          </>
        ) : (
          <div className="camera-feed-placeholder">
            <WifiOff size={32} style={{ color: 'var(--accent-red)', opacity: 0.5 }}/>
            <div>Camera Offline</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Check connection</div>
          </div>
        )}
      </div>

      <div className="camera-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="camera-name">{cam.name}</div>
            <div className="camera-meta">{cam.zone}</div>
          </div>
          <span className={`badge ${isOnline ? (hasViolation ? 'badge-red' : 'badge-green') : 'badge-red'}`}>
            {isOnline ? (hasViolation ? 'Violation' : 'Clear') : 'Offline'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
          <span><Wifi size={11}/> {cam.rtsp.slice(0, 24)}…</span>
          <span style={{ marginLeft: 'auto', color: cam.violations_today > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {cam.violations_today} violations today
          </span>
        </div>
      </div>
    </div>
  );
}

function UploadDetect() {
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  const simulateDetection = () => {
    setProcessing(true);
    setResult(null);
    setTimeout(() => {
      setResult({
        detections: [
          { class: 'Person', conf: 0.99, box: [120, 60, 280, 400] },
          { class: 'No Helmet', conf: 0.91, box: [130, 65, 200, 140] },
          { class: 'Vest', conf: 0.87, box: [125, 150, 275, 320] },
        ],
        inference_ms: 42,
        violations: 1,
      });
      setProcessing(false);
    }, 1800);
  };

  return (
    <div>
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); simulateDetection(); }}
        onClick={simulateDetection}
        id="upload-zone"
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && simulateDetection()}
      >
        <Upload size={32} style={{ color: 'var(--accent-blue)', marginBottom: 12 }}/>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Drop image or video here</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>or click to select · Supports JPEG, PNG, MP4, AVI</div>
        <button className="btn btn-primary" onClick={e => { e.stopPropagation(); simulateDetection(); }}>
          {processing ? ' Processing…' : <><Eye size={14}/> Analyze Image</>}
        </button>
      </div>

      {processing && (
        <div style={{ marginTop: 16, padding: '16px 20px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 16, height: 16, border: '2px solid var(--accent-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/>
          <span style={{ fontSize: 13 }}>Running YOLOv8m inference… preprocessing → NMS → output</span>
        </div>
      )}

      {result && (
        <div className="glass-card" style={{ marginTop: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Detection Results</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-blue">{result.inference_ms}ms inference</span>
              {result.violations > 0 && <span className="badge badge-red">{result.violations} violation</span>}
            </div>
          </div>
          <div className="code-block" style={{ fontSize: 12 }}>
            <span className="code-comment">// POST /api/v1/detect/image → 200 OK</span>{'\n'}
            {'{'}{'\n'}
            {'  '}<span className="code-keyword">"detections"</span>: [{'\n'}
            {result.detections.map((d, i) => (
              `    { "class": "${d.class}", "confidence": ${d.conf}, "bbox": [${d.box.join(', ')}] }${i < result.detections.length - 1 ? ',' : ''}\n`
            )).join('')}
            {'  '}],{'\n'}
            {'  '}<span className="code-keyword">"inference_ms"</span>: {result.inference_ms},{'\n'}
            {'  '}<span className="code-keyword">"violations"</span>: {result.violations},{'\n'}
            {'  '}<span className="code-keyword">"frame_id"</span>: <span className="code-string">"frame_20260613_091422_a3f2"</span>{'\n'}
            {'}'}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveFeed() {
  const [activeTab, setActiveTab] = useState('feeds');

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">Live Camera Feeds</h1>
            <p className="page-subtitle">Real-time YOLOv8 inference across all active cameras</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm"><RefreshCw size={14}/> Refresh All</button>
            <button className="btn btn-primary btn-sm"><Plus size={14}/> Add Camera</button>
          </div>
        </div>
      </div>

      <div className="tabs-nav">
        {[
          { key: 'feeds',  label: 'Camera Feeds' },
          { key: 'upload', label: 'Upload & Detect' },
          { key: 'rtsp',   label: 'RTSP Config' },
        ].map(t => (
          <button key={t.key} id={`tab-${t.key}`} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'feeds' && (
        <div>
          <div className="camera-grid">
            {cameras.map((cam, i) => (
              <CameraFeedCard key={cam.id} cam={cam} boxIndex={i} />
            ))}
          </div>
          <style>{`@keyframes scan-line { from { top: 0; } to { top: 100%; } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {activeTab === 'upload' && (
        <div style={{ maxWidth: 700 }}>
          <UploadDetect />
        </div>
      )}

      {activeTab === 'rtsp' && (
        <div style={{ maxWidth: 600 }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 700 }}>Register RTSP Camera Stream</h3>
            {['Camera Name', 'RTSP URL (rtsp://...)', 'Zone / Location', 'Confidence Threshold'].map((label, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</label>
                <input
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14, fontFamily: i === 1 ? 'var(--font-mono)' : 'inherit' }}
                  placeholder={i === 1 ? 'rtsp://192.168.1.100:554/stream' : i === 3 ? '0.45' : ''}
                />
              </div>
            ))}
            <button className="btn btn-primary" style={{ marginTop: 8 }}><Plus size={14}/> Register Camera</button>
          </div>

          <div className="glass-card" style={{ padding: 24, marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Sample WebSocket Stream Format</div>
            <div className="code-block">
              <span className="code-keyword">WS</span> <span className="code-url">wss://api.safescan.ai/api/v1/stream/cam_1</span>{'\n\n'}
              <span className="code-comment">// Incoming message (every frame with detections):</span>{'\n'}
              {'{'} <span className="code-keyword">"camera_id"</span>: <span className="code-string">"cam_1"</span>, <span className="code-keyword">"ts"</span>: <span className="code-number">1718267662</span>,{'\n'}
              {'  '}<span className="code-keyword">"detections"</span>: [{'{'}<span className="code-string">"class"</span>: <span className="code-string">"No Helmet"</span>, <span className="code-string">"conf"</span>: <span className="code-number">0.91</span>{'}'}],{'\n'}
              {'  '}<span className="code-keyword">"violation"</span>: <span className="code-number">true</span>, <span className="code-keyword">"frame_url"</span>: <span className="code-string">"s3://…"</span> {'}'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
