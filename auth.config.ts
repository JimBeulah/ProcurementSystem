import type { NextAuthConfig } from 'next-auth';
import { hasAccess, getModuleFromPath } from './lib/rbac';

export const authConfig = {
    pages: {
        signIn: '/',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }: any) {
            const isLoggedIn = !!auth?.user;
            const pathname = nextUrl.pathname;
            const isOnDashboard = pathname.startsWith('/dashboard') ||
                pathname.startsWith('/clients') ||
                pathname.startsWith('/projects') ||
                pathname.startsWith('/purchasing') ||
                pathname.startsWith('/inventory') ||
                pathname.startsWith('/receiving') ||
                pathname.startsWith('/site-release') ||
                pathname.startsWith('/finance');

            if (isOnDashboard) {
                if (isLoggedIn) {
                    // Check RBAC
                    const moduleKey = getModuleFromPath(pathname);
                    if (moduleKey && !hasAccess(auth.user?.role as string, moduleKey)) {
                        // Redirect to a safe page if unauthorized
                        return Response.redirect(new URL('/dashboard', nextUrl));
                    }
                    return true;
                }
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async session({ session, token }: any) {
            if (token && session.user) {
                session.user.id = token.sub as string;
                session.user.role = token.role as string; // Add role to session
            }
            return session;
        },
        async jwt({ token, user }: any) {
            // user is only available on first sign in
            if (user) {
                token.sub = user.id;
                // @ts-ignore
                token.role = user.role; // Add role to JWT
            }
            return token;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
