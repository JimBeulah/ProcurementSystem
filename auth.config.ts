import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/', // Custom login page (we use a dialog on home, so redirect to home if unauth)
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub as string;
                // Add other properties if needed, e.g. role
                // We need to extend the session type to include role, but for now let's rely on basic data
                // Ideally we'd fetch the user role here or add it to the JWT
            }
            return session;
        },
        async jwt({ token, user }) {
            // user is only available on first sign in
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
