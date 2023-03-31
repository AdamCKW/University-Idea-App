import { connectDatabase } from '@/utils/mongodb';
import { UserRegisterMulti } from 'controllers/users-controller';

export default async function handler(req, res) {
    await connectDatabase();

    if (req.method === 'POST') {
        UserRegisterMulti(req, res);
    }
}
