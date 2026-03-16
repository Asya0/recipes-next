import Header from "@/components/Header";
import RecipePageContent from "./RecipePageContent";
import { notFound } from "next/navigation";
import { Recipe } from "@/api/recipes";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

async function getRecipe(id: string): Promise<Recipe | null> {
  const response = await fetch(
    `https://front-school-strapi.ktsdev.ru/api/recipes/${id}?populate[0]=ingradients&populate[1]=equipments&populate[2]=directions.image&populate[3]=images&populate[4]=category`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  return json.data ?? null;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  return {
    title: "Recipe | Recipe page",
  };
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <>
      <Header />
      <RecipePageContent recipeId={id} initialRecipe={recipe} />
    </>
  );
}