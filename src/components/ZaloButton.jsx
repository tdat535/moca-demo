export default function ZaloButton() {
  return (
    <a
      href="https://zalo.me/0934638622"
      target="_blank"
      rel="noopener noreferrer"
      title="Chat Zalo"
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 999,
        width: 56, height: 56, borderRadius: '50%',
        background: '#0068ff', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0,104,255,.4)',
        textDecoration: 'none', transition: 'transform .2s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width="28" height="28" viewBox="0 0 48 48" fill="currentColor">
        <path d="M24 4C12.95 4 4 12.95 4 24c0 6.1 2.7 11.5 7 15.2V44l4.6-2.5c1.3.4 2.7.5 4.1.5h.3c11.05 0 20-8.95 20-20S35.05 4 24 4zm2.2 26.9l-5.1-5.4-9.9 5.5 10.9-11.6 5.2 5.4 9.8-5.4-10.9 11.5z"/>
      </svg>
    </a>
  );
}
