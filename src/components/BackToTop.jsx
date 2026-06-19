import { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 right-5 z-40 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
      aria-label="Về đầu trang"
    >
      <ChevronUpIcon className="w-5 h-5 text-slate-600" />
    </button>
  );
}
