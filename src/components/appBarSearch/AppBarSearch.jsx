import React, { useState } from 'react';
import { FormControl, InputAdornment, OutlinedInput, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AppBarSearch = () => {
    const navigate = useNavigate();
    const [searchFor, setSearchFor] = useState(useSearchParams().get('searchFor') || '');

    const handleChange = (event) => {
        setSearchFor(event.target.value);
    };

    const handleBlur = () => {
        const trimmedValue = searchFor.trim();
        if (trimmedValue) {
            navigate(`/home?searchFor=${trimmedValue}`);
        } else {
            navigate('/home');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleBlur();
        }
    };

    return (
        <FormControl variant="outlined" style={{ width: '33%' }}>
            <OutlinedInput
                id="search"
                value={searchFor}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#FFFFFF' }} />
                    </InputAdornment>
                }
                aria-describedby="search"
                placeholder="Search..."
                inputProps={{
                    'aria-label': 'search',
                }}
                size="small"
                sx={{
                    color: '#FFFFFF',
                    borderRadius: 2,
                    backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
                    '&:hover': {
                        backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
                    },
                    width: '100%',
                }}
            />
        </FormControl>
    );
};

export default AppBarSearch;
