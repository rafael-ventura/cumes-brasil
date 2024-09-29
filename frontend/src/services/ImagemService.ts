const serverIp = import.meta.env.VITE_APP_SERVER_IP;

export function adjustImageUrl (url: string): string {
  if (url) {
    return `${serverIp}/assets${url.split('assets')[1]}`;
  }
  return url;
}
