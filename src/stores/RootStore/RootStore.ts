import { QueryParamsStore } from './QueryParamsStore/QueryParamsStore';
import { FavoritesStore } from '../FavoritesStore/FavoritesStore';
import { RecipesStore } from '../RecipesStore/RecipesStore';

export class RootStore {
  readonly queryParamsStore: QueryParamsStore;
  readonly favoritesStore: FavoritesStore;
  readonly recipesStore: RecipesStore;

  constructor() {
    this.queryParamsStore = new QueryParamsStore();
    this.favoritesStore = new FavoritesStore();
    this.recipesStore = new RecipesStore();
  }
}