/// @ts-ignore
const serverIp = process.env.NODE_ENV === "development"
  ? "http://localhost:4020"
  : "http://192.168.1.147:4020"; // Use o IP do seu computador aqui

export function adjustImageUrl (url: string): string {
  if (url) {
    return `${serverIp}/assets${url.split("assets")[1]}`;
  }
  console.log("a url eh: ", url);
  return url;
}
