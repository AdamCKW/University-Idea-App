import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
    CssBaseline,
    TextField,
    MenuItem,
    Checkbox,
    Grid,
    Box,
    Chip,
    Card,
    Input,
    FormGroup,
    FormControlLabel,
} from '@mui/material';

import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { add_post_validate } from '@/utils/validate';
import TermsDialog from '@/sections/feed/main/TermsDialog';
import useFetchCategories from '@/utils/fetchCategories';

export default function AddIdea({ userId, setShowAddPost }) {
    const theme = useTheme();
    const categories = useFetchCategories();
    const [dialog, setDialog] = useState(false);
    const [values, setValues] = useState();
    const [reset, setReset] = useState();
    const [imageFiles, setImageFiles] = useState([]);
    const [docFiles, setDocFiles] = useState([]);

    const uploadProps = {
        setImageFiles,
        setDocFiles,
    };

    const formik = useFormik({
        initialValues: {
            author: userId || '',
            title: '',
            category: '',
            desc: '',
            isAuthHidden: false,
            images: [],
            documents: [],
        },
        validate: add_post_validate,
        onSubmit,
    });

    const handleImageChange = useCallback(
        (e) => {
            const files = Array.from(e.target.files).slice(0, 3);
            setImageFiles(files);
            formik.setFieldValue('images', files);
        },
        [formik]
    );

    const handleDocChange = useCallback(
        (e) => {
            const files = Array.from(e.target.files).slice(0, 3);
            setDocFiles(files);
            formik.setFieldValue('documents', files);
        },
        [formik]
    );

    async function onSubmit(values, { resetForm }) {
        const trimmedValues = Object.entries(values).reduce(
            (acc, [key, value]) => {
                acc[key] = typeof value === 'string' ? value.trim() : value;
                return acc;
            },
            {}
        );

        setValues(trimmedValues);
        setReset(() => resetForm);
        setDialog(true);
    }

    const handleDeleteChip = useCallback(
        (index, arrayName) => {
            const [files, setFiles, fieldName] =
                arrayName === 'imageFiles'
                    ? [imageFiles, setImageFiles, 'images']
                    : [docFiles, setDocFiles, 'documents'];
            const updatedFiles = [...files];
            updatedFiles.splice(index, 1);
            setFiles(updatedFiles);
            formik.setFieldValue(fieldName, updatedFiles);
        },
        [imageFiles, setImageFiles, docFiles, setDocFiles, formik]
    );

    return (
        <>
            {dialog && (
                <TermsDialog
                    reset={reset}
                    values={values}
                    dialog={dialog}
                    setDialog={setDialog}
                    uploadProps={uploadProps}
                    setShowAddPost={setShowAddPost}
                />
            )}

            <ThemeProvider theme={theme}>
                <CssBaseline />

                <Card>
                    <Box
                        sx={{
                            //marginTop: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            component="form"
                            noValidate
                            onSubmit={formik.handleSubmit}
                            sx={{ padding: 2 }}
                        >
                            <Grid container spacing={2}>
                                {/* Post Title */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="title"
                                        label="Post Title"
                                        name="title"
                                        {...formik.getFieldProps('title')}
                                        error={
                                            formik.touched.title &&
                                            Boolean(formik.errors.title)
                                        }
                                        helperText={formik.errors.title}
                                        inputProps={{ maxLength: 50 }}
                                    />
                                </Grid>

                                {/* Category Type */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        name="category"
                                        fullWidth
                                        id="category"
                                        label="Category"
                                        select
                                        defaultValue=""
                                        {...formik.getFieldProps('category')}
                                        error={
                                            formik.errors.category &&
                                            Boolean(formik.errors.category)
                                        }
                                        helperText={formik.errors.category}
                                    >
                                        {categories?.map((option) => (
                                            <MenuItem
                                                key={option._id}
                                                value={option._id}
                                            >
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/* Post Description */}
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="desc"
                                        label="Description"
                                        fullWidth
                                        multiline
                                        maxRows={4}
                                        {...formik.getFieldProps('desc')}
                                        error={
                                            formik.touched.desc &&
                                            Boolean(formik.errors.desc)
                                        }
                                        helperText={formik.errors.desc}
                                        inputProps={{ maxLength: 1000 }}
                                    />
                                </Grid>

                                {/* Post Images */}
                                <Grid item xs={12}>
                                    <Input
                                        id="image-file-input"
                                        type="file"
                                        inputProps={{
                                            multiple: true,
                                            accept: 'image/*',
                                            onChange: handleImageChange,
                                        }}
                                        sx={{ display: 'none' }}
                                    />

                                    <label htmlFor="image-file-input">
                                        <Button
                                            variant="contained"
                                            component="span"
                                        >
                                            Choose Images
                                        </Button>
                                    </label>
                                </Grid>

                                {imageFiles && (
                                    <Grid item xs={12}>
                                        {Array.from(imageFiles).map(
                                            (file, index) => {
                                                return (
                                                    <Box
                                                        key={index}
                                                        marginTop={1}
                                                    >
                                                        <Chip
                                                            label={file.name}
                                                            onDelete={() =>
                                                                handleDeleteChip(
                                                                    index,
                                                                    'imageFiles'
                                                                )
                                                            }
                                                        />
                                                    </Box>
                                                );
                                            }
                                        )}
                                    </Grid>
                                )}

                                {/* Post Documents */}
                                <Grid item xs={12}>
                                    <Input
                                        id="document-file-input"
                                        type="file"
                                        inputProps={{
                                            multiple: true,
                                            accept: '.pdf,.doc,.docx',
                                            onChange: handleDocChange,
                                        }}
                                        sx={{ display: 'none' }}
                                    />

                                    <label htmlFor="document-file-input">
                                        <Button
                                            variant="contained"
                                            component="span"
                                        >
                                            Choose Documents
                                        </Button>
                                    </label>
                                </Grid>

                                {docFiles && (
                                    <Grid item xs={12}>
                                        {Array.from(docFiles).map(
                                            (file, index) => {
                                                return (
                                                    <Box
                                                        key={index}
                                                        marginTop={1}
                                                    >
                                                        <Chip
                                                            label={shortenFileName(
                                                                file.name
                                                            )}
                                                            onDelete={() =>
                                                                handleDeleteChip(
                                                                    index,
                                                                    'docFiles'
                                                                )
                                                            }
                                                        />
                                                    </Box>
                                                );
                                            }
                                        )}
                                    </Grid>
                                )}

                                {/* Checkbox */}
                                <Grid item xs={12}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="isAuthHidden"
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                />
                                            }
                                            label="Post As Anonymous"
                                        />
                                    </FormGroup>
                                </Grid>
                            </Grid>

                            {/* Submit Post */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit Post
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </ThemeProvider>
        </>
    );
}

function shortenFileName(fileName) {
    const fileType = fileName.split('.').pop();
    const shortenedName = fileName.substring(0, 20 - 5) + '....' + fileType;
    return shortenedName;
}
