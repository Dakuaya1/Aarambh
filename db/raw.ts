import { env } from 'cloudflare:workers';
export function database() { if(!env.DB) throw new Error('Database is temporarily unavailable.'); return env.DB; }
