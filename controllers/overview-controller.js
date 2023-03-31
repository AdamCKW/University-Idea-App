import Post from 'models/Post';
import User from 'models/User';
import Category from 'models/Category';
import Comment from 'models/Comment';
import Closure from 'models/Closure';
import moment from 'moment';

export const GetOverview = async (req, res) => {
    const now = new Date();

    const startOfThisMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
        0,
        0,
        0
    );
    const endOfThisMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
    );

    try {
        const departments = await User.distinct('department');

        const postsByDepartment = await Post.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            { $unwind: '$author' },
            {
                $group: {
                    _id: '$author.department',
                    post_count: { $sum: 1 },
                },
            },
            {
                $project: {
                    department: '$_id', // set the custom name for the department field
                    post_count: 1,
                    _id: 0,
                },
            },
        ]);

        const topCommentsByPost = await Post.aggregate([
            {
                $project: {
                    _id: 0,
                    title: 1,
                    comments_count: { $size: { $ifNull: ['$comments', []] } },
                },
            },
            {
                $sort: { comments_count: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        const mostActiveStaff = await Comment.aggregate([
            {
                $group: {
                    _id: '$author',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $unwind: '$author',
            },
            {
                $sort: {
                    count: -1,
                },
            },
            {
                $limit: 5,
            },
            {
                $project: {
                    _id: '$author._id',
                    name: '$author.name',
                    email: '$author.email',
                    department: '$author.department',
                    count: 1,
                },
            },
        ]);

        const postsPerWeek = await Post.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfThisMonth,
                        $lte: endOfThisMonth,
                    },
                },
            },
            {
                $group: {
                    _id: { $week: '$createdAt' },
                    post_count: { $sum: 1 },
                },
            },
            {
                $project: {
                    week: '$_id',
                    post_count: 1,
                    _id: 0,
                },
            },
        ]);

        const commentsPerWeek = await Comment.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfThisMonth,
                        $lte: endOfThisMonth,
                    },
                },
            },
            {
                $group: {
                    _id: { $week: '$createdAt' },
                    comment_count: { $sum: 1 },
                },
            },
            {
                $project: {
                    week: '$_id',
                    comment_count: 1,
                    _id: 0,
                },
            },
        ]);

        const notActivePosts = await Post.aggregate([
            {
                $match: {
                    comments: { $exists: true, $size: 0 },
                    createdAt: {
                        $gte: startOfThisMonth,
                        $lte: endOfThisMonth,
                    },
                },
            },
            {
                $group: {
                    _id: { $week: '$createdAt' },
                    post_count: { $sum: 1 },
                },
            },
            {
                $project: {
                    week: '$_id',
                    post_count: 1,
                    _id: 0,
                },
            },
        ]);

        const anonymousPostsPerWeek = await Post.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfThisMonth,
                        $lte: endOfThisMonth,
                    },
                    isAuthHidden: true,
                },
            },
            {
                $group: {
                    _id: { $week: '$createdAt' },
                    post_count: { $sum: 1 },
                },
            },
            {
                $project: {
                    week: '$_id', // set the custom name for the department field
                    post_count: 1,
                    _id: 0,
                },
            },
        ]);

        const anonymousCommentsPerWeek = await Comment.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfThisMonth,
                        $lte: endOfThisMonth,
                    },
                    isAuthHidden: true,
                },
            },

            {
                $group: {
                    _id: { $week: '$createdAt' },
                    comment_count: { $sum: 1 },
                },
            },
            {
                $project: {
                    week: '$_id', // set the custom name for the department field
                    comment_count: 1,
                    _id: 0,
                },
            },
        ]);

        const response = {
            departments,
            postsByDepartment,
            topCommentsByPost,
            mostActiveStaff,
            postsPerWeek,
            commentsPerWeek,
            notActivePosts,
            anonymousPostsPerWeek,
            anonymousCommentsPerWeek,
        };
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};
