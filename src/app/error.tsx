'use client';

import { Button } from '@/components';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Что-то пошло не так!</h2>
      <Button onClick={reset}>Попробовать снова</Button>
    </div>
  );
}
