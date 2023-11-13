import {Montanha} from "../../Domain/models/Montanha";
import {MontanhaDocument} from "../documents/MontanhaDocument";
import {ViaAdapter} from "./ViaAdapter";

export class MontanhaAdapter {

    static fromRavenDBDocument(document: MontanhaDocument): Montanha {
        return new Montanha(
            document.Id as number,
            document.Nome as string,
            document.Localizacao as string,
            document.Altura as number,
        )
    }
}