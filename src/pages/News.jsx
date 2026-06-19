import { Link } from 'react-router-dom';

const articles = [
  {
    id: 1,
    title: 'Xu hướng nội thất 2026: Tối giản nhưng ấm cúng',
    summary: 'Phong cách Japandi tiếp tục thống trị với gam màu trung tính, chất liệu gỗ tự nhiên và thiết kế tối giản mà vẫn ấm áp.',
    date: '15/06/2026',
    tag: 'Xu hướng',
  },
  {
    id: 2,
    title: '5 cách chọn sofa phù hợp cho phòng khách nhỏ',
    summary: 'Phòng khách nhỏ không có nghĩa là bạn phải từ bỏ chiếc sofa thoải mái. Hãy cùng tìm hiểu 5 mẹo giúp bạn chọn đúng sofa.',
    date: '10/06/2026',
    tag: 'Mẹo hay',
  },
  {
    id: 3,
    title: 'MOCA Living khai trương showroom mới tại Quận 7',
    summary: 'Showroom rộng 500m² trưng bày đầy đủ các dòng sản phẩm mới nhất, mở cửa đón khách từ ngày 01/07/2026.',
    date: '05/06/2026',
    tag: 'Tin tức',
  },
  {
    id: 4,
    title: 'Hướng dẫn bảo quản đồ gỗ đúng cách',
    summary: 'Để đồ nội thất gỗ luôn bền đẹp theo thời gian, bạn cần lưu ý những điều sau trong quá trình sử dụng và vệ sinh.',
    date: '28/05/2026',
    tag: 'Mẹo hay',
  },
];

const tagColors = {
  'Xu hướng': { bg: '#eff6ff', color: '#2563eb' },
  'Mẹo hay': { bg: '#ecfdf5', color: '#059669' },
  'Tin tức': { bg: '#fff7ed', color: '#ea580c' },
};

export default function News() {
  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        <nav style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>Trang chủ</Link>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: 500 }}>Tin tức</span>
        </nav>

        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 4, height: 22, background: '#2563eb', borderRadius: 2, display: 'inline-block' }} />
          Tin Tức & Cảm Hứng
        </h1>

        <div style={{ display: 'grid', gap: 14 }}>
          {articles.map(article => {
            const tc = tagColors[article.tag] || tagColors['Tin tức'];
            return (
              <article key={article.id} style={{
                background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
                padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'flex-start',
                transition: 'box-shadow .15s', cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.06)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: tc.bg, color: tc.color }}>{article.tag}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{article.date}</span>
                  </div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8, lineHeight: 1.4 }}>{article.title}</h2>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{article.summary}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 }}>
          Đang cập nhật thêm bài viết mới...
        </div>
      </div>
    </div>
  );
}
