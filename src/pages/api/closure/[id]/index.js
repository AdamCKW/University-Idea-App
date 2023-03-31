import { connectDatabase } from '@/utils/mongodb';
import {
    UpdateClosureDate,
    DeleteClosureDate,
} from 'controllers/closure-controller';
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

    if (req.method === 'PUT') {
        return UpdateClosureDate(req, res);
    }

    if (req.method === 'DELETE') {
        return DeleteClosureDate(req, res);
    }
}
