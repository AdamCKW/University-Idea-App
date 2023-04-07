import { useState } from 'react';
import Head from 'next/head';
import { getSession, useSession, signOut } from 'next-auth/react';
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

import UserTable from '@/sections/dashboard/users/UserTableGrid';
import AddUserForm from '@/sections/dashboard/users/AddUser';
import { Layout as DashboardLayout } from '@/layouts/dashboard/layout';
import Meta from '@/components/meta';

const UsersPage = ({ error }) => {
    const { data: session } = useSession();
    const theme = useTheme();
    const [showAddUser, setShowAddUser] = useState(false);
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
            <Meta
                title={'Accounts | Idea-App'}
                description={'This is the accounts page!'}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <div>
                                <Button
                                    startIcon={
                                        <SvgIcon fontSize="small">
                                            {showAddUser ? (
                                                <RemoveIcon />
                                            ) : (
                                                <AddIcon />
                                            )}
                                        </SvgIcon>
                                    }
                                    onClick={() => setShowAddUser(!showAddUser)}
                                    variant="contained"
                                >
                                    {showAddUser ? 'Hide' : 'Add User'}
                                </Button>
                            </div>
                        </Stack>

                        {showAddUser && (
                            <div>
                                <Grid container spacing={3}>
                                    <Grid xs={12} md={6} lg={8}>
                                        <AddUserForm
                                            setShowAddUser={setShowAddUser}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        )}

                        <UserTable />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

UsersPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UsersPage;

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

    if (session.user.role !== 'admin') {
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
