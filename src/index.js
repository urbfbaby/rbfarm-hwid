/**
 * GK FARM HWID Verification Server
 * Cloudflare Workers + D1 Entry Point
 *
 * Routes:
 *   GET  /api/checkhwid/cekemu/?hw=<HWID>  → HWID verification API
 *   GET  /admin/login                       → Login page
 *   POST /admin/login                       → Login handler
 *   GET  /admin                             → Dashboard (auth required)
 *   POST /admin/hwid/add                    → Add HWID
 *   POST /admin/hwid/status                 → Toggle status
 *   POST /admin/hwid/edit                   → Edit HWID
 *   POST /admin/hwid/delete                 → Delete HWID
 *   POST /admin/logs/clear                  → Clear request logs
 *   GET  /admin/api/hwids                   → JSON list of HWIDs
 *   GET  /admin/logout                      → Logout
 */

import { handleHwidCheck } from './api.js';
import { handleAdmin } from './admin.js';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // ── HWID API ──
            if (path === '/api/checkhwid/cekemu' || path === '/api/checkhwid/cekemu/') {
                return await handleHwidCheck(request, env);
            }

            // ── Admin routes ──
            if (path === '/admin' || path.startsWith('/admin/')) {
                return await handleAdmin(request, env, path);
            }

            // ── Health check ──
            if (path === '/health') {
                return new Response(JSON.stringify({
                    status: 'ok',
                    service: 'GK FARM HWID Server',
                    timestamp: new Date().toISOString()
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // ── Fallback: pass through to origin (Pages site) ──
            // When using Workers Routes on yaelahky.com, unmatched paths
            // fall through to the Pages site automatically.
            // If this Worker is standalone, return 404.
            return new Response('Not Found', { status: 404 });

        } catch (err) {
            console.error('Worker error:', err.stack || err.message);
            return new Response(JSON.stringify({
                success: false,
                status: 'error',
                message: 'Internal server error'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
};
