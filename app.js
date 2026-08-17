/* Aether Rebirth — Main Application Logic */

// ---------- State ----------
let currentGender = 'female';
let characterData = {
  name: '',
  gender: 'female',
  lifeSeed: '',
  morphs: {
    fwhr: 1.85,
    canthal: 3,
    gonial: 125,
    thirds: 0.98,
    nose: 0.55,
    chin: 0.42,
    eyes: 0.50,
    lips: 0.48,
    height: 168,
    shoulders: 0.52,
    whr: 0.72,
    muscle: 0.35,
    limbs: 1.00,
    hairlen: 0.55
  },
  colors: {
    skin: '#e8b89d',
    hair: '#2c1810',
    eye: '#3a5f8a'
  },
  scars: 'none'
};

// Default values by gender (soft constraints inspired by True Eve / True Adam philosophy)
const GENDER_DEFAULTS = {
  female: {
    fwhr: 1.85, canthal: 3, gonial: 125, thirds: 0.98, nose: 0.55, chin: 0.42,
    eyes: 0.52, lips: 0.55, height: 165, shoulders: 0.48, whr: 0.70, muscle: 0.30, limbs: 1.00, hairlen: 0.65
  },
  male: {
    fwhr: 1.95, canthal: 1, gonial: 118, thirds: 1.02, nose: 0.62, chin: 0.55,
    eyes: 0.45, lips: 0.40, height: 178, shoulders: 0.62, whr: 0.85, muscle: 0.55, limbs: 1.02, hairlen: 0.35
  }
};

// ---------- Section Navigation ----------
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  // Close mobile menu
  document.getElementById('navLinks').classList.remove('open');

  // Special handling
  if (id === 'account') renderAccount();
  if (id === 'world') renderContinents();
  if (id === 'gods') renderGods();
  if (id === 'create') updatePreview();
}

// Mobile menu
document.getElementById('mobileToggle')?.addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// ---------- Render Continents & Gods ----------
function renderContinents() {
  const grid = document.getElementById('continentGrid');
  if (!grid || grid.children.length > 0) return;
  grid.innerHTML = CONTINENTS.map(c => `
    <div class="card">
      <span class="tag">${c.tag}</span>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
    </div>
  `).join('');
}

function renderGods() {
  const grid = document.getElementById('godsGrid');
  if (!grid || grid.children.length > 0) return;
  grid.innerHTML = GODS.map(g => `
    <div class="card">
      <h3>${g.name}</h3>
      <p><strong>${g.domain}</strong></p>
      <p style="margin-top:8px;font-size:0.85rem;color:var(--text-dim)">${g.theme}</p>
    </div>
  `).join('');
}

// ---------- Character Creator ----------
function setGender(gender) {
  currentGender = gender;
  characterData.gender = gender;

  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.gender === gender);
  });

  // Apply soft gender defaults
  const defaults = GENDER_DEFAULTS[gender];
  Object.keys(defaults).forEach(key => {
    characterData.morphs[key] = defaults[key];
    const el = document.getElementById(key);
    if (el) {
      el.value = defaults[key];
      updateMorphValueDisplay(key, defaults[key]);
    }
  });

  updatePreview();
}

function updateMorph(input) {
  const id = input.id;
  const val = parseFloat(input.value);
  characterData.morphs[id] = val;
  updateMorphValueDisplay(id, val);

  // Soft ratio enforcement (simplified True Eve / True Adam spirit)
  if (id === 'fwhr' || id === 'gonial') {
    // Example linked adjustment
    const linked = id === 'fwhr' ? 'chin' : 'shoulders';
    // Keep subtle influence only
  }

  updatePreview();
}

function updateMorphValueDisplay(id, val) {
  const display = document.getElementById('val-' + id);
  if (!display) return;

  const units = {
    fwhr: '', canthal: '°', gonial: '°', thirds: '', nose: '', chin: '',
    eyes: '', lips: '', height: '', shoulders: '', whr: '', muscle: '',
    limbs: '', hairlen: ''
  };

  if (id === 'height') {
    display.textContent = Math.round(val);
  } else if (id === 'canthal' || id === 'gonial') {
    display.textContent = val + '°';
  } else {
    display.textContent = Number(val).toFixed(2);
  }
}

function updatePreview() {
  const name = document.getElementById('charName')?.value || 'Unnamed';
  const seed = document.getElementById('lifeSeed')?.value || '';
  characterData.name = name;
  characterData.lifeSeed = seed;

  document.getElementById('previewName').textContent = name || 'Unnamed';
  document.getElementById('previewGender').textContent =
    characterData.gender === 'female' ? 'True Eve lineage' : 'True Adam lineage';

  // Colors
  const skin = document.getElementById('skinTone')?.value || characterData.colors.skin;
  const hair = document.getElementById('hairColor')?.value || characterData.colors.hair;
  const eye = document.getElementById('eyeColor')?.value || characterData.colors.eye;
  characterData.colors = { skin, hair, eye };
  characterData.scars = document.getElementById('scars')?.value || 'none';

  // Apply visual feedback to silhouette
  const silhouette = document.getElementById('previewSilhouette');
  if (silhouette) {
    silhouette.style.background = `linear-gradient(180deg, ${skin}33, #1a1625)`;
  }

  const eyes = document.querySelectorAll('.eye');
  eyes.forEach(e => e.style.background = eye);

  // Simple morph feedback
  const face = document.querySelector('.face-preview');
  if (face) {
    const scale = 0.9 + (characterData.morphs.fwhr - 1.7) * 0.15;
    face.style.transform = `translateX(-50%) scale(${scale})`;
  }
}

function randomizeCharacter() {
  const m = characterData.morphs;
  const ranges = {
    fwhr: [1.65, 2.05], canthal: [-5, 10], gonial: [115, 135], thirds: [0.88, 1.10],
    nose: [0.40, 0.70], chin: [0.30, 0.60], eyes: [0.35, 0.65], lips: [0.30, 0.70],
    height: [155, 190], shoulders: [0.40, 0.68], whr: [0.65, 0.90], muscle: [0.15, 0.80],
    limbs: [0.90, 1.10], hairlen: [0.10, 0.95]
  };

  Object.keys(ranges).forEach(key => {
    const [min, max] = ranges[key];
    const val = +(min + Math.random() * (max - min)).toFixed(2);
    m[key] = val;
    const el = document.getElementById(key);
    if (el) {
      el.value = val;
      updateMorphValueDisplay(key, val);
    }
  });

  // Random colors
  document.getElementById('skinTone').value = randomSkin();
  document.getElementById('hairColor').value = randomHair();
  document.getElementById('eyeColor').value = randomEye();

  updatePreview();
}

function randomSkin() {
  const skins = ['#e8b89d', '#d4a07a', '#c68642', '#8d5524', '#f1c27d', '#ffdbac', '#c58c65'];
  return skins[Math.floor(Math.random() * skins.length)];
}
function randomHair() {
  const hairs = ['#2c1810', '#4a3728', '#1a1a1a', '#6b4423', '#c9a227', '#8b0000', '#2f4f4f'];
  return hairs[Math.floor(Math.random() * hairs.length)];
}
function randomEye() {
  const eyes = ['#3a5f8a', '#2e8b57', '#8b4513', '#4a5568', '#6b8e23', '#5c3317', '#1e3a5f'];
  return eyes[Math.floor(Math.random() * eyes.length)];
}

function resetCharacter() {
  setGender(currentGender);
  document.getElementById('charName').value = '';
  document.getElementById('lifeSeed').value = '';
  document.getElementById('skinTone').value = '#e8b89d';
  document.getElementById('hairColor').value = '#2c1810';
  document.getElementById('eyeColor').value = '#3a5f8a';
  document.getElementById('scars').value = 'none';
  updatePreview();
}

function finalizeCharacter() {
  const name = document.getElementById('charName')?.value?.trim();
  if (!name) {
    alert('Please enter a character name.');
    return;
  }

  // Save to localStorage (prototype “account”)
  const account = JSON.parse(localStorage.getItem('aether_account') || '{"characters":[]}');
  const newChar = {
    id: Date.now().toString(36),
    ...characterData,
    name,
    createdAt: new Date().toISOString(),
    status: 'Normal World — First Life'
  };

  account.characters.push(newChar);
  account.lastCharacterId = newChar.id;
  localStorage.setItem('aether_account', JSON.stringify(account));

  alert(`Character "${name}" saved.\n\nYou are now ready to enter the Normal World.\n(In the full version this would instantly sync to the game client.)\n\nNext: the game prototype will use this character.`);

  showSection('account');
}

// ---------- Account ----------
function renderAccount() {
  const panel = document.getElementById('accountPanel');
  const account = JSON.parse(localStorage.getItem('aether_account') || '{"characters":[]}');

  if (!account.characters || account.characters.length === 0) {
    panel.innerHTML = `
      <div class="account-card">
        <h3>No Characters Yet</h3>
        <p style="color:var(--text-muted);margin-bottom:20px;">Create your first character to begin your journey of life, death, and rebirth.</p>
        <button class="btn btn-primary" onclick="showSection('create')">Create Character</button>
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <div class="account-card">
      <h3>Your Characters</h3>
      <ul class="char-list">
        ${account.characters.map(c => `
          <li>
            <div>
              <strong>${c.name}</strong>
              <div style="font-size:0.8rem;color:var(--text-dim)">${c.gender === 'female' ? 'True Eve' : 'True Adam'} · ${c.status}</div>
            </div>
            <span style="font-size:0.8rem;color:var(--accent)">${new Date(c.createdAt).toLocaleDateString()}</span>
          </li>
        `).join('')}
      </ul>
      <button class="btn btn-primary" style="margin-top:16px" onclick="showSection('create')">Create Another</button>
      <button class="btn btn-secondary" style="margin-top:10px;width:100%" onclick="clearAccount()">Clear All Data (Prototype)</button>
    </div>
  `;
}

function clearAccount() {
  if (confirm('Delete all local character data?')) {
    localStorage.removeItem('aether_account');
    renderAccount();
  }
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // Initialize displays
  Object.keys(characterData.morphs).forEach(key => {
    updateMorphValueDisplay(key, characterData.morphs[key]);
  });

  updatePreview();
  showSection('home');
});
