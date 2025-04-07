// Script para copiar o schema SQLite para o schema principal quando em ambiente de desenvolvimento
// Este script deve ser executado antes de gerar o cliente Prisma

const fs = require('fs');
const path = require('path');

// Verifica se estamos em ambiente de desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development';

// Caminhos dos arquivos
const schemaPath = path.join(__dirname, 'schema.prisma');
const sqliteSchemaPath = path.join(__dirname, 'schema.sqlite.prisma');
const pgSchemaPath = path.join(__dirname, 'schema.pg.prisma');

// Se estamos em desenvolvimento e não temos PostgreSQL disponível, usa SQLite
if (isDevelopment) {
  try {
    // Tenta conectar ao PostgreSQL
    const { execSync } = require('child_process');
    execSync('pg_isready -h localhost -p 5432', { stdio: 'ignore' });
    console.log('PostgreSQL está disponível, usando schema PostgreSQL');
    
    // Se não lançou exceção, PostgreSQL está disponível
    // Verifica se temos um backup do schema PostgreSQL
    if (!fs.existsSync(pgSchemaPath) && fs.existsSync(schemaPath)) {
      // Faz backup do schema PostgreSQL
      fs.copyFileSync(schemaPath, pgSchemaPath);
      console.log('Schema PostgreSQL foi copiado para schema.pg.prisma');
    }
  } catch (error) {
    // PostgreSQL não está disponível, usa SQLite
    console.log('PostgreSQL não está disponível, usando SQLite para desenvolvimento');
    
    // Verifica se temos um backup do schema PostgreSQL
    if (!fs.existsSync(pgSchemaPath) && fs.existsSync(schemaPath)) {
      // Faz backup do schema PostgreSQL
      fs.copyFileSync(schemaPath, pgSchemaPath);
      console.log('Schema PostgreSQL foi copiado para schema.pg.prisma');
    }
    
    // Copia o schema SQLite para o schema principal
    if (fs.existsSync(sqliteSchemaPath)) {
      fs.copyFileSync(sqliteSchemaPath, schemaPath);
      console.log('Schema SQLite foi copiado para schema.prisma');
      
      // Atualiza o .env para usar SQLite
      const envPath = path.join(__dirname, '..', '.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(
          /DATABASE_URL=.*$/m, 
          'DATABASE_URL="file:./prisma/dev.db"'
        );
        fs.writeFileSync(envPath, envContent);
        console.log('.env atualizado para usar SQLite');
      }
    }
  }
}

console.log('Configuração do schema Prisma concluída');
