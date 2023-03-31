import React from 'react';
import { usePostContext } from 'src/context/post-context';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function NavPagination() {
    const { totalPosts, pageLimit, setPage, page, listPost } = usePostContext();
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / pageLimit); i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (listPost?.length != 0) {
        return (
            <Stack spacing={2}>
                <Pagination
                    count={pageNumbers.length}
                    color="primary"
                    page={page}
                    onChange={handlePageChange}
                />
            </Stack>
        );
    }
}
