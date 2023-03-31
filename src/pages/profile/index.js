import { getSession, useSession } from 'next-auth/react';

import {
    Card,
    CardContent,
    Box,
    Container,
    Stack,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import { Layout as DashboardLayout } from '@/layouts/dashboard/layout';
import { AccountProfile } from '@/sections/account/account-profile';
import { AccountProfileDetails } from '@/sections/account/account-profile-details';
import useSWR from 'swr';
import axios from 'axios';
import Meta from '@/components/Meta';
import Loading from '@/components/Loading';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Profile = () => {
    const { data: session } = useSession();

    const {
        data: user,
        error,
        isLoading,
    } = useSWR(`api/users/${session?.user?.id}`, fetcher, {
        revalidateOnReconnect: false,
        revalidateOnFocus: false,
        refreshInterval: 300000,
    });

    if (isLoading) return <Loading />;

    if (error)
        return (
            <Card>
                <CardContent>There is an error.</CardContent>
            </Card>
        );

    const { _id, name, department, role, email } = user;

    return (
        <>
            <Meta
                title={'Profile'}
                description={"This is the user's profile"}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={3}>
                        <div>
                            <Typography variant="h4">Account</Typography>
                        </div>

                        <div>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={6} lg={4}>
                                    <AccountProfile
                                        userId={_id}
                                        name={name}
                                        department={department}
                                        email={email}
                                    />
                                </Grid>

                                <Grid xs={12} md={6} lg={8}>
                                    <AccountProfileDetails user={user} />
                                </Grid>
                            </Grid>
                        </div>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

Profile.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Profile;

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}
