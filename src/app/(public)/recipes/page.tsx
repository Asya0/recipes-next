// import { getQueryClient } from '@/lib/getQueryClient';
// import { recipeKeys } from '@/hooks/useRecipes';
// import { fetchRecipes, fetchCategories } from '@/api/recipesApi';
// import RecipesPageContent from './RecipesPageContent';
// import { Suspense } from 'react';
// import Header from '@/components/Header';

// export const metadata = {
//   title: 'Рецепты | Поиск идеальных блюд',
// };

// export default async function RecipesPage() {
//   const queryClient = getQueryClient();

//   await Promise.all([
//     queryClient.prefetchQuery({
//       queryKey: recipeKeys.list({ page: 1 }),
//       queryFn: () => fetchRecipes({ page: 1 }),
//     }),
//     queryClient.prefetchQuery({
//       queryKey: recipeKeys.categories,
//       queryFn: fetchCategories,
//     }),
//   ]);

//   return (
//     <>
//       <Header />
//       <Suspense fallback={<div className="loading">Загрузка рецептов...</div>}>
//           <RecipesPageContent />
//       </Suspense>
//     </>
//   );
// }

import { getQueryClient } from '@/lib/getQueryClient';
import { recipeKeys } from '@/hooks/useRecipes';
import { fetchRecipeById } from '@/api/recipesApi';
import { Suspense } from 'react';
import Header from '@/components/Header';
import RecipesPageContent from './RecipesPageContent';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `Рецепт | Страница рецепта`,
  };
}

export default async function RecipePage({ params }: Props) {
  const { id } = params;

  if (!id) {
    return <div>ID рецепта не указан</div>;
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => fetchRecipeById(id),
  });

  return (
    <>
      <Header />
      <Suspense fallback={<div className="loading">Загрузка рецепта...</div>}>
          <RecipesPageContent documentId={id} />
      </Suspense>
    </>
  );
}
