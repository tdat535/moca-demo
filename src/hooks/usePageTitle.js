import { useEffect } from 'react';

const BASE = 'MOCA Living';
const BASE_DESC = 'MOCA Living chuyên cung cấp nội thất hiện đại, chất lượng cao — sofa, bàn ghế, tủ kệ, đèn trang trí và phụ kiện nội thất. Giao hàng toàn quốc.';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : `${BASE} — Nội thất hiện đại, chất lượng cao`;
  }, [title]);
}
