export function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function escapeAttr(s) {
    if (!s) return '';
    return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

export function getAdminCSS() {
    return `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f1117;color:#e0e0e0;min-height:100vh}
.nav{background:rgba(20,20,30,0.95);border-bottom:1px solid #2a2a3a;padding:16px 32px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100}
.nav h1{font-size:20px;color:#fff} .nav h1 span{color:#7c5cfc}
.nav a{color:#888;text-decoration:none;font-size:14px} .nav a:hover{color:#fff}
.ct{max-width:1400px;margin:0 auto;padding:24px 32px}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
.sc{background:rgba(255,255,255,0.04);border:1px solid #2a2a3a;border-radius:12px;padding:20px;text-align:center}
.sc .n{font-size:36px;font-weight:700;color:#fff} .sc .l{font-size:13px;color:#888;margin-top:4px}
.sc.a .n{color:#4ade80} .sc.e .n{color:#fbbf24} .sc.b .n{color:#f87171}
table{width:100%;border-collapse:collapse;background:rgba(255,255,255,0.02);border:1px solid #2a2a3a;border-radius:12px;overflow:hidden}
th{background:rgba(255,255,255,0.05);padding:12px 16px;text-align:left;font-size:12px;text-transform:uppercase;color:#888;font-weight:600;border-bottom:1px solid #2a2a3a}
td{padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);font-size:13px;vertical-align:middle}
tr:hover{background:rgba(255,255,255,0.03)}
code{background:rgba(124,92,252,0.1);color:#a78bfa;padding:3px 8px;border-radius:4px;font-size:12px;font-family:Consolas,monospace}
.badge{display:inline-block;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600}
.sa{background:rgba(74,222,128,0.15);color:#4ade80}
.se{background:rgba(251,191,36,0.15);color:#fbbf24}
.sb{background:rgba(248,113,113,0.15);color:#f87171}
.acts{white-space:nowrap}
.bs{padding:6px 8px;border:none;border-radius:6px;cursor:pointer;font-size:14px;background:rgba(255,255,255,0.06);margin:0 2px}
.bs:hover{background:rgba(255,255,255,0.12)}
.bp{padding:10px 20px;border-radius:8px;border:none;background:linear-gradient(135deg,#7c5cfc,#5a3fd6);color:#fff;font-size:14px;font-weight:600;cursor:pointer}
.bp:hover{opacity:0.85}
.bd{padding:8px 16px;border-radius:8px;border:none;background:rgba(248,113,113,0.15);color:#f87171;font-size:13px;cursor:pointer}
.sh{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.sh h2{font-size:18px;color:#fff}
.tabs{display:flex;gap:4px;margin-bottom:20px}
.tab{padding:10px 20px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:500;background:rgba(255,255,255,0.05);color:#888}
.tab.active{background:rgba(124,92,252,0.2);color:#a78bfa} .tab:hover{color:#fff}
.tc{display:none} .tc.active{display:block}
.mo{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:200;align-items:center;justify-content:center}
.mo.show{display:flex}
.md{background:#1a1b25;border:1px solid #2a2a3a;border-radius:16px;padding:32px;width:500px;max-width:90vw}
.md h3{margin-bottom:20px;color:#fff;font-size:18px}
.fg{margin-bottom:16px} .fg label{display:block;margin-bottom:6px;font-size:13px;color:#888}
.fg input,.fg select{width:100%;padding:10px 14px;border-radius:8px;border:1px solid #2a2a3a;background:rgba(255,255,255,0.06);color:#fff;font-size:14px;outline:none}
.fg input:focus,.fg select:focus{border-color:#7c5cfc}
.ma{display:flex;gap:12px;margin-top:24px} .ma button{flex:1}
.bc{padding:10px;border-radius:8px;border:1px solid #2a2a3a;background:transparent;color:#888;cursor:pointer;font-size:14px}
.al{padding:12px 16px;border-radius:8px;margin-bottom:20px;font-size:14px}
.al-e{background:rgba(248,113,113,0.15);color:#f87171} .al-s{background:rgba(74,222,128,0.15);color:#4ade80}
.ls td:first-child{border-left:3px solid #4ade80} .lf td:first-child{border-left:3px solid #f87171}
@media(max-width:768px){.sg{grid-template-columns:repeat(2,1fr)}.ct{padding:16px}td,th{padding:8px}}`;
}
