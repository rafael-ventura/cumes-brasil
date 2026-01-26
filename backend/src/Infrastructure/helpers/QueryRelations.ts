import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { Via } from '../../Domain/entities/Via';
import { Colecao } from '../../Domain/entities/Colecao';

/**
 * Níveis de carregamento de relations para queries
 * - minimal: Sem relations - para contagens e operações simples
 * - light: Dados essenciais para listagens (nome, grau, localização básica)
 * - full: Todos os dados para páginas de detalhes
 */
export type RelationLevel = 'minimal' | 'light' | 'full';

/**
 * Adiciona joins de localização completa para uma entidade que tem localizacoes
 * Usado internamente pelos helpers
 */
function addFullLocationJoins<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    localizacoesAlias: string,
    prefix: string
): SelectQueryBuilder<T> {
    return qb
        .leftJoinAndSelect(`${localizacoesAlias}.continente`, `${prefix}Continente`)
        .leftJoinAndSelect(`${localizacoesAlias}.pais`, `${prefix}Pais`)
        .leftJoinAndSelect(`${localizacoesAlias}.regiao`, `${prefix}Regiao`)
        .leftJoinAndSelect(`${localizacoesAlias}.estado`, `${prefix}Estado`)
        .leftJoinAndSelect(`${localizacoesAlias}.cidade`, `${prefix}Cidade`)
        .leftJoinAndSelect(`${localizacoesAlias}.bairro`, `${prefix}Bairro`);
}

/**
 * Adiciona joins de localização básica (apenas estado, cidade, bairro)
 * Usado para listagens onde só precisamos exibir a localização resumida
 */
function addLightLocationJoins<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    localizacoesAlias: string,
    prefix: string
): SelectQueryBuilder<T> {
    return qb
        .leftJoinAndSelect(`${localizacoesAlias}.estado`, `${prefix}Estado`)
        .leftJoinAndSelect(`${localizacoesAlias}.cidade`, `${prefix}Cidade`)
        .leftJoinAndSelect(`${localizacoesAlias}.bairro`, `${prefix}Bairro`);
}

/**
 * Helper para adicionar relations de Via com base no nível de carregamento
 * 
 * @param qb - QueryBuilder já criado com alias "via"
 * @param level - Nível de carregamento desejado
 * @returns QueryBuilder com os joins apropriados
 * 
 * @example
 * const qb = repository.createQueryBuilder("via").where("via.id = :id", { id });
 * withViaRelations(qb, 'light');
 */
export function withViaRelations<T extends Via>(
    qb: SelectQueryBuilder<T>,
    level: RelationLevel
): SelectQueryBuilder<T> {
    if (level === 'minimal') {
        return qb;
    }

    // Relações diretas básicas (light e full)
    qb = qb
        .leftJoinAndSelect('via.montanha', 'montanha')
        .leftJoinAndSelect('via.face', 'face')
        .leftJoinAndSelect('via.setor', 'setor')
        .leftJoinAndSelect('via.imagem', 'imagem');

    if (level === 'light') {
        // Light: Localização básica através de montanha e face (caminho mais comum)
        // Muitas vias não têm setor, então precisamos carregar de montanha/face também
        qb = qb
            // Localização via montanha (caminho mais comum)
            .leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes')
            // Localização via face
            .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
            .leftJoinAndSelect('face.montanha', 'faceMontanha')
            // Localização via setor (quando existe)
            .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
            .leftJoinAndSelect('setor.montanha', 'setorMontanha')
            .leftJoinAndSelect('setor.face', 'setorFace');
        
        // Adicionar localizações básicas para cada caminho
        qb = addLightLocationJoins(qb, 'montanhaLocalizacoes', 'montanha');
        qb = addLightLocationJoins(qb, 'faceLocalizacoes', 'face');
        qb = addLightLocationJoins(qb, 'setorLocalizacoes', 'setor');
        
        return qb;
    }

    // Full: Todas as relations para página de detalhes
    qb = qb
        // Setor e suas relations
        .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
        .leftJoinAndSelect('setor.face', 'setorFace')
        .leftJoinAndSelect('setor.montanha', 'setorMontanha');
    
    qb = addFullLocationJoins(qb, 'setorLocalizacoes', 'setor');

    // Localização através da Face do Setor
    qb = qb.leftJoinAndSelect('setorFace.localizacoes', 'setorFaceLocalizacoes');
    qb = addFullLocationJoins(qb, 'setorFaceLocalizacoes', 'setorFace');
    qb = qb.leftJoinAndSelect('setorFace.montanha', 'setorFaceMontanha');

    // Localização através da Montanha do Setor
    qb = qb.leftJoinAndSelect('setorMontanha.localizacoes', 'setorMontanhaLocalizacoes');
    qb = addFullLocationJoins(qb, 'setorMontanhaLocalizacoes', 'setorMontanha');

    // Face e suas relations
    qb = qb
        .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
        .leftJoinAndSelect('face.montanha', 'faceMontanha');
    qb = addFullLocationJoins(qb, 'faceLocalizacoes', 'face');

    // Montanha e suas relations
    qb = qb.leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes');
    qb = addFullLocationJoins(qb, 'montanhaLocalizacoes', 'montanha');

    // Outras relations específicas de Via
    qb = qb
        .leftJoinAndSelect('via.viaPrincipal', 'viaPrincipal')
        .leftJoinAndSelect('via.fonte', 'fonte')
        .leftJoinAndSelect('via.viaCroquis', 'viaCroquis')
        .leftJoinAndSelect('viaCroquis.croqui', 'croqui');

    return qb;
}

/**
 * Helper para adicionar relations de Colecao com base no nível de carregamento
 * 
 * @param qb - QueryBuilder já criado com alias "colecao"
 * @param level - Nível de carregamento desejado
 * @returns QueryBuilder com os joins apropriados
 * 
 * @example
 * const qb = repository.createQueryBuilder("colecao").where("colecao.id = :id", { id });
 * withColecaoRelations(qb, 'light');
 */
export function withColecaoRelations<T extends Colecao>(
    qb: SelectQueryBuilder<T>,
    level: RelationLevel
): SelectQueryBuilder<T> {
    if (level === 'minimal') {
        return qb;
    }

    // Relações básicas da coleção (light e full)
    qb = qb
        .leftJoinAndSelect('colecao.usuario', 'usuario')
        .leftJoinAndSelect('colecao.imagem', 'imagem')
        .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
        .leftJoinAndSelect('viaColecao.via', 'vias');

    if (level === 'light') {
        // Light: Vias com dados básicos para listagem
        // Carrega localizações de montanha, face E setor (muitas vias não têm setor)
        qb = qb
            .leftJoinAndSelect('vias.montanha', 'montanha')
            .leftJoinAndSelect('vias.face', 'face')
            .leftJoinAndSelect('vias.setor', 'setor')
            // Localização via montanha (caminho mais comum)
            .leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes')
            // Localização via face
            .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
            .leftJoinAndSelect('face.montanha', 'faceMontanha')
            // Localização via setor (quando existe)
            .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
            .leftJoinAndSelect('setor.montanha', 'setorMontanha')
            .leftJoinAndSelect('setor.face', 'setorFace');
        
        // Adicionar localizações básicas para cada caminho
        qb = addLightLocationJoins(qb, 'montanhaLocalizacoes', 'montanha');
        qb = addLightLocationJoins(qb, 'faceLocalizacoes', 'face');
        qb = addLightLocationJoins(qb, 'setorLocalizacoes', 'setor');
        
        return qb;
    }

    // Full: Todas as relations para página de detalhes
    qb = qb
        .leftJoinAndSelect('vias.montanha', 'montanha')
        .leftJoinAndSelect('vias.face', 'face')
        .leftJoinAndSelect('vias.setor', 'setor');

    // Localização através de Setor
    qb = qb
        .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
        .leftJoinAndSelect('setor.face', 'setorFace')
        .leftJoinAndSelect('setor.montanha', 'setorMontanha');
    qb = addFullLocationJoins(qb, 'setorLocalizacoes', 'setor');

    // Localização através de Face
    qb = qb.leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes');
    qb = addFullLocationJoins(qb, 'faceLocalizacoes', 'face');
    qb = qb.leftJoinAndSelect('face.montanha', 'faceMontanha');

    // Localização através de Montanha
    qb = qb.leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes');
    qb = addFullLocationJoins(qb, 'montanhaLocalizacoes', 'montanha');

    return qb;
}

/**
 * Helper para adicionar relations de Via dentro de uma Colecao (quando Via já está com alias "vias")
 * Útil para o método search() do ColecaoRepository
 * 
 * @param qb - QueryBuilder com vias já joinadas como "vias"
 * @param level - Nível de carregamento desejado
 */
export function withViasInColecaoRelations<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    level: RelationLevel
): SelectQueryBuilder<T> {
    if (level === 'minimal') {
        return qb;
    }

    qb = qb
        .leftJoinAndSelect('via.montanha', 'montanha')
        .leftJoinAndSelect('via.face', 'face')
        .leftJoinAndSelect('via.setor', 'setor');

    if (level === 'light') {
        // Carrega localizações de montanha, face E setor (muitas vias não têm setor)
        qb = qb
            // Localização via montanha (caminho mais comum)
            .leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes')
            // Localização via face
            .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
            .leftJoinAndSelect('face.montanha', 'faceMontanha')
            // Localização via setor (quando existe)
            .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
            .leftJoinAndSelect('setor.montanha', 'setorMontanha')
            .leftJoinAndSelect('setor.face', 'setorFace');
        
        // Adicionar localizações básicas para cada caminho
        qb = addLightLocationJoins(qb, 'montanhaLocalizacoes', 'montanha');
        qb = addLightLocationJoins(qb, 'faceLocalizacoes', 'face');
        qb = addLightLocationJoins(qb, 'setorLocalizacoes', 'setor');
        
        return qb;
    }

    // Full: todas as localizações
    qb = qb.leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes');
    qb = addFullLocationJoins(qb, 'setorLocalizacoes', 'setor');
    
    qb = qb
        .leftJoinAndSelect('setor.face', 'setorFace')
        .leftJoinAndSelect('setor.montanha', 'setorMontanha');

    qb = qb.leftJoinAndSelect('setorFace.localizacoes', 'setorFaceLocalizacoes');
    qb = addFullLocationJoins(qb, 'setorFaceLocalizacoes', 'setorFace');
    qb = qb.leftJoinAndSelect('setorFace.montanha', 'setorFaceMontanha');

    qb = qb.leftJoinAndSelect('setorMontanha.localizacoes', 'setorMontanhaLocalizacoes');
    qb = addFullLocationJoins(qb, 'setorMontanhaLocalizacoes', 'setorMontanha');

    qb = qb.leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes');
    qb = addFullLocationJoins(qb, 'faceLocalizacoes', 'face');
    qb = qb.leftJoinAndSelect('face.montanha', 'faceMontanha');

    qb = qb.leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes');
    qb = addFullLocationJoins(qb, 'montanhaLocalizacoes', 'montanha');

    qb = qb.leftJoinAndSelect('via.imagem', 'imagem');

    return qb;
}
