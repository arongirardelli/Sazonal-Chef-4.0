#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Iniciando testes do Sazonal Chef com TestSprite...\n');

// Verificar se o servidor está rodando
function checkServer() {
  try {
    const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:5174', { encoding: 'utf8' });
    return response.trim() === '200';
  } catch (error) {
    return false;
  }
}

// Função para executar testes
function runTests(testFile = null) {
  try {
    let command = 'npx @testsprite/testsprite-mcp';
    
    if (testFile) {
      command += ` --test ${testFile}`;
    } else {
      command += ' --test tests/e2e/';
    }
    
    command += ' --config testsprite.config.js';
    
    console.log(`Executando comando: ${command}\n`);
    
    execSync(command, { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname)
    });
    
    console.log('\n✅ Testes concluídos com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro ao executar testes:', error.message);
    process.exit(1);
  }
}

// Função principal
function main() {
  const args = process.argv.slice(2);
  const testFile = args[0];
  
  console.log('📋 Verificando configuração...');
  
  // Verificar se o servidor está rodando
  if (!checkServer()) {
    console.log('⚠️  Servidor não está rodando em http://localhost:5174');
    console.log('💡 Execute "npm run dev" em outro terminal antes de rodar os testes');
    console.log('🔄 Tentando executar os testes mesmo assim...\n');
  } else {
    console.log('✅ Servidor está rodando em http://localhost:5174\n');
  }
  
  // Executar testes
  if (testFile) {
    console.log(`🎯 Executando teste específico: ${testFile}`);
    runTests(testFile);
  } else {
    console.log('🎯 Executando todos os testes...');
    runTests();
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runTests, checkServer };
