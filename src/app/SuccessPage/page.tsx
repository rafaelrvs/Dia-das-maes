// src/app/sucesso/page.tsx
"use client"
export const dynamic = 'force-dynamic';

export default function SuccessPage() {
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <h1 className="text-3xl font-semibold text-pink-600 mb-4">
          Pagamento confirmado! 🎉
        </h1>
        <p className="text-gray-700 mb-6">
          Sua compra foi realizada com sucesso. Obrigado por escolher nossos serviços!
        </p>
        <button
          onClick={() => {window.close()}}
          className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition"
        >
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
}
