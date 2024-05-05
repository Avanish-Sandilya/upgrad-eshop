import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { clearFilter, setFilter } from "../../store/actions/metadataAction";

const ProductCategory = ({ filter, categories, changeFilter, removeFilter }) => {
  const [filterValue, setFilterValue] = useState(filter || "ALL");

  useEffect(() => {
    const exists = categories.some((cat) => cat === filterValue);
    if (!exists) {
      clearFilter();
      setFilterValue("ALL");
    }
  }, [filterValue, categories]);

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment != null) {
      setFilterValue(newAlignment);
      if (newAlignment === "ALL") {
        removeFilter();
      } else {
        changeFilter(newAlignment);
      }
    }
  };

  return (
    <ToggleButtonGroup
      value={filterValue}
      exclusive
      onChange={handleAlignment}
      aria-label="categories"
    >
      {categories &&
        categories.map((element, index) => (
          <ToggleButton key={"category_" + index} value={element} aria-label={element}>
            {element.toUpperCase()}
          </ToggleButton>
        ))}
    </ToggleButtonGroup>
  );
};

const mapStateToProps = (state) => ({
  filter: state.metadata.selectedCategory,
  categories: state.metadata.categories,
});

const mapDispatchToProps = (dispatch) => ({
  changeFilter: (category) => dispatch(setFilter(category)),
  removeFilter: () => dispatch(clearFilter()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductCategory);
