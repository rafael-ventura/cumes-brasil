export function buildImageUrl(fileName: string): string {
    if (!fileName) return '';

    // Se estivermos em produção com CloudFront, usar ele
    if (process.env.CLOUDFRONT_URL) {
        return `${process.env.CLOUDFRONT_URL}/${fileName}`;
    }

    // Caso contrário, usa a URL do backend (assets servidos via Express)
    const assetsUrl = process.env.ASSETS_URL || `http://localhost:8080/assets/`;
    return `${assetsUrl}${fileName}`;
}
