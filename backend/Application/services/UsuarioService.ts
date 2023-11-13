import {ColecaoEscaladas} from "../../Domain/models/ColecaoEscaladas";
import {ColecaoBase} from "../../Domain/models/ColecaoBase";
import {ColecaoFavoritos} from "../../Domain/models/ColecaoFavoritos";
import {UsuarioRepository} from "../../Infrastructure/repositories/UsuarioRepository";
import {Usuario} from "../../Domain/models/Usuario";
import {UsuarioDTO} from "../../../shared/contratos/UsuarioDto";
import {UsuarioAdapter} from "../../Infrastructure/adapters/UsuarioAdapter";

export class UsuarioService {
    private usuarioRepository: UsuarioRepository;
    private usuarioAdapter: UsuarioAdapter;

    constructor(usuarioRepository: UsuarioRepository, usuarioAdapter: UsuarioAdapter) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioAdapter = new UsuarioAdapter();
    }


    public async getUsuarioById(id_usuario: number): Promise<Usuario> {
        const usuario = await this.usuarioRepository.getUsuarioById(id_usuario);
        return this.usuarioAdapter.fromDto(usuario);

    }

    public async login(email: string, senha: string): Promise<Usuario | null> {
        // Implementar lógica de autenticação
    }

    public async logout(usuarioId: number): Promise<void> {
        // Implementar lógica de logout
    }

    public async alterarSenha(usuarioId: number, novaSenha: string): Promise<void> {
        // Implementar lógica de alteração de senha
    }

    public async iniciarRecuperacaoSenha(email: string): Promise<void> {
        // Implementar lógica de início de recuperação de senha
    }

    public async redefinirSenha(token: string, novaSenha: string): Promise<void> {
        // Implementar lógica de redefinição de senha
    }

    public async atualizarPerfil(usuarioId: number, dadosAtualizados: UsuarioDTO): Promise<Usuario> {
        // Implementar lógica de atualização de perfil
    }

    public async verificarEmail(email: string): Promise<boolean> {
        // Implementar lógica de verificação de email
    }

}