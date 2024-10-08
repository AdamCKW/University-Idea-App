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
    Tooltip,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';

import PostTable from '@/sections/dashboard/posts/PostTable';
import CommentTable from '@/sections/dashboard/posts/CommentsTable';
import ClosureCard from '@/sections/dashboard/posts/Closure';
import { Layout as DashboardLayout } from '@/layouts/dashboard/layout';
import Meta from '@/components/meta';

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
                title={'Posts Management | Compact Ideas'}
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
                                {session?.user?.role == 'admin' ||
                                session?.user?.role == 'qaManager' ? (
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        spacing={1}
                                    >
                                        <Tooltip
                                            title={
                                                process.env.NODE_ENV ===
                                                'production'
                                                    ? 'May not work in production server to server limitations'
                                                    : ''
                                            }
                                            arrow
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
                                        </Tooltip>

                                        <Tooltip
                                            title={
                                                process.env.NODE_ENV ===
                                                'production'
                                                    ? 'Disabled in production mode due to server limitation'
                                                    : ''
                                            }
                                            arrow
                                        >
                                            <span>
                                                <Button
                                                    disabled={
                                                        process.env.NODE_ENV ===
                                                        'production'
                                                            ? true
                                                            : false
                                                    }
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
                                            </span>
                                        </Tooltip>
                                    </Stack>
                                ) : null}
                            </Stack>
                        </Stack>

                        <ClosureCard userRole={session.user.role} />

                        <PostTable />

                        <CommentTable />
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
