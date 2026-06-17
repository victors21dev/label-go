// app/_actions/generate-link.ts
import { generateEncryptedToken } from "./mint-data";

export interface LabelPayload {
  setor: string;
  coordenador: string;
  validade: string;
  tipo: string;
  local?: string;
  horario?: string;
  titulo?: string;
  descricao?: string;
  dataEvento?: string;
}

export async function handleGenerateLink(payload: LabelPayload) {
  // Agora usamos o parâmetro 'payload' recebido
  const data = generateEncryptedToken(payload);
  return data;
}
