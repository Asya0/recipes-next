import Header from "@/components/Header";
import RecipePageContent from "./RecipePageContent";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  return {
    title: `Рецепт | Страница рецепта`,
  };
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params;

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
