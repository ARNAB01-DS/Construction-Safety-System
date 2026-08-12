# 🛡️ SafeSite AI — Construction PPE Safety Detection System

> **Real-time AI-powered PPE (Personal Protective Equipment) detection for construction sites.**
> Built with React + Vite | YOLOv8m | FastAPI | AWS

---

## 📌 Project Overview

SafeSite AI is a full-stack web platform that uses **YOLOv8m** object detection to monitor construction site workers in real-time, detect PPE violations (missing helmets/vests), and generate OSHA-compliant reports automatically.

---

## 🚀 Live Demo

> Run locally at: `http://localhost:5173`

### Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Administrator | `admin@safesite.ai` | `admin123` |
| Site Manager | `manager@safesite.ai` | `manager123` |
| Safety Officer | `safety@safesite.ai` | `safety123` |
| Demo Viewer | `demo@safesite.ai` | `demo` |

---

## 🧠 ML Model — YOLOv8m

| Metric | Value |
|--------|-------|
| Overall mAP@0.5 | **83%** |
| Inference Speed | **90 FPS** (NVIDIA T4 GPU) |
| Latency | **< 50ms** per frame |
| Classes | 5 (Person, Helmet, No-Helmet, Vest, No-Vest) |
| Framework | Ultralytics YOLOv8m + ONNX Runtime |

---

## 🗂️ Project Structure

```
safesite-ai/
├── public/                  # Static assets
├── src/
│   ├── App.jsx              # Root app + routing + auth
│   ├── index.css            # Global design system
│   ├── main.jsx             # Entry point
│   ├── data/
│   │   └── mockData.js      # Demo violations, cameras, alerts
│   └── pages/
│       ├── LandingPage.jsx  # Public landing page
│       ├── LoginPage.jsx    # Authentication page
│       ├── Dashboard.jsx    # Safety overview + charts
│       ├── LiveFeed.jsx     # Real-time camera feeds
│       ├── ViolationsPage.jsx # Violation log + CSV/PDF export
│       ├── AnalyticsPage.jsx  # Charts & heatmaps
│       ├── ModelPage.jsx    # ML model metrics
│       ├── BusinessPage.jsx # Business plan
│       ├── BudgetPage.jsx   # Budget & ROI
│       ├── ApiDocsPage.jsx  # API documentation
│       └── SettingsPage.jsx # Configuration
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, React Router 7 |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | Vanilla CSS (glassmorphism, dark mode) |
| ML Model | YOLOv8m (Ultralytics) |
| Backend (planned) | FastAPI, PostgreSQL, Redis, Celery |
| Cloud (planned) | AWS ECS Fargate, EC2 G4dn, S3, CloudFront |

---

## 📦 Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/safesite-ai.git
cd safesite-ai

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## ✨ Features

- 🔐 **Authentication** — Login with role-based access (Admin, Manager, Safety Officer)
- 📊 **Dashboard** — KPI cards, violation charts, compliance gauge, camera status
- 🎥 **Live Feed** — Simulated camera feeds with YOLOv8 bounding box overlays
- ⚠️ **Violations Log** — Searchable/filterable table, Export CSV, OSHA PDF Report
- 📈 **Analytics** — Hourly trends, weekly compliance, radar chart, heatmap
- 🤖 **Model & ML** — Per-class metrics, inference pipeline, deployment guide
- 💼 **Business Plan** — ROI calculator, pricing tiers, target users
- 💰 **Budget & ROI** — Phase-wise budget, revenue projections
- 📄 **API Docs** — 10 REST endpoints with WebSocket support
- ⚙️ **Settings** — Profile, alerts, cameras, detection parameters, API keys

---

## 📸 Screenshots

> Login → Dashboard → Live Feed → Violations → Analytics

---

## 📋 OSHA Compliance

This system is designed to support **OSHA 29 CFR 1926 Subpart E** (Personal Protective Equipment) requirements for construction sites. Reports include:
- Violation timeline with annotated frames
- Chain-of-custody document hash
- Corrective action recommendations

---

## 👤 Author

**Arnab Saha** — Capstone Project  
SafeSite AI · 2026
