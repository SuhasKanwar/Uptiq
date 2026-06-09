import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NEXTAUTH_SECRET } from "@/lib/config";
import { login } from "@/utils/auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
                
                try {
                    const user = await login({
                        username: credentials.username,
                        password: credentials.password
                    });
                    
                    return user;
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.jwt = (user as any).token;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                if (!session.user) {
                    session.user = { name: token.id as string };
                } else {
                    session.user.name = token.id as string;
                }
                (session as any).jwt = token.jwt;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/',
        error: '/auth/error',
    },
    secret: NEXTAUTH_SECRET
};