'use client'
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Compra cancelada 😔
        </h1>
        <p className="text-gray-700 mb-6">
          Sentimos muito, sua compra foi cancelada. Se precisar de ajuda, entre em contato conosco.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition"
        >
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
}
