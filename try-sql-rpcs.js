import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pmfvhzpypycaxrhjjqhs.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZnZoenB5cHljYXhyaGpqcWhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk1MTQ0NywiZXhwIjoyMDk0NTI3NDQ3fQ.0DQpC4tEFt-463n9nw0TtKpb0yC6CKS0lJwlLnH-7og";

const serviceClient = createClient(SUPABASE_URL, SERVICE_KEY);

const rpcs = [
  'exec_sql', 'execute_sql', 'run_sql', 'sql', 'query', 'exec'
];

async function test() {
  for (const rpc of rpcs) {
    const { data, error } = await serviceClient.rpc(rpc, { sql: 'SELECT 1' });
    if (error && error.message.includes('does not exist')) {
      console.log(`RPC ${rpc} does not exist.`);
    } else {
      console.log(`RPC ${rpc} response:`, { data, error });
    }
  }
}

test();
