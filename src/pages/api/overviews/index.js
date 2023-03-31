import { connectDatabase } from '@/utils/mongodb';
import { GetOverview } from 'controllers/overview-controller';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
    await connectDatabase();
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json('You must be logged in.');
    }

    if (session?.user.role === 'staff') {
        return res
            .status(401)
            .json('You do not have permission to perform this action.');
    }

    if (req.method === 'GET') {
        return GetOverview(req, res);
    }
}
