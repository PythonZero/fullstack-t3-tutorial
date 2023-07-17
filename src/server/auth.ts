import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {type GetServerSidePropsContext} from "next";
import {
    getServerSession,
    type NextAuthOptions,
    type DefaultSession,
} from "next-auth";
import {env} from "~/env.mjs";
import {prisma} from "~/server/db";
import EmailProvider from "next-auth/providers/email"
import * as process from "process";
import * as console from "console";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";


/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            // ...other properties
            // role: UserRole;
        } & DefaultSession["user"];
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({session, user}) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER,
                port: 587,
                auth: {
                    user: "apikey",
                    pass: process.env.EMAIL_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM,
            ...(process.env.NODE_ENV != 'production' ? {
                sendVerificationRequest({url}) {
                    console.log("LOGIN LINK", url)
                }
            } : {})
        }),
    ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};
