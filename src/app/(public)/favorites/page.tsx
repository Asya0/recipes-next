// 'use client';

import { Suspense } from 'react';
import Header from '@/components/Header';
import FavoritesPageContent from './FavoritesPageContent';

export const metadata = {
  title: 'Избранное | Сохраненные рецепты',
  description: 'Ваши сохраненные рецепты',
};

export default function FavoritesPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="loading">Загрузка избранного...</div>}>
        <FavoritesPageContent />
      </Suspense>
    </>
  );
}
