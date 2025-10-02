#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

async function cleanupTestUsers() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variáveis de ambiente não configuradas');
    return;
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  try {
    console.log('🧹 Iniciando limpeza de usuários de teste...');

    // Listar usuários de teste
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Erro ao listar usuários: ${listError.message}`);
    }

    const testUsers = users.filter(user => 
      user.email === 'arongirardelli@gmail.com' || 
      user.email === 'arongirardelli2@gmail.com' ||
      user.email === 'girardelliaron@gmail.com' ||
      user.email === 'teste.debug@gmail.com'
    );

    if (testUsers.length === 0) {
      console.log('✅ Nenhum usuário de teste encontrado para remover.');
      return;
    }

    console.log(`🔍 Encontrados ${testUsers.length} usuários de teste:`);
    testUsers.forEach(user => console.log(`  - ${user.email} (ID: ${user.id})`));

    // Remover usuários de teste
    let removedCount = 0;
    for (const user of testUsers) {
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

    console.log(`\n✨ Limpeza concluída! ${removedCount} usuários removidos.`);

  } catch (error) {
    console.error('❌ Erro durante limpeza:', error.message);
  }
}

cleanupTestUsers();
