import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload, Image as ImageIcon, Zap, Shield, AlertTriangle,
  CheckCircle, Clock, Layers, BarChart2, RefreshCw, X, Eye,
} from 'lucide-react';
import { useLang } from '../context/LangContext';
import * as ort from 'onnxruntime-web';

/* ── Class config ─────────────────────────────────── */
// Actual model output: {0: helmet, 1: no-helmet, 2: no-vest, 3: person, 4: upper body, 5: vest}
const CLASS_LABELS = ['Helmet', 'No-Helmet', 'No-Vest', 'Person', 'Upper-Body', 'Vest'];

const CLASSES = {
  'Person':      { color: '#3b82f6', fill: 'rgba(59,130,246,0.25)',  border: 'rgba(59,130,246,0.8)'  },
  'Upper-Body':  { color: '#8b5cf6', fill: 'rgba(139,92,246,0.22)', border: 'rgba(139,92,246,0.8)'  },
  'Helmet':      { color: '#10b981', fill: 'rgba(16,185,129,0.22)',  border: 'rgba(16,185,129,0.9)'  },
  'No-Helmet':   { color: '#e11d48', fill: 'rgba(225,29,72,0.25)',   border: 'rgba(225,29,72,0.9)'   },
  'Vest':        { color: '#f59e0b', fill: 'rgba(245,158,11,0.20)',  border: 'rgba(245,158,11,0.85)' },
  'No-Vest':     { color: '#f97316', fill: 'rgba(249,115,22,0.22)',  border: 'rgba(249,115,22,0.85)' },
};

const MODEL_INPUT_SIZE = 640;
const CONF_THRESHOLD = 0.25;
const IOU_THRESHOLD  = 0.45;




/* ── ONNX model singleton ─────────────────────────── */
let modelSession = null;
let modelLoading = false;
let modelLoadPromise = null;

async function loadModel(onProgress) {
  if (modelSession) return modelSession;
  if (modelLoading) return modelLoadPromise;

  modelLoading = true;
  if (onProgress) onProgress('Loading AI model...');

  modelLoadPromise = (async () => {
    try {
      ort.env.wasm.wasmPaths = '/node_modules/onnxruntime-web/dist/';
      const session = await ort.InferenceSession.create('/best.onnx', {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });
      modelSession = session;
      modelLoading = false;
      return session;
    } catch (err) {
      modelLoading = false;
      throw err;
    }
  })();

  return modelLoadPromise;
}

/* ── Image preprocessing → Float32 tensor ─────────── */
function preprocessImage(img) {
  const canvas = document.createElement('canvas');
  canvas.width = MODEL_INPUT_SIZE;
  canvas.height = MODEL_INPUT_SIZE;
  const ctx = canvas.getContext('2d');

  // Letterbox resize (maintain aspect ratio)
  const scale = Math.min(MODEL_INPUT_SIZE / img.naturalWidth, MODEL_INPUT_SIZE / img.naturalHeight);
  const newW = Math.round(img.naturalWidth * scale);
  const newH = Math.round(img.naturalHeight * scale);
  const padX = (MODEL_INPUT_SIZE - newW) / 2;
  const padY = (MODEL_INPUT_SIZE - newH) / 2;

  ctx.fillStyle = '#808080'; // gray padding (standard YOLO letterbox)
  ctx.fillRect(0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
  ctx.drawImage(img, padX, padY, newW, newH);

  const imageData = ctx.getImageData(0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
  const { data } = imageData;

  // Convert RGBA HWC → RGB CHW, normalized to [0,1]
  const totalPixels = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE;
  const float32 = new Float32Array(3 * totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    float32[i]                = data[i * 4]     / 255.0; // R
    float32[i + totalPixels]  = data[i * 4 + 1] / 255.0; // G
    float32[i + 2 * totalPixels] = data[i * 4 + 2] / 255.0; // B
  }

  return {
    tensor: new ort.Tensor('float32', float32, [1, 3, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE]),
    scale,
    padX,
    padY,
  };
}

/* ── IoU (Intersection over Union) ────────────────── */
function iou(a, b) {
  const x1 = Math.max(a.x1, b.x1);
  const y1 = Math.max(a.y1, b.y1);
  const x2 = Math.min(a.x2, b.x2);
  const y2 = Math.min(a.y2, b.y2);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const areaA = (a.x2 - a.x1) * (a.y2 - a.y1);
  const areaB = (b.x2 - b.x1) * (b.y2 - b.y1);
  return inter / (areaA + areaB - inter + 1e-6);
}

/* ── Non-Maximum Suppression ──────────────────────── */
function nms(boxes, iouThreshold) {
  boxes.sort((a, b) => b.conf - a.conf);
  const keep = [];
  const suppressed = new Set();
  for (let i = 0; i < boxes.length; i++) {
    if (suppressed.has(i)) continue;
    keep.push(boxes[i]);
    for (let j = i + 1; j < boxes.length; j++) {
      if (suppressed.has(j)) continue;
      if (boxes[i].cls === boxes[j].cls && iou(boxes[i], boxes[j]) > iouThreshold) {
        suppressed.add(j);
      }
    }
  }
  return keep;
}

/* ── Post-process YOLOv8 output → detections ──────── */
function postprocess(output, scale, padX, padY, imgW, imgH) {
  // YOLOv8 output shape: [1, 10, 8400] → 8400 candidates, 10 values each
  // Values: [x_center, y_center, width, height, cls0, cls1, cls2, cls3, cls4, cls5]
  const rawData = output.data;
  const numDetections = 8400;
  const numClasses = 6;

  // Per-class confidence thresholds set to 0.25 standard
  const CLASS_THRESHOLDS = {
    'Helmet':      0.25,
    'No-Helmet':   0.25,
    'No-Vest':     0.25,
    'Person':      0.25,
    'Upper-Body':  0.25,
    'Vest':        0.25,
  };




  const candidates = [];

  // Debug: track max scores per class (logged once)
  const maxScoresPerClass = new Array(numClasses).fill(0);

  for (let i = 0; i < numDetections; i++) {
    // YOLOv8 output is transposed: [1, 10, 8400]
    const cx = rawData[0 * numDetections + i];
    const cy = rawData[1 * numDetections + i];
    const w  = rawData[2 * numDetections + i];
    const h  = rawData[3 * numDetections + i];

    // Find best class
    let maxScore = 0;
    let bestCls  = 0;
    for (let c = 0; c < numClasses; c++) {
      const score = rawData[(4 + c) * numDetections + i];
      if (score > maxScoresPerClass[c]) maxScoresPerClass[c] = score;
      if (score > maxScore) {
        maxScore = score;
        bestCls  = c;
      }
    }

    const label = CLASS_LABELS[bestCls];
    const threshold = CLASS_THRESHOLDS[label] || CONF_THRESHOLD;
    if (maxScore < threshold) continue;

    // Convert from letterboxed coords back to original image coords
    const x1 = Math.max(0, ((cx - w / 2) - padX) / scale);
    const y1 = Math.max(0, ((cy - h / 2) - padY) / scale);
    const x2 = Math.min(imgW, ((cx + w / 2) - padX) / scale);
    const y2 = Math.min(imgH, ((cy + h / 2) - padY) / scale);

    if (x2 - x1 < 2 || y2 - y1 < 2) continue;

    candidates.push({
      cls: label,
      conf: +(maxScore * 100).toFixed(1),
      x1, y1, x2, y2,
      // Normalized coords for drawing (0-1 range)
      x: x1 / imgW,
      y: y1 / imgH,
      w: (x2 - x1) / imgW,
      h: (y2 - y1) / imgH,
    });
  }

  // Debug log: max confidence per class (check browser console)
  console.log('🔍 Max confidence per class:',
    CLASS_LABELS.map((l, i) => `${l}: ${(maxScoresPerClass[i] * 100).toFixed(1)}%`).join(' | ')
  );


  // Apply NMS
  const filtered = nms(candidates, IOU_THRESHOLD);

  // Assign IDs
  return filtered.map((d, i) => ({ ...d, id: i }));
}

/* ── Run full inference ───────────────────────────── */
async function runInference(img) {
  const session = await loadModel();
  const { tensor, scale, padX, padY } = preprocessImage(img);

  const feeds = {};
  feeds[session.inputNames[0]] = tensor;
  const results = await session.run(feeds);
  const output  = results[session.outputNames[0]];

  return postprocess(output, scale, padX, padY, img.naturalWidth, img.naturalHeight);
}

/* ── Draw original (no boxes) ─────────────────────── */
function drawOriginal(canvas, img) {
  if (!canvas || !img) return;
  const ctx = canvas.getContext('2d');
  const cw  = canvas.width;
  const ch  = canvas.height;
  const sc  = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
  const dw  = img.naturalWidth  * sc;
  const dh  = img.naturalHeight * sc;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
}

/* ── Draw detections with segmentation-style overlays ─ */
function drawDetections(canvas, img, detections) {
  if (!canvas || !img) return;
  const ctx   = canvas.getContext('2d');
  const cw    = canvas.width;
  const ch    = canvas.height;
  const sc    = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
  const drawW = img.naturalWidth  * sc;
  const drawH = img.naturalHeight * sc;
  const offX  = (cw - drawW) / 2;
  const offY  = (ch - drawH) / 2;

  // Draw image
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, offX, offY, drawW, drawH);

  // Slight dark overlay for contrast
  ctx.fillStyle = 'rgba(0,0,20,0.15)';
  ctx.fillRect(offX, offY, drawW, drawH);

  // ── Crosshair / scan lines ──
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1;
  const scanY = offY + drawH * 0.30;
  ctx.beginPath();
  ctx.moveTo(offX, scanY);
  ctx.lineTo(offX + drawW, scanY);
  ctx.stroke();
  const scanX = offX + drawW * 0.25;
  ctx.beginPath();
  ctx.moveTo(scanX, offY);
  ctx.lineTo(scanX, offY + drawH);
  ctx.stroke();
  ctx.setLineDash([]);

  canvas._boxes = [];

  // Sort: draw Person boxes first (behind), then smaller boxes on top
  const sorted = [...detections].sort((a, b) => {
    const order = { 'Person': 0, 'Upper-Body': 1, 'Vest': 2, 'No-Vest': 2, 'Helmet': 3, 'No-Helmet': 3 };
    return (order[a.cls] ?? 3) - (order[b.cls] ?? 3);
  });

  sorted.forEach(d => {
    const cfg = CLASSES[d.cls] || { color: '#fff', fill: 'rgba(255,255,255,0.1)', border: '#fff' };
    const bx  = offX + d.x * drawW;
    const by  = offY + d.y * drawH;
    const bw  = d.w  * drawW;
    const bh  = d.h  * drawH;

    // ── Segmentation-style fill overlay ──
    ctx.fillStyle = cfg.fill;
    const r = Math.min(4, bw * 0.02, bh * 0.02);
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, r);
    ctx.fill();

    // ── Glow effect ──
    ctx.shadowColor = cfg.color;
    ctx.shadowBlur  = d.cls === 'Person' ? 8 : 14;

    // ── Border box ──
    ctx.strokeStyle = cfg.border;
    ctx.lineWidth   = d.cls === 'Person' ? 2 : 2.5;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, r);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // ── Corner accents (premium look) ──
    const cornerLen = Math.min(12, bw * 0.15, bh * 0.15);
    ctx.strokeStyle = cfg.color;
    ctx.lineWidth   = 3;
    ctx.beginPath();
    ctx.moveTo(bx, by + cornerLen); ctx.lineTo(bx, by); ctx.lineTo(bx + cornerLen, by);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx + bw - cornerLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cornerLen);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx, by + bh - cornerLen); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + cornerLen, by + bh);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx + bw - cornerLen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cornerLen);
    ctx.stroke();

    // ── Label pill ──
    const label = `${d.cls} ${d.conf}%`;
    ctx.font = 'bold 11px Inter, system-ui, sans-serif';
    const tw  = ctx.measureText(label).width;
    const lh  = 18;
    const ly  = by - lh - 2 < offY ? by + 2 : by - lh - 2;

    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur  = 6;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = cfg.color;
    ctx.beginPath();
    ctx.roundRect(bx, ly, tw + 14, lh, 3);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = '#fff';
    ctx.fillText(label, bx + 7, ly + 13);

    canvas._boxes.push({ ...d, bx, by, bw, bh, cfg, label: `${d.cls} ${d.conf}%` });
  });

  // ── Detection count ──
  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = 'rgba(59,130,246,0.6)';
  ctx.fillText(`${detections.length} objects detected`, offX + drawW - 130, offY + drawH - 10);

  // ── Detection count badge (top-right) ──
  const persons = detections.filter(d => d.cls === 'Person').length;
  const violations = detections.filter(d => d.cls === 'No-Helmet' || d.cls === 'No-Vest').length;
  const badgeText = `${persons} persons · ${violations} violations`;
  ctx.font = 'bold 10px Inter, system-ui, sans-serif';
  const btw = ctx.measureText(badgeText).width;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath();
  ctx.roundRect(offX + drawW - btw - 24, offY + 8, btw + 16, 22, 4);
  ctx.fill();
  ctx.fillStyle = violations > 0 ? '#f87171' : '#4ade80';
  ctx.fillText(badgeText, offX + drawW - btw - 16, offY + 23);
}

/* ── Main component ───────────────────────────────── */
export default function DetectionPage() {
  const { t } = useLang();

  const [file,        setFile]       = useState(null);
  const [imgURL,      setImgURL]     = useState(null);
  const [stage,       setStage]      = useState('idle');
  const [progress,    setProgress]   = useState(0);
  const [error,       setError]      = useState('');
  const [detections,  setDetections] = useState([]);
  const [hoveredBox,  setHoveredBox] = useState(null);
  const [latency,     setLatency]    = useState(null);
  const [isDragOver,  setDragOver]   = useState(false);
  const [modelStatus, setModelStatus] = useState('');

  const inputRef     = useRef(null);
  const origCanRef   = useRef(null);
  const detCanRef    = useRef(null);
  const loadedImgRef = useRef(null);

  /* Preload model on mount */
  useEffect(() => {
    setModelStatus('Loading AI model...');
    loadModel((msg) => setModelStatus(msg))
      .then(() => setModelStatus('Model ready'))
      .catch(() => setModelStatus('Model load failed — will retry on detect'));
  }, []);

  /* Draw canvases after React commits the DOM */
  useEffect(() => {
    if (stage !== 'done') return;
    const img = loadedImgRef.current;
    if (!img) return;

    let cancelled = false;
    let attempts = 0;

    const tryDraw = () => {
      if (cancelled) return;
      attempts++;
      const origCan = origCanRef.current;
      const detCan  = detCanRef.current;
      if (origCan && detCan) {
        drawOriginal(origCan, img);
        drawDetections(detCan, img, detections);
        return;
      }
      if (attempts < 30) requestAnimationFrame(tryDraw);
    };

    requestAnimationFrame(tryDraw);
    return () => { cancelled = true; };
  }, [stage, detections]);

  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_MB  = 10;
  const validateFile = (f) => {
    if (!ALLOWED.includes(f.type)) return 'Only JPEG, PNG, or WebP files are allowed.';
    if (f.size > MAX_MB * 1024 * 1024) return `File too large. Max ${MAX_MB} MB.`;
    return null;
  };

  /* Inference pipeline — NOW USES REAL ONNX MODEL */
  const startInference = useCallback(async (dataURL) => {
    setStage('inferring');
    setProgress(10);
    setModelStatus('Running inference...');
    const t0 = performance.now();

    try {
      // Load image
      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = dataURL;
      });

      loadedImgRef.current = img;
      setProgress(30);

      // Run real ONNX inference
      const dets = await runInference(img);

      const ms = Math.round(performance.now() - t0);
      setLatency(ms);
      setProgress(100);
      setDetections(dets);

      // Save real detected violations to localStorage
      const violations = dets.filter(d => d.cls === 'No-Helmet' || d.cls === 'No-Vest');
      if (violations.length > 0) {
        try {
          const pad = (n) => String(n).padStart(2, '0');
          const now = new Date();
          const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
          const existing = JSON.parse(localStorage.getItem('safesite_real_violations') || '[]');
          const newEntries = violations.map((v, i) => ({
            id: `V-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
            time: timeStr,
            camera: 'Live Upload Scan',
            type: v.cls === 'No-Helmet' ? 'No Helmet' : 'No Vest',
            confidence: v.conf / 100,
            zone: 'Detected Image Area',
            severity: v.cls === 'No-Helmet' ? 'critical' : 'high',
            worker: 'Detected Subject',
            thumbnail: v.cls === 'No-Helmet' ? '🪖' : '🦺'
          }));
          localStorage.setItem('safesite_real_violations', JSON.stringify([...newEntries, ...existing]));
        } catch (e) {
          console.error('Failed to save violations:', e);
        }
      }

      setModelStatus(`Detected ${dets.length} objects in ${ms}ms`);
      setStage('done');

    } catch (err) {
      console.error('Inference error:', err);
      setError(`Detection failed: ${err.message}`);
      setModelStatus('Inference error');
      setStage('error');
    }
  }, []);

  /* File processing */
  const processFile = useCallback((f) => {
    const err = validateFile(f);
    if (err) { setError(err); setStage('error'); return; }

    setFile(f);
    setError('');
    setHoveredBox(null);
    setDetections([]);
    loadedImgRef.current = null;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataURL = ev.target.result;
      setImgURL(dataURL);
      setStage('uploading');
      setProgress(0);

      let p = 0;
      const uv = setInterval(() => {
        p += Math.random() * 20 + 10;
        if (p >= 100) {
          clearInterval(uv);
          setProgress(100);
          startInference(dataURL);
          return;
        }
        setProgress(p);
      }, 70);
    };
    reader.readAsDataURL(f);
  }, [startInference]);

  /* Canvas hover tooltip */
  const handleCanvasMove = (e) => {
    const canvas = detCanRef.current;
    if (!canvas || !canvas._boxes) return;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx     = (e.clientX - rect.left) * scaleX;
    const my     = (e.clientY - rect.top)  * scaleY;
    const hit    = [...canvas._boxes].reverse().find(b =>
      mx >= b.bx && mx <= b.bx + b.bw &&
      my >= b.by && my <= b.by + b.bh
    );
    setHoveredBox(hit || null);
  };

  /* Drag & Drop */
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };

  /* Reset */
  const reset = () => {
    setFile(null); setImgURL(null); setStage('idle');
    setProgress(0); setDetections([]); setHoveredBox(null);
    setError(''); setLatency(null);
    loadedImgRef.current = null;
    if (inputRef.current) inputRef.current.value = '';
  };

  const violations  = detections.filter(d => d.cls === 'No-Helmet' || d.cls === 'No-Vest');
  const hasViolation = violations.length > 0;
  const isCompliant  = stage === 'done' && !hasViolation;
  const personCount  = detections.filter(d => d.cls === 'Person').length;
  const helmetCount  = detections.filter(d => d.cls === 'Helmet').length;
  const vestCount    = detections.filter(d => d.cls === 'Vest').length;

  /* ── Render ──────────────────────────────────────── */
  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">{t('page.detect')}</h1>
            <p className="page-subtitle">{t('page.detect.sub')}</p>
          </div>
          {stage === 'done' && (
            <button className="btn btn-ghost btn-sm" onClick={reset}>
              <RefreshCw size={14}/> New Detection
            </button>
          )}
        </div>
      </div>

      {/* ── Upload Zone (idle) ── */}
      {stage === 'idle' && (
        <>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
            aria-label="Upload image for PPE detection"
            style={{
              border: `2px dashed ${isDragOver ? 'var(--accent-orange)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-xl)',
              padding: '64px 32px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragOver ? 'rgba(249,115,22,0.05)' : 'var(--color-surface)',
              transition: 'all 0.25s ease',
              marginBottom: 24,
              userSelect: 'none',
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }}
            />
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: isDragOver ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', transition: 'all 0.25s' }}>
              <Upload size={32} style={{ color: isDragOver ? 'var(--accent-orange)' : 'var(--text-muted)' }}/>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{t('detect.drop')}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>{t('detect.or')}</div>
            <div className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
              <ImageIcon size={16}/> {t('detect.browse')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14 }}>{t('detect.formats')}</div>
          </div>

          {/* Info cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
            {[
              { icon: <Shield size={20}/>,     color: 'var(--accent-green)',  title: 'PPE Detection',    desc: 'Helmet, Vest, Person — 5 classes' },
              { icon: <Zap size={20}/>,         color: 'var(--accent-orange)', title: '90 FPS Inference', desc: 'YOLOv8m ONNX Runtime' },
              { icon: <BarChart2 size={20}/>,   color: 'var(--accent-blue)',   title: '83% mAP@0.5',      desc: 'Validated on test dataset' },
              { icon: <CheckCircle size={20}/>, color: 'var(--accent-cyan)',   title: 'OSHA Ready',       desc: '29 CFR 1926 compliance reports' },
            ].map((c, i) => (
              <div key={i} className="glass-card hover-lift" style={{ padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: c.color }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Error ── */}
      {stage === 'error' && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.06)' }}>
          <AlertTriangle size={24} style={{ color: 'var(--accent-red)', flexShrink: 0 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-red)' }}>Upload Failed</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{error}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={reset}><X size={14}/> Retry</button>
        </div>
      )}

      {/* ── Progress ── */}
      {(stage === 'uploading' || stage === 'inferring') && (
        <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
          {imgURL && (
            <div style={{ marginBottom: 20, borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: 200, display: 'flex', justifyContent: 'center', background: '#000' }}>
              <img src={imgURL} alt="Processing" style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain' }}/>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stage === 'uploading'
                ? <Upload size={20} style={{ color: 'var(--accent-orange)', animation: 'pulse 1.2s ease-in-out infinite' }}/>
                : <Zap    size={20} style={{ color: 'var(--accent-orange)', animation: 'pulse 1.2s ease-in-out infinite' }}/>}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                {stage === 'uploading' ? 'Uploading image…' : t('detect.analyzing')}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {stage === 'uploading'
                  ? `${file?.name || 'image'} — preparing for inference`
                  : 'Running YOLOv8m inference pipeline'}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>
              {Math.round(progress)}%
            </div>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', borderRadius: 100, background: 'linear-gradient(90deg,#f97316,#fb923c)', transition: 'width 0.1s ease' }}/>
          </div>
          <div style={{ display: 'flex', marginTop: 16 }}>
            {['Capture', 'Pre-process', 'YOLOv8m', 'NMS', 'Render'].map((s, i) => {
              const pct    = (i + 1) * 20;
              const done   = stage === 'inferring' && progress >= pct;
              const active = stage === 'inferring' && progress >= pct - 20;
              return (
                <div key={s} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: done ? 'var(--accent-orange)' : active ? 'var(--text-secondary)' : 'var(--text-muted)', fontWeight: active || done ? 700 : 400 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: done ? 'var(--accent-orange)' : 'var(--color-border)', margin: '0 auto 4px' }}/>
                  {s}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {stage === 'done' && (
        <>
          {/* Side-by-side canvases */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {/* Original */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ImageIcon size={14} style={{ color: 'var(--text-muted)' }}/>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{t('detect.original')}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{file?.name}</span>
              </div>
              <canvas
                ref={origCanRef}
                width={640}
                height={480}
                style={{ width: '100%', height: 'auto', display: 'block', background: '#000' }}
              />
            </div>

            {/* Processed */}
            <div className="glass-card" style={{ overflow: 'hidden', position: 'relative' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Eye size={14} style={{ color: 'var(--accent-orange)' }}/>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{t('detect.processed')}</span>
                <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: 10 }}>YOLOv8m</span>
              </div>
              <div style={{ position: 'relative' }}>
                <canvas
                  ref={detCanRef}
                  width={640}
                  height={480}
                  style={{ width: '100%', height: 'auto', display: 'block', background: '#000', cursor: 'crosshair' }}
                  onMouseMove={handleCanvasMove}
                  onMouseLeave={() => setHoveredBox(null)}
                />
                {hoveredBox && (
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', border: `1px solid ${hoveredBox.cfg.color}`, borderRadius: 'var(--radius-md)', padding: '8px 14px', pointerEvents: 'none', zIndex: 10 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Detected</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: hoveredBox.cfg.color }}/>
                      <span style={{ fontWeight: 800, fontSize: 15, color: hoveredBox.cfg.color }}>{hoveredBox.cls}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#fff', fontWeight: 700 }}>{hoveredBox.conf}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metrics row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div className="glass-card" style={{ padding: 20, gridColumn: 'span 2', background: isCompliant ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${isCompliant ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.35)'}`, display: 'flex', alignItems: 'center', gap: 14 }}>
              {isCompliant
                ? <CheckCircle size={32} style={{ color: 'var(--accent-green)', flexShrink: 0 }}/>
                : <AlertTriangle size={32} style={{ color: 'var(--accent-red)', flexShrink: 0, animation: 'pulse-red 1.2s ease-in-out infinite' }}/>}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Safety Status</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: isCompliant ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {isCompliant ? t('detect.compliant') : t('detect.violation')}
                </div>
                {!isCompliant && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{violations.length} violation{violations.length > 1 ? 's' : ''} found</div>}
              </div>
            </div>

            <div className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                <Layers size={11} style={{ display: 'inline', marginRight: 4 }}/>{t('detect.detections')}
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--accent-orange)' }}>{detections.length}</div>
            </div>

            <div className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                <Clock size={11} style={{ display: 'inline', marginRight: 4 }}/>{t('detect.latency')}
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--accent-cyan)' }}>{latency}<span style={{ fontSize: 14, fontWeight: 400 }}>ms</span></div>
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Persons',     count: personCount,                     color: '#3b82f6' },
              { label: 'Helmets',     count: helmetCount,                     color: '#10b981' },
              { label: 'No Helmets',  count: detections.filter(d => d.cls === 'No-Helmet').length,  color: '#e11d48' },
              { label: 'Vests',       count: vestCount,                       color: '#f59e0b' },
              { label: 'No Vests',    count: detections.filter(d => d.cls === 'No-Vest').length,    color: '#f97316' },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${s.color}25` }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.count}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Per-class breakdown bars */}
          <div className="glass-card" style={{ marginBottom: 20 }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart2 size={15} style={{ color: 'var(--accent-orange)' }}/>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Detection Breakdown</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{detections.length} total</span>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {detections.filter(d => d.cls !== 'Head').map(d => {
                const cfg = CLASSES[d.cls] || { color: '#fff' };
                return (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: cfg.color, flexShrink: 0 }}/>
                    <span style={{ fontSize: 13, fontWeight: 600, width: 100, flexShrink: 0 }}>{d.cls}</span>
                    <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ width: `${d.conf}%`, height: '100%', background: cfg.color, borderRadius: 100, transition: 'width 0.6s ease' }}/>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)', fontWeight: 700, width: 50, textAlign: 'right' }}>
                      {d.conf}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
