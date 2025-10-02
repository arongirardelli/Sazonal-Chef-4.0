import { createClient } from '@supabase/supabase-js'

const url = 'https://yspxyqrehhibogspctck.supabase.co'
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcHh5cXJlaGhpYm9nc3BjdGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxODk4NywiZXhwIjoyMDcwMDk0OTg3fQ._rW6-Td9B2rWyxcup568UyKrjOKLeA1H93-t0DH8jcw'

if (!url || !serviceRole) {
  console.error('❌ Missing Supabase URL or Service Role Key')
  process.exit(1)
}

const adminClient = createClient(url, serviceRole)

async function cleanupAllUsers() {
  console.log('🧹 Iniciando limpeza completa do banco de dados...')
  
  try {
    // 1. Limpar dados relacionados primeiro
    console.log('📊 Limpando dados relacionados...')
    
    const { error: menusError } = await adminClient
      .from('user_menus')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (menusError) {
      console.error('❌ Erro ao limpar menus:', menusError.message)
    } else {
      console.log('✅ Menus de usuário removidos')
    }
    
    const { error: pushError } = await adminClient
      .from('push_subscriptions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (pushError) {
      console.error('❌ Erro ao limpar inscrições push:', pushError.message)
    } else {
      console.log('✅ Inscrições push removidas')
    }
    
    const { error: settingsError } = await adminClient
      .from('user_settings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (settingsError) {
      console.error('❌ Erro ao limpar configurações:', settingsError.message)
    } else {
      console.log('✅ Configurações de usuário removidas')
    }
    
    const { error: profilesError } = await adminClient
      .from('user_profiles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (profilesError) {
      console.error('❌ Erro ao limpar perfis:', profilesError.message)
    } else {
      console.log('✅ Perfis de usuário removidos')
    }
    
    // 2. Listar todos os usuários para remoção
    console.log('👥 Listando usuários para remoção...')
    const { data: users, error: listError } = await adminClient.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError.message)
      return
    }
    
    console.log(`📋 Encontrados ${users.users.length} usuários`)
    
    // 3. Remover todos os usuários
    console.log('🗑️ Removendo usuários...')
    for (const user of users.users) {
      try {
        const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)
        if (deleteError) {
          console.error(`❌ Erro ao remover usuário ${user.email}:`, deleteError.message)
        } else {
          console.log(`✅ Usuário removido: ${user.email}`)
        }
      } catch (error) {
        console.error(`❌ Erro ao remover usuário ${user.email}:`, error.message)
      }
    }
    
    // 4. Verificar se a limpeza foi bem-sucedida
    console.log('🔍 Verificando resultado da limpeza...')
    const { data: remainingUsers, error: checkError } = await adminClient.auth.admin.listUsers()
    
    if (checkError) {
      console.error('❌ Erro ao verificar usuários restantes:', checkError.message)
    } else {
      console.log(`✅ Limpeza concluída! Usuários restantes: ${remainingUsers.users.length}`)
      
      if (remainingUsers.users.length > 0) {
        console.log('📋 Usuários restantes:')
        remainingUsers.users.forEach(user => {
          console.log(`  - ${user.email} (${user.id})`)
        })
      }
    }
    
    // 5. Verificar tabelas relacionadas
    console.log('📊 Verificando tabelas relacionadas...')
    const { data: profiles, error: profilesCheckError } = await adminClient
      .from('user_profiles')
      .select('id')
    
    if (profilesCheckError) {
      console.error('❌ Erro ao verificar perfis:', profilesCheckError.message)
    } else {
      console.log(`✅ Perfis restantes: ${profiles.length}`)
    }
    
    const { data: settings, error: settingsCheckError } = await adminClient
      .from('user_settings')
      .select('id')
    
    if (settingsCheckError) {
      console.error('❌ Erro ao verificar configurações:', settingsCheckError.message)
    } else {
      console.log(`✅ Configurações restantes: ${settings.length}`)
    }
    
    console.log('🎉 Limpeza completa finalizada!')
    
  } catch (error) {
    console.error('💥 Erro durante a limpeza:', error.message)
  }
}

// Executar limpeza
cleanupAllUsers()
