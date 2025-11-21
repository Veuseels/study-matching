let supabaseClient = null;
let useSupabase = false;
let currentUser = null;
let swipeProfiles = [];
let currentSwipeIndex = 0;

try {
  if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    useSupabase = true;
    console.log('Supabase client initialized');
  }
} catch (e) {
  console.log('Supabase not configured; using fallback');
}

// Navigation
function showPage(pageName) {
  document.getElementById('mainPage').classList.add('hidden');
  document.getElementById('swipePage').classList.add('hidden');
  document.getElementById('profilePage').classList.add('hidden');
  document.getElementById(pageName).classList.remove('hidden');
}

document.getElementById('goToSwipeBtn').addEventListener('click', () => {
  showPage('swipePage');
  loadSwipeProfiles();
});

document.getElementById('backToMain').addEventListener('click', (e) => {
  e.preventDefault();
  showPage('mainPage');
});

document.getElementById('profileIcon').addEventListener('click', () => {
  showPage('profilePage');
  loadProfilePage();
});

document.getElementById('backToMainFromProfile').addEventListener('click', (e) => {
  e.preventDefault();
  showPage('mainPage');
});

document.getElementById('editProfileBtn').addEventListener('click', () => {
  showPage('mainPage');
  document.getElementById('profileArea').classList.remove('hidden');
  document.getElementById('matchArea').classList.add('hidden');
});

// Profile Page
async function loadProfilePage() {
  if (!useSupabase) {
    document.getElementById('profileName').textContent = 'Demo User';
    document.getElementById('profileAvatar').textContent = 'D';
    return;
  }

  const { data: sessionData } = await supabaseClient.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) return;

  const name = user.user_metadata?.name || user.email;
  document.getElementById('profileName').textContent = name;
  document.getElementById('profileAvatar').textContent = name.charAt(0).toUpperCase();

  const { data: profile } = await supabaseClient.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
  if (profile) {
    document.getElementById('profileMajor').textContent = profile.major || 'Not set';
    document.getElementById('profileSkills').textContent = profile.skills || 'Not set';
    document.getElementById('profileNeeds').textContent = profile.needs || 'Not set';
  }
}

// Swipe Feature
async function loadSwipeProfiles() {
  if (useSupabase) {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;

    const { data } = await supabaseClient
      .from('profiles')
      .select('*')
      .neq('user_id', user.id)
      .limit(20);
    
    swipeProfiles = data || [];
  } else {
    // Demo profiles
    swipeProfiles = [
      { name: 'Sarah Chen', major: 'Computer Science', skills: 'Python, Data Structures', needs: 'Calculus, Physics' },
      { name: 'Mike Johnson', major: 'Mathematics', skills: 'Calculus, Linear Algebra', needs: 'Programming, Statistics' },
      { name: 'Emily Rodriguez', major: 'Biology', skills: 'Chemistry, Lab Techniques', needs: 'Statistics, Research Methods' },
      { name: 'David Kim', major: 'Physics', skills: 'Quantum Mechanics, Math', needs: 'Programming, Lab Reports' },
      { name: 'Lisa Wang', major: 'Business', skills: 'Economics, Marketing', needs: 'Statistics, Excel' }
    ];
  }

  currentSwipeIndex = 0;
  renderSwipeCard();
}

function renderSwipeCard() {
  const container = document.getElementById('swipeContainer');
  const cards = container.querySelectorAll('.swipe-card:not(.swipe-indicator)');
  cards.forEach(card => card.remove());

  if (currentSwipeIndex >= swipeProfiles.length) {
    container.innerHTML += `
      <div class="no-more-cards">
        <h2>🎉 You've seen everyone!</h2>
        <p>Check back later for more matches.</p>
        <button class="match-btn" onclick="showPage('mainPage')">Back to Main</button>
      </div>
    `;
    return;
  }

  const profile = swipeProfiles[currentSwipeIndex];
  const card = document.createElement('div');
  card.className = 'swipe-card';
  card.innerHTML = `
    <h2>${profile.name || 'Unknown'}</h2>
    <div class="info-section">
      <strong>Major</strong>
      <p>${profile.major || 'Not specified'}</p>
    </div>
    <div class="info-section">
      <strong>Can Teach</strong>
      <p>${profile.skills || 'Not specified'}</p>
    </div>
    <div class="info-section">
      <strong>Needs Help With</strong>
      <p>${profile.needs || 'Not specified'}</p>
    </div>
  `;

  container.appendChild(card);
  addSwipeListeners(card);
}

function addSwipeListeners(card) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  card.addEventListener('mousedown', startDrag);
  card.addEventListener('touchstart', startDrag);

  function startDrag(e) {
    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    card.classList.add('swiping');
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  }

  function drag(e) {
    if (!isDragging) return;
    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const diff = currentX - startX;
    const rotate = diff / 10;
    
    card.style.transform = `translateX(${diff}px) rotate(${rotate}deg)`;
    
    const likeIndicator = document.querySelector('.swipe-indicator.like');
    const skipIndicator = document.querySelector('.swipe-indicator.skip');
    
    if (diff > 50) {
      likeIndicator.style.opacity = Math.min(diff / 150, 1);
      skipIndicator.style.opacity = 0;
    } else if (diff < -50) {
      skipIndicator.style.opacity = Math.min(Math.abs(diff) / 150, 1);
      likeIndicator.style.opacity = 0;
    } else {
      likeIndicator.style.opacity = 0;
      skipIndicator.style.opacity = 0;
    }
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
    
    const diff = currentX - startX;
    
    if (diff > 100) {
      swipeRight(card);
    } else if (diff < -100) {
      swipeLeft(card);
    } else {
      card.classList.remove('swiping');
      card.style.transform = '';
      document.querySelector('.swipe-indicator.like').style.opacity = 0;
      document.querySelector('.swipe-indicator.skip').style.opacity = 0;
    }
  }
}

function swipeRight(card) {
  card.style.transform = 'translateX(800px) rotate(30deg)';
  card.style.opacity = '0';
  setTimeout(() => {
    currentSwipeIndex++;
    renderSwipeCard();
  }, 300);
}

function swipeLeft(card) {
  card.style.transform = 'translateX(-800px) rotate(-30deg)';
  card.style.opacity = '0';
  setTimeout(() => {
    currentSwipeIndex++;
    renderSwipeCard();
  }, 300);
}

document.getElementById('likeBtn').addEventListener('click', () => {
  const card = document.querySelector('.swipe-card:not(.swipe-indicator)');
  if (card) swipeRight(card);
});

document.getElementById('skipBtn').addEventListener('click', () => {
  const card = document.querySelector('.swipe-card:not(.swipe-indicator)');
  if (card) swipeLeft(card);
});

// Original main page functions
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
    document.getElementById('welcomeMsg').textContent = 'Local demo';
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

  currentUser = user;
  const name = user.user_metadata?.name || user.email;
  document.getElementById('welcomeMsg').textContent = `Welcome, ${name}`;
  document.getElementById('profileIcon').textContent = name.charAt(0).toUpperCase();

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