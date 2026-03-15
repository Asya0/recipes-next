import { useStore } from "@/stores/RootStore";

export const useFavorites = () => {
  const {favoritesStore } = useStore();

  return {
    favorites: favoritesStore.favoriteRecipes,
    savedCount: favoritesStore.savedCount,
    isSaved: favoritesStore.isSaved,
    removeFavorite: favoritesStore.removeFavorite,
    toggleSave: favoritesStore.toggleSave,
    isLoading: favoritesStore.isLoading,
    error: favoritesStore.error,

  };
};
