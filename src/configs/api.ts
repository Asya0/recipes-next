export const API_CONFIG = {
  baseURL: process.env.VITE_STRAPI_URL,
  token: process.env.VITE_STRAPI_TOKEN,

  endpoints: {
    recipes: "/api/recipes",
    recipesWithPopulate: "/api/recipes?populate=*",
  },
};
