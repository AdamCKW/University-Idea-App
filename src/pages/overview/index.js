import {
    Card,
    CardContent,
    Box,
    Container,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import { TotalPostsPerDept } from '@/sections/overview/total-posts';
import { HighestCommentsPerPost } from '@/sections/overview/highest-comments';
import { MostActiveUser } from '@/sections/overview/most-active';
import { PostsPerWeek } from '@/sections/overview/posts-per-week';
import { CommentsPerWeek } from '@/sections/overview/comments-per-week';
import { NotActivePosts } from '@/sections/overview/not-active-posts';
import { AnonymousPosts } from '@/sections/overview/anony-posts';
import { AnonymousComments } from '@/sections/overview/anony-comments';
import Meta from '@/components/Meta';
import { getSession, useSession } from 'next-auth/react';
import moment from 'moment';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Page = ({ error }) => {
    if (error)
        return (
            <Card>
                <CardContent>
                    <h3>{error}</h3>
                </CardContent>
            </Card>
        );

    const {
        data,
        error: DataError,
        isLoading,
    } = useSWR('/api/overviews', fetcher, {
        revalidateOnReconnect: false,
        revalidateOnFocus: false,
        refreshInterval: 300000,
    });

    if (isLoading)
        return (
            <Card>
                <CardContent>
                    <h3>Loading Data</h3>
                </CardContent>
            </Card>
        );

    if (DataError)
        return (
            <Card>
                <CardContent>There is an error.</CardContent>
            </Card>
        );

    const {
        departments,
        postsByDepartment,
        topCommentsByPost,
        mostActiveStaff,
        postsPerWeek,
        commentsPerWeek,
        notActivePosts,
        anonymousPostsPerWeek,
        anonymousCommentsPerWeek,
    } = data;

    const {
        seriesPostByDept,
        seriesTopComments,
        labelsTopComments,
        seriesMostActive,
        labelsMostActive,
        seriesPostsPerWeek,
        labelsWeeks,
        seriesCommentsPerWeek,
        seriesNotActivePosts,
        seriesAnonymousPostsPerWeek,
        seriesAnonymousCommentsPerWeek,
    } = getLabelsAndSeries(
        departments,
        postsByDepartment,
        topCommentsByPost,
        mostActiveStaff,
        postsPerWeek,
        commentsPerWeek,
        notActivePosts,
        anonymousPostsPerWeek,
        anonymousCommentsPerWeek
    );

    return (
        <>
            <Meta
                title={'Overview'}
                description={'This is the overview page'}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="xl">
                    <Grid container spacing={3}>
                        <Grid xs={12}>
                            <TotalPostsPerDept
                                chartSeries={seriesPostByDept}
                                labels={departments}
                                sx={{ height: '100%' }}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <HighestCommentsPerPost
                                chartSeries={seriesTopComments}
                                labels={labelsTopComments}
                                sx={{ height: '100%' }}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <MostActiveUser
                                chartSeries={seriesMostActive}
                                labels={labelsMostActive}
                                sx={{ height: '100%' }}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <PostsPerWeek
                                chartSeries={seriesPostsPerWeek}
                                labels={labelsWeeks}
                                sx={{ height: '100%' }}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <CommentsPerWeek
                                chartSeries={seriesCommentsPerWeek}
                                labels={labelsWeeks}
                                sx={{ height: '100%' }}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <NotActivePosts
                                chartSeries={seriesNotActivePosts}
                                labels={labelsWeeks}
                                sx={{ height: '100%' }}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <AnonymousPosts
                                chartSeries={seriesAnonymousPostsPerWeek}
                                labels={labelsWeeks}
                                sx={{ height: '100%' }}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <AnonymousComments
                                chartSeries={seriesAnonymousCommentsPerWeek}
                                labels={labelsWeeks}
                                sx={{ height: '100%' }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
function getLabelsAndSeries(
    departments,
    postsByDepartment,
    topCommentsByPost,
    mostActiveStaff,
    postsPerWeek,
    commentsPerWeek,
    notActivePosts,
    anonymousPostsPerWeek,
    anonymousCommentsPerWeek
) {
    const seriesPostByDept = departments.map((dept) =>
        postsByDepartment.find((pbd) => pbd.department === dept)
            ? postsByDepartment.find((pbd) => pbd.department === dept)
                  .post_count
            : 0
    );

    const labelsTopComments = topCommentsByPost.map((post) => post.title);
    const seriesTopComments = [
        {
            name: 'Number of comments',
            data: topCommentsByPost.map((post) => post.comments_count),
        },
    ];

    const labelsMostActive = mostActiveStaff.map((user) => user.name);
    const seriesMostActive = [
        {
            name: 'Number of comments',
            data: mostActiveStaff.map((user) => user.count),
        },
    ];

    const firstWeekOfMonth = moment().startOf('month').week();
    const lastWeekOfMonth = moment().endOf('month').week();

    const labelsWeeks = Array.from(
        { length: lastWeekOfMonth - firstWeekOfMonth + 1 },
        (_, i) => `Week ${i + 1}`
    );

    const seriesPostsPerWeek = [
        {
            Name: 'Number of posts',
            data: Array.from(
                { length: lastWeekOfMonth - firstWeekOfMonth + 1 },
                (_, i) => {
                    const matchingPost = postsPerWeek.find(
                        (post) => post.week === i + firstWeekOfMonth
                    );
                    return matchingPost ? matchingPost.post_count : 0;
                }
            ),
        },
    ];

    const seriesCommentsPerWeek = [
        {
            Name: 'Number of comments',
            data: Array.from(
                { length: lastWeekOfMonth - firstWeekOfMonth + 1 },
                (_, i) => {
                    const matchingComment = commentsPerWeek.find(
                        (comment) => comment.week === i + firstWeekOfMonth
                    );
                    return matchingComment ? matchingComment.comment_count : 0;
                }
            ),
        },
    ];

    const seriesNotActivePosts = [
        {
            Name: 'Number of posts',
            data: Array.from(
                { length: lastWeekOfMonth - firstWeekOfMonth + 1 },
                (_, i) => {
                    const matchingPost = notActivePosts.find(
                        (post) => post.week === i + firstWeekOfMonth
                    );
                    return matchingPost ? matchingPost.post_count : 0;
                }
            ),
        },
    ];

    const seriesAnonymousPostsPerWeek = [
        {
            Name: 'Number of posts',
            data: Array.from(
                { length: lastWeekOfMonth - firstWeekOfMonth + 1 },
                (_, i) => {
                    const matchingPost = anonymousPostsPerWeek.find(
                        (post) => post.week === i + firstWeekOfMonth
                    );
                    return matchingPost ? matchingPost.post_count : 0;
                }
            ),
        },
    ];

    const seriesAnonymousCommentsPerWeek = [
        {
            Name: 'Number of comments',
            data: Array.from(
                { length: lastWeekOfMonth - firstWeekOfMonth + 1 },
                (_, i) => {
                    const matchingComment = anonymousCommentsPerWeek.find(
                        (comment) => comment.week === i + firstWeekOfMonth
                    );
                    return matchingComment ? matchingComment.comment_count : 0;
                }
            ),
        },
    ];
    return {
        seriesPostByDept,
        seriesTopComments,
        labelsTopComments,
        seriesMostActive,
        labelsMostActive,
        seriesPostsPerWeek,
        labelsWeeks,
        seriesCommentsPerWeek,
        seriesNotActivePosts,
        seriesAnonymousPostsPerWeek,
        seriesAnonymousCommentsPerWeek,
    };
}

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
