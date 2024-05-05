import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const CreatableSelect = ({ options, value, onChange, onBlur, id, label, error, helperText }) => {
    const optionArray = options.slice(1); // Exclude the first option
    const filter = createFilterOptions();
    const [selectedValue, setSelectedValue] = useState(value || null);

    const handleInputChange = (event, newValue) => {
        if (newValue !== null && newValue.indexOf('Add ') === 0) {
            newValue = newValue.split('"')[1];
        }
        setSelectedValue(newValue);
        onChange(newValue);
    };

    const handleBlur = () => {
        onBlur(selectedValue);
    };

    return (
        <Autocomplete
            value={selectedValue}
            onChange={handleInputChange}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some((option) => inputValue === option);
                if (inputValue !== '' && !isExisting) {
                    filtered.push(`Add "${inputValue}"`);
                }
                return filtered;
            }}
            onBlur={handleBlur}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id={id}
            options={optionArray}
            getOptionLabel={(option) => (option.indexOf('Add ') === 0 ? option.split('"')[1] : option)}
            renderOption={(props, option) => <li {...props}>{option}</li>}
            sx={{ width: '100%' }}
            freeSolo
            renderInput={(params) => <TextField {...params} label={label} error={error} helperText={helperText} />}
        />
    );
};

export default CreatableSelect;
