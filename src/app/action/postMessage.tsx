"use server";

import { cookies, headers } from 'next/headers';
import Redis from 'ioredis';

// Inicializa o cliente Redis somente se estiver configurado
let redis: Redis | null = null;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL!);
  redis.on('error', (err) => console.warn('Redis error:', err));
}

export async function generateMessageAction({
  nomeMae,
  estilo,
  seuNome,
}: {
  nomeMae: string;
  estilo: string;
  seuNome: string;
}): Promise<string> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const clientIp = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // 1) Contador de gerações (máx 5 por IP/browser por dia)
  const keyCount = `card:${clientIp}:count`;
  let count = 0;
  if (redis) {
    try {
      count = await redis.incr(keyCount);
      const maxLimit = parseInt(process.env.GENERATION_LIMIT || '5', 10)
      if (count === maxLimit) {
        await redis.expire(keyCount, 24 * 60 * 60);
      }
    } catch (err) {
      console.warn('Redis count error, ignorando:', err);
    }
  } else {
    const cookieCount = parseInt(cookieStore.get('card_count')?.value || '0', 10);
    count = cookieCount + 1;
    cookieStore.set('card_count', count.toString(), {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60,
    });
  }
  if (count > 5) {
    throw new Error('LIMIT_REACHED');
  }

  // 2) Monta o prompt
  const prompt =
    `Gere uma mensagem para o Dia das Mães no estilo "${estilo}", ` +
    `endereçada a "${nomeMae}", assinada por "${seuNome}". A mensagem deve ser curta, de um parágrafo.`;

  // 3) Chama o Gemini
  let message = '';
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    if (!response.ok) {
      // Retorna flag de erro para front-end
      return '__API_ERROR__';
    }
    const json = await response.json();
    message =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ??
      json?.candidates?.[0]?.output ??
      '';
  } catch (err) {
    console.warn('Gemini fetch error:', err);
    return '__API_ERROR__';
  }

  return message.trim();
}
