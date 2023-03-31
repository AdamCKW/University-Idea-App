import * as React from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    useTheme,
    ThemeProvider,
    MenuItem,
    Unstable_Grid2 as Grid,
} from '@mui/material';

import { useFormik } from 'formik';
import { add_category_validate } from '@/utils/validate';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { useAlertContext } from '@/context/alert-context';

export default function AddCategory({ setShowAddCategory }) {
    const theme = useTheme();
    const { setAlertMessage, setAlertOpen, setIsError } = useAlertContext();
    const { mutate } = useSWRConfig();

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validate: add_category_validate,
        onSubmit,
    });

    async function onSubmit(values) {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            await axios.post('/api/categories', values, options);
            mutate('/api/categories');
            setAlertMessage('Category Added Successfully');
            setIsError(false);
            setAlertOpen(true);
            setShowAddCategory(false);
        } catch (error) {
            setAlertMessage(error.response.data);
            setIsError(true);
            setAlertOpen(true);
        }
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                    <Card>
                        <CardHeader
                            // subheader="The information can be edited"
                            title="Add Category"
                        />
                        <CardContent sx={{ pt: 0 }}>
                            <Box sx={{ m: -1.5 }}>
                                <Grid container spacing={3}>
                                    <Grid xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="name"
                                            label="Category Name"
                                            name="name"
                                            {...formik.getFieldProps('name')}
                                            error={
                                                formik.touched.name &&
                                                Boolean(formik.errors.name)
                                            }
                                            helperText={formik.errors.name}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>

                        <Divider />

                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Add Category
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            </ThemeProvider>
        </>
    );
}
