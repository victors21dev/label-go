// app/_actions/generate-link.ts
import { generateEncryptedToken } from "./mint-data";

// Definimos o formato do payload para ter ajuda do Autocomplete
export interface LabelPayload {
  setor: string;
  coordenador: string;
  validade: string;
  tipo: string;
}

export async function handleGenerateLink(payload: LabelPayload) {
  // Agora usamos o parâmetro 'payload' recebido
  const data = generateEncryptedToken(payload);
  return data;
}
