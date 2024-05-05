const initialState = {
	selectedCategory: null,
	categories: [],
	products: [],
	selectedSortBy: "DEFAULT",
  };
  
  const actionReducer = (state = initialState, action) => {
	switch (action.type) {
	  case "SET_FILTER":
		return {
		  ...state,
		  selectedCategory: action.category,
		};
	  case "CLEAR_FILTER":
		return {
		  ...state,
		  selectedCategory: null,
		};
	  case "SET_SORTING":
		return {
		  ...state,
		  selectedSortBy: action.sortBy,
		};
	  case "INIT_CATALOG":
		return {
		  ...state,
		  categories: action.categories,
		  products: action.products,
		};
	  case "CLEAR_ALL":
		return initialState;
	  default:
		return state;
	}
  };
  
  export default actionReducer;
  