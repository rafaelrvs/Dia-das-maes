// src/lib/redis.ts
import { Redis } from '@upstash/redis';

let client: Redis | null = null;

/**
 * Retorna o singleton do Upstash Redis.
 * Precisa de REDIS_URL e REDIS_TOKEN no .env.local
 */
export function getRedis(): Redis | null {
  if (client) return client;

  const url   = process.env.REDIS_URL;
  const token = process.env.REDIS_TOKEN;

  if (!url || !token) {
    console.warn(
      '🚨 Redis não configurado: faltando REDIS_URL ou REDIS_TOKEN'
    );
    return null;
  }

  client = new Redis({ url, token });
  console.log('✅ Upstash Redis inicializado');
  return client;
}
