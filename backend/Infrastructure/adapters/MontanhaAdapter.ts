import {Montanha} from "../../Domain/entities/Montanha";
import {MontanhaDocument} from "../documents/MontanhaDocument";
import {ViaAdapter} from "./ViaAdapter";

export class MontanhaAdapter {

    fromDocument(document: MontanhaDocument): Montanha {
        return new Montanha(

            document.Id!,
            document.Nome!,
            document.Localizacao!,
            document.Altura!

        )
    }


    toDocument(montanha: Montanha): MontanhaDocument {
        return {
            '@metadata': {
                '@collection': 'Montanhas'
            },
            Id: montanha.id,
            Nome: montanha.nome,
            Localizacao: montanha.localizacao,
            Altura: montanha.altura
        }
    }
}