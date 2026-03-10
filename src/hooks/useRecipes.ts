import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchRecipes, fetchRecipeById, fetchCategories } from '@/api/recipesApi';
import { Recipe, RecipesResponse } from '@/api/recipes';

export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (params: any) => [...recipeKeys.lists(), params] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  categories: ['categories'] as const,
};

export const useRecipes = (params: {
  page?: number;
  search?: string;
  categoryId?: string | null;
  vegetarian?: boolean | null;
}) => {
  return useQuery({
    queryKey: recipeKeys.list(params),
    queryFn: () => fetchRecipes(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => fetchRecipeById(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: recipeKeys.categories,
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteRecipes = (params: {
  search?: string;
  categoryId?: string | null;
  vegetarian?: boolean | null;
}) => {
  return useInfiniteQuery({
    queryKey: ['recipes', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => fetchRecipes({ ...params, page: pageParam }),
    getNextPageParam: (lastPage: RecipesResponse) => {
      const { page, pageCount } = lastPage.meta.pagination;
      return page < pageCount ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
