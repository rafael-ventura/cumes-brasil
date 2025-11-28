/**
 * Script TypeScript para dropar todas as tabelas usando TypeORM
 * Execute com: npx ts-node backend/src/Infrastructure/scripts/drop-all-tables.ts
 */

import { AppDataSource } from '../config/db';

async function dropAllTables() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await AppDataSource.initialize();

    console.log('🗑️  Droppando todas as tabelas...');
    
    // Dropar todas as tabelas do schema public
    await AppDataSource.dropDatabase();
    
    // Recriar o banco (vazio)
    await AppDataSource.synchronize();
    
    console.log('✅ Todas as tabelas foram removidas!');
    console.log('💡 O TypeORM vai recriar as tabelas automaticamente na próxima inicialização (synchronize: true)');
    
  } catch (error) {
    console.error('❌ Erro ao dropar tabelas:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

dropAllTables();

