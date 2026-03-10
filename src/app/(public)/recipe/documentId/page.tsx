import { Suspense } from 'react';
import RecipePageContent from './RecipePageContent';
import Header from '@/components/Header';

interface Props {
  params: {
    id: string;
  };
}

export default function RecipePage({ params }: Props) {
  console.log('Recipe page rendered with params:', params);

  const { id } = params;

  if (!id) {
    return <div>ID рецепта не указан</div>;
  }

  return (
    <>
      <Header />
      <Suspense fallback={<div>Загрузка рецепта...</div>}>
        <RecipePageContent documentId={id} />
      </Suspense>
    </>
  );
}
