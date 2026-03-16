import { Suspense } from 'react';
import RecipesPageContent from '@/app/(public)/recipes/RecipesPageContent';
import Header from '@/components/Header';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Recipes | Find Your Perfect Meal',
};

export default function RecipesPage() {
  redirect("/recipes");
  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading recipes...</div>}>
        <RecipesPageContent />
      </Suspense>
    </>
  );
}
