// список рецептов
// один выбранный рецепт
// список категорий
// loading и error
import { makeAutoObservable, runInAction } from "mobx";
import { fetchRecipeById } from "@/api/recipesApi";
import { Recipe } from "@/api/recipes";

export class RecipesStore {
    selectedRecipe: Recipe | null = null;
    isRecipeLoading = false;
    recipeError = '';

    constructor() {
        makeAutoObservable(this);
    }

    async loadRecipeById(id: string) {
        this.isRecipeLoading = true;
        this.recipeError = '';

        try {
            const recipe = await fetchRecipeById(id);

            runInAction(() => {
                this.selectedRecipe = recipe;
            });
        } catch (error) {
            runInAction(() => {
                this.recipeError = "Не удалось загрузить рецепт";
                this.selectedRecipe = null;
            })
        }finally {
            runInAction(() => {
                this.isRecipeLoading = false;
            })
        }
    }
    clearSelectedRecipe() {
        this.selectedRecipe = null;
        this.recipeError = '';
    }
}