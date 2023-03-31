import { connectDatabase } from '@/utils/mongodb';
import { FindUser, UpdateUser, DeleteUser } from 'controllers/users-controller';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
    await connectDatabase();

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json('You must be logged in.');
    }

    if (req.method === 'GET') {
        return FindUser(req, res);
    }

    if (req.method === 'PUT') {
        return UpdateUser(req, res);
    }

    if (session?.user?.role !== 'admin') {
        return res
            .status(401)
            .json('You do not have permission to perform this action.');
    }
    if (req.method === 'DELETE') {
        return DeleteUser(req, res);
    }
}
