import { useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import DownloadIcon from '@mui/icons-material/Download';
import ArchiveIcon from '@mui/icons-material/Archive';

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

import PostTable from '@/sections/dashboard/posts/PostTable';
import ClosureCard from '@/sections/dashboard/posts/Closure';
import { Layout as DashboardLayout } from '@/layouts/dashboard/layout';
import Meta from '@/components/Meta';

const PostsPage = ({ error }) => {
    const { data: session } = useSession();
    const theme = useTheme();
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
                title={'Posts Management'}
                description={'This is post management page.'}
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
                            <Stack spacing={1}>
                                <Typography variant="h4">Posts</Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <Button
                                        href="api/download/data"
                                        color="inherit"
                                        startIcon={
                                            <SvgIcon fontSize="small">
                                                <ArchiveIcon />
                                            </SvgIcon>
                                        }
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        Export
                                    </Button>
                                    <Button
                                        href="api/download/files"
                                        color="inherit"
                                        startIcon={
                                            <SvgIcon fontSize="small">
                                                <DownloadIcon />
                                            </SvgIcon>
                                        }
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        Download
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                        <ClosureCard />

                        <PostTable />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

PostsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PostsPage;

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
