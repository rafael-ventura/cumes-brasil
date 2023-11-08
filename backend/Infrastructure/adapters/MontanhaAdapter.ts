import {Montanha} from "../../Domain/models/Montanha";
import {MontanhaDocument} from "../documents/MontanhaDocument";
import {ViaAdapter} from "./ViaAdapter";

export class MontanhaAdapter {

    static fromRavenDBDocument(document: MontanhaDocument): Montanha {
        return new Montanha(
            document.Id,
            document.Nome,
            document.Localizacao,
            document.Altura,
        )
    }
}