/// @ts-ignore
const serverIp = 'http://localhost:4020';

export function adjustImageUrl (url: string): string {
  if (url) {
    return `${serverIp}/assets${url.split('assets')[1]}`;
  }
  return url;
}
