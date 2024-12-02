import pg, { PoolClient } from "pg";

const pool = new pg.Pool({
    host: "localhost",
    user: "postgres",
    password: "postgres",
    database: "LMSDB",
    port: 5432,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export let client: PoolClient;

(async () => {
    client = await pool.connect();
})();
