import { useState } from 'react';
import { apiEndpoints } from '../data/mockData';

const METHOD_COLORS = {
  GET: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  POST: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  PUT: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  DELETE: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  WS: { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
};

const examples = {
  detect: {
    request: `POST /api/v1/detect/image HTTP/1.1
Host: api.safescan.ai
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

{
  "image": <binary>,
  "confidence_threshold": 0.45,
  "iou_threshold": 0.5,
  "camera_id": "cam_1"
}`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "frame_id": "frame_20260613_091422_a3f2",
  "camera_id": "cam_1",
  "inference_ms": 42,
  "detections": [
    {
      "class": "Person",
      "confidence": 0.99,
      "bbox": [120, 60, 280, 400],
      "class_id": 0
    },
    {
      "class": "No Helmet",
      "confidence": 0.91,
      "bbox": [130, 65, 200, 140],
      "class_id": 2
    },
    {
      "class": "Vest",
      "confidence": 0.87,
      "bbox": [125, 150, 275, 320],
      "class_id": 3
    }
  ],
  "violations": ["No Helmet"],
  "violation_count": 1,
  "annotated_frame_url": "https://cdn.safescan.ai/frames/frame_20260613_091422_a3f2.jpg",
  "alert_sent": true
}`
  },
  violations: {
    request: `GET /api/v1/violations?page=1&limit=20&type=No+Helmet&severity=critical HTTP/1.1
Host: api.safescan.ai
Authorization: Bearer <jwt_token>`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "total": 87,
  "page": 1,
  "limit": 20,
  "violations": [
    {
      "id": "V-2024-001",
      "timestamp": "2026-06-13T09:14:22Z",
      "camera_id": "cam_1",
      "camera_name": "Gate-A Camera 1",
      "type": "No Helmet",
      "confidence": 0.94,
      "severity": "critical",
      "zone": "Entry Zone",
      "annotated_url": "https://cdn.safescan.ai/frames/...",
      "alert_sent": true
    }
  ]
}`
  },
  stream: {
    request: `// WebSocket connection
const ws = new WebSocket(
  'wss://api.safescan.ai/api/v1/stream/cam_1',
  { headers: { Authorization: 'Bearer <token>' } }
);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};`,
    response: `// Incoming WebSocket message (per frame with detections):
{
  "camera_id": "cam_1",
  "timestamp": 1718267662,
  "frame_number": 12847,
  "detections": [
    { "class": "No Helmet", "confidence": 0.91, "bbox": [130,65,70,75] }
  ],
  "violation": true,
  "violation_types": ["No Helmet"],
  "frame_url": "s3://safesite-frames/cam1/frame_12847.jpg",
  "inference_ms": 38
}`
  },
};

export default function ApiDocsPage() {
  const [selected, setSelected] = useState('detect');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">API Documentation</h1>
        <p className="page-subtitle">RESTful API + WebSocket endpoints for SafeScan integration</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-green)', animation: 'live-pulse 1s infinite' }}/>
          <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>api.safescan.ai</span>
          <span className="badge badge-green" style={{ marginLeft: 4 }}>v1 — Live</span>
        </div>
        <div className="glass-card" style={{ padding: '8px 16px' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Auth: </span>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>Bearer JWT</span>
        </div>
        <div className="glass-card" style={{ padding: '8px 16px' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Rate limit: </span>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>1000 req/min</span>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="glass-card" style={{ marginBottom: 20 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', fontWeight: 700, fontSize: 15 }}>All Endpoints</div>
        <div className="violations-table-wrapper">
          <table className="violations-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
                <th>Auth</th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map((ep, i) => {
                const mc = METHOD_COLORS[ep.method] || METHOD_COLORS.GET;
                return (
                  <tr key={i}>
                    <td>
                      <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, background: mc.bg, color: mc.color, border: `1px solid ${mc.border}` }}>
                        {ep.method}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-cyan)' }}>{ep.path}</td>
                    <td style={{ fontSize: 13 }}>{ep.desc}</td>
                    <td>{ep.auth ? <span className="badge badge-amber">JWT</span> : <span className="badge badge-green">Public</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive examples */}
      <div className="glass-card" style={{ marginBottom: 20 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', fontWeight: 700, fontSize: 15 }}>Example Requests & Responses</div>
        <div className="tabs-nav" style={{ padding: '0 24px' }}>
          {[['detect',' Detect Image'],['violations',' Get Violations'],['stream',' WebSocket Stream']].map(([k,l])=>(
            <button key={k} id={`api-tab-${k}`} className={`tab-btn ${selected===k?'active':''}`} onClick={()=>setSelected(k)}>{l}</button>
          ))}
        </div>
        <div style={{ padding: 24 }}>
          <div className="grid-2">
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Request</div>
              <div className="code-block">
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {examples[selected]?.request.split('\n').map((line, i) => {
                    if (line.startsWith('POST') || line.startsWith('GET') || line.startsWith('//')) return <span key={i} className="code-keyword">{line}{'\n'}</span>;
                    if (line.includes('"')) return <span key={i}>{line.replace(/"([^"]+)"/g, (m, g) => `<span class="code-string">"${g}"</span>`)}{'\n'}</span>;
                    return <span key={i}>{line}{'\n'}</span>;
                  })}
                </pre>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Response</div>
              <div className="code-block">
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {examples[selected]?.response}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture diagram */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>High-Level Architecture</div>
        <div className="code-block" style={{ fontSize: 11, lineHeight: 1.8 }}>
          <span className="code-comment">{'\n'}</span>
          <span className="code-comment">{'                     CLIENT LAYER                        \n'}</span>
          <span className="code-comment">{'  React SPA (Vite) + WebSocket client + Recharts          \n'}</span>
          <span className="code-comment">{'\n'}</span>
          <span className="code-keyword">{'                        HTTPS / WSS\n'}</span>
          <span className="code-comment">{'\n'}</span>
          <span className="code-comment">{'            API GATEWAY (Nginx + AWS API GW)             \n'}</span>
          <span className="code-comment">{'         Auth (JWT/OAuth2) · Rate Limit · WAF             \n'}</span>
          <span className="code-comment">{'\n'}</span>
          <span className="code-string">{'                                          \n'}</span>
          <span className="code-comment">{'        \n'}</span>
          <span className="code-comment">{'  Auth         Core API          ML Inference   \n'}</span>
          <span className="code-comment">{' Service       (FastAPI)         (YOLOv8+ONNX)  \n'}</span>
          <span className="code-comment">{'  (JWT)        PostgreSQL        T4 GPU / Edge  \n'}</span>
          <span className="code-comment">{'        \n'}</span>
          <span className="code-string">{'                                           \n'}</span>
          <span className="code-comment">{'                   \n'}</span>
          <span className="code-comment">{'                 Task Queue        Frame Buffer   \n'}</span>
          <span className="code-comment">{'                (Celery+Redis     (Redis Streams) \n'}</span>
          <span className="code-comment">{'                   \n'}</span>
          <span className="code-string">{'                       \n'}</span>
          <span className="code-comment">{'                   \n'}</span>
          <span className="code-comment">{'                  Storage          Alert Engine   \n'}</span>
          <span className="code-comment">{'                 S3 (frames)      (SNS/Twilio/SG) \n'}</span>
          <span className="code-comment">{'                 PostgreSQL      \n'}</span>
          <span className="code-comment">{'               \n'}</span>
        </div>
      </div>
    </div>
  );
}
