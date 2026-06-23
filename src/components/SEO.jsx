import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://noithatmoca.com';

export default function SEO({ title, description, ogImage }) {
  const fullTitle = title ? `${title} | MOCA Living` : 'MOCA Living — Nội thất hiện đại, chất lượng cao';
  const desc = description || 'MOCA Living chuyên cung cấp nội thất hiện đại, chất lượng cao — sofa, bàn ghế, tủ kệ, đèn trang trí và phụ kiện nội thất. Giao hàng toàn quốc.';
  const image = ogImage || '/og-image.jpg';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={`${BASE_URL}${image}`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={BASE_URL} />
    </Helmet>
  );
}
