// src/app/sucesso/page.tsx
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

type IncomingSearch = { session_id?: string };

export default async function SuccessPage(
  props: { searchParams: Promise<IncomingSearch> }
) {
  // 1. Aguarda o Promise que vem do App Router
  const { session_id: sessionId } = await props.searchParams;

  // 2. Valida se veio sessionId
  if (!sessionId) {
    return <p>Parâmetro de sessão não encontrado.</p>;
  }

  // 3. Busca no Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
  });
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // 4. Renderiza resultado
  return (
    <div className="p-8 text-center">
      {session.payment_status === 'paid' ? (
        <>
          <h1 className="text-3xl font-bold text-green-600">
            Pagamento confirmado! 🎉
          </h1>
          <p className="mt-4">Seus 5 créditos foram liberados com sucesso.</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-red-600">
            Pagamento não confirmado
          </h1>
          <p className="mt-4">Status: {session.payment_status}</p>
        </>
      )}
    </div>
  );
}
