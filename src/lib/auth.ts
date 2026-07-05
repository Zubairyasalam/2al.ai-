import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-google-client-secret",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).trim().toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
          paymentStatus: user.paymentStatus,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const email = user.email.trim().toLowerCase();
        
        // Use upsert to prevent race conditions during first sign-in
        const dbUser = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: user.name || (profile as any)?.name || (profile as any)?.login || email.split("@")[0],
            image: user.image || (profile as any)?.avatar_url || (profile as any)?.picture,
            role: "CUSTOMER",
            plan: "NONE",
            paymentStatus: "UNPAID",
            emailVerified: new Date(),
          },
        });

        // Upsert OAuth account to link it safely
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          update: {
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            id_token: account.id_token,
          },
          create: {
            userId: dbUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state as string,
          },
        });

        // Attach database user attributes to NextAuth session object
        user.id = dbUser.id;
        (user as any).role = dbUser.role;
        (user as any).plan = dbUser.plan;
        (user as any).paymentStatus = dbUser.paymentStatus;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "CUSTOMER";
        token.plan = (user as any).plan || "NONE";
        token.paymentStatus = (user as any).paymentStatus || "UNPAID";
      }
      // Bulletproof fallback: fetch from database if role/id is missing in token
      if ((!token.role || !token.id) && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.plan = dbUser.plan;
          token.paymentStatus = dbUser.paymentStatus;
        }
      }
      if (trigger === "update" && session) {
        token.plan = session.plan;
        token.paymentStatus = session.paymentStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).plan = token.plan;
        (session.user as any).paymentStatus = token.paymentStatus;
      }
      return session;
    },
  },
});
