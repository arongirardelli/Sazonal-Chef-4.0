
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function cleanupUsers() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('Supabase URL or Service Role Key not found in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  const usersToDelete = users.filter(user => 
    user.email !== 'arongirardelli@gmail.com' && 
    user.email !== 'girardelliaron@gmail.com'
  );

  if (usersToDelete.length === 0) {
    console.log('No users to delete.');
    return;
  }

  console.log(`Found ${usersToDelete.length} users to delete.`);

  for (const user of usersToDelete) {
    console.log(`Deleting user ${user.id} (${user.email})...`);
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error(`Error deleting user ${user.id}:`, deleteError);
    } else {
      console.log(`User ${user.id} deleted successfully.`);
    }
  }

  console.log('Cleanup complete.');
}

cleanupUsers();
