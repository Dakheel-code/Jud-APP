import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  _client = postgres(connectionString, {
    prepare: false,
    ssl: 'require',
    connection: {
      application_name: 'jud-app',
    },
  });

  _db = drizzle(_client, { schema });
  return _db;
}
