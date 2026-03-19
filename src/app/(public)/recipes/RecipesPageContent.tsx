"use client";

import { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { motion, AnimatePresence } from "motion/react";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "./RecipesPageContent.module.scss";
import {
  Button,
  Loading,
  SearchBar,
  ErrorMessage,
  RecipeCard,
  FiltersBar,
  Pagination,
} from "@/components";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/RootStore/RootStoreContext";
import { usePagination } from "@/hooks/usePagination";
import { useFavorites } from "@/hooks/useFavorites";
import { Category, Pagination as PaginationMeta, Recipe } from "@/api/recipes";

interface Props {
  initialRecipes?: Recipe[];
  initialPagination?: PaginationMeta;
  initialCategories?: Category[];
}

const RecipesPageContent = observer(
  ({
    initialRecipes = [],
    initialPagination,
    initialCategories = [],
  }: Props) => {
    const { recipesStore, queryParamsStore } = useStore();
    const [searchInput, setSearchInput] = useState(queryParamsStore.search);

    const { handlePageChange } = usePagination({
      totalPages: recipesStore.totalPages,
      currentPage: recipesStore.currentPage,
      onPageChange: (page) => {
        queryParamsStore.setPage(page);
      },
      scrollToTop: true,
    });
    const { isSaved, toggleSave } = useFavorites();
    const debouncedSearch = useDebounce(searchInput, 500);
    const router = useRouter();

    useEffect(() => {
      recipesStore.setInitialData({
        recipes: initialRecipes,
        pagination: initialPagination,
        categories: initialCategories,
      });
    }, []);

    useEffect(() => {
      recipesStore.setPage(queryParamsStore.page);

      recipesStore.fetchRecipes({
        page: queryParamsStore.page,
        search: queryParamsStore.search,
        categoryId: queryParamsStore.category || null,
        vegetarian: queryParamsStore.vegetarian,
      });
    }, [
      recipesStore,
      queryParamsStore.page,
      queryParamsStore.search,
      queryParamsStore.category,
      queryParamsStore.vegetarian,
    ]);

    useEffect(() => {
      setSearchInput(queryParamsStore.search);
    }, [queryParamsStore.search]);

    useEffect(() => {
      if (debouncedSearch === queryParamsStore.search) {
        return;
      }

      queryParamsStore.setSearch(debouncedSearch);
      queryParamsStore.setPage(1);
    }, [debouncedSearch, queryParamsStore]);

    const handleFilterChange = (
      key: string,
      value: string | boolean | null,
    ) => {
      if (key === "categoryId") {
        queryParamsStore.setFilter("category", value ?? "");
      }

      if (key === "vegetarian") {
        queryParamsStore.setFilter("vegetarian", value);
      }

      queryParamsStore.setPage(1);
    };

    const handleSearchChange = (value: string) => {
      setSearchInput(value);
    };

    const handleSearchSubmit = useCallback(() => {
      queryParamsStore.setSearch(searchInput);
      queryParamsStore.setPage(1);
    }, [queryParamsStore, searchInput]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSearchSubmit();
        }
      },
      [handleSearchSubmit],
    );

    const handleRandomRecipe = () => {
      if (recipesStore.recipes.length === 0) {
        return;
      }

      const randomIndex = Math.floor(
        Math.random() * recipesStore.recipes.length,
      );
      const randomRecipe = recipesStore.recipes[randomIndex];

      router.push(`/recipe/${randomRecipe.documentId}`);
    };

    if (recipesStore.error) {
      return (
        <ErrorMessage error={recipesStore.error}>
          <Button
            onClick={() => {
              recipesStore.fetchRecipes({
                page: queryParamsStore.page,
                search: queryParamsStore.search,
                categoryId: queryParamsStore.category || null,
                vegetarian: queryParamsStore.vegetarian,
              });
            }}
          >
            Try again
          </Button>
        </ErrorMessage>
      );
    }

    return (
      <div className={styles["recipes-page"]}>
        <div className={styles["recipes-page__banner"]}>
          <Image
            src="/assets/header-bg.png"
            fill
            priority
            alt="recipes"
            className={styles["recipes-page__bannerImage"]}
          />
        </div>

        <div className={styles["recipes-page__infoContainer"]}>
          <span className={styles["recipes-page__info"]}>
            Find the perfect food and{" "}
            <span className={styles["recipes-page__infoUnderlined"]}>
              drink ideas
            </span>{" "}
            for every occasion, from{" "}
            <span className={styles["recipes-page__infoUnderlined"]}>
              weeknight dinners
            </span>{" "}
            to
            <span className={styles["recipes-page__infoUnderlined"]}>
              {" "}
              holiday feasts
            </span>
            .
          </span>
        </div>

        <div className={styles["recipes-page__actions"]}>
          <Button
            onClick={handleRandomRecipe}
            disabled={recipesStore.recipes.length === 0}
          >
            Random recipes
          </Button>
        </div>

        <div className={styles["recipes-page__content"]}>
          <SearchBar
            placeholder="Enter dishes"
            value={searchInput}
            onChange={handleSearchChange}
            onSearch={handleSearchSubmit}
            onKeyDown={handleKeyDown}
          />

          <FiltersBar
            filters={{
              categoryId: queryParamsStore.category || null,
              vegetarian: queryParamsStore.vegetarian,
            }}
            onChange={handleFilterChange}
          />

          {recipesStore.recipes.length === 0 && !recipesStore.isLoading && (
            <div className={styles["recipes-page__notFound"]}>
              Nothing was found for your query :с
            </div>
          )}

          <motion.div layout className={styles["recipes-page__grid"]}>
            <AnimatePresence mode="popLayout">
              {recipesStore.recipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                >
                  <RecipeCard
                    recipe={recipe}
                    imageUrl={
                      recipe.images?.[0]?.formats?.small?.url ||
                      recipe.images?.[0]?.url
                    }
                    isSaved={isSaved(recipe.documentId || recipe.id)}
                    onSave={() => toggleSave(recipe)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {recipesStore.totalPages > 1 && (
              <motion.div
                className={styles["recipes-page__paginationSticky"]}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
              >
                <Pagination
                  currentPage={recipesStore.currentPage}
                  totalPages={recipesStore.totalPages}
                  onPageChange={handlePageChange}
                  className={styles["recipes-page__pagination"]}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
);
export default RecipesPageContent;
