import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pmfvhzpypycaxrhjjqhs.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZnZoenB5cHljYXhyaGpqcWhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk1MTQ0NywiZXhwIjoyMDk0NTI3NDQ3fQ.0DQpC4tEFt-463n9nw0TtKpb0yC6CKS0lJwlLnH-7og";

const serviceClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function check() {
  const { data: users, error: userErr } = await serviceClient.from('users').select('id, username');
  if (userErr) {
    console.error("Error fetching users:", userErr);
    return;
  }

  for (const user of users) {
    const { data: specs } = await serviceClient.from('user_specializations').select('tag').eq('user_id', user.id);
    const { data: tools } = await serviceClient.from('user_tools').select('tool').eq('user_id', user.id);
    const { data: ints } = await serviceClient.from('user_interests').select('interest').eq('user_id', user.id);

    console.log(`User: ${user.username} (${user.id})`);
    console.log(`  Specializations:`, specs?.map(s => s.tag));
    console.log(`  Tools:`, tools?.map(t => t.tool));
    console.log(`  Interests:`, ints?.map(i => i.interest));
    console.log("-----------------------------------------");
  }
}

check();
