const SUPABASE_URL = "https://pmfvhzpypycaxrhjjqhs.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZnZoenB5cHljYXhyaGpqcWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTE0NDcsImV4cCI6MjA5NDUyNzQ0N30.sUpPdzB-RucSEPq5hRT_bLla57U3zQXo__RBUHAyOqM";

async function test() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
      }
    });
    const data = await res.json();
    console.log("Exposed Tables/Views:");
    console.log(Object.keys(data.definitions || {}));
    console.log("\nExposed RPC Paths:");
    console.log(Object.keys(data.paths || {}).filter(p => p.startsWith('/rpc/')));
  } catch (e) {
    console.error("Fetch schema error:", e);
  }
}

test();
