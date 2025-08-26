export function buildImageUrl(fileName: string): string {
    if (!fileName) return '';

    if (process.env.CLOUDFRONT_URL) {
        return `${process.env.CLOUDFRONT_URL}${fileName}`;
    }

    const assetsUrl = process.env.ASSETS_URL;
    return `${assetsUrl}${fileName}`;
}
