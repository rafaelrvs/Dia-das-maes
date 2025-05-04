"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  MouseEvent,
} from "react";
import Image from "next/image";
import { Form } from "./Components/Form";
import CardResult from "./Components/CardResult/CardResult";
import { generateMessageAction } from "./action/postMessage";

export default function Home() {
  // const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nomeMae, setNomeMae] = useState("");
  const [seuNome, setSeuNome] = useState("");
  const [estilo, setEstilo] = useState("Emocionante");
  const [mensagem, setMensagem] = useState("");
  const [showResult, setShowResult] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Revoga o object URL antigo
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Abre o seletor de arquivo
  const handlePreviewClick = (e: MouseEvent) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  // Gera preview ao selecionar arquivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sel = e.target.files?.[0] ?? null;
  
    if (sel) setPreviewUrl(URL.createObjectURL(sel));
  };

  // Fallback local
  function gerarLocal(estilo: string) {
    switch (estilo) {
      case "Emocionante":
        return `Querida ${nomeMae},\n\nneste Dia das Mães meu coração se aquece ao lembrar de cada gesto seu. Sua dedicação e seu amor me acompanham em todos os momentos. Obrigado(a) por ser meu porto seguro e minha inspiração.`;
      case "Divertida":
        return `Ei ${nomeMae}! 🚀\n\nSe eu tivesse um troféu de melhor mãe do universo, com certeza ele teria seu nome gravado em neon! Obrigado(a) por transformar o dia a dia em uma aventura cheia de risos.`;
      case "Agradecida":
        return `Minha amada ${nomeMae},\n\nsou profundamente grato(a) por cada sacrifício, cada conselho e cada abraço. Você é meu exemplo de força e carinho. Feliz Dia das Mães!`;
      case "Poética":
        return `Ó flor mais rara, ${nomeMae},\n\nteu amor é verso que embala minha alma, e teu abraço, melodia que aquece meu ser. Hoje celebro a poesia que você é na minha vida.`;
      default:
        return `Querida ${nomeMae},\n\nFeliz Dia das Mães!`;
    }
  }

  // Chama a API do Gemini e, em caso de erro, usa gerarLocal
  const handleGenerate = async (e: MouseEvent) => {
    e.preventDefault();
    if (!nomeMae.trim() || !seuNome.trim()) {
      return alert("Por favor, preencha o nome da mãe e o seu nome.");
    }

    try {
      // **Aqui** chamamos diretamente a Server Action
      const msg = await generateMessageAction({ nomeMae, estilo, seuNome });
      setMensagem(msg);
  
      
    } catch (err) {
      console.error(err);
      setMensagem(gerarLocal(estilo));
    } finally {
      setShowResult(true);
    }
  };
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-[#FFEFF3] font-geist-sans">
      {/* Estrelas decorativas */}
      <Image
        src="/image/star.png"
        alt=""
        width={60}
        height={60}
        className="absolute top-8 left-8 opacity-70"
      />
      <Image
        src="/image/star.png"
        alt=""
        width={60}
        height={60}
        className="absolute bottom-8 right-8 opacity-70"
      />

      {/* Cabeçalho */}
      <h1 className="mt-4 text-5xl text-[#EA4C89] font-['Dancing Script',cursive]">
        Feliz Dia das Mães
      </h1>
      <p className="mt-2 text-gray-600 text-lg">
        Crie uma mensagem especial para celebrar o amor materno
      </p>
      <span className="mt-2 text-[#EA4C89] text-2xl animate-pulse">❤️</span>

      {/* Formulário */}
      <div className="mt-8 w-full max-w-4xl bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Coluna esquerda: imagem */}
        <div className="flex flex-col">
          <h2 className="text-gray-500 font-semibold mb-2">Adicione uma foto</h2>
          <p className="text-gray-500/70 mb-4">
            Clique em “Escolha a imagem” para selecionar:
          </p>

          <Form.InputForms
            ref={inputRef}
            className="hidden"
            type="file"
            onChange={handleFileChange}
          />

          <button
            onClick={handlePreviewClick}
            className="self-start px-4 py-2 bg-[#EC4899] text-white rounded-lg mb-6"
          >
            Escolha a imagem
          </button>

          <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="preview"
                className="object-contain w-full h-full"
              />
            ) : (
              <span className="text-gray-400">Sua imagem aparecerá aqui</span>
            )}
          </div>
        </div>

        {/* Coluna direita: inputs e botão */}
        <div className="flex flex-col">
          <h2 className="text-gray-500 font-semibold mb-2">Crie sua mensagem</h2>
          <p className="text-gray-500/70 mb-4">
            Personalize sua mensagem para o Dia das Mães:
          </p>

          <label className="text-gray-700 mb-1">Nome da sua mãe:</label>
          <Form.InputForms
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            placeholder="Ex: Maria"
            type="text"
            value={nomeMae}
            onChange={(e) => setNomeMae(e.target.value)}
          />

          <label className="text-gray-700 mb-1">Seu nome:</label>
          <Form.InputForms
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            placeholder="Ex: João"
            type="text"
            value={seuNome}
            onChange={(e) => setSeuNome(e.target.value)}
          />

          <label className="text-gray-700 mb-1">Estilo da mensagem:</label>
          <Form.SelectForms
            className="border border-gray-300 rounded-lg p-2 mb-6 w-full"
            value={estilo}
            onChange={(e) => setEstilo(e.target.value)}
          >
            <option value="Emocionante">Emocionante</option>
            <option value="Divertida">Divertida</option>
            <option value="Agradecida">Agradecida</option>
            <option value="Poética">Poética</option>
          </Form.SelectForms>

          <button
            onClick={handleGenerate}
            className="self-start px-4 py-2 bg-[#EC4899] text-white rounded-lg"
          >
            Gerar mensagem
          </button>
        </div>
      </div>

      {/* Resultado */}
      {showResult && (
        <CardResult nome={seuNome} previewUrl={previewUrl} mensagem={mensagem} />
      )}

      {/* Rodapé */}
      <p className="mt-8 text-gray-400 text-sm flex items-center space-x-2">
        <span className="animate-pulse">❤️</span>
        <span className="text-gray-900">Feito com amor para todas as mães</span>
        <span className="animate-pulse">❤️</span>
      </p>
    </div>
  );
}
