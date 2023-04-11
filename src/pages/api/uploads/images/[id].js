import { MongoClient, GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

let gfs;

const connectDatabase = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            // If not connected, then connect to database
            mongoose.set('strictQuery', true);
            mongoose
                .connect(process.env.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })
                .then(() => {
                    console.log('Database Connection Established');
                    gfs = new GridFSBucket(mongoose.connection.db, {
                        bucketName: 'uploads',
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            // If already connected, then use existing connection
            gfs = new GridFSBucket(mongoose.connection.db, {
                bucketName: 'uploads',
            });
        }
    } catch (err) {
        console.error(err);
    }
};

export default async function handler(req, res) {
    const { id } = req.query;

    // create a new GridFSBucket to retrieve files
    await connectDatabase();
    // const gfs = new GridFSBucket(db, { bucketName: 'uploads' });

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json('You must be logged in.');
    }

    const _id = new mongoose.Types.ObjectId(id);

    // retrieve the file from GridFSBucket
    const file = await gfs.find({ _id }).toArray();

    if (!file || file.length === 0) {
        return res.status(404).json({ message: 'File not found' + file });
    }

    // set the Content-Type header based on the file's MIME type
    res.setHeader('Content-Type', file[0].contentType);

    // stream the file to the client
    const downloadStream = gfs.openDownloadStream(_id);
    downloadStream.pipe(res);
}
