'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './FavoritesPage.module.scss';
import { Button, Loading, Card, ErrorMessage, Pagination } from '@/components';
import { useFavorites } from '@/hooks/useFavorites';
import { usePagination } from '@/hooks/usePagination';
import { Recipe } from '@/api/recipes';
import { observer } from 'mobx-react-lite';

const PAGE_SIZE = 9;

const FavoritesPageContent = observer(() => {
  const { favorites, isLoading,
     error, removeFavorite 
    } = useFavorites();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(favorites.length / PAGE_SIZE);

  const { handlePageChange } = usePagination({
    totalPages,
    currentPage,
    onPageChange: (page) => setCurrentPage(page),
    scrollToTop: true,
  });

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentRecipes = favorites.slice(startIndex, endIndex);

  useEffect(() => {
  if (totalPages > 0 && currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

  const handleRemove = async (recipe: Recipe, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const recipeId = recipe.documentId || String(recipe.id);
    removeFavorite(recipeId);
  };

  if (isLoading) {
    return (
      <div className={styles.contentContainer}>
        <Loading size="l" color="accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contentContainer}>
        <ErrorMessage error={error}>
          <Button onClick={() => window.location.reload()}>Повторить попытку</Button>
        </ErrorMessage>
      </div>
    );
  }

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.contentContainer}>
        <h1 className={styles.pageTitle}>Сохраненные рецепты ({favorites.length})</h1>

        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>У вас пока нет сохраненных рецептов</h2>
            <p className={styles.emptyText}>
              Сохраняйте понравившиеся рецепты, чтобы быстро находить их потом
            </p>
            <Link href="/recipes">
              <Button className={styles.exploreButton}>Найти рецепты</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.recipeGrid}>
              {currentRecipes.map((recipe: Recipe) => (
                <Link
                  href={`/recipe/${recipe.documentId}`}
                  key={recipe.id}
                  className={styles.recipeCardLink}>
                  <Card
                    image={
                      recipe.images?.[0]?.formats?.small?.url ||
                      recipe.images?.[0]?.url ||
                      '/placeholder.jpg'
                    }
                    cookingTime={recipe.cookingTime}
                    title={recipe.name}
                    subtitle={recipe.summary?.replace(/<[^>]*>/g, '')}
                    contentSlot={Math.round(recipe.calories).toString()}
                    actionSlot={<Button onClick={(e) => handleRemove(recipe, e)} className={styles.removeButton}>Remove</Button>}
                  />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className={styles.pagination}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
})

export default FavoritesPageContent;
