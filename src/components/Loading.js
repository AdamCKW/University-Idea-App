import React from 'react';
import { CircularProgress, Box } from '@mui/material';

export default function CircularIndeterminate() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 'auto',
            }}
        >
            <CircularProgress />
        </Box>
    );
}
