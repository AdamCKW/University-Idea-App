import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import User from '/models/User';
import bcrypt from 'bcrypt';

export const authOptions = {
    session: {
        strategy: 'jwt',
    },
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            async authorize(credentials, req) {
                const url = `${process.env.WEB_URL}/api/auth/login`;
                const response = await axios.post(url, credentials);
                if (response) {
                    const user = response.data;
                    return user;
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.id = user._id;
                token.role = user.role;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (token.id) {
                session.user.id = token.id;
            }

            if (token.role) {
                session.user.role = token.role;
            }
            return session;
        },
    },
};

export default NextAuth(authOptions);
