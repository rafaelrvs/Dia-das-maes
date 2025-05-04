"use server";

export async function generateMessageAction({
  nomeMae,
  estilo,
  seuNome,
}: {
  nomeMae: string;
  estilo: string;
  seuNome: string;
}): Promise<string> {
  // 1) Monta o prompt dinamicamente
  const prompt = `Gere uma mensagem para o Dia das Mães no estilo "${estilo}", ` +
                 `endereçada a "${nomeMae}", assinada por "${seuNome}".`;

  // 2) Chama o Gemini usando o prompt
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        contents: [
          { parts: [{ text: prompt }] }
        ]
      }),
    }
  );

  // 3) Tratamento de erro HTTP
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API retornou status ${res.status}: ${errorText}`);
  }

  // 4) Extrai o JSON e o texto gerado no caminho correto
  const json = await res.json();
  console.log('Resposta do Gemini:', JSON.stringify(json, null, 2));

  const message =
    json?.candidates?.[0]?.content?.parts?.[0]?.text
    ?? json?.candidates?.[0]?.output
    ?? "";

  // 5) Retorna o texto gerado
  return message.trim();
}
