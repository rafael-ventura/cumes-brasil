export type StatusSugestao = 'pendente' | 'aprovada' | 'rejeitada';

export interface IViaImageSugestao {
  id: number;
  via: { id: number; nome: string };
  imagem: { id: number; url: string };
  usuario: { id: number; username: string; nome: string } | null;
  status: StatusSugestao;
  creditos: string | null;
  motivo_rejeicao: string | null;
  admin_revisor: { id: number; username: string } | null;
  reviewed_at: string | null;
  created_at: string;
}
