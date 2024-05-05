import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { setSortBy } from "../../store/actions/metadataAction";
import { connect } from "react-redux";

const ProductSorting = ({ selectedSortBy, saveSortBy }) => {
  const [sortBy, setSortBy] = useState(selectedSortBy);

  const handleChange = (event) => {
    const sortByValue = event.target.value;
    setSortBy(sortByValue);
    saveSortBy(sortByValue);
  };

  const options = [
    {
      label: "Default",
      value: "DEFAULT",
    },
    {
      label: "Price high to low",
      value: "PRICE_DESC",
    },
    {
      label: "Price low to high",
      value: "PRICE_ASC",
    },
    {
      label: "Newest",
      value: "NEWEST",
    },
  ];

  return (
    <FormControl sx={{ m: 1, minWidth: 240 }} size={"small"}>
      <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={sortBy}
        label="Sort By"
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const mapStateToProps = (state) => ({
  selectedSortBy: state.metadata.selectedSortBy,
});

const mapDispatchToProps = (dispatch) => ({
  saveSortBy: (sortBy) => dispatch(setSortBy(sortBy)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductSorting);
