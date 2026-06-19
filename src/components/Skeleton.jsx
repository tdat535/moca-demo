const pulseStyle = {
  background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeletonPulse 1.5s ease-in-out infinite',
  borderRadius: 8,
};

export function ProductCardSkeleton() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
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
        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ ...pulseStyle, height: 12, width: '30%' }} />
          <div style={{ ...pulseStyle, height: 12, width: '25%' }} />
        </div>
      </div>
      <style>{`@keyframes skeletonPulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

export default ProductCardSkeleton;
