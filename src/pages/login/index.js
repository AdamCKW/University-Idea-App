import { useCallback, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { useAlertContext } from '@/context/alert-context';
import login_validate from '@/utils/validate';
import { signIn } from 'next-auth/react';
import Meta from '@/components/meta';

import {
    Alert,
    Box,
    Button,
    FormHelperText,
    Link,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';

import { Layout as AuthLayout } from 'src/layouts/auth/layout';

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {'Copyright © '}
            <Link color="inherit" href="#">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const LoginPage = () => {
    const { setAlertMessage, setIsError, setAlertOpen } = useAlertContext();
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate: login_validate,
        onSubmit,
    });

    async function onSubmit(values) {
        const trimmedValues = Object.entries(values).reduce(
            (acc, [key, value]) => {
                acc[key] = typeof value === 'string' ? value.trim() : value;
                return acc;
            },
            {}
        );

        const status = await signIn('credentials', {
            redirect: false,
            id: trimmedValues.id,
            email: trimmedValues.email,
            password: trimmedValues.password,
            callbackUrl: '/',
        });
        if (status.ok) {
            router.push(status.url);
        } else {
            setAlertMessage('Invalid credentials');
            setIsError(true);
            setAlertOpen(true);
        }
    }

    return (
        <>
            <Meta title={'Login | Compact Ideas'} description={'This is a login page.'} />

            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        maxWidth: 550,
                        px: 3,
                        py: '100px',
                        width: '100%',
                    }}
                >
                    <div>
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            <Typography variant="h4">Login</Typography>
                            <Typography color="text.secondary" variant="body2">
                                Don&apos;t have an account? &nbsp;
                                <Link
                                    component={NextLink}
                                    href="#"
                                    underline="hover"
                                    variant="subtitle2"
                                >
                                    Contact The Administrator
                                </Link>
                            </Typography>
                        </Stack>

                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    error={
                                        !!(
                                            formik.touched.email &&
                                            formik.errors.email
                                        )
                                    }
                                    fullWidth
                                    helperText={
                                        formik.touched.email &&
                                        formik.errors.email
                                    }
                                    label="Email Address"
                                    name="email"
                                    {...formik.getFieldProps('email')}
                                    type="email"
                                />
                                <TextField
                                    error={
                                        !!(
                                            formik.touched.password &&
                                            formik.errors.password
                                        )
                                    }
                                    fullWidth
                                    helperText={
                                        formik.touched.password &&
                                        formik.errors.password
                                    }
                                    label="Password"
                                    name="password"
                                    type="password"
                                    {...formik.getFieldProps('password')}
                                />
                            </Stack>

                            <Button
                                fullWidth
                                size="large"
                                sx={{ mt: 3 }}
                                type="submit"
                                variant="contained"
                            >
                                Sign in
                            </Button>

                            <Copyright sx={{ mt: 8, mb: 4 }} />
                        </form>
                    </div>
                </Box>
            </Box>
        </>
    );
};

LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default LoginPage;
