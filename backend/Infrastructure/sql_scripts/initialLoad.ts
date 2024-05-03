import { FonteService } from "../../Application/services/FonteService";
import { FonteRepository } from "../repositories/FonteRepository";
import { Face } from "../../Domain/entities/Face";
import { FaceRepository } from "../repositories/FaceRepository";
import { FaceService } from "../../Application/services/FaceService";
import { MontanhaRepository } from "../repositories/MontanhaRepository";
import { MontanhaService } from "../../Application/services/MontanhaService";
import { Fonte } from "../../Domain/entities/Fonte";
import { Usuario } from "../../Domain/entities/Usuario";
import { Colecao } from "../../Domain/entities/Colecao";
import { Croqui } from "../../Domain/entities/Croqui";
import { Montanha } from "../../Domain/entities/Montanha";
import usuarioService from "../../Application/services/UsuarioService";
import { ColecaoRepository } from "../repositories/ColecaoRepository";
import { ColecaoService } from "../../Application/services/ColecaoService";
import { EscaladaRepository } from "../repositories/EscaladaRepository";
import { EscaladaService } from "../../Application/services/EscaladaService";
import { CroquiRepository } from "../repositories/CroquiRepository";
import { CroquiService } from "../../Application/services/CroquiService";
import { ViaRepository } from "../repositories/ViaRepository";
import { ViaService } from "../../Application/services/ViaService";

export const initialLoad = async () => {
  const fonteService = new FonteService(new FonteRepository());
  const montanhaService = new MontanhaService(new MontanhaRepository());
  const faceService = new FaceService(new FaceRepository(), fonteService, montanhaService);
  const viaService = new ViaService(new ViaRepository());
  const croquiService = new CroquiService(new CroquiRepository(), new ViaRepository());
  const escaladaService = new EscaladaService(new EscaladaRepository(), usuarioService, viaService);
  const colecaoService = new ColecaoService(new ColecaoRepository(), viaService, usuarioService);

  const data = {
    usuarios: [
      {
        "nome": "Carlos Caralinho",
        "email": "carlos@gmail.com.br",
        "password_hash": "123456",
        "fotoPerfil": "https://google.com"
      } as Usuario
    ],
    fontes: [
      {
        "autor": "ElmoJuh Boquete Fofo",
        "referencia": "Elmo Juh com sua revista ficticia"
      } as Fonte
    ],
    montanhas: [
      {
        "nome": "Morro Pica de Acucar",
        "localizacao": "Rio de Janeiro",
        "altura": 256,
        "fonte_id": 1
      } as Montanha
    ],
    faces: [
      {
        "nome": "Face Cequelete",
        "montanha_id": 1,
        "fonte_id": 1
      } as Face
    ],
    /*  vias: [
       {
         "nome": "Desafio do Pico",
         "grau": "VIsup",
         "crux": "Passagem técnica no meio da via",
         "artificial": "A2",
         "duracao": "D3",
         "exposicao": "E2",
         "extensao": 150.6,
         "conquistadores": "['Ana Silva', 'Carlos Rocha']",
         "detalhes": "Via de grande beleza cênica, com trechos de escalada livre e artificial. Exige boa técnica e resistência.",
         "data": "2021-07-15",
         "montanha_id": 1,
         "via_principal_id": null,
         "fonte_id": 1,
         "face_id": 1
       } as Via
     ], */
    croquis: [
      {
        "nome": "croqui de merda",
        "imagemUrl": "https://google.com",
        "autor": "Autor Filha da Puta",
        "descricao": "Croqui.",
        "fonte_id": 1
      } as Croqui
    ],
    /* escaladas: [
      {
        "nome": "Escalada do ovo esquerdo e direito",
        "data": "2021-07-15",
        "observacao": "Caguei 3 vezes na via",
        "usuario_id": 1,
        "via_id": 1
      } as Escalada
    ], */
    colecoes: [
      {
        "nome": "Colecao 3",
        "descricao": "col 3",
        "usuario_id": 1
      } as Colecao
    ]
  };

// Usuario, Fonte, Montanha, Face, Via, Croqui, Escalada, Colecao
  usuarioService.register(data.usuarios[0].nome, data.usuarios[0].email, data.usuarios[0].password_hash);
  fonteService.createFonte(data.fontes[0]);
  montanhaService.createMontanha(data.montanhas[0]);
  faceService.createFace(data.faces[0]);
  /* viaService.createVia(data.vias[0]); */
  croquiService.createCroqui(data.croquis[0]);
  /* escaladaService.createEscalada(data.escaladas[0]); */
  colecaoService.createColecao(data.colecoes[0]);
};




