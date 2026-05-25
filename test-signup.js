import { createClient } from '@supabase/supabase-js';
import { createFullProfile } from './src/lib/auth.js';

const SUPABASE_URL = "https://pmfvhzpypycaxrhjjqhs.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZnZoenB5cHljYXhyaGpqcWhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk1MTQ0NywiZXhwIjoyMDk0NTI3NDQ3fQ.0DQpC4tEFt-463n9nw0TtKpb0yC6CKS0lJwlLnH-7og";

const serviceClient = createClient(SUPABASE_URL, SERVICE_KEY);

async function test() {
  const testUid = "test-uid-signup-" + Math.floor(Math.random() * 100000);
  const firebaseUser = {
    uid: testUid,
    email: `${testUid}@example.com`,
    displayName: "Test Signup User",
    photoURL: null
  };

  const signupData = {
    displayName: "Test Signup User",
    username: "tsignup_" + Math.floor(Math.random() * 10000),
    title: "Architect",
    organization: "Test Studio",
    locationCity: "Mumbai",
    locationCountry: "India",
    yearsExp: "3–5",
    accountType: "individual",
    interests: ["Residential", "Commercial", "Sustainable"],
    tools: ["AutoCAD", "Revit"],
    websiteUrl: "https://test.com"
  };

  console.log(`Running createFullProfile for simulated firebaseUser:`, firebaseUser.uid);
  const result = await createFullProfile(firebaseUser, signupData);
  console.log("createFullProfile result:", result);

  if (result.error) {
    console.error("Error in createFullProfile:", result.error);
    return;
  }

  const userId = result.data.id;
  console.log("\nChecking database for inserted records for userId:", userId);

  const { data: user } = await serviceClient.from('users').select('*').eq('id', userId).single();
  console.log("User record in DB:", user);

  const { data: specs } = await serviceClient.from('user_specializations').select('tag').eq('user_id', userId);
  console.log("Specializations in DB:", specs?.map(s => s.tag));

  const { data: tools } = await serviceClient.from('user_tools').select('tool').eq('user_id', userId);
  console.log("Tools in DB:", tools?.map(t => t.tool));

  const { data: ints } = await serviceClient.from('user_interests').select('interest').eq('user_id', userId);
  console.log("Interests in DB:", ints?.map(i => i.interest));
}

test();
