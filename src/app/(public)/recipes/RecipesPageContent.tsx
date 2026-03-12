"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import styles from "./RecipesPageContent.module.scss";
import {
  // Pagination,
  Button,
  Loading,
  // SearchBar,
  ErrorMessage,
  RecipeCard,
  Pagination,
  // FiltersBar,
  // RecipeCard,
} from "@/components";

import Image from "next/image";
import { useStore } from "@/stores/RootStore/RootStoreContext";

const RecipesPageContent = observer(() => {
  const { recipesStore } = useStore();

  useEffect(() => {
    recipesStore.fetchRecipes();
  }, [recipesStore]);

  if (recipesStore.isLoading) {
    return <Loading size="l" color="accent" />;
  }
  if (recipesStore.error) {
    return (
      <ErrorMessage error={recipesStore.error}>
        <Button
          onClick={() => {
            recipesStore.fetchRecipes();
          }}
        >
          Повторить попытку
        </Button>
      </ErrorMessage>
    );
  }

  return (
    <div className={styles["recipes-page"]}>
      <div className={styles["recipes-page__banner"]}>
        <Image
          src="/assets/header-bg.png"
          width={100}
          height={50}
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

      <div className={styles["recipes-page__content"]}>
        {/* <SearchBar
          placeholder="Enter dishes"
          value={searchInput}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
          onKeyDown={handleKeyDown}
        /> */}

        {/* <FiltersBar filters={} onChange={}/> */}

        {recipesStore.recipes.length > 0 && (
              <div className={styles["recipes-page__grid"]}>
                {recipesStore.recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    // imageUrl={recipesStore.getRecipeImageUrl(recipe)}
                    // isSaved={}
                    // onSave={}
                  />
                ))}
              </div>
            )}

        {recipesStore.recipes.length === 0 && !recipesStore.isLoading && (
          <div className={styles["recipes-page__notFound"]}>
            По вашему запросу ничего не найдено :с
          </div>
        )}

        {recipesStore.totalPages > 1 && (
          <Pagination
            currentPage={recipesStore.currentPage}
            totalPages={recipesStore.totalPages}
            // onPageChange={handlePageChange}
            className={styles["recipes-page__pagination"]}
          />
        )}
      </div>
    </div>
  );
});
export default RecipesPageContent;
