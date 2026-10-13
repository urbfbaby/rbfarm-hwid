export function getLoginPage(error) {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>HWID Admin - Login</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);min-height:100vh;display:flex;align-items:center;justify-content:center}
.box{background:rgba(255,255,255,0.05);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:40px;width:380px;color:#fff}
.box h1{text-align:center;margin-bottom:8px;font-size:24px}
.box p{text-align:center;color:#8888aa;margin-bottom:30px;font-size:14px}
.fg{margin-bottom:20px}
.fg label{display:block;margin-bottom:6px;font-size:13px;color:#aaa}
.fg input{width:100%;padding:12px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.08);color:#fff;font-size:14px;outline:none}
.fg input:focus{border-color:#7c5cfc}
.btn{width:100%;padding:12px;border-radius:8px;border:none;background:linear-gradient(135deg,#7c5cfc,#5a3fd6);color:#fff;font-size:15px;font-weight:600;cursor:pointer}
.btn:hover{opacity:0.9}
.err{background:rgba(255,50,50,0.15);color:#ff6b6b;padding:10px;border-radius:8px;margin-bottom:20px;text-align:center;font-size:13px}
</style></head><body>
<div class="box">
<h1>🔐 HWID Admin</h1><p>GK FARM License Management</p>
${error ? `<div class="err">${error}</div>` : ''}
<form method="POST" action="/admin/login">
<div class="fg"><label>Username</label><input type="text" name="username" required autofocus placeholder="Enter username"></div>
<div class="fg"><label>Password</label><input type="password" name="password" required placeholder="Enter password"></div>
<button type="submit" class="btn">Login</button>
</form></div></body></html>`;
}
