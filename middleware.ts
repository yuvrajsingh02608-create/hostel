import createIntlMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const authMiddleware = withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const pathWithoutLocale = path.replace(/^\/(en|hi)/, '') || '/';

        if (pathWithoutLocale.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (pathWithoutLocale.startsWith("/agent") && token?.role !== "AGENT") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (pathWithoutLocale.startsWith("/dashboard") && token?.role !== "RESIDENT") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return intlMiddleware(req);
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: '/login',
        }
    }
);

export default function middleware(req: NextRequest) {
    const publicPages = ['/', '/login', '/register'];
    const path = req.nextUrl.pathname;
    
    // API routes should not be handled by intlMiddleware
    if (path.startsWith('/api')) {
        return NextResponse.next();
    }

    const pathWithoutLocale = path.replace(/^\/(en|hi)/, '') || '/';
    const isPublicPage = publicPages.includes(pathWithoutLocale);

    if (isPublicPage) {
        return intlMiddleware(req);
    } else {
        return (authMiddleware as any)(req);
    }
}

export const config = {
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /.*\\..* (static files)
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
