let supabaseClient = null;
let useSupabase = false;

try {
  if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    useSupabase = true;
    console.log('Supabase client initialized (main)');
  }
} catch (e) {
  console.log('Supabase not configured for main.js; fallback where needed');
}

function renderMatches(matches) {
  let html = '';
  matches.forEach(m => {
    html += `
      <div class='card'>
        <h3>${m.name || 'Unknown'}</h3>
        <p><strong>Major:</strong> ${m.major || ''}</p>
        <p><strong>Can Teach:</strong> ${m.skills || ''}</p>
        <p><strong>Needs Help In:</strong> ${m.needs || ''}</p>
        <button>Connect</button>
      </div>
    `;
  });
  document.getElementById('results').innerHTML = html;
}

async function searchProfiles(query) {
  query = (query || '').trim();
  if (!query) return loadProfileAndMatches();

  if (useSupabase) {
    // use OR with ilike on multiple fields
    const q = `%${query.replace(/%/g, '')}%`;
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .or(`name.ilike.${q},major.ilike.${q},skills.ilike.${q},needs.ilike.${q}`)
      .limit(50);
    if (error) {
      console.error('Search error', error);
      return alert('Search failed');
    }
    renderMatches(data || []);
    document.getElementById('matchArea').classList.remove('hidden');
    document.getElementById('profileArea').classList.add('hidden');
  } else {
    // local fallback: search localStorage users
    const users = JSON.parse(localStorage.getItem('studymatch_users') || '{}');
    const results = Object.values(users).filter(u => {
      const hay = `${u.name || ''} ${u.email || ''} ${u.major || ''} ${u.skills || ''} ${u.needs || ''}`.toLowerCase();
      return hay.includes(query.toLowerCase());
    });
    renderMatches(results);
    document.getElementById('matchArea').classList.remove('hidden');
    document.getElementById('profileArea').classList.add('hidden');
  }
}

async function loadProfileAndMatches() {
  if (!useSupabase) {
    // local demo — just show profile area if no profile saved in localStorage for the current user
    document.getElementById('welcomeMsg').textContent = 'Local demo — profile and matches stored in browser';
    document.getElementById('profileArea').classList.remove('hidden');
    document.getElementById('matchArea').classList.add('hidden');
    return;
  }

  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) {
    window.location = 'index.html';
    return;
  }

  document.getElementById('welcomeMsg').textContent = `Welcome, ${user.user_metadata?.name || user.email}`;

  const { data: profile } = await supabaseClient.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
  if (profile) {
    document.getElementById('profileArea').classList.add('hidden');
    document.getElementById('matchArea').classList.remove('hidden');
    renderMatches([profile]);
  } else {
    document.getElementById('profileArea').classList.remove('hidden');
    document.getElementById('matchArea').classList.add('hidden');
  }
}

async function saveProfile() {
  if (!useSupabase) return alert('Supabase not configured.');

  const major = document.getElementById('major').value.trim();
  const skills = document.getElementById('skills').value.trim();
  const needs = document.getElementById('needs').value.trim();
  if (!major || !skills || !needs) return alert('Please fill out all fields.');

  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) return alert('No signed-in user.');

  const payload = { user_id: user.id, name: user.user_metadata?.name || '', major, skills, needs };
  const { error } = await supabaseClient.from('profiles').upsert(payload, { onConflict: 'user_id' });
  if (error) return alert('Failed to save profile: ' + error.message);

  document.getElementById('profileArea').classList.add('hidden');
  document.getElementById('matchArea').classList.remove('hidden');

  const { data: profile } = await supabaseClient.from('profiles').select('*').eq('user_id', user.id).single();
  renderMatches([profile]);
}

async function signOut() {
  if (useSupabase) {
    await supabaseClient.auth.signOut();
  }
  window.location = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
  document.getElementById('signOutBtn').addEventListener('click', signOut);
  document.getElementById('searchBtn').addEventListener('click', () => searchProfiles(document.getElementById('searchInput').value));
  document.getElementById('searchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') searchProfiles(e.target.value); });
  loadProfileAndMatches();
});