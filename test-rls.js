import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pmfvhzpypycaxrhjjqhs.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZnZoenB5cHljYXhyaGpqcWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTE0NDcsImV4cCI6MjA5NDUyNzQ0N30.sUpPdzB-RucSEPq5hRT_bLla57U3zQXo__RBUHAyOqM";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZnZoenB5cHljYXhyaGpqcWhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk1MTQ0NywiZXhwIjoyMDk0NTI3NDQ3fQ.0DQpC4tEFt-463n9nw0TtKpb0yC6CKS0lJwlLnH-7og";

const anonClient = createClient(SUPABASE_URL, ANON_KEY);
const serviceClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function test() {
  console.log("Fetching users with service client...");
  const { data: users, error: userErr } = await serviceClient.from('users').select('id, firebase_uid, username').limit(5);
  if (userErr) {
    console.error("Fetch users error:", userErr);
    return;
  }
  console.log("Users in DB:", users);

  if (users.length === 0) {
    console.log("No users found to test with.");
    return;
  }

  const targetUser = users[0];
  console.log(`Using target user: ${targetUser.username} (${targetUser.id}, firebase_uid: ${targetUser.firebase_uid})`);

  console.log("\n--- Testing with Anon client + set_firebase_uid ---");
  console.log("Setting firebase_uid via RPC...");
  const { error: rpcErr } = await anonClient.rpc('set_firebase_uid', { uid: targetUser.firebase_uid });
  if (rpcErr) {
    console.error("set_firebase_uid RPC error:", rpcErr);
  } else {
    console.log("set_firebase_uid RPC succeeded.");
  }

  // Test specializations delete
  console.log("\nAttempting DELETE from user_specializations via anonClient...");
  const { error: specDelErr } = await anonClient.from('user_specializations').delete().eq('user_id', targetUser.id);
  console.log("DELETE user_specializations error:", specDelErr ? specDelErr : "None (Success)");

  // Test specializations insert
  console.log("Attempting INSERT into user_specializations via anonClient...");
  const { error: specInsErr } = await anonClient.from('user_specializations').insert({ user_id: targetUser.id, tag: 'TestTag' });
  console.log("INSERT user_specializations error:", specInsErr ? specInsErr : "None (Success)");

  // Test tools delete
  console.log("\nAttempting DELETE from user_tools via anonClient...");
  const { error: toolDelErr } = await anonClient.from('user_tools').delete().eq('user_id', targetUser.id);
  console.log("DELETE user_tools error:", toolDelErr ? toolDelErr : "None (Success)");

  // Test tools insert
  console.log("Attempting INSERT into user_tools via anonClient...");
  const { error: toolInsErr } = await anonClient.from('user_tools').insert({ user_id: targetUser.id, tool: 'TestTool' });
  console.log("INSERT user_tools error:", toolInsErr ? toolInsErr : "None (Success)");

  // Test interests delete
  console.log("\nAttempting DELETE from user_interests via anonClient...");
  const { error: intDelErr } = await anonClient.from('user_interests').delete().eq('user_id', targetUser.id);
  console.log("DELETE user_interests error:", intDelErr ? intDelErr : "None (Success)");

  // Test interests insert
  console.log("Attempting INSERT into user_interests via anonClient...");
  const { error: intInsErr } = await anonClient.from('user_interests').insert({ user_id: targetUser.id, interest: 'TestInterest' });
  console.log("INSERT user_interests error:", intInsErr ? intInsErr : "None (Success)");

  console.log("\nChecking what policies are active by examining pg_policies (using service role)...");
  const { data: policies, error: polErr } = await serviceClient.rpc('get_policies_metadata');
  if (polErr) {
    // If there is no custom RPC, let's try direct SQL or select from pg_policies if allowed.
    // Let's run a query to check if we can query pg_policies using supabase.
    console.log("No RPC 'get_policies_metadata' or query failed. Let's try raw postgres info if possible.");
  } else {
    console.log("Policies:", policies);
  }
}

test();
