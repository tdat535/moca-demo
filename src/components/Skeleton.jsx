const pulseStyle = {
  background: 'linear-gradient(90deg, #f4f1ec 25%, #e8e3dc 50%, #f4f1ec 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeletonPulse 1.5s ease-in-out infinite',
  borderRadius: 8,
};

export function ProductCardSkeleton() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      {/* Image placeholder */}
      <div style={{ ...pulseStyle, aspectRatio: '1', borderRadius: 0 }} />
      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        {/* Title line 1 */}
        <div style={{ ...pulseStyle, height: 14, width: '90%', marginBottom: 8 }} />
        {/* Title line 2 */}
        <div style={{ ...pulseStyle, height: 14, width: '60%', marginBottom: 14 }} />
        {/* Price */}
        <div style={{ ...pulseStyle, height: 18, width: '45%', marginBottom: 10 }} />
        {/* Rating bar */}
        <div style={{ borderTop: '1px solid #e8e3dc', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ ...pulseStyle, height: 12, width: '30%' }} />
          <div style={{ ...pulseStyle, height: 12, width: '25%' }} />
        </div>
      </div>
      <style>{`@keyframes skeletonPulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

export default ProductCardSkeleton;
