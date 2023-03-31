import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Box,
    InputAdornment,
    OutlinedInput,
    SvgIcon,
    Button,
    TextField,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import axios from 'axios';
import useSWR from 'swr';

import AddClosureDialog from '@/sections/dashboard/posts/AddClosureDialog';
import EditClosureDialog from '@/sections/dashboard/posts/EditClosureDialog';
import DeleteClosureModal from '@/sections/dashboard/posts/DeleteClosureModal';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '@/components/Loading';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function ClosureCard() {
    const [showAddClosure, setShowAddClosure] = useState(false);
    const [showEditClosure, setShowEditClosure] = useState(false);
    const [showDeleteClosure, setShowDeleteClosure] = useState(false);

    const {
        data: Closure,
        isLoading,
        error,
    } = useSWR('/api/closure', fetcher, {
        revalidateOnFocus: false,
        refreshInterval: 300000,
    });

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <h3>Error loading data, {error}</h3>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ p: 2 }}>
            <CardContent sx={{ pt: 0 }}>
                <Box sx={{ m: -1.5 }}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={4}>
                            <TextField
                                disabled
                                fullWidth
                                label="Start Date"
                                value={
                                    Closure ? formatDate(Closure.startDate) : ''
                                }
                            />
                        </Grid>

                        <Grid xs={12} md={4}>
                            <TextField
                                disabled
                                fullWidth
                                label="Initial Closure Date"
                                value={
                                    Closure
                                        ? formatDate(Closure.initialClosureDate)
                                        : ''
                                }
                            />
                        </Grid>

                        <Grid xs={12} md={4}>
                            <TextField
                                disabled
                                fullWidth
                                label="Final Closure Date"
                                value={
                                    Closure
                                        ? formatDate(Closure.finalClosureDate)
                                        : ''
                                }
                            />
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>

            {showAddClosure && (
                <AddClosureDialog
                    setShowAddClosure={setShowAddClosure}
                    showAddClosure={showAddClosure}
                />
            )}

            {showEditClosure && Closure && (
                <EditClosureDialog
                    closure={Closure}
                    setShowEditClosure={setShowEditClosure}
                    showEditClosure={showEditClosure}
                />
            )}

            {showDeleteClosure && Closure && (
                <DeleteClosureModal
                    closure={Closure}
                    setShowDeleteClosure={setShowDeleteClosure}
                    showDeleteClosure={showDeleteClosure}
                />
            )}

            <CardActions>
                <Button
                    variant="contained"
                    startIcon={
                        <SvgIcon fontSize="small">
                            <AddIcon />
                        </SvgIcon>
                    }
                    onClick={() => setShowAddClosure(!showAddClosure)}
                >
                    Add
                </Button>

                {Closure && (
                    <Button
                        startIcon={
                            <SvgIcon fontSize="small">
                                <EditIcon />
                            </SvgIcon>
                        }
                        onClick={() => setShowEditClosure(!showEditClosure)}
                    >
                        Edit
                    </Button>
                )}

                {Closure && (
                    <Button
                        startIcon={
                            <SvgIcon fontSize="small">
                                <DeleteIcon />
                            </SvgIcon>
                        }
                        onClick={() => setShowDeleteClosure(!showDeleteClosure)}
                    >
                        Remove
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
