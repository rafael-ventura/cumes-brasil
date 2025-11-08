export function buildImageUrl(fileName: string): string {
    if (!fileName) return '';

    // Se já for uma URL completa, retornar como está
    if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
        return fileName;
    }

    // Remover barras iniciais e /assets/ para evitar duplicação
    let cleanFileName = fileName;
    
    // Remover /assets/ do início
    if (cleanFileName.startsWith('/assets/')) {
        cleanFileName = cleanFileName.replace('/assets/', '');
    }
    
    // Remover TODAS as barras iniciais
    while (cleanFileName.startsWith('/')) {
        cleanFileName = cleanFileName.substring(1);
    }

    if (process.env.CLOUDFRONT_URL) {
        const cloudfront = process.env.CLOUDFRONT_URL.replace(/\/+$/, ''); // Remove barras finais
        return `${cloudfront}/assets/${cleanFileName}`;
    }

    let assetsUrl = process.env.ASSETS_URL || `http://localhost:8080/assets`;
    assetsUrl = assetsUrl.replace(/\/+$/, ''); // Remove barras finais
    
    return `${assetsUrl}/${cleanFileName}`;
}
