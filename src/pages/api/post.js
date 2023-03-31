import { connectDatabase } from '@/utils/mongodb';
import { PostAndUpload } from 'controllers/posts-controller';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
    await connectDatabase();

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json('You must be logged in.');
    }

    if (req.method === 'POST') {
        return PostAndUpload(req, res);
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
