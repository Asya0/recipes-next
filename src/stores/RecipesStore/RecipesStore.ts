import { makeAutoObservable, runInAction } from "mobx";
import {
  fetchRecipeById,
  fetchRecipes,
  fetchCategories,
} from "@/api/recipesApi";
import { Category, Pagination, Recipe, RecipesResponse } from "@/api/recipes";

export class RecipesStore {
  selectedRecipe: Recipe | null = null;
  isRecipeLoading = false;
  recipeError = "";

  recipes: Recipe[] = [];
  isLoading = false;
  error = "";
  currentPage = 1;
  totalPages = 1;

  categories: Category[] = [];
  categoriesLoading = false;
  categoriesError = "";

  constructor() {
    makeAutoObservable(this);
  }

  async loadRecipeById(id: string) {
    this.isRecipeLoading = true;
    this.recipeError = "";

    try {
      const recipe = await fetchRecipeById(id);

      runInAction(() => {
        this.selectedRecipe = recipe;
      });
    } catch (error) {
      runInAction(() => {
        this.recipeError = "Не удалось загрузить рецепт";
        this.selectedRecipe = null;
      });
    } finally {
      runInAction(() => {
        this.isRecipeLoading = false;
      });
    }
  }

  setSelectedRecipe(recipe: Recipe) {
    this.selectedRecipe = recipe;
    this.recipeError = "";
    this.isRecipeLoading = false;
  }

  setInitialRecipes(data: RecipesResponse) {
    this.recipes = data.data;
    this.totalPages = data.meta.pagination.pageCount;
    this.error = "";
    this.isLoading = false;
  }

  setInitialData(data: {
    recipes: Recipe[];
    pagination?: Pagination;
    categories: Category[];
  }) {
    this.recipes = data.recipes;
    this.totalPages = data.pagination?.pageCount ?? 1;
    this.currentPage = data.pagination?.page ?? 1;
    this.categories = data.categories;
    this.error = "";
    this.categoriesError = "";
    this.isLoading = false;
    this.categoriesLoading = false;
  }

  clearSelectedRecipe() {
    this.selectedRecipe = null;
    this.recipeError = "";
  }

  async fetchRecipes(params?: {
    page?: number;
    search?: string;
    categoryId?: string | null;
    vegetarian?: boolean | null;
  }) {
    this.isLoading = true;
    this.error = "";

    try {
      const response = await fetchRecipes({
        page: params?.page ?? this.currentPage,
        search: params?.search ?? "",
        categoryId: params?.categoryId ?? null,
        vegetarian: params?.vegetarian ?? null,
      });

      runInAction(() => {
        this.recipes = response.data;
        this.totalPages = response.meta.pagination.pageCount;
      });
    } catch (error) {
      runInAction(() => {
        this.error = "Не удалось загрузить рецепты";
        this.recipes = [];
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  async fetchCategories() {
    this.categoriesLoading = true;
    this.categoriesError = "";

    try {
      const categories = await fetchCategories();

      runInAction(() => {
        this.categories = categories;
      });
    } catch (error) {
      runInAction(() => {
        this.categoriesError = "Не удалось загрузить категории";
        this.categories = [];
      });
    } finally {
      runInAction(() => {
        this.categoriesLoading = false;
      });
    }
  }

  setPage(page: number) {
    this.currentPage = page;
  }
}
