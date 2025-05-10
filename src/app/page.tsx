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
import ModalTelaCredito from "./Components/ModalTelaCRedito/ModalTelaCredito";

export default function Home() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nomeMae, setNomeMae] = useState("");
  const [seuNome, setSeuNome] = useState("");
  const [estilo, setEstilo] = useState("Emocionante");
  const [mensagem, setMensagem] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalTela, setModalTela] = useState(false);


  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handlePreviewClick = (e: MouseEvent) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sel = e.target.files?.[0] ?? null;
    if (sel) setPreviewUrl(URL.createObjectURL(sel));
  };

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

  const handleGenerate = async (e: React.MouseEvent) => {
    e.preventDefault();

  
    
    if (!nomeMae.trim() || !seuNome.trim()) {
      alert("Por favor, preencha o nome da mãe e o seu nome.");
      return;
    }
  
    setLoading(true);
    setShowResult(false);
    setModalTela(false); // garantir estado inicial limpo
  
    try {
      const msg = await generateMessageAction({ nomeMae, estilo, seuNome });
      const mensagem = msg.replace(/#/g, '');
      setMensagem(mensagem);
      setShowResult(true);
    } catch (err) {
      if (err instanceof Error && err.message === "LIMIT_REACHED") {
        setModalTela(true);
        // Não mostra resultado se limite foi atingido
      } else {
        console.error(err);
        setMensagem(gerarLocal(estilo));
        setShowResult(true); // mostra fallback local
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-[#FFEFF3] font-geist-sans">
      {modalTela && (
        <ModalTelaCredito setModalTela={setModalTela}/>
      )}

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
            className="self-start px-4 py-2 bg-[#EC4899] text-white rounded-lg mb-6 active:scale-105 durate-2"
          >
            Escolha a imagem
          </button>

          <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
            {previewUrl ? (
              <img
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
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full text-gray-700/80"
            placeholder="Ex: Maria"
            type="text"
            value={nomeMae}
            onChange={(e) => setNomeMae(e.target.value)}
          />

          <label className="text-gray-700 mb-1">Seu nome:</label>
          <Form.InputForms
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full text-gray-700/80"
            placeholder="Ex: João"
            type="text"
            value={seuNome}
            onChange={(e) => setSeuNome(e.target.value)}
          />

          <label className="text-gray-700 mb-1">Estilo da mensagem:</label>
          <Form.SelectForms
            className="border border-gray-300 rounded-lg p-2 mb-6 w-full text-gray-700"
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
            disabled={loading}
            className={` active:scale-105 durate-2 self-start px-4 py-2 rounded-lg flex items-center ${loading ? 'bg-blue-300'  : 'bg-[#EC4899] text-white'}`}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {loading ? 'Gerando...' : 'Gerar mensagem'}
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
