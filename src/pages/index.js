import Head from 'next/head';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Box,
    Container,
    Button,
    useTheme,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import { Layout as DashboardLayout } from '@/layouts/dashboard/layout';
import { getSession, useSession } from 'next-auth/react';
import { PostProvider } from '@/context/post-context';
import AddIdea from '@/sections/feed/main/AddIdea';
import PostList from '@/sections/feed/main/PostList';
import FilterActions from '@/sections/feed/main/FilterActions';
import Pagination from '@/sections/feed/main/Pagination';
import Meta from '@/components/meta';

const now = new Date();

const Page = () => {
    const { data: session } = useSession();
    const theme = useTheme();
    const [showAddPost, setShowAddPost] = useState(false);

    return (
        <>
            <Meta
                title={'Home | Compact-Idea'}
                description="This is the home page of the list of ideas posted"
            />
            <PostProvider>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 8,
                        mx: 15,
                        [theme.breakpoints.down('md')]: {
                            mx: 0,
                        },
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
                                                {showAddPost ? (
                                                    <RemoveIcon />
                                                ) : (
                                                    <AddIcon />
                                                )}
                                            </SvgIcon>
                                        }
                                        variant="contained"
                                        onClick={() =>
                                            setShowAddPost(!showAddPost)
                                        }
                                    >
                                        {showAddPost ? 'Hide' : 'Add Post'}
                                    </Button>
                                </div>
                            </Stack>

                            {showAddPost && (
                                <AddIdea
                                    userId={session.user.id}
                                    setShowAddPost={setShowAddPost}
                                />
                            )}
                            <FilterActions />
                            <PostList userId={session.user.id} />
                            <Pagination />
                        </Stack>
                    </Container>
                </Box>
            </PostProvider>
        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

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
