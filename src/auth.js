/**
 * Cookie-based auth for Cloudflare Workers (no express-session)
 * Uses HMAC-SHA256 to sign a simple token cookie
 */

const COOKIE_NAME = 'gkfarm_auth';
const COOKIE_MAX_AGE = 86400; // 24 hours in seconds

/** Sign a value with HMAC-SHA256 → hex string */
async function sign(value, secret) {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
    return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Verify a value+signature pair */
async function verify(value, signature, secret) {
    const expected = await sign(value, secret);
    return expected === signature;
}

/** Create a signed auth cookie string */
export async function createAuthCookie(env, isSecure = true) {
    const secret = env.AUTH_SECRET || 'gkfarm-default-secret-change-me';
    const token = `authenticated:${Date.now()}`;
    const sig = await sign(token, secret);
    const cookieVal = `${token}.${sig}`;
    const secure = isSecure ? '; Secure' : '';
    return `${COOKIE_NAME}=${cookieVal}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`;
}

/** Check if request has valid auth cookie → boolean */
export async function isAuthenticated(request, env) {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    if (!match) return false;

    const secret = env.AUTH_SECRET || 'gkfarm-default-secret-change-me';
    const parts = match[1].split('.');
    if (parts.length < 2) return false;

    const sig = parts.pop();
    const token = parts.join('.');

    if (!await verify(token, sig, secret)) return false;

    // Check expiry (token format: "authenticated:<timestamp>")
    const ts = parseInt(token.split(':')[1], 10);
    if (isNaN(ts) || (Date.now() - ts) > COOKIE_MAX_AGE * 1000) return false;

    return true;
}

/** Return a Set-Cookie header that clears the auth cookie */
export function clearAuthCookie(isSecure = true) {
    const secure = isSecure ? '; Secure' : '';
    return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}
