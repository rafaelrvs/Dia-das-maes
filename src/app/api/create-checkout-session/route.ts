// src/app/api/create-checkout-session/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';

// Inicializa o cliente Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

// Tipagem do corpo da requisição
interface CreateCheckoutSessionBody {
  userId: string;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse> {
  // 1) Parse com tipagem
  const body = (await req.json()) as CreateCheckoutSessionBody;
  const { userId } = body;

  if (!userId) {
    return NextResponse.json(
      { error: 'Campo userId é obrigatório.' },
      { status: 400 }
    );
  }

  try {
    // 2) Cria a sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userId,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { name: '5 Créditos' },
            unit_amount: 190, // R$ 1,90
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    });

    // 3) Retorna URL e sessionId

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: unknown) {
    // 4) Tratamento de erro tipado
    const message =
      error instanceof Error
        ? error.message
        : 'Erro desconhecido ao criar sessão.';
    console.error('Stripe error:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
