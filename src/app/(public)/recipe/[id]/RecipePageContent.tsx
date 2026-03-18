"use client";

import { useEffect } from "react";
import DOMPurify from "isomorphic-dompurify"
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./RecipePage.module.scss";
import { BackArrowIcon, Button, ErrorMessage, Loading } from "@/components";
import { RecipeContent } from "./components";
import { RECIPE_INFO_CONFIG, type RecipeInfoItem } from "./config";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/RootStore/RootStoreContext";
import { Recipe } from "@/api/recipes";

interface Props {
  recipeId: string;
  initialRecipe: Recipe;
}

const RecipePageContent = observer(({ recipeId, initialRecipe }: Props) => {
  const router = useRouter();

  const { recipesStore } = useStore();

  const recipe = recipesStore.selectedRecipe;
  const isLoading = recipesStore.isRecipeLoading;
  const error = recipesStore.recipeError;

  useEffect(() => {
    recipesStore.setSelectedRecipe(initialRecipe);

    return () => {
      recipesStore.clearSelectedRecipe();
    };
  }, [initialRecipe, recipesStore]);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return <Loading size="l" color="accent" />;
  }

  if (error) {
    return (
      <ErrorMessage error={error}>
        <Button onClick={handleGoBack}>Back</Button>
      </ErrorMessage>
    );
  }

  if (!recipe) {
    return <div className={styles.recipe__notFound}>Recipe not found</div>;
  }

  const safeSummary = recipe.summary
    ? DOMPurify.sanitize(recipe.summary, {
        ALLOWED_TAGS: [
          "b",
          "strong",
          "i",
          "em",
          "p",
          "br",
          "ul",
          "ol",
          "li",
          "a",
        ],
        ALLOWED_ATTR: ["href", "target", "rel"],
      })
    : "";

  return (
    <div className={styles.recipe}>
      <div className={styles.recipe__breadcrumbs}>
        <div className={styles["recipe__back-arrow"]} onClick={handleGoBack}>
          <BackArrowIcon width={24} height={32} strokeWidth={2} />
        </div>
        <h1 className={styles.recipe__title}>{recipe.name}</h1>
      </div>

      <div className={styles.recipe__main}>
        {recipe.images?.[0] && (
          <div className={styles["recipe__image-wrapper"]}>
            <Image
              src={recipe.images[0].formats?.small?.url || recipe.images[0].url}
              alt={recipe.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.recipe__image}
              priority
            />
          </div>
        )}

        <div className={styles["recipe__info-grid"]}>
          {RECIPE_INFO_CONFIG.map(({ id, label, getValue }: RecipeInfoItem) => (
            <div key={id} className={styles["recipe__info-item"]}>
              <span className={styles["recipe__info-label"]}>{label}</span>
              <span className={styles["recipe__info-value"]}>
                {getValue(recipe)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {recipe.summary && (
        <div className={styles.recipe__description}>
          <div dangerouslySetInnerHTML={{ __html: safeSummary }} />
        </div>
      )}

      <RecipeContent recipe={recipe} />
    </div>
  );
});
export default RecipePageContent;
