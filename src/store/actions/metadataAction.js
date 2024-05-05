import { fetchAllProducts } from "../../api/productAPIs";
import { fetchAllCategories } from "../../api/categoryAPIs";

export const setFilter = (category) => ({
  // Note: used for filtering of products based on selected category
  type: "SET_FILTER",
  category: category,
});

export const clearFilter = () => ({
  // Note: for clearing filter
  type: "CLEAR_FILTER",
});

export const initCatalog = (accessToken) => (dispatch) => {
  // Note: Initialise catalog by fetching all categories and all products
  Promise.all([fetchAllCategories(accessToken), fetchAllProducts(accessToken)])
    .then((json) => {
      dispatch({
        type: "INIT_CATALOG",
        categories: json[0].data,
        products: json[1].data,
      });
    })
    .catch(() => {
      dispatch({
        type: "INIT_CATALOG",
        categories: ["ALL"],
        products: [],
      });
    });
};

export const setSortBy = (sortBy) => ({
  // Note: used for sorting of products
  type: "SET_SORTING",
  sortBy: sortBy,
});

export const clearAllMetadata = () => ({
  // Note: for clearing all metadata
  type: "CLEAR_ALL",
});
