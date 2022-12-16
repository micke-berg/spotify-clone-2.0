import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export const config = {
	matcher: '/',
};

export async function middleware(req) {
	// Token will exist if user is logged in
	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	const { pathname } = req.nextUrl;
	const url = req.nextUrl.clone();
	url.pathname = '/login';
	// Allow the request if the following is true
	// 1) its arequest for next-auth session & provider fetching
	// 2) the token exists

	if (pathname.includes('/api/auth') || token) {
		return NextResponse.next();
	}

	// Redirect to login if they dont have token and are requesting a protected route
	if (!token && pathname !== '/login') {
		return NextResponse.redirect(url);
	}
}
