// Mock data for the SafeSite AI platform

// Helper for dynamic dates based on today
const getTodayTime = (h, m, s) => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(h)}:${pad(m)}:${pad(s)}`;
};

export const violationsData = [
  { id: 'V-2026-001', time: getTodayTime(9, 14, 22), camera: 'Gate-A Cam 1', type: 'No Helmet', confidence: 0.94, zone: 'Entry Zone', severity: 'critical', worker: 'Unknown Worker', thumbnail: '🪖' },
  { id: 'V-2026-002', time: getTodayTime(9, 11, 5), camera: 'Tower-B Cam 3', type: 'No Vest', confidence: 0.88, zone: 'Tower B Scaffold', severity: 'high', worker: 'Worker #12', thumbnail: '🦺' },
  { id: 'V-2026-003', time: getTodayTime(8, 55, 18), camera: 'Foundation Cam 2', type: 'No Helmet', confidence: 0.91, zone: 'Foundation Zone', severity: 'critical', worker: 'Unknown Worker', thumbnail: '🪖' },
  { id: 'V-2026-004', time: getTodayTime(8, 42, 37), camera: 'Gate-A Cam 1', type: 'No Vest', confidence: 0.85, zone: 'Entry Zone', severity: 'high', worker: 'Worker #07', thumbnail: '🦺' },
  { id: 'V-2026-005', time: getTodayTime(8, 30, 11), camera: 'Crane Op Cam', type: 'No Helmet', confidence: 0.97, zone: 'Crane Ops Area', severity: 'critical', worker: 'Unknown Worker', thumbnail: '🪖' },
  { id: 'V-2026-006', time: getTodayTime(8, 22, 44), camera: 'Tower-B Cam 3', type: 'No Vest', confidence: 0.79, zone: 'Tower B Scaffold', severity: 'medium', worker: 'Worker #19', thumbnail: '🦺' },
  { id: 'V-2026-007', time: getTodayTime(7, 58, 3), camera: 'Parking Cam', type: 'No Helmet', confidence: 0.82, zone: 'Parking/Staging', severity: 'high', worker: 'Unknown Worker', thumbnail: '🪖' },
  { id: 'V-2026-008', time: getTodayTime(7, 44, 29), camera: 'Foundation Cam 2', type: 'No Vest', confidence: 0.91, zone: 'Foundation Zone', severity: 'high', worker: 'Worker #03', thumbnail: '🦺' },
];

export const weeklyViolationData = [
  { day: 'Mon', helmet: 12, vest: 8, total: 20 },
  { day: 'Tue', helmet: 8, vest: 11, total: 19 },
  { day: 'Wed', helmet: 15, vest: 6, total: 21 },
  { day: 'Thu', helmet: 9, vest: 14, total: 23 },
  { day: 'Fri', helmet: 11, vest: 9, total: 20 },
  { day: 'Sat', helmet: 5, vest: 3, total: 8 },
  { day: 'Sun', helmet: 2, vest: 1, total: 3 },
];

export const hourlyData = [
  { hour: '06:00', detections: 18, violations: 3 },
  { hour: '07:00', detections: 54, violations: 8 },
  { hour: '08:00', detections: 127, violations: 14 },
  { hour: '09:00', detections: 165, violations: 11 },
  { hour: '10:00', detections: 142, violations: 9 },
  { hour: '11:00', detections: 138, violations: 7 },
  { hour: '12:00', detections: 95, violations: 4 },
  { hour: '13:00', detections: 120, violations: 6 },
  { hour: '14:00', detections: 155, violations: 10 },
  { hour: '15:00', detections: 147, violations: 8 },
  { hour: '16:00', detections: 112, violations: 5 },
  { hour: '17:00', detections: 72, violations: 3 },
];

export const classDistributionData = [
  { name: 'Helmet ✓', value: 42, color: '#10b981' },
  { name: 'Vest ✓', value: 31, color: '#3b82f6' },
  { name: 'No Helmet', value: 15, color: '#ef4444' },
  { name: 'No Vest', value: 9, color: '#f97316' },
  { name: 'Person', value: 3, color: '#8b5cf6' },
];

export const modelMetrics = [
  { cls: 'Person', precision: 0.91, recall: 0.87, mAP50: 0.89, mAP5095: 0.62, color: '#8b5cf6' },
  { cls: 'Helmet', precision: 0.87, recall: 0.82, mAP50: 0.84, mAP5095: 0.58, color: '#10b981' },
  { cls: 'No-Helmet', precision: 0.84, recall: 0.79, mAP50: 0.81, mAP5095: 0.54, color: '#ef4444' },
  { cls: 'Vest', precision: 0.86, recall: 0.81, mAP50: 0.83, mAP5095: 0.56, color: '#3b82f6' },
  { cls: 'No-Vest', precision: 0.82, recall: 0.76, mAP50: 0.79, mAP5095: 0.51, color: '#f97316' },
];

export const cameras = [
  { id: 1, name: 'Gate-A Camera 1', zone: 'Entry Zone', status: 'online', fps: 28, violations_today: 5, rtsp: 'rtsp://cam1.site.local:554' },
  { id: 2, name: 'Foundation Cam 2', zone: 'Foundation Zone', status: 'online', fps: 30, violations_today: 3, rtsp: 'rtsp://cam2.site.local:554' },
  { id: 3, name: 'Tower-B Cam 3', zone: 'Tower B Scaffold', status: 'online', fps: 25, violations_today: 4, rtsp: 'rtsp://cam3.site.local:554' },
  { id: 4, name: 'Crane Ops Cam', zone: 'Crane Ops Area', status: 'online', fps: 30, violations_today: 2, rtsp: 'rtsp://cam4.site.local:554' },
  { id: 5, name: 'Parking Cam', zone: 'Parking/Staging', status: 'offline', fps: 0, violations_today: 1, rtsp: 'rtsp://cam5.site.local:554' },
  { id: 6, name: 'Roof Access Cam', zone: 'Roof Level 4', status: 'online', fps: 29, violations_today: 0, rtsp: 'rtsp://cam6.site.local:554' },
];

export const alerts = [
  { id: 1, type: 'critical', msg: 'No Helmet detected — Crane Ops Area (Cam 4) — 09:14:22', time: '2 min ago' },
  { id: 2, type: 'high', msg: 'No Vest detected — Tower-B Scaffold (Cam 3) — 09:11:05', time: '5 min ago' },
  { id: 3, type: 'critical', msg: 'No Helmet detected — Foundation Zone (Cam 2) — 08:55:18', time: '19 min ago' },
  { id: 4, type: 'info', msg: 'Camera 5 (Parking) went offline — connectivity issue', time: '32 min ago' },
];

export const budgetPhases = [
  {
    phase: 'Phase 1 — R&D',
    period: 'Months 1–3',
    total: 45000,
    color: '#8b5cf6',
    items: [
      { name: 'ML Engineer (contract)', cost: 18000 },
      { name: 'GPU Compute (A100)', cost: 3500 },
      { name: 'Dataset Labeling (10k images)', cost: 4000 },
      { name: 'Backend Engineer', cost: 12000 },
      { name: 'Cloud Infra (dev/staging)', cost: 2500 },
      { name: 'Security Audit', cost: 3500 },
      { name: 'Tools & Licenses', cost: 1500 },
    ]
  },
  {
    phase: 'Phase 2 — MVP',
    period: 'Months 4–6',
    total: 62000,
    color: '#3b82f6',
    items: [
      { name: 'Full-Stack Engineer', cost: 18000 },
      { name: 'Frontend / UX Engineer', cost: 15000 },
      { name: 'Cloud Infra (prod, GPU)', cost: 8000 },
      { name: 'MLOps & Monitoring', cost: 2000 },
      { name: 'Legal & Compliance', cost: 5000 },
      { name: 'CI/CD & DevOps', cost: 3000 },
      { name: 'Marketing', cost: 6000 },
      { name: 'Contingency (10%)', cost: 5000 },
    ]
  },
  {
    phase: 'Phase 3 — Scale',
    period: 'Months 7–12',
    total: 120000,
    color: '#10b981',
    items: [
      { name: '2× Full-Time Engineers', cost: 48000 },
      { name: 'Sales & Customer Success', cost: 24000 },
      { name: 'Cloud Scaling & CDN', cost: 18000 },
      { name: 'SOC 2 Audit', cost: 12000 },
      { name: 'Model Retraining & Drift Mgmt', cost: 6000 },
      { name: 'Edge Hardware (Jetson ×10)', cost: 5000 },
      { name: 'Marketing & Events', cost: 7000 },
    ]
  }
];

export const roadmilestones = [
  { q: 'Q1 — R&D', done: true, items: ['Dataset curation & labeling (10k images)', 'YOLOv8m training & evaluation (mAP 83%)', 'Inference API (FastAPI + ONNX Runtime)', 'CI/CD pipeline & cloud infra baseline'] },
  { q: 'Q2 — MVP Launch', active: true, items: ['React dashboard (core features)', 'Camera management & live stream', 'Violation logging & email alerts', 'Billing integration (Stripe)', '5 paying beta customers'] },
  { q: 'Q3 — Growth', items: ['Video batch processing', 'Advanced analytics (heatmaps, trends)', 'SSO & team management (SCIM)', 'SOC 2 audit kickoff'] },
  { q: 'Q4 — Scale', items: ['Edge deployment package (Jetson Nano)', 'White-label & API reseller program', 'International data residency (EU)', 'Series A fundraising preparation'] },
];

export const apiEndpoints = [
  { method: 'POST', path: '/api/v1/detect/image', desc: 'Upload single frame for PPE detection', auth: true },
  { method: 'POST', path: '/api/v1/detect/video', desc: 'Async video processing job submission', auth: true },
  { method: 'GET', path: '/api/v1/detect/jobs/{job_id}', desc: 'Poll async job status & results', auth: true },
  { method: 'WS', path: '/api/v1/stream/{camera_id}', desc: 'Live RTSP inference WebSocket stream', auth: true },
  { method: 'GET', path: '/api/v1/cameras', desc: 'List all cameras with status', auth: true },
  { method: 'POST', path: '/api/v1/cameras', desc: 'Register new camera (RTSP URL)', auth: true },
  { method: 'GET', path: '/api/v1/violations', desc: 'Paginated violations with filters', auth: true },
  { method: 'GET', path: '/api/v1/analytics/summary', desc: 'Daily/weekly/monthly stats', auth: true },
  { method: 'POST', path: '/api/v1/reports/generate', desc: 'Trigger OSHA compliance PDF report', auth: true },
  { method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticate and get JWT token', auth: false },
];
