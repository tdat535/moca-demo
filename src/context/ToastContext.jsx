import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

const ICONS = {
  success: { bg: '#ecfdf5', color: '#059669', path: 'M20 6L9 17l-5-5' },
  error: { bg: '#fef2f2', color: '#dc2626', path: 'M6 18L18 6M6 6l12 12' },
  info: { bg: '#eff6ff', color: '#2563eb', path: 'M12 16v-4m0-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
        {toasts.map(t => {
          const icon = ICONS[t.type] || ICONS.success;
          return (
            <div key={t.id} style={{
              background: '#0f172a', color: '#fff', padding: '12px 18px', borderRadius: 12,
              fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,.2)', pointerEvents: 'auto',
              animation: 'toastIn .25s ease',
              minWidth: 240, maxWidth: 380,
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: icon.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={icon.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon.path} />
                </svg>
              </div>
              {t.message}
            </div>
          );
        })}
      </div>
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
