/// @ts-ignore
const serverIp = "http://localhost:4020";

export function adjustImageUrl (url: string): string {
  if (url) {
    return `${serverIp}/assets${url.split("assets")[1]}`;
  }
  console.log("a url eh: ", url);
  return url;
}
