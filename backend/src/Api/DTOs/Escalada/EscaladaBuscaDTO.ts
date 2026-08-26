import { Escalada } from '../../../Domain/entities/Escalada';
import { ImagemDTO } from '../Imagem/ImagemDTO';

type UsuarioResumo = {
  id: number;
  nome: string;
  username?: string;
};

type ParticipanteResumo = {
  id: number;
  nome: string;
  tipo: string;
  username?: string;
};

type ViaResumo = {
  id: number;
  nome: string;
  grau?: string;
  imagem?: ImagemDTO;
};

export class EscaladaBuscaDTO {
  id: number;
  data: Date;
  observacao?: string;
  usuario?: UsuarioResumo;
  via?: ViaResumo;
  participantes: ParticipanteResumo[];

  constructor(entity: Escalada) {
    this.id = entity.id;
    this.data = entity.data;
    this.observacao = entity.observacao;

    if (entity.usuario) {
      this.usuario = {
        id: entity.usuario.id,
        nome: entity.usuario.nome,
        username: entity.usuario.username
      };
    }

    if (entity.via) {
      const primeiraImagem = entity.via.viaImagens?.[0]?.imagem;
      this.via = {
        id: entity.via.id,
        nome: entity.via.nome,
        grau: entity.via.grau,
        imagem: primeiraImagem ? new ImagemDTO(primeiraImagem as any) : undefined
      };
    }

    this.participantes = (entity.participantes ?? []).map(p => ({
      id: p.id,
      nome: p.nome,
      tipo: p.tipo,
      username: p.username
    }));
  }
}
