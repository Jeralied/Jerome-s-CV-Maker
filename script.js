// script.js
// Owns app state and talks to TEMPLATES (templates.js) to render the live CV.

let track = null;
let photoData = null;
let skills = [];
let experiences = [{ role: '', company: '', dates: '', desc: '' }];
let educations = [{ degree: '', school: '', year: '' }];

const TRACK_LABELS = { tech: 'Tech / CS', cabin: 'Cabin Crew', corporate: 'Banking / Corporate' };
const STORAGE_KEY = 'jeromecv:draft';
const FIELD_IDS = ['fullName', 'roleTitle', 'email', 'phone', 'location', 'linkedin', 'summary', 'certs'];

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
  document.getElementById('step1').style.display = 'none';
  document.getElementById('workspace').classList.add('active');
  document.getElementById('photoField').style.display = track === 'cabin' ? 'block' : 'none';
  document.getElementById('atsBar').style.display = track === 'tech' ? 'flex' : 'none';
  renderProfileSwitcher();
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

function handleSkillEnter(e) {
  if (e.key === 'Enter' && e.target.value.trim()) {
    e.preventDefault();
    skills.push(e.target.value.trim());
    e.target.value = '';
    renderSkillChips();
    render();
  }
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
    photo: photoData
  };
}

function render() {
  if (!track) return;
  const data = collectData();
  const fn = TEMPLATES[track] || TEMPLATES.corporate;
  document.getElementById('sheetLive').innerHTML = fn(data);
  updateATS(data);

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) downloadBtn.disabled = !document.getElementById('fullName').value.trim();

  saveDraft();
}

/* ---------- Autosave (localStorage) ---------- */
/* Falls back to no-op silently if storage is unavailable (private browsing, quota, etc). */

function saveDraft() {
  try {
    const payload = { track, photoData, skills, experiences, educations, fields: {} };
    FIELD_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) payload.fields[id] = el.value;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) { /* ignore */ }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) { return null; }
}

function clearDraft() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
}

function startOver() {
  if (!confirm('Clear everything you\u2019ve entered and start a new CV?')) return;
  clearDraft();
  location.reload();
}

function restoreDraft() {
  const draft = loadDraft();
  if (!draft || !draft.track) { renderRepeaters(); return; }

  track = draft.track;
  photoData = draft.photoData || null;
  skills = draft.skills || [];
  experiences = (draft.experiences && draft.experiences.length) ? draft.experiences : experiences;
  educations = (draft.educations && draft.educations.length) ? draft.educations : educations;

  document.getElementById('step1').style.display = 'none';
  document.getElementById('workspace').classList.add('active');
  document.getElementById('photoField').style.display = track === 'cabin' ? 'block' : 'none';
  document.getElementById('atsBar').style.display = track === 'tech' ? 'flex' : 'none';

  FIELD_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el && draft.fields && draft.fields[id] !== undefined) el.value = draft.fields[id];
  });
  if (photoData) {
    document.getElementById('photoPreview').innerHTML = `<img src="${photoData}" alt="">`;
  }
  const card = document.querySelector(`.track-card[data-track="${track}"]`);
  if (card) card.classList.add('selected');
  document.getElementById('continueBtn').disabled = false;

  renderProfileSwitcher();
  renderRepeaters();
  renderSkillChips();
  render();
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
  html2pdf().set({
    margin: 0.4,
    filename: `CV-${name}-${track}.pdf`,
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  }).from(el).save();
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

restoreDraft();
