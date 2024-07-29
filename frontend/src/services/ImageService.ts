/// @ts-ignore
import { Via } from "src/models/Via";

const serverIp = "http://localhost:4020";

export function adjustImageUrl (url: string): string {
  if (url) {
    return `${serverIp}/assets${url.split("assets")[1]}`;
  }
  console.log("a url eh: ", url);
  return url;
}

export const adjustImageUrls = (vias: Via[]): Via[] => {
  return vias.map(via => {
    if (via.imagem?.url) {
      via.imagem.url = adjustImageUrl(via.imagem.url);
    }
    return via;
  });
};
