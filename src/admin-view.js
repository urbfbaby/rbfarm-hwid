import { escapeHtml, escapeAttr, getAdminCSS } from './helpers.js';
import { getAdminModals } from './admin-modals.js';

export function getAdminPage(lics, stats, logs) {
    const css = getAdminCSS();
    const lr = buildLicRows(lics);
    const lgr = buildLogRows(logs);
    const el = '<tr><td colspan="8" style="text-align:center;color:#666;padding:40px">No licenses yet</td></tr>';
    const elg = '<tr><td colspan="4" style="text-align:center;color:#666;padding:40px">No logs yet</td></tr>';

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>HWID Admin</title><style>${css}</style></head><body>
<nav class="nav"><h1>🔑 <span>HWID</span> Admin</h1><div><a href="/admin" style="margin-right:16px">Dashboard</a><a href="/admin/logout">Logout →</a></div></nav>
<div class="ct"><div id="alerts"></div>
<div class="sg"><div class="sc"><div class="n">${stats.total}</div><div class="l">Total</div></div><div class="sc a"><div class="n">${stats.active}</div><div class="l">Active</div></div><div class="sc e"><div class="n">${stats.expired}</div><div class="l">Expired</div></div><div class="sc b"><div class="n">${stats.banned}</div><div class="l">Banned</div></div></div>
<div class="tabs"><button class="tab active" onclick="swTab('lic')">📋 Licenses</button><button class="tab" onclick="swTab('log')">📝 Logs</button></div>
<div id="tab-lic" class="tc active"><div class="sh"><h2>HWID Licenses</h2><button class="bp" onclick="document.getElementById('addM').classList.add('show')">+ Add HWID</button></div>
<table><thead><tr><th>HWID</th><th>Label</th><th>Pkg</th><th>Status</th><th>User</th><th>Expires</th><th>Created</th><th>Actions</th></tr></thead><tbody>${lr || el}</tbody></table></div>
<div id="tab-log" class="tc"><div class="sh"><h2>Recent Requests</h2><form method="POST" action="/admin/logs/clear" onsubmit="return confirm('Clear?')"><button type="submit" class="bd">🗑️ Clear</button></form></div>
<table><thead><tr><th>Time</th><th>HWID</th><th>IP</th><th>Result</th></tr></thead><tbody>${lgr || elg}</tbody></table></div></div>
` + getAdminModals() + `</body></html>`;
}

function buildLicRows(lics) {
    return lics.map(l => {
        const sc = l.status === 'active' ? 'sa' : l.status === 'expired' ? 'se' : 'sb';
        const si = l.status === 'active' ? '✅' : l.status === 'expired' ? '⏰' : '🚫';
        const tg = l.status === 'active'
            ? `<form method="POST" action="/admin/hwid/status" style="display:inline"><input type="hidden" name="id" value="${l.id}"><input type="hidden" name="status" value="banned"><button class="bs">🚫</button></form>`
            : `<form method="POST" action="/admin/hwid/status" style="display:inline"><input type="hidden" name="id" value="${l.id}"><input type="hidden" name="status" value="active"><button class="bs">✅</button></form>`;
        return `<tr><td><code>${escapeHtml(l.hwid)}</code></td><td>${escapeHtml(l.label || '-')}</td><td>${escapeHtml(l.package)}</td><td><span class="badge ${sc}">${si} ${l.status}</span></td><td>${escapeHtml(l.user_name || '-')}</td><td>${l.expired_at || 'Never'}</td><td>${l.created_at || '-'}</td><td class="acts"><button onclick="editH(${l.id},'${escapeAttr(l.hwid)}','${escapeAttr(l.label)}','${escapeAttr(l.package)}','${escapeAttr(l.user_name)}','${escapeAttr(l.user_email)}','${escapeAttr(l.expired_at || '')}','${l.status}')" class="bs">✏️</button>${tg}<form method="POST" action="/admin/hwid/delete" style="display:inline" onsubmit="return confirm('Delete?')"><input type="hidden" name="id" value="${l.id}"><button class="bs">🗑️</button></form></td></tr>`;
    }).join('');
}

function buildLogRows(logs) {
    return logs.map(l => `<tr class="${l.result === 'success' ? 'ls' : 'lf'}"><td>${l.created_at}</td><td><code>${escapeHtml(l.hwid)}</code></td><td>${escapeHtml(l.ip_address)}</td><td><span class="badge ${l.result === 'success' ? 'sa' : 'se'}">${l.result}</span></td></tr>`).join('');
}
