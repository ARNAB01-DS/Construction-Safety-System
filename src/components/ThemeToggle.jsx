import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        width: 38, height: 38,
        borderRadius: '50%',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: theme === 'dark' ? '#f59e0b' : '#6366f1',
        transition: 'all 0.25s ease',
        flexShrink: 0,
      }}
      className="theme-toggle-btn"
    >
      {theme === 'dark'
        ? <Sun  size={16} style={{ transition: 'transform 0.3s ease' }}/>
        : <Moon size={16} style={{ transition: 'transform 0.3s ease' }}/>}
    </button>
  );
}
