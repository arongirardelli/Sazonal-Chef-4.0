#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

async function cleanupFinalTest() {
  const supabaseUrl = 'https://yspxyqrehhibogspctck.supabase.co';
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxODk4NywiZXhwIjoyMDcwMDk0OTg3fQ._rW6-Td9B2rWyxcup568UyKrjOKLeA1H93-t0DH8jcw';

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  try {
    console.log('🧹 Iniciando limpeza FINAL para teste...');

    // Listar todos os usuários
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Erro ao listar usuários: ${listError.message}`);
    }

    if (users.length === 0) {
      console.log('✅ Nenhum usuário encontrado no banco.');
      return;
    }

    console.log(`🔍 Encontrados ${users.length} usuários no banco:`);
    users.forEach(user => console.log(`  - ${user.email} (ID: ${user.id})`));

    // Remover todos os usuários
    let removedCount = 0;
    for (const user of users) {
      try {
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
        if (deleteError) {
          console.error(`❌ Erro ao remover ${user.email}: ${deleteError.message}`);
        } else {
          console.log(`✅ Usuário ${user.email} removido com sucesso.`);
          removedCount++;
        }
      } catch (error) {
        console.error(`❌ Erro ao remover ${user.email}:`, error.message);
      }
    }

    console.log(`\n✨ Limpeza FINAL concluída! ${removedCount} usuários removidos.`);
    console.log('🚀 Banco de dados limpo e pronto para teste FINAL!');

  } catch (error) {
    console.error('❌ Erro durante limpeza:', error.message);
  }
}

cleanupFinalTest();
