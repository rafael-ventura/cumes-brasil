import {buildImageUrl} from "../../../Infrastructure/helpers/imageHelper";
import {Imagem} from "../../../Domain/entities/Imagem";

export class ImagemDTO {
    id: number;
    url: string;

    constructor(entity: Imagem) {
        this.id = entity.id;
        this.url = buildImageUrl(entity.url);
    }
}
