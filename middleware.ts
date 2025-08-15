import { NextResponse, type NextRequest } from 'next/server';

// Cookie-based auth for admin UI and admin APIs.
// Pages under /admin redirect to /admin/login if unauthenticated.
// API routes under /api/admin return 401 JSON if unauthenticated (except login endpoint).
export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	const isAdminPage = pathname.startsWith('/admin');
	const isAdminApi = pathname.startsWith('/api/admin');
	if (!isAdminPage && !isAdminApi) return NextResponse.next();

	// Allow unauthenticated access to login page and Next assets
	if (
		pathname === '/admin/login' ||
		pathname.startsWith('/admin/login') ||
		pathname.startsWith('/_next')
	) {
		// flag admin UI requests so the root layout can hide Navbar/Footer
		const requestHeaders = new Headers(req.headers);
		requestHeaders.set('x-admin-route', '1');
		return NextResponse.next({ request: { headers: requestHeaders } });
	}
	// Allow unauthenticated access to the API login endpoint
	if (pathname === '/api/admin/login' || pathname.startsWith('/api/admin/login')) {
		return NextResponse.next();
	}

	const session = req.cookies.get('admin_session')?.value;
	if (!session) {
		if (isAdminApi) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		const url = req.nextUrl.clone();
		url.pathname = '/admin/login';
		url.searchParams.set('redirect', pathname);
		return NextResponse.redirect(url);
	}
	// authenticated admin UI/API requests
	if (isAdminPage) {
		const requestHeaders = new Headers(req.headers);
		requestHeaders.set('x-admin-route', '1');
		return NextResponse.next({ request: { headers: requestHeaders } });
	}
	return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
