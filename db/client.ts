import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var __drizzleDb__: ReturnType<typeof drizzle> | undefined;
}

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'NEON_DATABASE_URL is not configured. Set it in your environment before importing db.'
  );
}

// Basic validation to catch cases where an unexpected value (for example a
// relative path like "/api/activities") is provided instead of a Neon/Postgres
// connection string. This avoids cryptic errors later when libraries try to
// parse the value as a URL.
if (!/^postgres(?:ql)?:\/\//i.test(connectionString) && !/neon\.tech|neondatabase/i.test(connectionString)) {
  throw new Error(
    'NEON_DATABASE_URL appears to be invalid. It should be a Postgres connection string (e.g. starting with "postgresql://").'
  );
}

const neonClient = neon(connectionString);

export const db: ReturnType<typeof drizzle> =
  globalThis.__drizzleDb__ ?? drizzle(neonClient, { schema });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__drizzleDb__ = db;
}

export type DbInstance = typeof db;