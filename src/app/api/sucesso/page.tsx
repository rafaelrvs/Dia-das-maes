// src/app/sucesso/page.tsx
import Stripe from 'stripe';
import { cookies } from 'next/headers'; // se precisar auth

export const dynamic = 'force-dynamic'; // garantir fetch fresh

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  if (!sessionId) {
    return <p>Parâmetro de sessão não encontrado.</p>;
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
  });

  // Busca o status da sessão
  const session = await stripe.checkout.sessions.retrieve(sessionId);

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
          <h1 className="text-3xl font-bold text-red-600">Pagamento não confirmado</h1>
          <p className="mt-4">Status: {session.payment_status}</p>
        </>
      )}
    </div>
  );
}
