import { connectDatabase } from '@/utils/mongodb';
import {
    FindCategory,
    UpdateCategory,
    DeleteCategory,
} from 'controllers/categories-controller';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
    await connectDatabase();
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json('You must be logged in.');
    }

    if (req.method === 'GET') {
        return FindCategory(req, res);
    }

    if (
        session?.user?.role !== 'admin' &&
        session?.user?.role !== 'qaManager'
    ) {
        return res
            .status(401)
            .json('You do not have permission to perform this action.');
    }

    if (req.method === 'PUT') {
        return UpdateCategory(req, res);
    }

    if (req.method === 'DELETE') {
        return DeleteCategory(req, res);
    }
}
