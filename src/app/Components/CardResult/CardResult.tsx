import React, { useRef } from "react";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";

interface CardResultProps {
  nome: string;
  previewUrl: string | null;
  mensagem: string;
}

const CardResult: React.FC<CardResultProps> = ({ nome, previewUrl, mensagem }) => {
  const exportRef = useRef<HTMLDivElement>(null);

  // Converte imagens blob: para dataURL inline antes de exportar
  const prepareImages = async () => {
    if (!exportRef.current) return;
    const imgs = Array.from(exportRef.current.querySelectorAll('img')) as HTMLImageElement[];
    await Promise.all(
      imgs.map((img) => {
        const src = img.src;
        if (src.startsWith('blob:')) {
          return fetch(src)
            .then((res) => res.blob())
            .then(
              (blob) =>
                new Promise<void>((resolve) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    img.src = reader.result as string;
                    resolve();
                  };
                  reader.readAsDataURL(blob);
                })
            );
        }
        return Promise.resolve();
      })
    );
  };

  const handleDownloadPNG = async () => {
    if (!exportRef.current) return;
    try {
      await prepareImages();
      const dataUrl = await htmlToImage.toPng(exportRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "mensagem-dia-das-maes.png";
      link.click();
    } catch (error) {
      console.error("Erro ao gerar PNG:", error);
    }
  };

  return (
    <div className="mt-8 w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
      <div ref={exportRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Sua foto"
              className="rounded-lg object-contain max-w-60 max-h-60"
            />
          ) : (
            <span className="text-gray-400">Nenhuma foto selecionada</span>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <h2 className="text-2xl text-[#EA4C89] font-['Dancing Script',cursive] mb-4">
            Sua Mensagem Especial
          </h2>
          <p className="flex-1 italic text-gray-700 mb-6 whitespace-pre-wrap">
            {mensagem}
          </p>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleDownloadPNG}
          className="px-4 py-2 bg-[#EC4899] text-white rounded-lg"
        >
          Compartilhar
        </button>
  
      </div>
    </div>
  );
};

export default CardResult;
