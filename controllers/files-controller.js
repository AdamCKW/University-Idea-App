import { gfs } from '@/utils/mongodb';
import Post from 'models/Post';
import Category from 'models/Category';
import User from 'models/User';
import Comment from 'models/Comment';
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
import JSZip from 'jszip';
import { PassThrough } from 'stream';
import { Parser } from 'json2csv';

export const DownloadPostData = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate({
                path: 'author',
                select: 'name -_id',
            })
            .populate({
                path: 'category',
                select: 'name -_id',
            })
            .select(
                '-isAuthHidden -documents -images -createdAt -updatedAt -__v'
            );

        const formattedPosts = posts.map((post) => {
            const {
                likes,
                dislikes,
                views,
                comments,
                author,
                category,
                ...rest
            } = post.toJSON();
            return {
                ...rest,
                category: category.name,
                author: author.name,
                likes: likes.length,
                dislikes: dislikes.length,
                comments: comments.length,
                views,
            };
        });

        const fields = Object.keys(formattedPosts[0]);
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(formattedPosts);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=posts.csv');
        res.send(csv);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

// export const GetAllUploads = async (req, res) => {
//     try {
//         const zip = new JSZip();
//         const files = await gfs.find({}).toArray();
//         const fileIDs = files.map((file) => file._id);

//         for (const fileId of fileIDs) {
//             const _id = new mongoose.Types.ObjectId(fileId);
//             const [file] = await gfs.find({ _id }).toArray();
//             const downloadStream = gfs.openDownloadStream(_id);

//             const passThroughStream = new PassThrough();
//             downloadStream.pipe(passThroughStream);
//             zip.file(file.filename, passThroughStream);
//         }

//         const zipFile = await zip.generateAsync({ type: 'nodebuffer' });

//         res.setHeader('Content-Type', 'text/plain');
//         res.setHeader(
//             'Content-Disposition',
//             'attachment; filename=uploads.zip'
//         );

//         res.send(zipFile);
//     } catch (error) {
//         return res
//             .status(500)
//             .json({ error: true, message: 'Internal Server Error' + error });
//     }
// };

export const GetAllUploads = async (req, res) => {
    try {
        const zip = new JSZip();

        const posts = await Post.find({
            $or: [
                { images: { $exists: true, $ne: [] } },
                { documents: { $exists: true, $ne: [] } },
            ],
        });

        for (const post of posts) {
            for (const image of post.images) {
                const _id = new mongoose.Types.ObjectId(image);
                const [file] = await gfs.find({ _id }).toArray();
                const downloadStream = gfs.openDownloadStream(_id);

                const passThroughStream = new PassThrough();
                downloadStream.pipe(passThroughStream);
                zip.file(
                    `(Post_Id-${post._id})_${file.filename}`,
                    passThroughStream
                );
            }

            for (const document of post.documents) {
                const _id = new mongoose.Types.ObjectId(document);
                const [file] = await gfs.find({ _id }).toArray();
                const downloadStream = gfs.openDownloadStream(_id);
                const passThroughStream = new PassThrough();
                downloadStream.pipe(passThroughStream);
                zip.file(
                    `(Post_Id-${post._id})_${file.filename}`,
                    passThroughStream
                );
            }
        }

        const zipFile = await zip.generateAsync({ type: 'nodebuffer' });

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=uploads.zip'
        );

        res.send(zipFile);
    } catch (error) {
        return res
            .status(500)
            .json({ error: true, message: 'Internal Server Error' + error });
    }
};
