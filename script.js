// script.js
// Owns app state and talks to TEMPLATES (templates.js) to render the live CV.

let track = null;
let photoData = null;
let skills = [];
let experiences = [{ role: '', company: '', dates: '', desc: '' }];
let educations = [{ degree: '', school: '', year: '' }];

const TRACK_LABELS = { tech: 'Tech / CS', cabin: 'Cabin Crew', corporate: 'Banking / Corporate' };
const FIELD_IDS = ['fullName', 'roleTitle', 'email', 'phone', 'location', 'linkedin', 'summary', 'certs', 'languages'];

// Multiple saved CVs live under one registry key so we don't scatter localStorage keys.
// Shape: { activeId: 'cv_123', cvs: { cv_123: { id, name, savedAt, track, photoData, skills, experiences, educations, fields } } }
const REGISTRY_KEY = 'jeromecv:registry';
let currentCvId = null;
let currentCvName = 'Untitled CV';
let cvFontFamily = 'default';
let cvFontScale = 1;

function esc(s) {
  return (s || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

/* ---------- Track selection ---------- */

function selectTrack(t, evt) {
  track = t;
  document.querySelectorAll('.track-card').forEach(c => c.classList.remove('selected'));
  const card = (evt && evt.currentTarget) || document.querySelector(`.track-card[data-track="${t}"]`);
  card.classList.add('selected');
  document.getElementById('continueBtn').disabled = false;
}

function goToStep2() {
  if (!track) return;
  if (!currentCvId) currentCvId = makeCvId();
  document.getElementById('step1').style.display = 'none';
  document.getElementById('workspace').classList.add('active');
  document.getElementById('photoField').style.display = track === 'cabin' ? 'block' : 'none';
  document.getElementById('languagesField').style.display = track === 'cabin' ? 'block' : 'none';
  document.getElementById('atsBar').style.display = track === 'tech' ? 'flex' : 'none';
  renderProfileSwitcher();
  renderCvSwitcher();
  renderRepeaters();
  renderSkillChips();
  render();
}

function goToStep1() {
  document.getElementById('step1').style.display = 'block';
  document.getElementById('workspace').classList.remove('active');
  document.getElementById('profileSwitcher').innerHTML = '';
}

function renderProfileSwitcher() {
  document.getElementById('profileSwitcher').innerHTML = Object.keys(TRACK_LABELS).map(k =>
    `<button class="profile-btn ${k === track ? 'active' : ''}" onclick="switchProfile('${k}')">${TRACK_LABELS[k]}</button>`
  ).join('');
}

function switchProfile(t) {
  track = t;
  document.getElementById('photoField').style.display = track === 'cabin' ? 'block' : 'none';
  document.getElementById('languagesField').style.display = track === 'cabin' ? 'block' : 'none';
  document.getElementById('atsBar').style.display = track === 'tech' ? 'flex' : 'none';
  renderProfileSwitcher();
  render();
}

/* ---------- Photo ---------- */

function handlePhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    photoData = ev.target.result;
    document.getElementById('photoPreview').innerHTML = `<img src="${photoData}" alt="">`;
    render();
  };
  reader.readAsDataURL(file);
}

/* ---------- Repeatable experience / education ---------- */

function addExperience() { experiences.push({ role: '', company: '', dates: '', desc: '' }); renderRepeaters(); }
function removeExperience(i) { experiences.splice(i, 1); renderRepeaters(); render(); }
function addEducation() { educations.push({ degree: '', school: '', year: '' }); renderRepeaters(); }
function removeEducation(i) { educations.splice(i, 1); renderRepeaters(); render(); }

function renderRepeaters() {
  document.getElementById('experienceList').innerHTML = experiences.map((exp, i) => `
    <div class="repeat-block">
      ${experiences.length > 1 ? `<button class="repeat-remove" onclick="removeExperience(${i})" aria-label="Remove this experience entry">×</button>` : ''}
      <div class="row2">
        <div class="field"><label>Role</label><input value="${esc(exp.role)}" oninput="experiences[${i}].role=this.value; render()" placeholder="Software Engineer"></div>
        <div class="field"><label>Company</label><input value="${esc(exp.company)}" oninput="experiences[${i}].company=this.value; render()" placeholder="Acme Inc."></div>
      </div>
      <div class="field"><label>Dates</label><input value="${esc(exp.dates)}" oninput="experiences[${i}].dates=this.value; render()" placeholder="2023 — Present"></div>
      <div class="field"><label>What you did</label><textarea oninput="experiences[${i}].desc=this.value; render()" placeholder="Lead with the result, e.g. Increased sales by 32%...">${exp.desc}</textarea></div>
    </div>
  `).join('');

  document.getElementById('educationList').innerHTML = educations.map((edu, i) => `
    <div class="repeat-block">
      ${educations.length > 1 ? `<button class="repeat-remove" onclick="removeEducation(${i})" aria-label="Remove this education entry">×</button>` : ''}
      <div class="field"><label>Qualification</label><input value="${esc(edu.degree)}" oninput="educations[${i}].degree=this.value; render()" placeholder="BSc Computer Science"></div>
      <div class="row2">
        <div class="field"><label>Institution</label><input value="${esc(edu.school)}" oninput="educations[${i}].school=this.value; render()" placeholder="University of Ghana"></div>
        <div class="field"><label>Year</label><input value="${esc(edu.year)}" oninput="educations[${i}].year=this.value; render()" placeholder="2024"></div>
      </div>
    </div>
  `).join('');
}

/* ---------- Skills ---------- */

function addSkillFromInput() {
  const input = document.getElementById('skillInput');
  const value = input.value.trim();
  if (!value) return;
  skills.push(value);
  input.value = '';
  renderSkillChips();
  render();
}
function handleSkillKeydown(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    addSkillFromInput();
  }
}
function handleSkillBlur() {
  addSkillFromInput(); // don't silently lose whatever was typed if they click away
}
function removeSkill(i) { skills.splice(i, 1); renderSkillChips(); render(); }
function renderSkillChips() {
  document.getElementById('skillChips').innerHTML = skills.map((s, i) =>
    `<span class="chip">${esc(s)}<button onclick="removeSkill(${i})" aria-label="Remove skill ${esc(s)}">×</button></span>`).join('');
}

/* ---------- Collect + render ---------- */

function collectData() {
  const expStr = experiences
    .filter(e => e.role || e.company)
    .map(e => {
      const head = [esc(e.role), esc(e.company)].filter(Boolean).join(' — ');
      const date = e.dates ? ` (${esc(e.dates)})` : '';
      return `${head}${date}${e.desc ? '\n' + esc(e.desc) : ''}`;
    }).join('\n\n');

  const eduStr = educations
    .filter(e => e.degree || e.school)
    .map(e => {
      const head = [esc(e.degree), esc(e.school)].filter(Boolean).join(' — ');
      return `${head}${e.year ? ' (' + esc(e.year) + ')' : ''}`;
    }).join('\n');

  return {
    name: esc(document.getElementById('fullName').value),
    title: esc(document.getElementById('roleTitle').value),
    email: esc(document.getElementById('email').value),
    phone: esc(document.getElementById('phone').value),
    location: esc(document.getElementById('location').value),
    linkedin: esc(document.getElementById('linkedin').value),
    summary: esc(document.getElementById('summary').value),
    skills: skills.map(esc).join(' | '),
    experience: expStr,
    education: eduStr,
    certs: esc(document.getElementById('certs').value),
    languages: esc(document.getElementById('languages').value),
    photo: photoData
  };
}

function render() {
  if (!track) return;
  const data = collectData();
  const fn = TEMPLATES[track] || TEMPLATES.corporate;
  const sheet = document.getElementById('sheetLive');
  sheet.innerHTML = fn(data);
  applyFormattingToSheet();
  updateATS(data);

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) downloadBtn.disabled = !document.getElementById('fullName').value.trim();

  saveActiveCv();
}

const FONT_STACKS = {
  arial: "Arial, Helvetica, sans-serif",
  calibri: "Calibri, 'Segoe UI', sans-serif",
  times: "'Times New Roman', Times, serif"
};

function updateFormatting() {
  cvFontFamily = document.getElementById('fontFamily').value;
  cvFontScale = parseFloat(document.getElementById('fontScale').value) || 1;
  applyFormattingToSheet();
  saveActiveCv();
}

function applyFormattingToSheet() {
  const sheet = document.getElementById('sheetLive');
  if (!sheet) return;
  sheet.style.setProperty('--cv-scale', cvFontScale);
  sheet.style.setProperty('--user-font', FONT_STACKS[cvFontFamily] || 'inherit');
  const cvEl = sheet.querySelector('.cv');
  if (cvEl) cvEl.classList.toggle('font-override', cvFontFamily !== 'default');
}

/* ---------- Saved CVs (localStorage registry) ---------- */
/* Falls back to no-op silently if storage is unavailable (private browsing, quota, etc). */

function loadRegistry() {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return (parsed && parsed.cvs) ? parsed : { activeId: null, cvs: {} };
  } catch (err) { return { activeId: null, cvs: {} }; }
}

function saveRegistry(reg) {
  try { localStorage.setItem(REGISTRY_KEY, JSON.stringify(reg)); } catch (err) { /* ignore */ }
}

function snapshotCurrentCv() {
  const fields = {};
  FIELD_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) fields[id] = el.value;
  });
  return {
    id: currentCvId,
    name: currentCvName,
    savedAt: Date.now(),
    track, photoData, skills, experiences, educations, fields,
    fontFamily: cvFontFamily, fontScale: cvFontScale
  };
}

function applyCvSnapshot(cv) {
  track = cv.track || null;
  photoData = cv.photoData || null;
  skills = cv.skills || [];
  experiences = (cv.experiences && cv.experiences.length) ? cv.experiences : [{ role: '', company: '', dates: '', desc: '' }];
  educations = (cv.educations && cv.educations.length) ? cv.educations : [{ degree: '', school: '', year: '' }];
  currentCvId = cv.id;
  currentCvName = cv.name || 'Untitled CV';
  cvFontFamily = cv.fontFamily || 'default';
  cvFontScale = cv.fontScale || 1;

  document.getElementById('step1').style.display = 'none';
  document.getElementById('workspace').classList.add('active');
  document.getElementById('photoField').style.display = track === 'cabin' ? 'block' : 'none';
  document.getElementById('languagesField').style.display = track === 'cabin' ? 'block' : 'none';
  document.getElementById('atsBar').style.display = track === 'tech' ? 'flex' : 'none';

  FIELD_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = (cv.fields && cv.fields[id] !== undefined) ? cv.fields[id] : '';
  });
  document.getElementById('photoPreview').innerHTML = photoData ? `<img src="${photoData}" alt="">` : 'No photo';
  document.getElementById('fontFamily').value = cvFontFamily;
  document.getElementById('fontScale').value = String(cvFontScale);

  document.querySelectorAll('.track-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`.track-card[data-track="${track}"]`);
  if (card) card.classList.add('selected');
  document.getElementById('continueBtn').disabled = !track;

  renderProfileSwitcher();
  renderCvSwitcher();
  renderRepeaters();
  renderSkillChips();
  render();
}

function saveActiveCv() {
  if (!currentCvId) return; // nothing to save into yet (still on step 1)
  const reg = loadRegistry();
  reg.cvs[currentCvId] = snapshotCurrentCv();
  reg.activeId = currentCvId;
  saveRegistry(reg);
  renderCvSwitcher();
}

function makeCvId() { return 'cv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7); }

function startNewCv() {
  currentCvId = makeCvId();
  currentCvName = 'Untitled CV';
  track = null;
  photoData = null;
  skills = [];
  experiences = [{ role: '', company: '', dates: '', desc: '' }];
  educations = [{ degree: '', school: '', year: '' }];
  cvFontFamily = 'default';
  cvFontScale = 1;

  FIELD_IDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('photoPreview').innerHTML = 'No photo';
  document.getElementById('fontFamily').value = 'default';
  document.getElementById('fontScale').value = '1';
  document.querySelectorAll('.track-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('continueBtn').disabled = true;
  document.getElementById('profileSwitcher').innerHTML = '';

  document.getElementById('step1').style.display = 'block';
  document.getElementById('workspace').classList.remove('active');
  renderCvSwitcher();
}

function openSavedCv(id) {
  const reg = loadRegistry();
  const cv = reg.cvs[id];
  if (!cv) return;
  reg.activeId = id;
  saveRegistry(reg);
  applyCvSnapshot(cv);
}

function renameCurrentCv() {
  if (!currentCvId) return;
  const next = prompt('Name this CV:', currentCvName);
  if (next === null) return;
  currentCvName = next.trim() || 'Untitled CV';
  saveActiveCv();
}

function deleteCv(id, evt) {
  if (evt) evt.stopPropagation();
  const reg = loadRegistry();
  const cv = reg.cvs[id];
  if (!cv) return;
  if (!confirm(`Delete "${cv.name}"? This can't be undone.`)) return;

  delete reg.cvs[id];
  const remainingIds = Object.keys(reg.cvs);

  if (id === currentCvId) {
    if (remainingIds.length) {
      const nextId = remainingIds.sort((a, b) => reg.cvs[b].savedAt - reg.cvs[a].savedAt)[0];
      reg.activeId = nextId;
      saveRegistry(reg);
      applyCvSnapshot(reg.cvs[nextId]);
      return;
    }
    reg.activeId = null;
    saveRegistry(reg);
    startNewCv();
    return;
  }

  saveRegistry(reg);
  renderCvSwitcher();
}

function renderCvSwitcher() {
  const el = document.getElementById('cvSwitcher');
  if (!el) return;
  const reg = loadRegistry();
  const ids = Object.keys(reg.cvs).sort((a, b) => reg.cvs[b].savedAt - reg.cvs[a].savedAt);

  const list = ids.map(id => {
    const cv = reg.cvs[id];
    const active = id === currentCvId;
    const label = TRACK_LABELS[cv.track] || 'No track yet';
    return `
      <button class="cv-switcher-item ${active ? 'active' : ''}" onclick="openSavedCv('${id}')">
        <span class="cv-switcher-name">${esc(cv.name)}</span>
        <span class="cv-switcher-track">${label}</span>
        <span class="cv-switcher-delete" onclick="deleteCv('${id}', event)" aria-label="Delete ${esc(cv.name)}" role="button">×</span>
      </button>`;
  }).join('');

  el.innerHTML = `
    <button class="cv-switcher-toggle" onclick="toggleCvMenu()">
      <span>${esc(currentCvName)}</span> ▾
    </button>
    <div class="cv-switcher-menu" id="cvSwitcherMenu">
      ${list || '<div class="cv-switcher-empty">No saved CVs yet</div>'}
      <button class="cv-switcher-new" onclick="startNewCv()">+ New CV</button>
      <button class="cv-switcher-rename" onclick="renameCurrentCv()">Rename current</button>
    </div>`;
}

function toggleCvMenu() {
  const menu = document.getElementById('cvSwitcherMenu');
  if (menu) menu.classList.toggle('open');
}

document.addEventListener('click', (e) => {
  const switcher = document.getElementById('cvSwitcher');
  const menu = document.getElementById('cvSwitcherMenu');
  if (switcher && menu && !switcher.contains(e.target)) menu.classList.remove('open');
});

function restoreOnLoad() {
  const reg = loadRegistry();
  const ids = Object.keys(reg.cvs);

  if (reg.activeId && reg.cvs[reg.activeId]) {
    currentCvId = reg.activeId;
    applyCvSnapshot(reg.cvs[reg.activeId]);
    return;
  }
  if (ids.length) {
    const latest = ids.sort((a, b) => reg.cvs[b].savedAt - reg.cvs[a].savedAt)[0];
    applyCvSnapshot(reg.cvs[latest]);
    return;
  }
  // brand new visitor — nothing saved yet, start on step 1 with a fresh id ready
  currentCvId = makeCvId();
  renderRepeaters();
  renderCvSwitcher();
}

/* ---------- ATS readiness (tech track) ---------- */

function updateATS(data) {
  const bar = document.getElementById('atsBar');
  if (!bar || bar.style.display === 'none') return;

  let score = 0;
  if (data.name) score += 15;
  if (data.email && data.phone) score += 15;
  if (data.summary && data.summary.length > 40) score += 20;
  if (skills.length >= 4) score += 25;
  if (experiences.some(e => e.desc && e.desc.length > 20)) score += 25;
  score = Math.min(100, score);

  const note = score >= 80 ? 'looking strong' : score >= 50 ? 'add a bit more detail' : 'keep filling in the sections above';
  document.getElementById('atsScore').textContent = score + '%';
  document.getElementById('atsNote').textContent = note;
}

/* ---------- PDF download ---------- */

function downloadPDF() {
  if (!track) return;
  const rawName = document.getElementById('fullName').value.trim();
  if (!rawName) {
    document.getElementById('fullName').focus();
    return;
  }
  const el = document.getElementById('sheetLive');
  const name = rawName.replace(/\s+/g, '-');

  // html2canvas captures based on current scroll position. If the page itself is
  // scrolled, or the preview panel's own internal scroll container isn't at the
  // top, the capture can come out blank or cut off. Reset everything scrollable
  // first, capture, then put scroll positions back.
  const scrollers = [];
  let node = el.parentElement;
  while (node) {
    if (node.scrollHeight > node.clientHeight) {
      scrollers.push({ node, top: node.scrollTop });
      node.scrollTop = 0;
    }
    node = node.parentElement;
  }
  const pageScrollY = window.scrollY;
  window.scrollTo(0, 0);

  const restoreScroll = () => {
    scrollers.forEach(s => { s.node.scrollTop = s.top; });
    window.scrollTo(0, pageScrollY);
  };

  html2pdf().set({
    margin: 0.4,
    filename: `CV-${name}-${track}.pdf`,
    html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, windowWidth: window.innerWidth },
    jsPDF: { unit: 'in', format: 'a4' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  }).from(el).save().then(restoreScroll).catch(restoreScroll);
}

/* ---------- Cover letter modal ---------- */

function openModal(id) { document.getElementById(id + 'Modal').style.display = 'flex'; }
function closeModal() { document.querySelectorAll('.modal').forEach(m => m.style.display = 'none'); }

function generateCoverLetter() {
  const data = collectData();
  const company = document.getElementById('companyName').value.trim() || 'your company';
  const job = document.getElementById('jobTitle').value.trim() || 'this role';
  const name = data.name || 'Your Name';
  const topSkills = skills.slice(0, 4).join(', ') || 'a strong mix of relevant skills';
  const opener = data.summary || "I bring a track record of delivering results and working well with teams.";

  const letter = `Dear Hiring Manager,

I'm writing to apply for ${job} at ${company}. ${opener}

Among the strengths I'd bring to this role: ${topSkills}.

I'd welcome the chance to talk about how I can contribute to ${company}.

Sincerely,
${name}`;

  document.getElementById('generatedCL').textContent = letter;
}

restoreOnLoad();
