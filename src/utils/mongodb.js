const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gfs;

export const connectDatabase = async () => {
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

export { gfs };
