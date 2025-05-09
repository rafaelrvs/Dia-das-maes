// components/ModalTelaCredito.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';

type ModalProps = {
  setModalTela: React.Dispatch<React.SetStateAction<boolean>>;
};

// Tipagem da resposta da criação de sessão
interface CreateCheckoutSessionResponse {
  url: string;
  sessionId: string;
  error?: string;
}

// Tipagem da verificação de pagamento
interface CheckPaymentResponse {
  paymentStatus: 'paid' | 'unpaid' | string;
}

export default function ModalTelaCredito({ setModalTela }: ModalProps) {
  const [email, setEmail] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Inicia a sessão de checkout e abre em nova aba
  const handleConfirmEmail = async () => {
    if (!email) {
      setError('Digite um e-mail válido.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: email }),
      });

      const data: CreateCheckoutSessionResponse = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar sessão.');
      }

      setCheckoutUrl(data.url);
      setSessionId(data.sessionId);
      window.open(data.url, '_blank');
    } catch (e: unknown) {
      // type guard para extrair mensagem de erro
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Polling ao retornar ao foco para verificar pagamento
  const checkPayment = useCallback(async () => {
    if (!sessionId) return;

    try {
      const res = await fetch('/api/check-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data: CheckPaymentResponse = await res.json();
      setPaymentStatus(data.paymentStatus);

      if (data.paymentStatus === 'paid') {
        window.removeEventListener('focus', checkPayment);
      }
    } catch {
      // se quiser, trate um erro aqui também
    }
  }, [sessionId]);

  useEffect(() => {
    if (checkoutUrl && sessionId) {
      window.addEventListener('focus', checkPayment);
      return () => window.removeEventListener('focus', checkPayment);
    }
  }, [checkoutUrl, sessionId, checkPayment]);

  // Se pagamento confirmado
  if (paymentStatus === 'paid') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg text-center space-y-4">
          <h2 className="text-2xl font-semibold text-green-600">
            Pagamento confirmado!
          </h2>
          <p>Seus 5 créditos foram liberados 🚀</p>
          <button
            onClick={() => setModalTela(false)}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  // Estado normal do modal
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center space-y-4">
        {!checkoutUrl ? (
          <>
            <h2 className="text-2xl font-semibold text-[#EA4C89]">
              Pagar 5 créditos (R$ 1,90)
            </h2>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg "
              disabled={loading}
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              onClick={handleConfirmEmail}
              disabled={loading}
              className={`mt-4 px-6 py-2 rounded-lg ${
                loading ? 'bg-blue-300' : 'bg-[#EA4C89] text-white'
              }`}
            >
              {loading ? 'Carregando...' : 'Gerar Link de Pagamento'}
            </button>
            <button
              onClick={() => setModalTela(false)}
              disabled={loading}
              className="mt-2 px-6 py-2 border border-[#EA4C89] text-[#EA4C89] rounded-lg"
            >
              Cancelar
            </button>
          </>
        ) : (
        
            <div className="flex flex-col items-center space-y-4">
              {/* Spinner */}
              <div className="w-8 h-8 border-4 border-t-[#EA4C89] border-gray-200 rounded-full animate-spin" />
              <p>Checkout aberto, aguarde a confirmação de pagamento.</p>
            </div>
         
         
          
        )}
      </div>
    </div>
  );
}
