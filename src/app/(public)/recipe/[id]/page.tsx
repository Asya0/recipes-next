import Header from "@/components/Header";
import RecipePageContent from "./RecipePageContent";

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

  return (
    <>
      <Header />
      <RecipePageContent recipeId={id} />
    </>
  );
}
