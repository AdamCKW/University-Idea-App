import { connectDatabase } from '@/utils/mongodb';
import { DownloadPostData } from 'controllers/files-controller';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
    await connectDatabase();

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json('You must be logged in.');
    }

    if (
        session?.user?.role !== 'admin' &&
        session?.user?.role !== 'qaManager'
    ) {
        return res
            .status(401)
            .json('You do not have permission to perform this action.');
    }

    if (req.method === 'GET') {
        return DownloadPostData(req, res);
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
};
