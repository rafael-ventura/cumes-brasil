// ViaAdapter.ts
import {Via} from '../../Domain/models/Via';
import {Croqui} from "../../Domain/models/Croqui";
import {ViaDocument} from "../documents/ViaDocument";
import {ViaDto} from "../../../shared/contratos/ViaDto";
import {Montanha} from "../../Domain/models/Montanha";
import {Face} from "../../Domain/models/Face";
import {Fonte} from "../../Domain/models/Fonte";
import {CroquiDocument} from "../documents/CroquiDocument";


export class ViaAdapter {
    // Converte uma Via para o formato de documento JSON para o RavenDB
    toRavenDBDocument(via: Via, montanha: Montanha, face: Face | undefined, fonte: Fonte | undefined): ViaDocument {
        return {
            "@metadata": {
                "@collection": "Vias"

            },
            Id: via.id,
            Nome: via?.nome,
            Montanha: {
                "@metadata": {
                    "@collection": "Montanhas"
                },
                Id: montanha?.id,
                Nome: montanha?.nome,
                Altura: montanha?.altura,
                Localizacao: montanha?.localizacao,
            },
            Croquis: via.croquis?.map(croqui => ({
                Id: croqui.id,
                CaminhoImagem: croqui.imagemUrl,
                Autor: croqui.autor,
                Descricao: croqui.descricao
            } as CroquiDocument)),
            Grau: via.grau,
            Crux: via.crux,
            Artificial: via.artificial,
            Duracao: via.duracao,
            Exposicao: via.exposicao,
            Extensao: via.extensao,
            Conquistadores: via.conquistadores,
            Data: via.data,
            Face: {
                "@metadata": {
                    "@collection": "Faces"
                },
                Id: face?.id!,
                Nome: face?.nome!
            },
            Fonte: {
                "@metadata": {
                    "@collection": "Fontes"
                },
                Id: fonte?.id!,
                Referencia: fonte?.referencia!
            },
            Id_Via_Principal: via.id_viaPrincipal
        }

    }

// Converte um documento do RavenDB para uma instância de Via
    fromRavenDBDocument(document: ViaDocument): Via {
        const via = new Via(
            document.Id,
            document.Nome,
            document.Croquis?.map(croqui => new Croqui(
                croqui.Id,
                croqui.CaminhoImagem,
                croqui.Autor,
                croqui.Descricao,
            )),
            document.Montanha?.Id,
            document.Grau,
            document.Crux,
            document.Artificial,
            document.Duracao,
            document.Exposicao,
            document.Extensao,
            document.Conquistadores,
            document.Detalhes,
            document.Data,
            document.Fonte?.Id,
            document.Id_Via_Principal,
            document.Face?.Id
        );

        return via;
    }

    // Converte uma instância de ViaDto para Via
    fromDto(viaDto: ViaDto): Via {
        return new Via(
            viaDto.id,
            viaDto.nome,
            viaDto.croquis.map(croqui => new Croqui(
                croqui.id,
                croqui.imagemUrl,
                croqui.autor,
                croqui.descricao,
            )),
            viaDto.montanha!.id,
            viaDto.grau,
            viaDto.crux,
            viaDto.artificial,
            viaDto.duracao,
            viaDto.exposicao,
            viaDto.extensao,
            viaDto.conquistadores,
            viaDto.detalhes,
            viaDto.data,
            viaDto.face!.id,
            viaDto.fonte!.id,
            viaDto.id_via_principal
        );
    }
}
