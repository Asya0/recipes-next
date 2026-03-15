'use client';

import Link from 'next/link';
import { Card, Button } from '@/components';
import { Recipe } from '@/api/recipes';
import styles from './RecipeCard.module.scss';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  onSave: () => void;
  imageUrl?: string;
}

export const RecipeCard = ({ recipe,
   isSaved, onSave, imageUrl
   }: RecipeCardProps) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave();
  };

  const imageSource =
    imageUrl ||
    recipe.images?.[0]?.formats?.small?.url ||
    recipe.images?.[0]?.url ||
    '/placeholder.jpg';

  return (
    <Link href={`/recipe/${recipe.documentId}`} className={styles.link}>
      <Card
        image={imageSource}
        cookingTime={recipe.cookingTime}
        title={recipe.name}
        subtitle={recipe.summary?.replace(/<[^>]*>/g, '')}
        contentSlot={Math.round(recipe.calories).toString()}
        actionSlot={
          <Button onClick={handleSaveClick} className={isSaved ? styles.saved : styles.save}>
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        }
      />
    </Link>
  );
};
