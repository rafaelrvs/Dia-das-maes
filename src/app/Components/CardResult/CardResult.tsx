// Components/CardResult.tsx
import React from "react";

interface CardResultProps {
  nome: string;
  previewUrl: string | null;
  mensagem: string;
}

const CardResult: React.FC<CardResultProps> = ({ nome, previewUrl, mensagem }) => (
  <div className="
    mt-8 w-full max-w-4xl
    bg-white rounded-2xl shadow-lg
    grid grid-cols-1 md:grid-cols-2 gap-8 p-8
  ">
    {/* preview da imagem */}
    <div className="flex items-center justify-center">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Sua foto"
          className="rounded-lg object-contain w-full h-full"
        />
      ) : (
        <span className="text-gray-400">Nenhuma foto selecionada</span>
      )}
    </div>

    {/* texto da mensagem */}
    <div className="flex flex-col justify-between">
      <h2 className="text-2xl text-[#EA4C89] font-['Dancing Script',cursive] mb-4">
        Sua Mensagem Especial
      </h2>
      <p className="flex-1 italic text-gray-700 mb-6 whitespace-pre-wrap">
        {mensagem}
      </p>
      <p className="text-right text-gray-500">Com todo amor, {nome}</p>
    </div>
  </div>
);

export default CardResult;
