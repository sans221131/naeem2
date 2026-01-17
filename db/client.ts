import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var __drizzleDb__: ReturnType<typeof drizzle> | undefined;
}

function getDb(): ReturnType<typeof drizzle> {
  if (globalThis.__drizzleDb__) {
    return globalThis.__drizzleDb__;
  }

  const connectionString = process.env.NEON_DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'NEON_DATABASE_URL is not configured. Set it in your environment before using db.'
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
  const dbInstance = drizzle(neonClient, { schema });

  if (process.env.NODE_ENV !== 'production') {
    globalThis.__drizzleDb__ = dbInstance;
  }

  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  }
});

export type DbInstance = typeof db;