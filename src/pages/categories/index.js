import { useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Card,
    CardContent,
    Box,
    Container,
    Button,
    useTheme,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';

import AddCategory from '@/sections/dashboard/categories/AddCategoryForm';
import CategoryDataGrid from '@/sections/dashboard/categories/CategoryTableGrid';
import { Layout as DashboardLayout } from '@/layouts/dashboard/layout';
import Meta from '@/components/meta';

const CategoriesPage = ({ error }) => {
    const { data: session } = useSession();
    const theme = useTheme();
    const [showAddCategory, setShowAddCategory] = useState(false);

    if (error)
        return (
            <Card>
                <CardContent>
                    <h3>{error}</h3>
                </CardContent>
            </Card>
        );

    return (
        <>
            <Meta title={'Categories | Compact Ideas'} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        {session?.user?.role == 'admin' ||
                        session?.user?.role == 'qaManager' ? (
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={4}
                            >
                                <div>
                                    <Button
                                        startIcon={
                                            <SvgIcon fontSize="small">
                                                {showAddCategory ? (
                                                    <RemoveIcon />
                                                ) : (
                                                    <AddIcon />
                                                )}
                                            </SvgIcon>
                                        }
                                        onClick={() =>
                                            setShowAddCategory(!showAddCategory)
                                        }
                                        variant="contained"
                                    >
                                        {showAddCategory
                                            ? 'Hide'
                                            : 'Add Category'}
                                    </Button>
                                </div>
                            </Stack>
                        ) : null}

                        {showAddCategory && (
                            <div>
                                <Grid container spacing={3}>
                                    <Grid xs={12} md={6}>
                                        <AddCategory
                                            setShowAddCategory={
                                                setShowAddCategory
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        )}
                        <CategoryDataGrid userRole={session?.user?.role} />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

CategoriesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CategoriesPage;

export async function getServerSideProps({ req }) {
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    if (
        session.user.role !== 'admin' &&
        session.user.role !== 'qaManager' &&
        session.user.role !== 'qaCoordinator'
    ) {
        return {
            props: {
                error: 'You do not have permission to access this page',
            },
        };
    }

    return {
        props: { session },
    };
}
