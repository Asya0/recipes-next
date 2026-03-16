'use client';

import { Button } from '@/components';
import Header from '@/components/Header';
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
    <>
    <Header/>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Something wrong!</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
    </>
  );
}
