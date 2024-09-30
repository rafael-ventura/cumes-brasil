export function getFullImageUrl (relativeUrl: string): string {
  const serverIp = import.meta.env.VITE_APP_SERVER_IP || 'http://localhost:8080';
  return `${serverIp}${relativeUrl}`;
}
