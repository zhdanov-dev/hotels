import { Pool } from 'pg';

export const pool = new Pool({
	user: 'ethalon',
	password: 'hotelspassword',
	host: 'localhost',
	port: 5432,
	database: 'hotels',
});
