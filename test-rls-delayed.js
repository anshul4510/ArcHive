import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pmfvhzpypycaxrhjjqhs.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZnZoenB5cHljYXhyaGpqcWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTE0NDcsImV4cCI6MjA5NDUyNzQ0N30.sUpPdzB-RucSEPq5hRT_bLla57U3zQXo__RBUHAyOqM";

const anonClient = createClient(SUPABASE_URL, ANON_KEY);

const userId = "48a3c2bc-9219-4948-89e3-534fb8a9f7a2"; // testuser_38861
const firebaseUid = "test-firebase-uid-853153";

async function test() {
  console.log("--- 1. Testing INSERT without set_firebase_uid ---");
  const { error: err1 } = await anonClient.from('user_specializations').insert({ user_id: userId, tag: 'DelayTag1' });
  console.log("INSERT 1 error:", err1 ? err1.message : "None (Success)");

  console.log("\n--- 2. Setting firebase_uid ---");
  await anonClient.rpc('set_firebase_uid', { uid: firebaseUid });

  console.log("\n--- 3. Testing INSERT immediately after set_firebase_uid ---");
  const { error: err2 } = await anonClient.from('user_specializations').insert({ user_id: userId, tag: 'DelayTag2' });
  console.log("INSERT 2 error:", err2 ? err2.message : "None (Success)");

  console.log("\n--- 4. Waiting 5 seconds ---");
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log("\n--- 5. Testing INSERT after 5s delay ---");
  const { error: err3 } = await anonClient.from('user_specializations').insert({ user_id: userId, tag: 'DelayTag3' });
  console.log("INSERT 3 error:", err3 ? err3.message : "None (Success)");
}

test();
