'use client';

import { Button } from '@/components';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
      }}>
      <h1>404 - Страница не найдена</h1>
      <p>Извините, запрошенная страница не существует.</p>
      <Link href="/">
        <Button>Вернуться на главную</Button>
      </Link>
    </div>
  );
}
