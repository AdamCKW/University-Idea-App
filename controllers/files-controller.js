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
                select: '-password -dateOfBirth -role -createdAt -updatedAt -__v',
            })
            .populate({
                path: 'category',
                select: '-startDate -endDate -createdAt -updatedAt -__v',
            })
            .populate({
                path: 'comments',
                select: '-updatedAt -__v',
            })
            .select('-documents -images -updatedAt -__v');

        const formattedPosts = posts.map((post) => {
            const { likes, dislikes, ...rest } = post.toJSON();

            return {
                ...rest,
                likes: likes.length,
                dislikes: dislikes.length,
            };
        });

        const fields = Object.keys(formattedPosts[1]);
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

export const GetAllUploads = async (req, res) => {
    try {
        const zip = new JSZip();
        const files = await gfs.find({}).toArray();
        const fileIDs = files.map((file) => file._id);

        for (const fileId of fileIDs) {
            const _id = new mongoose.Types.ObjectId(fileId);
            const [file] = await gfs.find({ _id }).toArray();
            const downloadStream = gfs.openDownloadStream(_id);

            const passThroughStream = new PassThrough();
            downloadStream.pipe(passThroughStream);
            zip.file(file.filename, passThroughStream);
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
