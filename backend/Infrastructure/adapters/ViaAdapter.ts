// ViaAdapter.ts
import {Via} from '../../Domain/models/Via';
import {Croqui} from "../../Domain/models/Croqui";
import {ViaDocument} from "../documents/ViaDocument";
import {ViaDto} from "../../../shared/contratos/ViaDto";


export class ViaAdapter {
    // Converte uma Via para o formato de documento JSON para o RavenDB
    static toRavenDBDocument(via: Via): ViaDocument {
        return {
            '@metadata': {
                '@collection': 'Vias'
            },
            Id: via.id,
            Nome: via.nome,
            Id_Montanha: via.id_montanha,
            Grau: via.grau,
            Crux: via.crux,
            Artificial: via.artificial,
            Duracao: via.duracao,
            Exposicao: via.exposicao,
            Extensao: via.extensao,
            Conquistadores: via.conquistadores,
            Data: via.data,
            Id_Face: via.id_face,
            Id_Fonte: via.id_fonte,
            Id_Variante: via.id_variante,
            Croquis: via.croquis.map(croqui => new Croqui(
                croqui.id,
                croqui.imagemUrl,
                croqui.autor,
                croqui.descricao,
            )),
        };
    }

// Converte um documento do RavenDB para uma instância de Via
    static fromRavenDBDocument(document: ViaDocument): Via {
        const via = new Via(
            document.Id,
            document.Nome,
            document.Id_Montanha,
            document.Croquis,
            document.Grau,
            document.Crux,
            document.Artificial,
            document.Duracao,
            document.Exposicao,
            document.Extensao,
            document.Conquistadores,
            document.Data,
            document.Id_Face,
            document.Id_Fonte,
            document.Id_Variante
        );

        return via;
    }

    // Converte uma instância de ViaDto para Via
    static fromDto(viaDto: ViaDto): Via {
        return new Via(
            viaDto.id,
            viaDto.nome,
            viaDto.montanha.id,
            viaDto.croqui.map(croqui => new Croqui(
                croqui.id,
                croqui.caminho_imagem,
                croqui.autor,
                croqui.descricao,
            )),
            viaDto.grau,
            viaDto.crux,
            viaDto.artificial,
            viaDto.duracao,
            viaDto.exposicao,
            viaDto.extensao,
            viaDto.conquistadores,
            viaDto.data,
            viaDto.fonte.id,
            viaDto.variante.id,
            viaDto.face.id
        );
    }
}
