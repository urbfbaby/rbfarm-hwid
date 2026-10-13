/**
 * D1 Database helpers
 * D1 is bound as env.DB in wrangler.toml
 */

/** SELECT multiple rows → array of objects */
export async function queryAll(db, sql, params = []) {
    const { results } = await db.prepare(sql).bind(...params).all();
    return results || [];
}

/** SELECT single row → object or null */
export async function queryOne(db, sql, params = []) {
    const row = await db.prepare(sql).bind(...params).first();
    return row || null;
}

/** INSERT / UPDATE / DELETE → void */
export async function runSql(db, sql, params = []) {
    await db.prepare(sql).bind(...params).run();
}
