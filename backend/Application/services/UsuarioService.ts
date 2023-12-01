import {ColecaoEscaladas} from "../../Domain/models/ColecaoEscaladas";
import {ColecaoBase} from "../../Domain/models/ColecaoBase";
import {ColecaoFavoritos} from "../../Domain/models/ColecaoFavoritos";
import {UsuarioRepository} from "../../Infrastructure/repositories/UsuarioRepository";
import {Usuario} from "../../Domain/models/Usuario";
import {UsuarioDTO} from "../../../shared/contratos/UsuarioDto";

export class UsuarioService {
    private usuarioRepository: UsuarioRepository;
    private usuarioAdapter: UsuarioAdapter;

    constructor(usuarioRepository?: UsuarioRepository, usuarioAdapter?: UsuarioAdapter) {
        this.usuarioRepository = usuarioRepository || new UsuarioRepository();
        this.usuarioAdapter = new UsuarioAdapter() || new UsuarioAdapter();
    }

    public async createUser(usuarioData: UsuarioDTO): Promise<UsuarioDTO> {
        const novoUsuario = new Usuario(
            usuarioData.Id,
            usuarioData.nome,
            usuarioData.email,
            usuarioData.senha,
            usuarioData.fotoPerfil,
            {} as ColecaoBase,
            {} as ColecaoEscaladas,
            {} as ColecaoFavoritos
        );

        novoUsuario.setSenha(usuarioData.senha);
        const usuarioCriado = await this.usuarioRepository.createUser(novoUsuario);
        return this.usuarioAdapter.toDto(usuarioCriado);
    }

    public async getUsuarioById(id_usuario: number): Promise<UsuarioDTO> {
        const usuario = await this.usuarioRepository.getUsuarioById(id_usuario);
        return this.usuarioAdapter.toDto(usuario);

    }

    public async login(email: string, senha: string): Promise<UsuarioDTO | null> {
        const usuario = await this.usuarioRepository.login(email, senha);
        return this.usuarioAdapter.toDto(usuario);
    }

    public async logout(usuarioId: number): Promise<void> {
        await this.usuarioRepository.logout(usuarioId);

    }

    public async alterarSenha(usuarioId: number, novaSenha: string): Promise<void> {
        await this.usuarioRepository.alterarSenha(usuarioId, novaSenha);

    }

    public async iniciarRecuperacaoSenha(email: string): Promise<void> {
        const usuario = await this.usuarioRepository.iniciarRecuperacaoSenha(email);
        // todo: validar necessidade desse método

    }

    public async redefinirSenha(token: string, novaSenha: string): Promise<void> {
        await this.usuarioRepository.redefinirSenha(token, novaSenha);

    }

    public async atualizarPerfil(usuarioId: number, dadosAtualizados: UsuarioDTO): Promise<UsuarioDTO> {
        const usuario = await this.usuarioRepository.atualizarPerfil(usuarioId, dadosAtualizados);
        return this.usuarioAdapter.toDto(usuario);
    }

    public async verificarEmail(email: string): Promise<boolean> {
        const existe = await this.usuarioRepository.getUsuarioByEmail(email);
        return existe;

    }

}

import {UsuarioAdapter} from "../../Infrastructure/adapters/UsuarioAdapter";
