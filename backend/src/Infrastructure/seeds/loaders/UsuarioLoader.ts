import { AppDataSource } from '../../config/db';
import { Usuario } from '../../../Domain/entities/Usuario';
import { Colecao } from '../../../Domain/entities/Colecao';
import bcrypt from 'bcrypt';

const EMAIL_TESTE = 'teste@cumes.com.br';
const USERNAME_TESTE = 'cumes_teste';
const SENHA_TESTE = 'teste123';
const IMAGEM_PADRAO_ID = 3;

export interface UsuarioTesteIds {
  usuarioId: number;
}

/**
 * Cria ou busca o usuário de teste para desenvolvimento.
 * Credenciais: teste@cumes.com.br / teste123
 * Idempotente: não duplica se já existir.
 */
export async function runUsuarioLoader(): Promise<UsuarioTesteIds> {
  const usuarioRepo = AppDataSource.getRepository(Usuario);
  const colecaoRepo = AppDataSource.getRepository(Colecao);

  let usuario = await usuarioRepo.findOne({ where: { email: EMAIL_TESTE } });

  if (!usuario) {
    const senhaHash = await bcrypt.hash(SENHA_TESTE, 10);
    usuario = usuarioRepo.create({
      nome: 'Usuário Teste Cumes',
      email: EMAIL_TESTE,
      username: USERNAME_TESTE,
      password_hash: senhaHash,
      foto_perfil: { id: IMAGEM_PADRAO_ID } as any,
      perfil_publico: true,
      localizacao: 'Rio de Janeiro, RJ',
      data_atividade: '2025-03-15',
      biografia: 'Perfil de teste para desenvolvimento do Cumes Brasil. Use para explorar o feed, escaladas e funcionalidades.'
    });
    await usuarioRepo.save(usuario);

    const favoritas = colecaoRepo.create({
      nome: 'Favoritas',
      descricao: 'Vias favoritas do usuário',
      usuario
    });
    await colecaoRepo.save(favoritas);

    console.log(`[UsuarioLoader] Usuário de teste criado: ${EMAIL_TESTE} (senha: ${SENHA_TESTE})`);
  } else {
    let atualizado = false;
    if (!usuario.username) {
      usuario.username = USERNAME_TESTE;
      atualizado = true;
    }
    if (atualizado) {
      await usuarioRepo.save(usuario);
      console.log(`[UsuarioLoader] Usuário de teste atualizado: username=${USERNAME_TESTE}`);
    } else {
      console.log(`[UsuarioLoader] Usuário de teste já existe: ${EMAIL_TESTE}`);
    }
  }

  return { usuarioId: usuario.id };
}
