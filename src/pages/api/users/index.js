import { connectDatabase } from '@/utils/mongodb';
import {
    FindAllUsers,
    DeleteMultipleUsers,
} from 'controllers/users-controller';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
    await connectDatabase();

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json('You must be logged in.');
    }

    if (session?.user?.role !== 'admin') {
        return res
            .status(401)
            .json('You do not have permission to perform this action.');
    }

    if (req.method === 'GET') {
        return FindAllUsers(req, res);
    }

    if (req.method === 'DELETE') {
        return DeleteMultipleUsers(req, res);
    }
}
