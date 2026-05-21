import pg from 'pg';

const pool = new pg.Pool({
  user: 'diu',
  host: 'postgres_db', // Nombre del servicio en tu docker-compose
  database: 'diu_eventos',
  password: 'diu_2026',
  port: 5432,
});

export default pool;