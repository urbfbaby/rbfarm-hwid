/**
 * HWID Check API Handler
 * GET /api/checkhwid/cekemu/?hw=<HWID>
 */
import { queryOne, runSql } from './db.js';

export async function handleHwidCheck(request, env) {
    const url = new URL(request.url);
    const hwid = url.searchParams.get('hw') || '';
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || '';
    const ua = request.headers.get('User-Agent') || '';

    console.log(`[${new Date().toISOString()}] HWID Check: ${hwid} from ${ip}`);

    if (!hwid) {
        await logReq(env.DB, hwid, ip, ua, 'missing');
        return jsonResponse({ success: false, status: 'error', message: 'HWID required' });
    }

    const lic = await queryOne(env.DB, 'SELECT * FROM hwid_licenses WHERE hwid = ?', [hwid]);
    if (!lic) {
        await logReq(env.DB, hwid, ip, ua, 'not_found');
        return jsonResponse({ success: false, status: 'not_found', message: 'HWID not registered' });
    }

    // Auto-expire check
    if (lic.expired_at && new Date(lic.expired_at) < new Date()) {
        await runSql(env.DB, "UPDATE hwid_licenses SET status='expired', updated_at=datetime('now','localtime') WHERE id=?", [lic.id]);
        lic.status = 'expired';
    }

    if (lic.status !== 'active') {
        await logReq(env.DB, hwid, ip, ua, 'inactive_' + lic.status);
        return jsonResponse({ success: false, status: lic.status, message: 'License is ' + lic.status });
    }

    await logReq(env.DB, hwid, ip, ua, 'success');
    return jsonResponse({
        success: true,
        status: 'active',
        message: 'HWID is active',
        data: {
            hwid,
            package: lic.package,
            expired: lic.expired_at,
            is_active: true,
            user: { name: lic.user_name, email: lic.user_email }
        }
    });
}

async function logReq(db, hwid, ip, ua, result) {
    try {
        await runSql(db, 'INSERT INTO request_logs (hwid, ip_address, user_agent, result) VALUES (?, ?, ?, ?)',
            [hwid || 'empty', ip, ua, result]);
    } catch (e) {
        console.error('Log err:', e.message);
    }
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
