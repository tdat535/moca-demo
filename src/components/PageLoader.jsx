import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(30);

    const t1 = setTimeout(() => setProgress(60), 100);
    const t2 = setTimeout(() => setProgress(80), 200);
    const t3 = setTimeout(() => setProgress(100), 350);
    const t4 = setTimeout(() => setLoading(false), 500);

    window.scrollTo({ top: 0, behavior: 'instant' });

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, height: 3 }}>
      <div style={{
        height: '100%',
        background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
        width: `${progress}%`,
        transition: 'width 0.2s ease',
        borderRadius: '0 2px 2px 0',
        boxShadow: '0 0 8px rgba(37,99,235,.4)',
      }} />
    </div>
  );
}
