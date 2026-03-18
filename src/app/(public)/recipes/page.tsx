import Header from "@/components/Header";
import RecipesPageContent from "./RecipesPageContent";
import { Category, Pagination, Recipe } from "@/api/recipes";

const API = "https://front-school-strapi.ktsdev.ru";

interface RecipesResponse {
  data: Recipe[];
  meta: {
    pagination: Pagination;
  };
}

interface CategoriesResponse {
  data: Category[];
}

export default async function RecipesPage() {
  const [recipesRes, categoriesRes] = await Promise.all([
    fetch(
      `${API}/api/recipes?populate[0]=images&pagination[page]=1&pagination[pageSize]=12`,
      {
        next: { revalidate: 60 },
      }
    ),
    fetch(`${API}/api/meal-categories?populate=*`, {
      next: { revalidate: 300 },
    }),
  ]);

  if (!recipesRes.ok || !categoriesRes.ok) {
    throw new Error("Failed to fetch initial data");
  }

  const recipesData: RecipesResponse = await recipesRes.json();
  const categoriesData: CategoriesResponse = await categoriesRes.json();

  return (
    <>
      <Header />
      <RecipesPageContent
        initialRecipes={recipesData.data ?? []}
        initialPagination={recipesData.meta?.pagination}
        initialCategories={categoriesData.data ?? []}
      />
    </>
  );
}