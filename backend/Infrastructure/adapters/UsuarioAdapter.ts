import {UsuarioDTO} from "../../../shared/contratos/UsuarioDto";
import {Usuario} from "../../Domain/entities/Usuario";
import {ColecaoBase} from "../../Domain/entities/ColecaoBase";
import {ColecaoEscaladas} from "../../Domain/entities/ColecaoEscaladas";
import {ColecaoFavoritos} from "../../Domain/entities/ColecaoFavoritos";

export class UsuarioAdapter {

    toRavenDBDocument(usuario: Usuario, colecao: ColecaoBase, historico: ColecaoEscaladas, favoritos: ColecaoFavoritos): UsuarioDTO {
        const usuarioDto: UsuarioDTO = {
            Id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.getSenha(),
            fotoPerfil: usuario.fotoPerfil,
            colecoes: colecao as any,
            historico: historico as any,
            favoritos: favoritos as any
        };
        return usuarioDto;
    }

    fromRavenDBDocument(usuarioDto: UsuarioDTO): Usuario {
        const usuario = new Usuario(
            usuarioDto.Id,
            usuarioDto.nome,
            usuarioDto.email,
            usuarioDto.senha,
            usuarioDto.fotoPerfil,
            usuarioDto.colecoes as any,
            usuarioDto.historico as any,
            usuarioDto.favoritos as any
        );

        return usuario;
    }


    fromDto(usuarioDto: UsuarioDTO): Usuario {
        const usuario = new Usuario(
            usuarioDto.Id,
            usuarioDto.nome,
            usuarioDto.email,
            usuarioDto.senha,
            usuarioDto.fotoPerfil,
            usuarioDto.colecoes as any,
            usuarioDto.historico as any,
            usuarioDto.favoritos as any
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
            colecoes: usuario.colecao as any,
            historico: usuario.historico as any,
            favoritos: usuario.favoritos as any
        };
        return usuarioDto;
    }
}