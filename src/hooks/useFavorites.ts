import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Recipe } from '@/api/recipes';

const FAVORITES_KEY = 'favorites';

const getFavorites = (): Recipe[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(FAVORITES_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveFavorites = (favorites: Recipe[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
    staleTime: Infinity,
  });

  const toggleFavorite = useMutation({
    mutationFn: async (recipe: Recipe) => {
      const current = getFavorites();
      const exists = current.some((r) => r.id === recipe.id);

      let newFavorites;
      if (exists) {
        newFavorites = current.filter((r) => r.id !== recipe.id);
      } else {
        newFavorites = [...current, recipe];
      }

      saveFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: (newFavorites) => {
      queryClient.setQueryData(['favorites'], newFavorites);
    },
  });

  const isSaved = (recipeId: number | string) => {
    return favorites.some((r) => r.id === recipeId || r.documentId === recipeId);
  };

  return {
    favorites,
    savedCount: favorites.length,
    isSaved,
    toggleSave: toggleFavorite.mutate,
    toggleSaveAsync: toggleFavorite.mutateAsync,
    isLoading: toggleFavorite.isPending,
  };
};
