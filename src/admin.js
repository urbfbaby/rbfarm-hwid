/**
 * Admin Routes Handler
 * Handles /admin/* routes with cookie-based authentication
 */
import { createAuthCookie, isAuthenticated, clearAuthCookie } from './auth.js';
import { queryAll, runSql } from './db.js';
import { getLoginPage } from './views.js';
import { getAdminPage } from './admin-view.js';

/** Parse URL-encoded form body from request */
async function parseForm(request) {
    const formData = await request.formData();
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
}

/** HTML response helper */
function html(body, status = 200, extraHeaders = {}) {
    return new Response(body, {
        status,
        headers: { 'Content-Type': 'text/html;charset=UTF-8', ...extraHeaders }
    });
}

/** Redirect helper */
function redirect(url, headers = {}) {
    return new Response(null, {
        status: 302,
        headers: { Location: url, ...headers }
    });
}

/**
 * Main admin router — called from index.js
 * @param {Request} request
 * @param {object} env — Workers env bindings (DB, vars)
 * @param {string} path — the pathname e.g. "/admin", "/admin/login"
 * @returns {Response}
 */
export async function handleAdmin(request, env, path) {
    const method = request.method;
    const isSecure = new URL(request.url).protocol === 'https:';

    // ── Login page ──
    if (path === '/admin/login' && method === 'GET') {
        const url = new URL(request.url);
        const error = url.searchParams.get('error') ? 'Invalid username or password' : '';
        return html(getLoginPage(error));
    }

    // ── Login POST ──
    if (path === '/admin/login' && method === 'POST') {
        const body = await parseForm(request);
        const username = body.username || '';
        const password = body.password || '';

        if (username === (env.ADMIN_USERNAME || 'admin') && password === (env.ADMIN_PASSWORD || 'admin123')) {
            const cookie = await createAuthCookie(env, isSecure);
            return redirect('/admin', { 'Set-Cookie': cookie });
        }
        return redirect('/admin/login?error=1');
    }

    // ── Logout ──
    if (path === '/admin/logout') {
        return redirect('/admin/login', { 'Set-Cookie': clearAuthCookie(isSecure) });
    }

    // ── All other /admin/* routes require auth ──
    if (!await isAuthenticated(request, env)) {
        return redirect('/admin/login');
    }

    // ── Dashboard ──
    if (path === '/admin' && method === 'GET') {
        const lics = await queryAll(env.DB, 'SELECT * FROM hwid_licenses ORDER BY created_at DESC');
        const stats = {
            total: lics.length,
            active: lics.filter(l => l.status === 'active').length,
            expired: lics.filter(l => l.status === 'expired').length,
            banned: lics.filter(l => l.status === 'banned').length
        };
        const logs = await queryAll(env.DB, 'SELECT * FROM request_logs ORDER BY created_at DESC LIMIT 50');
        return html(getAdminPage(lics, stats, logs));
    }

    // ── Add HWID ──
    if (path === '/admin/hwid/add' && method === 'POST') {
        const body = await parseForm(request);
        const hwid = (body.hwid || '').trim();
        if (!hwid) return redirect('/admin?error=HWID+is+required');
        try {
            await runSql(env.DB,
                'INSERT INTO hwid_licenses (hwid, label, package, user_name, user_email, expired_at) VALUES (?, ?, ?, ?, ?, ?)',
                [hwid, body.label || '', body.package || 'Lifetime', body.user_name || 'User', body.user_email || '', body.expired_at || null]
            );
            return redirect('/admin?success=HWID+added');
        } catch (e) {
            const msg = e.message.includes('UNIQUE') ? 'HWID+already+exists' : encodeURIComponent(e.message);
            return redirect('/admin?error=' + msg);
        }
    }

    // ── Update status (ban/activate) ──
    if (path === '/admin/hwid/status' && method === 'POST') {
        const body = await parseForm(request);
        await runSql(env.DB,
            "UPDATE hwid_licenses SET status = ?, updated_at = datetime('now','localtime') WHERE id = ?",
            [body.status, body.id]
        );
        return redirect('/admin');
    }

    // ── Edit HWID ──
    if (path === '/admin/hwid/edit' && method === 'POST') {
        const body = await parseForm(request);
        await runSql(env.DB,
            "UPDATE hwid_licenses SET hwid=?, label=?, package=?, user_name=?, user_email=?, expired_at=?, status=?, updated_at=datetime('now','localtime') WHERE id=?",
            [body.hwid, body.label || '', body.package || 'Lifetime', body.user_name || '', body.user_email || '', body.expired_at || null, body.status || 'active', body.id]
        );
        return redirect('/admin?success=HWID+updated');
    }

    // ── Delete HWID ──
    if (path === '/admin/hwid/delete' && method === 'POST') {
        const body = await parseForm(request);
        await runSql(env.DB, 'DELETE FROM hwid_licenses WHERE id = ?', [body.id]);
        return redirect('/admin?success=HWID+deleted');
    }

    // ── Clear logs ──
    if (path === '/admin/logs/clear' && method === 'POST') {
        await runSql(env.DB, 'DELETE FROM request_logs');
        return redirect('/admin?success=Logs+cleared');
    }

    // ── API: list HWIDs (JSON) ──
    if (path === '/admin/api/hwids' && method === 'GET') {
        const lics = await queryAll(env.DB, 'SELECT * FROM hwid_licenses ORDER BY created_at DESC');
        return new Response(JSON.stringify(lics), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // ── 404 ──
    return new Response('Not Found', { status: 404 });
}
