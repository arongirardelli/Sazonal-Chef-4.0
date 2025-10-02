#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

async function testNewEmail() {
  const supabaseUrl = 'https://yspxyqrehhibogspctck.supabase.co';
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxODk4NywiZXhwIjoyMDcwMDk0OTg3fQ._rW6-Td9B2rWyxcup568UyKrjOKLeA1H93-t0DH8jcw';

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  try {
    console.log('🧹 Limpando usuário arongirardelli@gmail.com para teste do novo e-mail...');

    // Buscar usuário existente
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Erro ao listar usuários: ${listError.message}`);
    }

    const existingUser = users.find(user => user.email === 'arongirardelli@gmail.com');
    
    if (existingUser) {
      console.log(`🔍 Usuário encontrado: ${existingUser.email} (ID: ${existingUser.id})`);
      
      // Remover usuário existente
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      if (deleteError) {
        console.error(`❌ Erro ao remover usuário: ${deleteError.message}`);
      } else {
        console.log(`✅ Usuário ${existingUser.email} removido com sucesso.`);
      }
    } else {
      console.log('✅ Nenhum usuário arongirardelli@gmail.com encontrado.');
    }

    console.log('🚀 Pronto para teste do novo e-mail!');

  } catch (error) {
    console.error('❌ Erro durante limpeza:', error.message);
  }
}

testNewEmail();
