import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

const ZaloIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor">
    <path d="M24 4C12.95 4 4 12.95 4 24c0 6.1 2.7 11.5 7 15.2V44l4.6-2.5c1.3.4 2.7.5 4.1.5h.3c11.05 0 20-8.95 20-20S35.05 4 24 4zm2.2 26.9l-5.1-5.4-9.9 5.5 10.9-11.6 5.2 5.4 9.8-5.4-10.9 11.5z"/>
  </svg>
);

export default function ZaloButton() {
  const { settings } = useAdmin();
  const [open, setOpen] = useState(false);

  const phones = [settings.zalo_phone, settings.phone2].filter(Boolean);
  if (phones.length === 0) phones.push(settings.phone1 || '0398945409');

  if (phones.length === 1) {
    return (
      <a href={`https://zalo.me/${phones[0].replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" title="Chat Zalo"
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-[#0068ff] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,104,255,.4)] no-underline hover:scale-110 transition-transform">
        <ZaloIcon />
      </a>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-2">
      {open && phones.map((p, i) => (
        <a key={i} href={`https://zalo.me/${p.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white rounded-full shadow-xl pl-4 pr-2 py-2 no-underline hover:shadow-2xl transition-shadow"
          style={{ animation: 'fadeUp .2s ease' }}>
          <span className="text-sm font-bold text-slate-700">{p}</span>
          <span className="w-10 h-10 rounded-full bg-[#0068ff] text-white flex items-center justify-center shrink-0">
            <ZaloIcon />
          </span>
        </a>
      ))}
      <button onClick={() => setOpen(o => !o)}
        className={`w-14 h-14 rounded-full border-none cursor-pointer text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,104,255,.4)] transition-all ${open ? 'bg-slate-700 rotate-45' : 'bg-[#0068ff]'}`}>
        {open ? <span className="text-2xl font-bold">+</span> : <ZaloIcon />}
      </button>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
