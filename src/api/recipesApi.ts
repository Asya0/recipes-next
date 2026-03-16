import apiClient from "@/api/apiClient";
import { Category, Recipe, RecipesResponse } from "./recipes";

const PAGE_SIZE = 9;

const POPULATE_PARAMS = {
  single: [
    "ingradients",
    "equipments",
    "directions.image",
    "images",
    "category",
  ],
  list: ["images"],
};

type StrapiFilters = {
  name?: {
    $containsi: string;
  };
  category?: {
    id: {
      $eq: number;
    };
  };
  vegetarian?: {
    $eq: boolean;
  };
  documentId?: {
    $in: string[];
  };
};

type RecipesQueryParams = {
  populate: string[];
  pagination: {
    page: number;
    pageSize: number;
  };
  filters?: StrapiFilters;
};

export const recipesApi = {
  getRecipeById: async (documentId: string): Promise<Recipe> => {
    const response = await apiClient.get<{ data: Recipe }>(
      `/api/recipes/${documentId}`,
      {
        params: {
          populate: POPULATE_PARAMS.single,
        },
      },
    );
    return response.data.data;
  },

  getRecipes: async (
    page: number = 1,
    pageSize: number = PAGE_SIZE,
    filters?: StrapiFilters,
  ): Promise<RecipesResponse> => {
    const params: RecipesQueryParams = {
      populate: POPULATE_PARAMS.list,
      pagination: {
        page,
        pageSize,
      },
    };

    if (filters) {
      params.filters = filters;
    }

    const response = await apiClient.get<RecipesResponse>("/api/recipes", {
      params,
    });
    return response.data;
  },

  getRecipesByIds: async (
    ids: string[],
    page = 1,
    pageSize = 100,
  ): Promise<RecipesResponse> => {
    const params = {
      populate: POPULATE_PARAMS.list,
      pagination: {
        page,
        pageSize,
      },
      filters: {
        documentId: {
          $in: ids,
        },
      },
    };

    const response = await apiClient.get<RecipesResponse>("/api/recipes", {
      params,
    });
    return response.data;
  },

  searchRecipes: async (
    searchTerm: string,
    page = 1,
    pageSize = PAGE_SIZE,
  ): Promise<RecipesResponse> => {
    const params = {
      populate: POPULATE_PARAMS.list,
      pagination: {
        page,
        pageSize,
      },
      filters: {
        name: {
          $containsi: searchTerm,
        },
      },
    };

    const response = await apiClient.get<RecipesResponse>("/api/recipes", {
      params,
    });
    return response.data;
  },
};

export const fetchRecipes = async (params: {
  page?: number;
  search?: string;
  categoryId?: string | null;
  vegetarian?: boolean | null;
}): Promise<RecipesResponse> => {
  const { page = 1, search = "", categoryId, vegetarian } = params;

  const filters: StrapiFilters = {};

  if (search) {
    filters.name = { $containsi: search };
  }

  if (categoryId) {
    filters.category = { id: { $eq: parseInt(categoryId) } };
  }

  if (vegetarian !== null && vegetarian !== undefined) {
    filters.vegetarian = { $eq: vegetarian };
  }

  return recipesApi.getRecipes(page, 12, filters);
};

export const fetchRecipeById = async (id: string): Promise<Recipe> => {
  return recipesApi.getRecipeById(id);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/api/meal-categories", {
    params: {
      populate: "*",
    },
  });
  return response.data.data;
};
