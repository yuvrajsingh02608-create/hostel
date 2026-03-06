import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.error("[AUTH] Missing credentials");
                    throw new Error("Invalid credentials");
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    if (!user) {
                        console.error(`[AUTH] User not found: ${credentials.email}`);
                        throw new Error("User not found");
                    }

                    if (!user.password) {
                        console.error(`[AUTH] User has no password set: ${credentials.email}`);
                        throw new Error("No password set");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        console.error(`[AUTH] Invalid password for: ${credentials.email}`);
                        throw new Error("Invalid password");
                    }

                    console.log(`[AUTH] Successful login: ${credentials.email} (${user.role})`);
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error: any) {
                    console.error("[AUTH] Database or bcrypt error:", error.message);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id as string;
            }
            return session;
        },
    },
};
