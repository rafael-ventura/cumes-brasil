export function buildImageUrl(fileName: string): string {
    if (!fileName) return '';

    if (process.env.CLOUDFRONT_URL) {
        return `${process.env.CLOUDFRONT_URL}/assets/${fileName}`;
    }

    const assetsUrl = process.env.ASSETS_URL || `http://localhost:8080/assets`;
    return `${assetsUrl}/${fileName}`;
}
