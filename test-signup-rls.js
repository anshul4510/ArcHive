import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pmfvhzpypycaxrhjjqhs.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZnZoenB5cHljYXhyaGpqcWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTE0NDcsImV4cCI6MjA5NDUyNzQ0N30.sUpPdzB-RucSEPq5hRT_bLla57U3zQXo__RBUHAyOqM";

const anonClient = createClient(SUPABASE_URL, ANON_KEY);

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function test() {
  const firebaseUid = "test-firebase-uid-signup-" + Math.floor(Math.random() * 100000);
  const userId = generateUUID();
  console.log(`Generated firebaseUid: ${firebaseUid}, userId: ${userId}`);

  // Step 1: set_firebase_uid
  console.log("Calling set_firebase_uid RPC...");
  const { error: rpcErr } = await anonClient.rpc('set_firebase_uid', { uid: firebaseUid });
  console.log("set_firebase_uid error:", rpcErr ? rpcErr : "None");

  // Step 2: Insert into users
  console.log("Inserting user...");
  const payload = {
    id: userId,
    firebase_uid: firebaseUid,
    username: "tsignup_" + Math.floor(Math.random() * 10000),
    display_name: "Test Signup User",
    email: `${firebaseUid}@example.com`,
    title: "Architect",
    organization: "Test Studio",
    location_city: "Mumbai",
    location_country: "India",
    years_exp: "3–5",
    account_type: "individual",
    updated_at: new Date().toISOString()
  };
  const { data: user, error: userErr } = await anonClient.from('users').insert(payload).select().single();
  console.log("Insert user error:", userErr ? userErr : "None");

  if (userErr) return;

  // Step 3: Deletes and inserts for interests
  console.log("Deleting interests...");
  const { error: delIntErr } = await anonClient.from('user_interests').delete().eq('user_id', userId);
  console.log("Delete interests error:", delIntErr ? delIntErr : "None");

  console.log("Inserting interests...");
  const { error: insIntErr } = await anonClient.from('user_interests').insert([
    { user_id: userId, interest: "Residential" },
    { user_id: userId, interest: "Commercial" }
  ]);
  console.log("Insert interests error:", insIntErr ? insIntErr : "None");

  // Step 4: Deletes and inserts for specializations
  console.log("Deleting specializations...");
  const { error: delSpecErr } = await anonClient.from('user_specializations').delete().eq('user_id', userId);
  console.log("Delete specializations error:", delSpecErr ? delSpecErr : "None");

  console.log("Inserting specializations...");
  const { error: insSpecErr } = await anonClient.from('user_specializations').insert([
    { user_id: userId, tag: "Residential" },
    { user_id: userId, tag: "Commercial" }
  ]);
  console.log("Insert specializations error:", insSpecErr ? insSpecErr : "None");

  // Step 5: Deletes and inserts for tools
  console.log("Deleting tools...");
  const { error: delToolErr } = await anonClient.from('user_tools').delete().eq('user_id', userId);
  console.log("Delete tools error:", delToolErr ? delToolErr : "None");

  console.log("Inserting tools...");
  const { error: insToolErr } = await anonClient.from('user_tools').insert([
    { user_id: userId, tool: "AutoCAD" },
    { user_id: userId, tool: "Revit" }
  ]);
  console.log("Insert tools error:", insToolErr ? insToolErr : "None");
}

test();
