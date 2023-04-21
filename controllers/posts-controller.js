import Post from 'models/Post';
import User from 'models/User';
import Category from 'models/Category';
import Comment from 'models/Comment';
import Closure from 'models/Closure';
import { sendEmail } from '@/utils/sendEmail';
import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';
import { connectDatabase, gfs } from '@/utils/mongodb';
import { v4 as uuidv4 } from 'uuid';

const mongoose = require('mongoose');

/* Creating a new GridFsStorage object. */
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = [
            'image/png',
            'image/jpg',
            'image/jpeg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${uuidv4()}-any-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: 'uploads',
            filename: `${uuidv4()}-${file.originalname}`,
        };
    },
});

/* Creating a multer object. */
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const match = [
            'image/png',
            'image/jpg',
            'image/jpeg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (match.indexOf(file.mimetype) === -1) {
            const error = new Error('Invalid file type');
            error.status = 400;
            return cb(error, false);
        }

        cb(null, true);
    },
});

/**
 * It finds a post by id, populates the author, category, and comments, then finds the images and
 * documents associated with the post and returns the post with the images and documents
 */
export const FindPost = async (req, res) => {
    try {
        const { id } = req.query;
        const post = await Post.findById(id)
            .populate({
                path: 'author',
                select: '-password -dateOfBirth -role -createdAt -updatedAt',
            })
            .populate({
                path: 'category',
                select: '-startDate -endDate -createdAt -updatedAt',
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: '-password -dateOfBirth -role -createdAt -updatedAt',
                },
            });

        const images = await Promise.all(
            post.images.map(async (imageId) => {
                try {
                    const _id = new mongoose.Types.ObjectId(imageId);
                    const file = await gfs
                        .find({ _id })
                        .toArray()
                        .then((files) => files[0]);
                    const url = `/api/uploads/images/${imageId}`;
                    return { ...file, url };
                } catch (err) {
                    console.log('Error while retrieving image:', err);
                }
            })
        );

        const documents = await Promise.all(
            post.documents.map(async (docId) => {
                try {
                    const _id = new mongoose.Types.ObjectId(docId);
                    const file = await gfs
                        .find({ _id })
                        .toArray()
                        .then((files) => files[0]);
                    const url = `/api/uploads/documents/${docId}`;
                    return { ...file, url };
                } catch (err) {
                    console.log('Error while retrieving document:', err);
                }
            })
        );

        const fullPost = {
            post,
            images,
            documents,
        };

        return res.status(200).json(fullPost);
    } catch (error) {
        return res.status(500).json('Internal Server Error' + ' ' + error);
    }
};

/**
 * It finds all posts and populates the author and category fields with the author and category data.
 * @param req - The request object.
 * @param res - the response object
 * @returns An array of posts.
 */
export const FindAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate({
                path: 'author',
                select: '-password -dateOfBirth -role -createdAt -updatedAt',
            })
            .populate({
                path: 'category',
                select: '-startDate -endDate -createdAt -updatedAt',
            });

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

/**
 * It finds posts based on the query parameters and returns them to the client.
 * </code>
 * @param req - {
 * @param res - {
 * @returns An array of posts.
 */
export const FindSortPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';
        let category = req.query.category || 'All';
        const categories = await Category.find();
        const categoryOptions = categories.map(({ _id }) => ({
            _id,
        }));

        category === 'All'
            ? (category = categoryOptions.map(({ _id }) => _id))
            : (category = req.query.category.split(','));

        category = category.map((id) => new mongoose.Types.ObjectId(id));

        let query = [
            {
                $match: {
                    title: { $regex: search, $options: 'i' },
                    category: { $in: category },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: '$category' },
            {
                $project: {
                    title: 1,
                    desc: 1,
                    // likes_count: { $size: { $ifNull: ['$likes', []] } },
                    // dislikes_count: { $size: { $ifNull: ['$likes', []] } },
                    likes_count: { $size: { $ifNull: ['$likes', []] } },
                    dislikes_count: { $size: { $ifNull: ['$dislikes', []] } },
                    views: 1,
                    isAuthHidden: 1,
                    deleted: 1,
                    createdAt: 1,
                    'author._id': 1,
                    'author.name': 1,
                    'author.email': 1,
                    'author.department': 1,
                    'author.role': 1,
                    'author.dateOfBirth': 1,
                    'category._id': 1,
                    'category.name': 1,
                },
            },
        ];

        if (req.query.sortBy && req.query.sortOrder) {
            let sort = {};
            sort[req.query.sortBy] = req.query.sortOrder === 'asc' ? 1 : -1;
            query.push({
                $sort: sort,
            });
        } else {
            query.push({
                $sort: { createdAt: -1 },
            });
        }

        query.push({ $skip: page * limit }, { $limit: limit });

        let posts = await Post.aggregate(query);

        const total = await Post.countDocuments({
            category: { $in: [...category] },
            name: { $regex: search, $options: '1' },
        });

        // console.log(
        //     posts.map((p) => ({
        //         countLikes: p.countLikes,
        //         countDislikes: p.countDislikes,
        //     }))
        // );

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            posts,
        };

        // : posts.map((post) => ({
        //     ...post.toObject(),
        // }))
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

const deleteFiles = async (fileIds) => {
    await Promise.all(
        fileIds.map(async (fileId) => {
            try {
                const _id = new mongoose.Types.ObjectId(fileId);
                await gfs.delete(_id);
            } catch (err) {
                throw new Error(`${err}`);
            }
        })
    );
};

/**
 * It creates a new post, uploads any files that were submitted with the post, and sends an email to
 * the QA Coordinators
 * @param req - the request object
 * @param res - the response object
 * @returns The newPost object is being returned.
 */
export const PostAndUpload = async (req, res) => {
    await connectDatabase();
    try {
        upload.any()(req, res, async (err) => {
            if (err) {
                return res.status(500).json(`Error uploading files: ${err}`);
            }

            let documents = [];
            documents = req.files.filter((file) =>
                file.fieldname.includes('documents')
            );

            let images = [];
            images = req.files.filter((file) =>
                file.fieldname.includes('images')
            );

            const closureDates = await Closure.findOne();
            if (!closureDates) {
                await deleteFiles(images.map((file) => file.id));
                await deleteFiles(documents.map((file) => file.id));

                return res.status(400).json('Idea submissions are not open');
            }

            const today = new Date().toISOString();
            const start = new Date(closureDates.startDate).toISOString();
            const initial = new Date(
                closureDates.initialClosureDate
            ).toISOString();
            const final = new Date(closureDates.finalClosureDate).toISOString();

            if (start > today) {
                await deleteFiles(images.map((file) => file.id));
                await deleteFiles(documents.map((file) => file.id));

                return res.status(400).json('Idea submissions are not open');
            }

            if (today > initial || today > final) {
                await deleteFiles(images.map((file) => file.id));
                await deleteFiles(documents.map((file) => file.id));

                return res.status(400).json('Idea submissions are closed');
            }

            //Create new post with uploaded documents and images
            const newPost = await Post.create({
                title: req.body.title,
                desc: req.body.desc,
                author: req.body.author,
                category: req.body.category,
                documents: documents.map((file) => file.id),
                images: images.map((file) => file.id),
                isAuthHidden: req.body.isAuthHidden,
            });

            const userId = req.body.author;
            const categoryId = req.body.category;
            const category = await Category.findById(categoryId);
            const author = await User.findById(userId);
            if (!author) {
                await deleteFiles(images.map((file) => file.id));
                await deleteFiles(documents.map((file) => file.id));
                await Post.findByIdAndDelete(newPost._id);

                return res.status(400).json('Invalid author');
            }

            const qaCoordinators = await User.find({
                role: 'qaCoordinator',
                department: author?.department,
            });

            const subject = 'New Post Submitted';
            const text = `A new idea has been submitted by ${author.name} from ${author.department}`;

            const html = `<head>
            <meta charset="UTF-8" />
            <title>New Post Submitted</title>
            <style>
              body {
                background-color: #f1f1f1;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #555;
                margin: 0;
                padding: 0;
              }

              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                background-color: #fff;
              }

              h1 {
                font-size: 28px;
                margin-bottom: 30px;
                text-align: center;
              }

              .post {
                margin-bottom: 30px;
              }

              .post-title {
                font-size: 20px;
                margin-bottom: 10px;
              }

              .post-description {
                font-size: 16px;
                margin-bottom: 10px;
                color: #777;
              }

              .post-details {
                font-size: 16px;
                margin-bottom: 10px;
                color: #777;
              }

              .post-details strong {
                font-weight: bold;
                color: #555;
              }

              .footer {
                text-align: center;
                font-size: 14px;
                color: #999;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>New Post Submitted</h1>

              <div class="post">
                <div class="post-title">${newPost.title}</div>
                <div class="post-description">${newPost.desc}</div>
                <div class="post-details">
                  <div><strong>Category:</strong> ${category.name}</div>
                  <div><strong>Author:</strong> ${author.name}</div>
                  <div><strong>Department:</strong> ${author.department}</div>
                  <div><strong>Author Email:</strong> ${author.email}</div>
                  <div><strong>Date:</strong> ${newPost.createdAt}</div>
                </div>
              </div>

              <div class="footer">
                This email was sent because ${author.email} submitted a new post.
              </div>
            </div>
          </body>`;

            if (qaCoordinators) {
                const qaCoordinatorEmails = qaCoordinators.map(
                    (manager) => manager.email
                );
                sendEmail(qaCoordinatorEmails, subject, text, html);
            }

            return res.status(200).json(newPost);
        });
    } catch (err) {
        return res.status(500).json(`Internal Server Error: ${err}`);
    }
};

// export const PostAndUpload = async (req, res) => {
//     await connectDatabase();
//     try {
//         upload.any()(req, res, async (err) => {
//             if (err) {
//                 return res.status(500).json(`Error uploading files: ${err}`);
//             }

//             let documents = [];
//             documents = req.files.filter((file) =>
//                 file.fieldname.includes('documents')
//             );

//             let images = [];
//             images = req.files.filter((file) =>
//                 file.fieldname.includes('images')
//             );

//             const closureDates = await Closure.findOne();
//             if (!closureDates) {
//                 await deleteFiles(images.map((file) => file.id));
//                 await deleteFiles(documents.map((file) => file.id));

//                 return res.status(400).json('Idea submissions are not open');
//             }

//             const today = new Date().toISOString();
//             const start = new Date(closureDates.startDate).toISOString();
//             const initial = new Date(
//                 closureDates.initialClosureDate
//             ).toISOString();
//             const final = new Date(closureDates.finalClosureDate).toISOString();

//             if (start > today) {
//                 await deleteFiles(images.map((file) => file.id));
//                 await deleteFiles(documents.map((file) => file.id));

//                 return res.status(400).json('Idea submissions are not open');
//             }

//             if (today > initial || today > final) {
//                 await deleteFiles(images.map((file) => file.id));
//                 await deleteFiles(documents.map((file) => file.id));

//                 return res.status(400).json('Idea submissions are closed');
//             }

//             //Create new post with uploaded documents and images
//             const newPost = await Post.create({
//                 title: req.body.title,
//                 desc: req.body.desc,
//                 author: req.body.author,
//                 category: req.body.category,
//                 documents: documents.map((file) => file.id),
//                 images: images.map((file) => file.id),
//                 isAuthHidden: req.body.isAuthHidden,
//             });

//             return res.status(200).json(newPost);
//         });
//     } catch (err) {
//         return res.status(500).json(`Internal Server Error: ${err}`);
//     }
// };

/**
 * It updates a post by its id and the userId of the author
 * @param req - request
 * @param res - the response object
 * @returns The post has been updated
 */
export const UpdatePost = async (req, res) => {
    const { id } = req.query;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json('Post not found');
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json('You can only update your post');
        }

        await post.updateOne({ $set: req.body });
        return res.status(200).json('The post has been updated');
    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};

/**
 * It deletes a post and all the comments and images associated with it.
 * </code>
 * @param req - {
 * @param res - response object
 * @returns The response is being returned as a JSON object.
 */
export const DeletePost = async (req, res) => {
    const { id } = req.query;
    const { author, userId } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json('Post not found');
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json('You can only delete your post');
        }

        await deleteFiles(post.images.map((file) => file));
        await deleteFiles(post.documents.map((file) => file));

        // await Comment.deleteMany({
        //     _id: { $in: post.comments },
        // });

        await post.deleteOne();

        return res.status(200).json('Post Deleted');
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

export const HidePost = async (req, res) => {
    const { id } = req.query;
    const { userId } = req.body.data;
    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json('Post not found');
        }

        if (post.author.toString() !== userId) {
            console.log(req.body);
            return res
                .status(403)
                .json(
                    `You can only delete your post ${post.author.toString()} = ${userId}`
                );
        }

        post.deleted = true;
        await post.save();

        return res.status(200).json('The post has been updated');
    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};

/**
 * It deletes multiple posts, their images, documents, and comments.
 * </code>
 * @param req - request object
 * @param res - response object
 * @returns An array of objects.
 */
export const DeleteMultiPost = async (req, res) => {
    const PostIds = req.body;
    try {
        const result = await Promise.all(
            PostIds.map(async (id) => {
                const post = await Post.findById(id);
                if (!post) {
                    return {
                        message: `Post with id ${id} not found`,
                    };
                }
                await deleteFiles(post.images.map((file) => file));
                await deleteFiles(post.documents.map((file) => file));

                await Comment.deleteMany({
                    _id: { $in: post.comments },
                });

                await post.deleteOne();

                return {
                    message: `Post with id ${id} deleted successfully`,
                };
            })
        );
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};

/**
 * It's a function that allows a user to like a post.
 * @param req - request
 * @param res - the response object
 * @returns The post has been liked
 */
export const LikePost = async (req, res) => {
    const { id } = req.query;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json('Post not found');
        }

        const action = post.likes.includes(userId) ? 'like remove' : 'like';

        await post.updateOne({
            [action === 'like' ? '$push' : '$pull']: { likes: userId },
            [action === 'like' ? '$pull' : '']: { dislikes: userId },
        });

        return res.status(200).json(`The post has been ${action}d`);
    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};

/**
 * If the userId is in the likes array, remove it from the likes array and add it to the dislikes
 * array. If the userId is in the dislikes array, remove it from the dislikes array.
 * </code>
 * @param req - request
 * @param res - the response object
 * @returns The post has been disliked
 */
export const DislikePost = async (req, res) => {
    const { id } = req.query;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json('Post not found');
        }

        const action = post.dislikes.includes(userId)
            ? 'dislike remove'
            : 'dislike';

        await post.updateOne({
            [action === 'dislike' ? '$push' : '$pull']: { dislikes: userId },
            [action === 'dislike' ? '$pull' : '']: { likes: userId },
        });

        return res.status(200).json(`The post has been ${action}d`);
    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};

/**
 * It finds a post by its id, increments the views property by 1, and then saves the post
 * @param req - The request object.
 * @param res - The response object.
 * @returns The post is being returned.
 */
export const ViewPost = async (req, res) => {
    const { id } = req.query;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json('Post not found');
        }

        post.views++;
        await post.save();
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};
