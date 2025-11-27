export function buildImageUrl(fileName: string): string {
    if (!fileName) return '';

    const trimmedFileName = fileName.trim();
    
    // Se já é uma URL completa (http/https), retornar como está SEM processar
    if (trimmedFileName.startsWith('http://') || trimmedFileName.startsWith('https://')) {
        return trimmedFileName;
    }
    
    // Se a URL contém http:// ou https:// em algum lugar (URL malformada), extrair apenas a parte correta
    // Exemplo: "http://localhost:8080/assets/https://images.unsplash.com/..." 
    // -> retornar apenas "https://images.unsplash.com/..."
    const httpsIndex = trimmedFileName.indexOf('https://');
    const httpIndex = trimmedFileName.indexOf('http://');
    
    if (httpsIndex !== -1) {
        // Encontrou https://, retornar a partir daí
        return trimmedFileName.substring(httpsIndex);
    }
    
    if (httpIndex !== -1 && !trimmedFileName.startsWith('http://')) {
        // Encontrou http:// mas não no início, retornar a partir daí
        return trimmedFileName.substring(httpIndex);
    }

    // Remove /assets/ do início do fileName para evitar duplicação
    let cleanFileName = trimmedFileName.startsWith('/assets/') 
        ? trimmedFileName.replace('/assets/', '') 
        : trimmedFileName.startsWith('assets/')
        ? trimmedFileName.replace('assets/', '')
        : trimmedFileName;

    // Garantir que cleanFileName comece com / se não começar
    if (!cleanFileName.startsWith('/')) {
        cleanFileName = '/' + cleanFileName;
    }

    if (process.env.CLOUDFRONT_URL) {
        // CloudFront geralmente já tem o caminho completo
        const cloudfrontUrl = process.env.CLOUDFRONT_URL.endsWith('/')
            ? process.env.CLOUDFRONT_URL.slice(0, -1)
            : process.env.CLOUDFRONT_URL;
        return `${cloudfrontUrl}${cleanFileName}`;
    }

    const assetsUrl = process.env.ASSETS_URL || 'http://localhost:8080/assets';
    // Garantir que assetsUrl não termine com / para evitar duplicação
    const cleanAssetsUrl = assetsUrl.endsWith('/')
        ? assetsUrl.slice(0, -1)
        : assetsUrl;
    
    return `${cleanAssetsUrl}${cleanFileName}`;
}
