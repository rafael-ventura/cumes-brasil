export function buildImageUrl(fileName: string): string {
    if (!fileName) return '';

    // Remove /assets/ do início do fileName para evitar duplicação
    let cleanFileName = fileName.startsWith('/assets/') 
        ? fileName.replace('/assets/', '') 
        : fileName;

    if (process.env.CLOUDFRONT_URL) {
        return `${process.env.CLOUDFRONT_URL}${cleanFileName}`;
    }

    const assetsUrl = process.env.ASSETS_URL;
    return `${assetsUrl}${cleanFileName}`;
}
