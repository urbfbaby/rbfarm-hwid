-- GK FARM HWID License Database Schema (Cloudflare D1)

CREATE TABLE IF NOT EXISTS hwid_licenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hwid TEXT UNIQUE NOT NULL,
    label TEXT DEFAULT '',
    package TEXT DEFAULT 'Lifetime',
    status TEXT DEFAULT 'active',
    user_name TEXT DEFAULT 'User',
    user_email TEXT DEFAULT '',
    expired_at TEXT DEFAULT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS request_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hwid TEXT NOT NULL,
    ip_address TEXT DEFAULT '',
    user_agent TEXT DEFAULT '',
    result TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now','localtime'))
);
