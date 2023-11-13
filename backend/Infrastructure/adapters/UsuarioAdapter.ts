import {UsuarioDTO} from "../../../shared/contratos/UsuarioDto";
import {Usuario} from "../../Domain/models/Usuario";
import {ColecaoBase} from "../../Domain/models/ColecaoBase";
import {ColecaoEscaladas} from "../../Domain/models/ColecaoEscaladas";
import {ColecaoFavoritos} from "../../Domain/models/ColecaoFavoritos";

export class UsuarioAdapter {


    fromDto(usuarioDto: UsuarioDTO): Usuario {
        const usuario = new Usuario(
            usuarioDto.Id,
            usuarioDto.nome,
            usuarioDto.email,
            usuarioDto.senha,
            usuarioDto.fotoPerfil,
            //todo: implementar colecoes
        );
        return usuario;
    }

    public toDto(usuario: Usuario): UsuarioDTO {
        const usuarioDto: UsuarioDTO = {
            Id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.getSenha(),
            fotoPerfil: usuario.fotoPerfil,
            colecoes: usuario.colecao as ColecaoBase,
            historico: usuario.historico as ColecaoEscaladas,
            favoritos: usuario.favoritos as ColecaoFavoritos
        };
        return usuarioDto;
    }
}