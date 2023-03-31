import React, { useState, useEffect, useMemo } from 'react';
import NextLink from 'next/link';
import {
    Card,
    CardContent,
    Typography,
    Breadcrumbs,
    Link,
    Container,
    Box,
    useTheme,
} from '@mui/material';

import { Layout as DashboardLayout } from '@/layouts/dashboard/layout';
import PostCard from '@/sections/feed/individual/Post/PostCard';
import CommentForm from '@/sections/feed/individual/Comments/CommentForm';
import CommentCard from '@/sections/feed/individual/Comments/CommentCard';
import { getSession, useSession } from 'next-auth/react';
import { getFormatDate } from '@/utils/getFormatDate';
import Loading from '@/components/Loading';
import useSWR from 'swr';
import axios from 'axios';
import Meta from '@/components/meta';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const PostDetail = ({ postData, formattedDate }) => {
    const [showForm, setShowForm] = useState(false);
    const theme = useTheme();
    const { data: session } = useSession();

    const userId = session.user.id;

    const {
        data: post,
        error,
        isLoading,
    } = useSWR(`/api/posts/${postData?.post?._id}`, fetcher, {
        initialData: postData,
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

    const { title, _id, author, isAuthHidden, comments } = post.post;
    return (
        <>
            <Meta
                title={`Post | ${title}`}
                description={'This is a single post'}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            mx: 15,
                            [theme.breakpoints.down('sm')]: {
                                mx: 0,
                            },
                        }}
                    >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                underline="hover"
                                color="inherit"
                                href="/"
                                component={NextLink}
                            >
                                Home
                            </Link>
                            <Typography color="text.primary">
                                {title}
                            </Typography>
                        </Breadcrumbs>

                        <PostCard
                            userId={userId}
                            post={post}
                            setShowForm={setShowForm}
                            showForm={showForm}
                        />

                        {showForm && (
                            <CommentForm
                                setShowForm={setShowForm}
                                userId={userId}
                                postId={_id}
                            />
                        )}

                        {comments.map((comment) => {
                            return (
                                <div key={comment._id}>
                                    <CommentCard
                                        comment={comment}
                                        userId={userId}
                                        postId={_id}
                                    />
                                </div>
                            );
                        })}
                    </Box>
                </Container>
            </Box>
        </>
    );
};

PostDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PostDetail;

export async function getServerSideProps(context) {
    const res = await fetch(
        `${process.env.WEB_URL}/api/posts/${context.params.id}`
    );
    const postData = await res.json();

    if (!postData?.post) {
        return {
            notFound: true,
        };
    }

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
        props: { postData, session },
    };
}
