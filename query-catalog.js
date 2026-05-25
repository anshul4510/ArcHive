import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pmfvhzpypycaxrhjjqhs.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZnZoenB5cHljYXhyaGpqcWhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk1MTQ0NywiZXhwIjoyMDk0NTI3NDQ3fQ.0DQpC4tEFt-463n9nw0TtKpb0yC6CKS0lJwlLnH-7og";

// Create client for pg_catalog schema
const pgCatalogClient = createClient(SUPABASE_URL, SERVICE_KEY, {
  db: { schema: 'pg_catalog' }
});

// Create client for information_schema
const infoSchemaClient = createClient(SUPABASE_URL, SERVICE_KEY, {
  db: { schema: 'information_schema' }
});

async function run() {
  try {
    console.log("=== Querying pg_proc for user functions ===");
    // We want functions in public schema. public schema OID is usually 2200 or we can join with pg_namespace.
    // Let's just fetch all functions and filter.
    const { data: functions, error: funcErr } = await pgCatalogClient
      .from('pg_proc')
      .select('proname, prosrc')
      .limit(100);

    if (funcErr) {
      console.error("Error querying pg_proc:", funcErr);
    } else {
      console.log("Found functions in pg_proc (sample):");
      const userFuncs = functions.filter(f => f.proname.includes('firebase') || f.proname.includes('profile') || f.proname.includes('specialization') || f.proname.includes('tool') || f.proname.includes('interest'));
      console.log(userFuncs);
    }

    console.log("\n=== Querying information_schema.routines ===");
    const { data: routines, error: routErr } = await infoSchemaClient
      .from('routines')
      .select('routine_name, routine_definition')
      .eq('routine_schema', 'public');

    if (routErr) {
      console.error("Error querying routines:", routErr);
    } else {
      console.log("Routines in public schema:", routines.map(r => r.routine_name));
    }

    console.log("\n=== Querying RLS Policies via pg_policies ===");
    // pg_policies is a view, but we can query it via a custom view or we can query pg_policy table in pg_catalog.
    const { data: policies, error: polErr } = await pgCatalogClient
      .from('pg_policy')
      .select('*')
      .limit(20);

    if (polErr) {
      console.error("Error querying pg_policy:", polErr);
    } else {
      console.log("pg_policy table data (raw):", policies);
    }
  } catch (e) {
    console.error("Catalog query exception:", e);
  }
}

run();
