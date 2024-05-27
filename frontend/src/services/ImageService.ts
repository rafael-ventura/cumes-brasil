export function adjustImageUrl (url: string): string {
  if (url) {
    return `http://localhost:4020/assets${url.split("assets")[1]}`;
  }
  console.log("a url eh: ", url);
  return url;
}
