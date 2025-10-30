import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

let sql = null;
let db = null;

// Obtener URL de PostgreSQL de cualquier variable disponible
const POSTGRES_URL = process.env.POSTGRES_URL || 
                     process.env.DATABASE_URL_POSTGRES || 
                     process.env.NEON_DATABASE_URL || 
                     process.env.PG_CONNECTION_STRING ||
                     process.env.DATABASE_URL;

// Inicializar solo si hay URL de PostgreSQL y está habilitado
if (POSTGRES_URL && process.env.USE_POSTGRES !== 'false') {
  try {
    sql = neon(POSTGRES_URL);
    db = drizzle(sql);
    console.log('✅ PostgreSQL initialized');
  } catch (error) {
    console.error('❌ PostgreSQL initialization error:', error.message);
    console.log('⚠️  Continuing without PostgreSQL...');
  }
} else {
  console.log('⚠️  PostgreSQL disabled - using MongoDB only');
}

// Helper para verificar conexión
export const checkPostgresConnection = async () => {
  if (!sql) {
    console.log('⚠️  PostgreSQL not configured (DATABASE_URL not set)');
    return false;
  }
  
  try {
    await sql`SELECT 1`;
    console.log('✅ PostgreSQL connected successfully');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    return false;
  }
};

export { db };
export default db;
