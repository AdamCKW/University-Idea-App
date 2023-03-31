import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import {
    Box,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Card,
    InputAdornment,
    OutlinedInput,
    SvgIcon,
    TextField,
    useTheme,
} from '@mui/material';

import axios from 'axios';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { usePostContext } from '@/context/post-context';
import useFetchCategories from '@/utils/fetchCategories';

export default function FilterActions() {
    const { sort, setSort, categoryOptions, setCategoryOptions, setSearch } =
        usePostContext();

    const theme = useTheme();

    const [sortValue, setSortValue] = useState('latest');
    const [categoryValue, setCategoryValue] = useState('all');

    const categories = useFetchCategories();

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    };

    const setSearchDebounced = debounce((searchTerm) => {
        setSearch(searchTerm);
    }, 2000);

    const onSortChange = (event) => {
        const value = event.target.value;

        switch (value) {
            case 'latest':
                setSort({ sort: 'createdAt', order: 'desc' });
                break;
            case 'oldest':
                setSort({ sort: 'createdAt', order: 'asc' });
                break;
            case 'mostLikes':
                setSort({ sort: 'likes_count', order: 'desc' });
                break;
            case 'mostDislikes':
                setSort({ sort: 'dislikes_count', order: 'desc' });
                break;
            case 'mostView':
                setSort({ sort: 'views', order: 'desc' });
                break;
            default:
                break;
        }

        setSortValue(value);
    };

    const onCategoryChange = (event) => {
        const value = event.target.value;

        let categories = [];
        if (value !== 'all') {
            categories = [value];
        }
        setCategoryOptions(categories);
        setCategoryValue(value);
    };

    return (
        <Card sx={{ p: 2 }}>
            <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Search post"
                startAdornment={
                    <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                            <MagnifyingGlassIcon />
                        </SvgIcon>
                    </InputAdornment>
                }
                sx={{
                    maxWidth: 400,
                    m: 1,
                    minWidth: 150,
                    [theme.breakpoints.down('md')]: {
                        maxWidth: 500,
                    },
                }}
                onChange={(e) => {
                    const searchTerm = e.target.value;
                    setSearchDebounced(searchTerm);
                }}
            />

            <FormControl variant="filled" sx={{ m: 1, minWidth: 150 }}>
                <InputLabel id="sort-select-label">Sort by</InputLabel>
                <Select
                    labelId="sort-select-label"
                    id="sort-select"
                    value={sortValue}
                    label="Sort by"
                    onChange={onSortChange}
                >
                    <MenuItem value={'latest'}>Latest</MenuItem>
                    <MenuItem value={'oldest'}>Oldest</MenuItem>
                    <MenuItem value={'mostLikes'}>Most Likes</MenuItem>
                    <MenuItem value={'mostDislikes'}>Most Dislikes</MenuItem>
                    <MenuItem value={'mostView'}>Most Views</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="filled" sx={{ m: 1, minWidth: 150 }}>
                <InputLabel id="category-select-label">Category</InputLabel>

                <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={categoryValue}
                    label="Category"
                    onChange={onCategoryChange}
                >
                    <MenuItem value={'all'}>All</MenuItem>
                    {categories?.map((category) => {
                        return (
                            <MenuItem key={category._id} value={category._id}>
                                {category.name}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Card>
    );
}
