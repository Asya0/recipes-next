"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import styles from "./FavoritesPage.module.scss";
import { Button, Loading, Card, ErrorMessage, Pagination } from "@/components";
import { useFavorites } from "@/hooks/useFavorites";
import { usePagination } from "@/hooks/usePagination";
import { Recipe } from "@/api/recipes";
import { observer } from "mobx-react-lite";

const PAGE_SIZE = 9;

const FavoritesPageContent = observer(() => {
  const { favorites, isLoading, error, removeFavorite } = useFavorites();
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
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </ErrorMessage>
      </div>
    );
  }

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.contentContainer}>
        <h1 className={styles.pageTitle}>
          Favorite recipes ({favorites.length})
        </h1>

        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>
              You don't have any saved recipes yet.
            </h2>
            <p className={styles.emptyText}>
              Save your favorite recipes to find them quickly later.
            </p>
            <Link href="/recipes">
              <Button className={styles.exploreButton}>Find recipes</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.recipeGrid}>
              <AnimatePresence mode="popLayout">
                {currentRecipes.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Link
                      href={`/recipe/${recipe.documentId}`}
                      className={styles.recipeCardLink}
                    >
                      <Card
                        image={
                          recipe.images?.[0]?.formats?.small?.url ||
                          recipe.images?.[0]?.url ||
                          "/placeholder.jpg"
                        }
                        cookingTime={recipe.cookingTime}
                        title={recipe.name}
                        subtitle={recipe.summary?.replace(/<[^>]*>/g, "")}
                        contentSlot={Math.round(recipe.calories).toString()}
                        actionSlot={
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Button
                              onClick={(e) => handleRemove(recipe, e)}
                              className={styles.removeButton}
                            >
                              Remove
                            </Button>
                          </motion.div>
                        }
                      />
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className={styles["paginationSticky"]}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className={styles.pagination}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default FavoritesPageContent;
