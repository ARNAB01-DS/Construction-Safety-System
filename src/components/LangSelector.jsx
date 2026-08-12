import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function LangSelector() {
  const { lang, setLanguage, languages } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = languages.find(l => l.code === lang) || languages[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        id="lang-selector-btn"
        onClick={() => setOpen(o => !o)}
        style={{
          height: 38,
          padding: '0 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          color: 'var(--text-secondary)',
          fontSize: 13, fontWeight: 600,
          transition: 'all 0.2s ease',
        }}
      >
        <Globe size={14}/>
        <span>{current.flag}</span>
        <span style={{ display: 'none' }} className="lang-name">{current.name}</span>
        <ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}/>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: 'var(--color-bg-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 999,
          minWidth: 150,
        }}>
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => { setLanguage(l.code); setOpen(false); }}
              style={{
                width: '100%', padding: '10px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: lang === l.code ? 'rgba(249,115,22,0.12)' : 'transparent',
                border: 'none', cursor: 'pointer',
                color: lang === l.code ? 'var(--accent-orange)' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: 600,
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ fontSize: 18 }}>{l.flag}</span>
              <span>{l.name}</span>
              {lang === l.code && <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--accent-orange)' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
