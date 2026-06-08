import { NextAuthOptions } from "next-auth";
import { NEXTAUTH_SECRET } from "@/lib/config";

export const authOptions: NextAuthOptions = {
    callbacks: {
        async signIn({ user }) {
            return true;
        },
        async jwt({ token, user }) {
            return token;
        },
        async session({ session, token }) {
            return session;
        },
    },
    session: {
        strategy: 'jwt'
    },
    secret: NEXTAUTH_SECRET
};