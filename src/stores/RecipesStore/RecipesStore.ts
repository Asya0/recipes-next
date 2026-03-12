// список рецептов
// один выбранный рецепт
// список категорий
// loading и error
import { makeAutoObservable, runInAction } from "mobx";
import { fetchRecipeById, fetchRecipes, fetchCategories } from "@/api/recipesApi";
import { Category, Recipe } from "@/api/recipes";

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
  categoriesError = '';

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
  clearSelectedRecipe() {
    this.selectedRecipe = null;
    this.recipeError = "";
  }

  async fetchRecipes() {
    this.isLoading = true;
    this.error = '';

    try {
        const response = await fetchRecipes({page: this.currentPage,});

            runInAction(() => {
                this.recipes = response.data;
                this.totalPages = response.meta.pagination.pageCount;
            })
    } catch(error) {
        runInAction(()=> {
            this.error = 'Не удалось загрузить рецепты';
            this.recipes = [];
        })
    } finally {
        runInAction(() => {
            this.isLoading = false;
        })
    }
  }
  async fetchCategories() {
    this.categoriesLoading = true;
    this.categoriesError = '';

    try {
      const categories =await fetchCategories();

      runInAction(() => {
        this.categories = categories;
      });
    } catch(error) {
      runInAction(() => {
        this.categoriesError = "Не удалось загрузить категории"
        this.categories = [];
      })
    } finally {
      runInAction(() => {
        this.categoriesLoading = false;
      })
    }
  }

  setPage(page: number) {
    this.currentPage = page;
  }
}
