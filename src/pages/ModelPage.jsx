import { modelMetrics } from '../data/mockData';

const versions = [
  { v: 'YOLOv8n', params: '3.2M', fps: 250, mAP: 48, use: 'Edge / IoT' },
  { v: 'YOLOv8s', params: '11.2M', fps: 170, mAP: 56, use: 'Balanced' },
  { v: 'YOLOv8m', params: '25.9M', fps: 90, mAP: 63, use: 'MVP Cloud ', rec: true },
  { v: 'YOLOv8l', params: '43.7M', fps: 60, mAP: 67, use: 'High Accuracy' },
  { v: 'YOLOv8x', params: '68.2M', fps: 40, mAP: 69, use: 'Max Accuracy' },
];

const driftSteps = [
  { n: '01', title: 'Data Drift Detection', desc: 'Track input image stats (brightness, contrast, resolution) with Evidently AI — weekly reports', color: '#3b82f6' },
  { n: '02', title: 'Prediction Drift', desc: 'Monitor class confidence score distributions over rolling 7-day windows', color: '#8b5cf6' },
  { n: '03', title: 'Active Learning', desc: 'Low-conf frames (0.3–0.5) auto-flagged for human review → added to training set', color: '#f59e0b' },
  { n: '04', title: 'Trigger Threshold', desc: 'Auto-retrain when drift score >0.15 OR mAP drops >5% from baseline', color: '#ef4444' },
  { n: '05', title: 'Staged Rollout', desc: 'New model → canary 10% → 50% → 100% with automatic rollback on regression', color: '#10b981' },
];

export default function ModelPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Model Assessment & ML Pipeline</h1>
        <p className="page-subtitle">YOLOv8 version selection, evaluation metrics, and deployment considerations</p>
      </div>

      {/* Selected Model Banner */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20, background: 'rgba(59,130,246,0.07)', borderColor: 'rgba(59,130,246,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 40 }}></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 900 }}>YOLOv8m</span>
              <span className="badge badge-green">Selected for MVP</span>
              <span className="badge badge-blue">ONNX Runtime</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              25.9M parameters · 90 FPS on T4 GPU · 83% mAP@0.5 · &lt;50ms latency · Best accuracy/speed trade-off for cloud deployment
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, textAlign: 'center', flexShrink: 0 }}>
            {[['83%','mAP@0.5'],['0.86','Precision'],['0.81','Recall'],['90 FPS','Inference']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent-blue)' }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Version Comparison Table */}
      <div className="glass-card" style={{ marginBottom: 20 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>YOLOv8 Version Comparison</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PPE detection performance across all variants</div>
        </div>
        <div className="violations-table-wrapper">
          <table className="violations-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Parameters</th>
                <th>FPS (T4 GPU)</th>
                <th>mAP@0.5 (COCO)</th>
                <th>mAP Speed</th>
                <th>Use Case</th>
              </tr>
            </thead>
            <tbody>
              {versions.map(v => (
                <tr key={v.v} style={{ background: v.rec ? 'rgba(59,130,246,0.06)' : 'transparent' }}>
                  <td style={{ fontWeight: v.rec ? 800 : 400 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {v.rec && <span style={{ fontSize: 16 }}></span>}
                      <span style={{ fontFamily: 'var(--font-mono)', color: v.rec ? 'var(--accent-blue)' : 'var(--text-secondary)' }}>{v.v}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{v.params}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 50, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ width: `${(v.fps / 250) * 100}%`, height: '100%', background: 'var(--accent-cyan)', borderRadius: 100 }}/>
                      </div>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{v.fps}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 50, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ width: `${(v.mAP / 70) * 100}%`, height: '100%', background: 'var(--accent-green)', borderRadius: 100 }}/>
                      </div>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{v.mAP}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ width: `${(v.fps / 2.5)}%`, height: '100%', background: 'var(--accent-purple)', borderRadius: 100 }}/>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${v.rec ? 'badge-blue' : 'badge-purple'}`}>{v.use}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Per-class metrics table */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Per-Class Evaluation (YOLOv8m)</div>
          {modelMetrics.map(m => (
            <div key={m.cls} className="metric-row">
              <div className="metric-class" style={{ color: m.color }}>{m.cls}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>Precision</div>
                    <div className="metric-bar-wrapper">
                      <div className="metric-bar" style={{ width: `${m.precision * 100}%`, background: m.color }}/>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>Recall</div>
                    <div className="metric-bar-wrapper">
                      <div className="metric-bar" style={{ width: `${m.recall * 100}%`, background: m.color + '99' }}/>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>mAP@0.5</div>
                    <div className="metric-bar-wrapper">
                      <div className="metric-bar" style={{ width: `${m.mAP50 * 100}%`, background: m.color + '66' }}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="metric-value">{(m.mAP50 * 100).toFixed(0)}%</div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Overall mAP@0.5: <strong style={{ color: 'var(--accent-blue)' }}>83.2%</strong> · mAP@0.5:0.95: <strong style={{ color: 'var(--accent-blue)' }}>56.2%</strong></div>
          </div>
        </div>

        {/* Deployment considerations */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Deployment Considerations</div>
          {[
            {
title: 'Cloud Inference (Default)', items: ['AWS EC2 G4dn.xlarge (T4 GPU)', 'ONNX Runtime with CUDA EP', '~90 FPS, ~200ms end-to-end latency', 'Auto-scaling via ECS Fargate', 'TensorRT optimization for 2× speedup'] },
            {
title: 'Edge Deployment (Optional)', items: ['NVIDIA Jetson Nano / Orin', 'TensorRT INT8 quantized', '~30ms on-device latency', 'Offline operation capable', '$149 hardware add-on'] },
          ].map((d, i) => (
            <div key={i} style={{ marginBottom: i === 0 ? 16 : 0, padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{d.icon} {d.title}</div>
              {d.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 5 }}>
                  <span style={{ color: 'var(--accent-green)', flexShrink: 0 }}></span>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Model Drift & Monitoring */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Model Drift Monitoring Workflow</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {driftSteps.map(s => (
            <div key={s.n} style={{ padding: '14px 16px', background: `${s.color}10`, border: `1px solid ${s.color}30`, borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 900, color: s.color, marginBottom: 8, opacity: 0.5 }}>{s.n}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Labeling Workflow */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Data Labeling Pipeline</div>
        <div className="timeline">
          {[
            { title: 'Raw Image Collection', desc: '10,000 construction site images collected from partner sites', date: 'Month 1', done: true },
            { title: 'Roboflow Annotation', desc: 'Team annotation with bounding boxes for 5 PPE classes + auto-QA checks', date: 'Month 1–2', done: true },
            { title: 'Dataset Split & Augmentation', desc: '70% train / 20% val / 10% test · HSV jitter, mosaic, flip, rotation augmentations', date: 'Month 2', active: true },
            { title: 'Training & Validation', desc: 'YOLOv8m fine-tune on A100 · Early stopping · Confusion matrix & PR curve analysis', date: 'Month 2–3', done: false },
            { title: 'Active Learning Loop', desc: 'Low-confidence frames (0.3–0.5) → human review → dataset expansion', date: 'Ongoing', done: false },
          ].map((t, i) => (
            <div key={i} className={`timeline-item ${t.done ? 'done' : t.active ? 'active' : ''}`}>
              <div className="timeline-title">{t.title}</div>
              <div className="timeline-desc">{t.desc}</div>
              <div className="timeline-date">{t.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
