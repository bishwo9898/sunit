import { NextResponse } from 'next/server';

const USERNAME = process.env.ADMIN_USERNAME || 'admin';
const PASSWORD = process.env.ADMIN_PASSWORD || 'logmein';

export async function POST(req: Request) {
	try {
		const { username, password, remember } = await req.json();
		if (username !== USERNAME || password !== PASSWORD) {
			return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
		}
		const res = NextResponse.json({ ok: true });
		res.cookies.set('admin_session', remember ? 'persist' : '1', {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
		});
		return res;
	} catch {
		return NextResponse.json({ error: 'Bad request' }, { status: 400 });
	}
}
