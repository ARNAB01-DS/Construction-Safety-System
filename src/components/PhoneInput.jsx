import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { countries } from '../data/countries';

export default function PhoneInput({ id = 'phone', label = 'Phone Number', defaultCountry = 'BD', value, onChange }) {
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find(c => c.iso === defaultCountry) || countries.find(c => c.iso === 'US')
  );
  const [phone, setPhone] = useState(value || '');
  const [open, setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const [touched, setTouched] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search) ||
    c.iso.toLowerCase().includes(search.toLowerCase())
  );

  const digits = phone.replace(/\D/g, '');
  const isValid = digits.length >= selectedCountry.min && digits.length <= selectedCountry.max;
  const showError = touched && phone.length > 0 && !isValid;
  const showOk    = touched && phone.length > 0 && isValid;

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^0-9\s\-\(\)]/g, '');
    setPhone(val);
    onChange?.({ country: selectedCountry, phone: val, full: selectedCountry.dial + val });
  };

  const handleCountrySelect = (c) => {
    setSelectedCountry(c);
    setOpen(false);
    setSearch('');
    onChange?.({ country: c, phone, full: c.dial + phone });
  };

  return (
    <div style={{ position: 'relative' }} ref={dropRef}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
          {label}
        </label>
      )}

      <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
        {/* Country code selector */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 12px',
            background: 'var(--color-bg-3)',
            border: '1px solid var(--color-border)',
            borderRight: 'none',
            borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            fontSize: 14, fontWeight: 600,
            height: 44,
            whiteSpace: 'nowrap',
            transition: 'background 0.15s',
            minWidth: 90,
          }}
        >
          <span style={{ fontSize: 18 }}>{selectedCountry.flag}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{selectedCountry.dial}</span>
          <ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }}/>
        </button>

        {/* Phone number input */}
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            id={id}
            type="tel"
            value={phone}
            placeholder={`${selectedCountry.min}–${selectedCountry.max} digits`}
            onBlur={() => setTouched(true)}
            onChange={handlePhoneChange}
            style={{
              width: '100%', height: 44,
              padding: '0 40px 0 14px',
              background: 'var(--color-bg-2)',
              border: `1px solid ${showError ? 'var(--accent-red)' : showOk ? 'var(--accent-green)' : 'var(--color-border)'}`,
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              color: 'var(--text-primary)',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'var(--font-mono)',
              transition: 'border-color 0.2s',
            }}
          />
          {showError && <AlertCircle  size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-red)' }}/>}
          {showOk    && <CheckCircle size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)' }}/>}
        </div>
      </div>

      {/* Validation message */}
      {showError && (
        <div style={{ fontSize: 11, color: 'var(--accent-red)', marginTop: 4 }}>
          {selectedCountry.name} numbers require {selectedCountry.min}–{selectedCountry.max} digits (entered: {digits.length})
        </div>
      )}
      {showOk && (
        <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 4 }}>
          ✓ Valid {selectedCountry.name} phone number
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 9999,
          background: 'var(--color-bg-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          width: 300, maxHeight: 320,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Search */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
            <input
              autoFocus
              placeholder="Search country or code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '7px 10px 7px 30px',
                background: 'var(--color-bg-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)', fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No countries found</div>
            )}
            {filtered.map(c => (
              <button
                key={c.iso}
                type="button"
                onClick={() => handleCountrySelect(c)}
                style={{
                  width: '100%', padding: '9px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: c.iso === selectedCountry.iso ? 'rgba(249,115,22,0.1)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  color: c.iso === selectedCountry.iso ? 'var(--accent-orange)' : 'var(--text-secondary)',
                  fontSize: 13, textAlign: 'left',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = c.iso === selectedCountry.iso ? 'rgba(249,115,22,0.1)' : 'transparent'}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{c.flag}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{c.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
