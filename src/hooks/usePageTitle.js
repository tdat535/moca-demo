import { useEffect } from 'react';

const BASE = 'MOCA Living';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : `${BASE} — Nội thất hiện đại, chất lượng cao`;
  }, [title]);
}
