import { connectDatabase } from '@/utils/mongodb';
import {
    UpdateComment,
    DeleteComment,
    HidePost,
} from 'controllers/comments-controller';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
    await connectDatabase();
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json('You must be logged in.');
    }

    if (req.method === 'PUT') {
        return UpdateComment(req, res);
    }

    if (req.method === 'DELETE') {
        // return DeleteComment(req, res);
        return HidePost(req, res);
    }
}
