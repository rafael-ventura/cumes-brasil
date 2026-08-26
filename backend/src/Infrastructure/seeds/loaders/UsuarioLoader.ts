import { AppDataSource } from '../../config/db';
import { Usuario } from '../../../Domain/entities/Usuario';
import { Colecao } from '../../../Domain/entities/Colecao';
import { PapelUsuario, ehPapelValido } from '../../../Domain/enum/EPapelUsuario';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { loadYaml } from '../seedUtils';

const IMAGEM_PADRAO_ID = 3;

interface UsuarioYaml {
  email: string;
  username: string;
  senha: string;
  nome: string;
  perfil_publico: boolean;
  /** Papel explícito (usuario | moderador | admin). Tem prioridade sobre is_admin. */
  role?: string;
  /** Compat retro do YAML: is_admin: true equivale a role: admin. */
  is_admin?: boolean;
  localizacao?: string;
  data_atividade?: string;
  biografia?: string;
}

/** Resolve o papel esperado do YAML: `role` explícito tem prioridade; senão deriva de is_admin. */
function resolverPapel (u: UsuarioYaml): PapelUsuario {
  if (u.role && ehPapelValido(u.role)) return u.role;
  return u.is_admin ? PapelUsuario.Admin : PapelUsuario.Usuario;
}

export interface UsuarioSeedResult {
  /** username → id */
  porUsername: Map<string, number>;
}

async function garantirColecaoFavoritas(usuario: Usuario, colecaoRepo: Repository<Colecao>): Promise<void> {
  const existente = await colecaoRepo.findOne({
    where: { usuario: { id: usuario.id }, nome: 'Favoritas' }
  });
  if (existente) return;
  const favoritas = colecaoRepo.create({
    nome: 'Favoritas',
    descricao: 'Vias favoritas do usuário',
    usuario
  });
  await colecaoRepo.save(favoritas);
}

/**
 * Cria ou atualiza usuários de desenvolvimento a partir de `usuarios-teste.yaml`.
 * Idempotente por email. Em contas já existentes, a senha é re-sincronizada com o YAML
 * a cada seed (evita “Credenciais inválidas” após registro manual ou hash antigo).
 */
export async function runUsuarioLoader(): Promise<UsuarioSeedResult> {
  const lista = loadYaml<UsuarioYaml[]>('usuarios-teste.yaml');
  if (!lista?.length) {
    throw new Error('[UsuarioLoader] usuarios-teste.yaml vazio ou inválido');
  }

  const usuarioRepo = AppDataSource.getRepository(Usuario);
  const colecaoRepo = AppDataSource.getRepository(Colecao);
  const porUsername = new Map<string, number>();

  for (const u of lista) {
    const papelEsperado = resolverPapel(u);

    // Idempotência primária por `email`. Como `username` é único, também tentamos
    // reaproveitar um usuário já existente caso o `username` já esteja na base.
    let usuario = await usuarioRepo.findOne({ where: { email: u.email } });
    if (!usuario) {
      usuario = await usuarioRepo.findOne({ where: { username: u.username } });
    }

    if (!usuario) {
      const senhaHash = await bcrypt.hash(u.senha, 10);
      usuario = usuarioRepo.create({
        nome: u.nome,
        email: u.email,
        username: u.username,
        password_hash: senhaHash,
        foto_perfil: { id: IMAGEM_PADRAO_ID } as any,
        perfil_publico: u.perfil_publico,
        role: papelEsperado,
        localizacao: u.localizacao,
        data_atividade: u.data_atividade,
        biografia: u.biografia
      });
      await usuarioRepo.save(usuario);
      await garantirColecaoFavoritas(usuario, colecaoRepo);
      console.log(`[UsuarioLoader] Criado: ${u.email} (username: ${u.username}, senha: ${u.senha})`);
    } else {
      let atualizado = false;
      // Atualiza campos básicos caso a execução anterior tenha criado o usuário
      // por outro `email` (ou por outro lote de seed).
      if (usuario.email !== u.email) {
        usuario.email = u.email;
        atualizado = true;
      }

      if (!usuario.username) {
        usuario.username = u.username;
        atualizado = true;
      }
      if (usuario.perfil_publico !== u.perfil_publico) {
        usuario.perfil_publico = u.perfil_publico;
        atualizado = true;
      }
      if (usuario.role !== papelEsperado) {
        usuario.role = papelEsperado;
        atualizado = true;
      }

      const hashAtual = usuario.password_hash;
      const senhaConfere = hashAtual ? await bcrypt.compare(u.senha, hashAtual) : false;
      if (!senhaConfere) {
        usuario.password_hash = await bcrypt.hash(u.senha, 10);
        atualizado = true;
      }

      if (atualizado) {
        await usuarioRepo.save(usuario);
        console.log(`[UsuarioLoader] Atualizado: ${u.email}`);
      } else {
        console.log(`[UsuarioLoader] Já existe: ${u.email}`);
      }
      await garantirColecaoFavoritas(usuario, colecaoRepo);
    }

    porUsername.set(u.username, usuario.id);
  }

  return { porUsername };
}
