import { connectDatabase } from '@/utils/mongodb';
import { UserLogin } from 'controllers/users-controller';

export default async function handler(req, res) {
    await connectDatabase();

    if (req.method === 'POST') {
        UserLogin(req, res);
    }
}
