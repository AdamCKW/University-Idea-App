import { connectDatabase } from '@/utils/mongodb';
import { FindPost, UpdatePost, DeletePost } from 'controllers/posts-controller';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
    await connectDatabase();

    const session = await getServerSession(req, res, authOptions);

    if (req.method === 'GET') {
        return FindPost(req, res);
    }

    if (!session) {
        return res.status(401).json('You must be logged in.');
    }

    if (req.method === 'PUT') {
        return UpdatePost(req, res);
    }

    if (req.method === 'DELETE') {
        return DeletePost(req, res);
    }
}
