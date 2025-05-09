// src/app/api/check-payment/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getRedis } from '@/app/lib/redis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

interface CheckPaymentBody {
  sessionId: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { sessionId } = (await req.json()) as CheckPaymentBody;
  if (!sessionId) {
    return NextResponse.json(
      { error: 'sessionId é obrigatório.' },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const status = session.payment_status; // 'paid', 'unpaid', etc.

  if (status === 'paid' && session.customer_email) {
    const email = session.customer_email;
    const redis = getRedis();
    if (redis) {
      // --- limpo o IP antigo (como antes) ---
      const hist = await redis.lrange('card:ips', 0, -1);
      const oldIp = hist.find((item) => !item.includes('@'));
      if (oldIp) {
        await redis.del(`card:${oldIp}:count`);
        await redis.lrem('card:ips', 0, oldIp);
      }

      // --- AQUI: adiciono 5 créditos ao e-mail ---
      const emailKey = `card:${email}:count`;
      const CREDITS_TO_ADD = 5;
      // INCRBY: se não existir, vira 5; se existir, soma 5
      const newCount = await redis.incrby(emailKey, CREDITS_TO_ADD);
      // garante expirar em 24h
      await redis.expire(emailKey, 24 * 60 * 60);

      // atualiza o histórico empilhando o e-mail
      await redis.lpush('card:ips', email);
      await redis.ltrim('card:ips', 0, 999);

      // opcional: retornar quantos créditos o usuário tem agora
      return NextResponse.json({ paymentStatus: status, credits: newCount });
    }
  }

  return NextResponse.json({ paymentStatus: status });
}
