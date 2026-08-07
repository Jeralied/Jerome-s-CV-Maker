// script.js
// Owns app state and talks to TEMPLATES (templates.js) to render the live CV.

let track = null;
let photoData = null;
let skills = [];
let experiences = [{ role: '', company: '', dates: '', desc: '' }];
let educations = [{ degree: '', school: '', year: '' }];

const TRACK_LABELS = {
  tech: 'Tech / CS',
  cabin: 'Cabin Crew',
  corporate: 'Banking / Corporate'
};

const FIELD_IDS = [
  'fullName',
  'roleTitle',
  'email',
  'phone',
  'location',
  'linkedin',
  'summary',
  'certs',
  'age',
  'nationality',
  'height',
  'armReach',
  'swimming',
  'languages',
  'cabinTraining'
];

const REGISTRY_KEY = 'jeromecv:registry';

let currentCvId = null;
let currentCvName = 'Untitled CV';
let cvFontFamily = 'default';
let cvFontScale = 1;

/* ---------- Utilities ---------- */

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

/* ---------- Track selection ---------- */

function selectTrack(t, evt) {
  track = t;

  document.querySelectorAll('.track-card').forEach(card => {
    card.classList.remove('selected');
  });

  const card =
    (evt && evt.currentTarget) ||
    document.querySelector(`.track-card[data-track="${t}"]`);

  if (card) card.classList.add('selected');

  document.getElementById('continueBtn').disabled = false;
}

function goToStep2() {
  if (!track) return;

  if (!currentCvId) {
    currentCvId = makeCvId();
  }

  document.getElementById('step1').style.display = 'none';
  document.getElementById('workspace').classList.add('active');

  updateTrackUI();
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

function updateTrackUI() {
  const isCabin = track === 'cabin';
  const isTech = track === 'tech';

  document.getElementById('photoField').style.display =
    isCabin ? 'block' : 'none';

  document.getElementById('atsBar').style.display =
    isTech ? 'flex' : 'none';

  const cabinBar = document.getElementById('cabinReadinessBar');

  if (cabinBar) {
    cabinBar.style.display = isCabin ? 'flex' : 'none';
  }

  updateCabinFields();

  document.querySelectorAll('.track-card').forEach(card => {
    card.classList.toggle(
      'selected',
      card.dataset.track === track
    );
  });
}

function renderProfileSwitcher() {
  const el = document.getElementById('profileSwitcher');
  if (!el) return;

  el.innerHTML = Object.keys(TRACK_LABELS)
    .map(key => `
      <button
        class="profile-btn ${key === track ? 'active' : ''}"
        onclick="switchProfile('${key}')"
      >
        ${TRACK_LABELS[key]}
      </button>
    `)
    .join('');
}

function switchProfile(t) {
  track = t;

  updateTrackUI();
  renderProfileSwitcher();
  render();
}

/* ---------- Track-specific fields ---------- */

function updateCabinFields() {
  const show = track === 'cabin';

  document.querySelectorAll('.cabin-only').forEach(el => {
    el.style.display = show ? '' : 'none';
  });

  const summaryHeading = document.getElementById('summaryHeading');

  if (summaryHeading) {
    summaryHeading.textContent =
      show ? 'Professional profile' : 'Summary';
  }

  const expHeading = document.getElementById('experienceHeading');

  if (expHeading) {
    expHeading.textContent =
      show ? 'Customer service experience' : 'Experience';
  }
}

/* ---------- Photo ---------- */

function handlePhoto(e) {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.');
    return;
  }

  const reader = new FileReader();

  reader.onload = ev => {
    photoData = ev.target.result;

    const preview = document.getElementById('photoPreview');

    if (preview) {
      preview.innerHTML =
        `<img src="${photoData}" alt="Uploaded CV photo">`;
    }

    render();
  };

  reader.readAsDataURL(file);
}

/* ---------- Experience / Education ---------- */

function addExperience() {
  experiences.push({
    role: '',
    company: '',
    dates: '',
    desc: ''
  });

  renderRepeaters();
  render();
}

function removeExperience(i) {
  experiences.splice(i, 1);

  if (!experiences.length) {
    experiences.push({
      role: '',
      company: '',
      dates: '',
      desc: ''
    });
  }

  renderRepeaters();
  render();
}

function addEducation() {
  educations.push({
    degree: '',
    school: '',
    year: ''
  });

  renderRepeaters();
  render();
}

function removeEducation(i) {
  educations.splice(i, 1);

  if (!educations.length) {
    educations.push({
      degree: '',
      school: '',
      year: ''
    });
  }

  renderRepeaters();
  render();
}

function renderRepeaters() {
  const experienceList = document.getElementById('experienceList');
  const educationList = document.getElementById('educationList');

  if (experienceList) {
    experienceList.innerHTML = experiences.map((exp, i) => `
      <div class="repeat-block">

        ${
          experiences.length > 1
            ? `
              <button
                class="repeat-remove"
                onclick="removeExperience(${i})"
                aria-label="Remove this experience entry"
              >
                ×
              </button>
            `
            : ''
        }

        <div class="row2">

          <div class="field">
            <label for="expRole${i}">Role</label>
            <input
              id="expRole${i}"
              value="${esc(exp.role)}"
              oninput="experiences[${i}].role=this.value; render()"
              placeholder="Software Engineer"
            >
          </div>

          <div class="field">
            <label for="expCompany${i}">Company</label>
            <input
              id="expCompany${i}"
              value="${esc(exp.company)}"
              oninput="experiences[${i}].company=this.value; render()"
              placeholder="Acme Inc."
            >
          </div>

        </div>

        <div class="field">
          <label for="expDates${i}">Dates</label>
          <input
            id="expDates${i}"
            value="${esc(exp.dates)}"
            oninput="experiences[${i}].dates=this.value; render()"
            placeholder="2023 — Present"
          >
        </div>

        <div class="field">
          <label for="expDesc${i}">What you did</label>
          <textarea
            id="expDesc${i}"
            oninput="experiences[${i}].desc=this.value; render()"
            placeholder="Increased sales by 32%..."
          >${esc(exp.desc)}</textarea>
        </div>

      </div>
    `).join('');
  }

  if (educationList) {
    educationList.innerHTML = educations.map((edu, i) => `
      <div class="repeat-block">

        ${
          educations.length > 1
            ? `
              <button
                class="repeat-remove"
                onclick="removeEducation(${i})"
                aria-label="Remove this education entry"
              >
                ×
              </button>
            `
            : ''
        }

        <div class="field">
          <label for="eduDegree${i}">Qualification</label>
          <input
            id="eduDegree${i}"
            value="${esc(edu.degree)}"
            oninput="educations[${i}].degree=this.value; render()"
            placeholder="BSc Computer Science"
          >
        </div>

        <div class="row2">

          <div class="field">
            <label for="eduSchool${i}">Institution</label>
            <input
              id="eduSchool${i}"
              value="${esc(edu.school)}"
              oninput="educations[${i}].school=this.value; render()"
              placeholder="University of Ghana"
            >
          </div>

          <div class="field">
            <label for="eduYear${i}">Year</label>
            <input
              id="eduYear${i}"
              value="${esc(edu.year)}"
              oninput="educations[${i}].year=this.value; render()"
              placeholder="2027"
            >
          </div>

        </div>

      </div>
    `).join('');
  }
}

/* ---------- Skills ---------- */

function addSkillFromInput() {
  const input = document.getElementById('skillInput');

  if (!input) return;

  const value = input.value.trim();

  if (!value) return;

  const exists = skills.some(
    skill => skill.toLowerCase() === value.toLowerCase()
  );

  if (!exists) {
    skills.push(value);
  }

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
  addSkillFromInput();
}

function removeSkill(i) {
  skills.splice(i, 1);

  renderSkillChips();
  render();
}

function renderSkillChips() {
  const el = document.getElementById('skillChips');

  if (!el) return;

  el.innerHTML = skills.map((skill, i) => `
    <span class="chip">
      ${esc(skill)}
      <button
        type="button"
        onclick="removeSkill(${i})"
        aria-label="Remove skill ${esc(skill)}"
      >
        ×
      </button>
    </span>
  `).join('');
}

/* ---------- Collect data ---------- */

function collectData() {
  const experienceData = experiences
    .filter(e => e.role || e.company || e.dates || e.desc)
    .map(e => ({
      role: esc(e.role),
      company: esc(e.company),
      dates: esc(e.dates),
      desc: esc(e.desc)
    }));

  const eduStr = educations
    .filter(e => e.degree || e.school || e.year)
    .map(e => {
      const head = [esc(e.degree), esc(e.school)]
        .filter(Boolean)
        .join(' — ');

      return `${head}${e.year ? ' (' + esc(e.year) + ')' : ''}`;
    })
    .join('\n');

  return {
    name: esc(document.getElementById('fullName').value),
    title: esc(document.getElementById('roleTitle').value),
    email: esc(document.getElementById('email').value),
    phone: esc(document.getElementById('phone').value),
    location: esc(document.getElementById('location').value),
    linkedin: esc(document.getElementById('linkedin').value),
    summary: esc(document.getElementById('summary').value),

    skills: skills.map(esc).join('|'),
    experience: experienceData,
    education: eduStr,
    certs: esc(document.getElementById('certs').value),
    photo: photoData,

    // Cabin crew fields
    age: esc(document.getElementById('age').value),
    nationality: esc(document.getElementById('nationality').value),
    height: esc(document.getElementById('height').value),
    armReach: esc(document.getElementById('armReach').value),
    swimming: esc(document.getElementById('swimming').value),
    languages: esc(document.getElementById('languages').value),
    cabinTraining: esc(document.getElementById('cabinTraining').value)
  };
}

  const experienceData = experiences
    .filter(e =>
      e.role ||
      e.company ||
      e.dates ||
      e.desc
    )
    .map(e => ({
      role: esc(e.role),
      company: esc(e.company),
      dates: esc(e.dates),
      desc: esc(e.desc)
    }));

  const educationData = educations
    .filter(e =>
      e.degree ||
      e.school ||
      e.year
    )
    .map(e => ({
      degree: esc(e.degree),
      school: esc(e.school),
      year: esc(e.year)
    }));

  return {
    name: esc(getValue('fullName')),
    title: esc(getValue('roleTitle')),
    email: esc(getValue('email')),
    phone: esc(getValue('phone')),
    location: esc(getValue('location')),
    linkedin: esc(getValue('linkedin')),
    summary: esc(getValue('summary')),

    skills: skills.map(skill => esc(skill)),

    experience: experienceData,
    education: educationData,

    certs: esc(getValue('certs')),
    photo: photoData,

    age: esc(getValue('age')),
    nationality: esc(getValue('nationality')),
    height: esc(getValue('height')),
    armReach: esc(getValue('armReach')),
    swimming: esc(getValue('swimming')),
    languages: esc(getValue('languages')),
    cabinTraining: esc(getValue('cabinTraining'))
  };
}

/* ---------- Rendering ---------- */

function render() {
  if (!track) return;

  const data = collectData();
  const fn = TEMPLATES[track] || TEMPLATES.corporate;
  const sheet = document.getElementById('sheetLive');

  if (!sheet) return;

  sheet.innerHTML = fn(data);

  applyFormattingToSheet();
  updateATS(data);
  updateCabinEligibility(data);

  const downloadBtn = document.getElementById('downloadBtn');

  if (downloadBtn) {
    downloadBtn.disabled =
      !document.getElementById('fullName')?.value.trim();
  }

  saveActiveCv();
}

/* ---------- Formatting ---------- */

const FONT_STACKS = {
  arial: 'Arial, Helvetica, sans-serif',
  calibri: "Calibri, 'Segoe UI', sans-serif",
  times: "'Times New Roman', Times, serif"
};

function updateFormatting() {
  cvFontFamily =
    document.getElementById('fontFamily')?.value || 'default';

  cvFontScale =
    parseFloat(document.getElementById('fontScale')?.value) || 1;

  applyFormattingToSheet();
  saveActiveCv();
}

function applyFormattingToSheet() {
  const sheet = document.getElementById('sheetLive');

  if (!sheet) return;

  sheet.style.setProperty('--cv-scale', cvFontScale);

  sheet.style.setProperty(
    '--user-font',
    FONT_STACKS[cvFontFamily] || 'inherit'
  );

  const cvEl = sheet.querySelector('.cv');

  if (cvEl) {
    cvEl.classList.toggle(
      'font-override',
      cvFontFamily !== 'default'
    );
  }
}

/* ---------- Saved CV registry ---------- */

function loadRegistry() {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (parsed && parsed.cvs) {
      return parsed;
    }

    return {
      activeId: null,
      cvs: {}
    };
  } catch (err) {
    return {
      activeId: null,
      cvs: {}
    };
  }
}

function saveRegistry(reg) {
  try {
    localStorage.setItem(
      REGISTRY_KEY,
      JSON.stringify(reg)
    );
  } catch (err) {
    console.warn('Could not save CV:', err);
  }
}

function snapshotCurrentCv() {
  const fields = {};

  FIELD_IDS.forEach(id => {
    const el = document.getElementById(id);

    if (el) {
      fields[id] = el.value;
    }
  });

  return {
    id: currentCvId,
    name: currentCvName,
    savedAt: Date.now(),

    track,
    photoData,
    skills: [...skills],
    experiences: JSON.parse(JSON.stringify(experiences)),
    educations: JSON.parse(JSON.stringify(educations)),

    fields,

    fontFamily: cvFontFamily,
    fontScale: cvFontScale
  };
}

function applyCvSnapshot(cv) {
  track = cv.track || null;
  photoData = cv.photoData || null;

  skills = Array.isArray(cv.skills)
    ? cv.skills
    : [];

  experiences =
    Array.isArray(cv.experiences) && cv.experiences.length
      ? cv.experiences
      : [{
          role: '',
          company: '',
          dates: '',
          desc: ''
        }];

  educations =
    Array.isArray(cv.educations) && cv.educations.length
      ? cv.educations
      : [{
          degree: '',
          school: '',
          year: ''
        }];

  currentCvId = cv.id;
  currentCvName = cv.name || 'Untitled CV';

  cvFontFamily = cv.fontFamily || 'default';
  cvFontScale = Number(cv.fontScale) || 1;

  document.getElementById('step1').style.display = 'none';
  document.getElementById('workspace').classList.add('active');

  FIELD_IDS.forEach(id => {
    const el = document.getElementById(id);

    if (el) {
      el.value =
        cv.fields && cv.fields[id] !== undefined
          ? cv.fields[id]
          : '';
    }
  });

  const photoPreview =
    document.getElementById('photoPreview');

  if (photoPreview) {
    photoPreview.innerHTML = photoData
      ? `<img src="${photoData}" alt="Uploaded CV photo">`
      : 'No photo';
  }

  const fontFamily =
    document.getElementById('fontFamily');

  const fontScale =
    document.getElementById('fontScale');

  if (fontFamily) {
    fontFamily.value = cvFontFamily;
  }

  if (fontScale) {
    fontScale.value = String(cvFontScale);
  }

  document.querySelectorAll('.track-card')
    .forEach(card => {
      card.classList.toggle(
        'selected',
        card.dataset.track === track
      );
    });

  document.getElementById('continueBtn').disabled =
    !track;

  updateTrackUI();
  renderProfileSwitcher();
  renderCvSwitcher();
  renderRepeaters();
  renderSkillChips();
  render();
}

function saveActiveCv() {
  if (!currentCvId || !track) return;

  const reg = loadRegistry();

  reg.cvs[currentCvId] =
    snapshotCurrentCv();

  reg.activeId = currentCvId;

  saveRegistry(reg);

  renderCvSwitcher();
}

function makeCvId() {
  return (
    'cv_' +
    Date.now() +
    '_' +
    Math.random().toString(36).slice(2, 7)
  );
}

function startNewCv() {
  currentCvId = makeCvId();
  currentCvName = 'Untitled CV';

  track = null;
  photoData = null;
  skills = [];

  experiences = [{
    role: '',
    company: '',
    dates: '',
    desc: ''
  }];

  educations = [{
    degree: '',
    school: '',
    year: ''
  }];

  cvFontFamily = 'default';
  cvFontScale = 1;

  FIELD_IDS.forEach(id => {
    const el = document.getElementById(id);

    if (el) {
      el.value = '';
    }
  });

  const photoPreview =
    document.getElementById('photoPreview');

  if (photoPreview) {
    photoPreview.innerHTML = 'No photo';
  }

  document.getElementById('fontFamily').value =
    'default';

  document.getElementById('fontScale').value =
    '1';

  document.querySelectorAll('.track-card')
    .forEach(card => {
      card.classList.remove('selected');
    });

  document.getElementById('continueBtn').disabled =
    true;

  document.getElementById('profileSwitcher').innerHTML =
    '';

  document.getElementById('sheetLive').innerHTML =
    '';

  updateCabinFields();

  document.getElementById('step1').style.display =
    'block';

  document.getElementById('workspace')
    .classList.remove('active');

  renderRepeaters();
  renderSkillChips();
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

  const next = prompt(
    'Name this CV:',
    currentCvName
  );

  if (next === null) return;

  currentCvName =
    next.trim() || 'Untitled CV';

  saveActiveCv();
}

function deleteCv(id, evt) {
  if (evt) {
    evt.stopPropagation();
  }

  const reg = loadRegistry();
  const cv = reg.cvs[id];

  if (!cv) return;

  if (
    !confirm(
      `Delete "${cv.name}"? This can't be undone.`
    )
  ) {
    return;
  }

  delete reg.cvs[id];

  const remainingIds =
    Object.keys(reg.cvs);

  if (id === currentCvId) {
    if (remainingIds.length) {
      const nextId =
        remainingIds.sort(
          (a, b) =>
            reg.cvs[b].savedAt -
            reg.cvs[a].savedAt
        )[0];

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
  const el =
    document.getElementById('cvSwitcher');

  if (!el) return;

  const reg = loadRegistry();

  const ids =
    Object.keys(reg.cvs).sort(
      (a, b) =>
        reg.cvs[b].savedAt -
        reg.cvs[a].savedAt
    );

  const list = ids.map(id => {
    const cv = reg.cvs[id];

    const active =
      id === currentCvId;

    const label =
      TRACK_LABELS[cv.track] ||
      'No track yet';

    return `
      <button
        class="cv-switcher-item ${active ? 'active' : ''}"
        onclick="openSavedCv('${id}')"
      >
        <span class="cv-switcher-name">
          ${esc(cv.name)}
        </span>

        <span class="cv-switcher-track">
          ${label}
        </span>

        <span
          class="cv-switcher-delete"
          onclick="deleteCv('${id}', event)"
          aria-label="Delete ${esc(cv.name)}"
          role="button"
        >
          ×
        </span>
      </button>
    `;
  }).join('');

  el.innerHTML = `
    <button
      class="cv-switcher-toggle"
      onclick="toggleCvMenu()"
    >
      <span>${esc(currentCvName)}</span> ▾
    </button>

    <div
      class="cv-switcher-menu"
      id="cvSwitcherMenu"
    >
      ${
        list ||
        '<div class="cv-switcher-empty">No saved CVs yet</div>'
      }

      <button
        class="cv-switcher-new"
        onclick="startNewCv()"
      >
        + New CV
      </button>

      <button
        class="cv-switcher-rename"
        onclick="renameCurrentCv()"
      >
        Rename current
      </button>
    </div>
  `;
}

function toggleCvMenu() {
  const menu =
    document.getElementById('cvSwitcherMenu');

  if (menu) {
    menu.classList.toggle('open');
  }
}

document.addEventListener('click', e => {
  const switcher =
    document.getElementById('cvSwitcher');

  const menu =
    document.getElementById('cvSwitcherMenu');

  if (
    switcher &&
    menu &&
    !switcher.contains(e.target)
  ) {
    menu.classList.remove('open');
  }
});

/* ---------- Restore ---------- */

function restoreOnLoad() {
  const reg = loadRegistry();

  const ids =
    Object.keys(reg.cvs);

  if (
    reg.activeId &&
    reg.cvs[reg.activeId]
  ) {
    applyCvSnapshot(
      reg.cvs[reg.activeId]
    );

    return;
  }

  if (ids.length) {
    const latest =
      ids.sort(
        (a, b) =>
          reg.cvs[b].savedAt -
          reg.cvs[a].savedAt
      )[0];

    applyCvSnapshot(
      reg.cvs[latest]
    );

    return;
  }

  currentCvId = makeCvId();

  renderRepeaters();
  renderSkillChips();
  renderCvSwitcher();
  updateCabinFields();
}

/* ---------- Tech ATS readiness ---------- */

function updateATS(data) {
  const bar =
    document.getElementById('atsBar');

  if (
    !bar ||
    bar.style.display === 'none'
  ) {
    return;
  }

  let score = 0;

  if (data.name) score += 15;

  if (
    data.email &&
    data.phone
  ) {
    score += 15;
  }

  if (
    data.summary &&
    data.summary.length >= 40
  ) {
    score += 20;
  }

  if (
    Array.isArray(data.skills) &&
    data.skills.length >= 4
  ) {
    score += 25;
  }

  if (
    data.experience.some(
      exp =>
        exp.role &&
        exp.company &&
        exp.desc.length > 20
    )
  ) {
    score += 25;
  }

  score = Math.min(100, score);

  let note;

  if (score >= 80) {
    note = 'looking strong';
  } else if (score >= 50) {
    note = 'add a bit more detail';
  } else {
    note = 'keep filling in the sections above';
  }

  document.getElementById(
    'atsScore'
  ).textContent = `${score}%`;

  document.getElementById(
    'atsNote'
  ).textContent = note;
}

/* ---------- PDF ---------- */

function downloadPDF() {
  if (!track) return;

  const rawName =
    document.getElementById(
      'fullName'
    ).value.trim();

  if (!rawName) {
    document.getElementById(
      'fullName'
    ).focus();

    return;
  }

  const el =
    document.getElementById(
      'sheetLive'
    );

  if (!el) return;

  const name =
    rawName.replace(
      /\s+/g,
      '-'
    );

  const scrollers = [];

  let node = el.parentElement;

  while (node) {
    if (
      node.scrollHeight >
      node.clientHeight
    ) {
      scrollers.push({
        node,
        top: node.scrollTop
      });

      node.scrollTop = 0;
    }

    node = node.parentElement;
  }

  const pageScrollY =
    window.scrollY;

  window.scrollTo(0, 0);

  const restoreScroll = () => {
    scrollers.forEach(s => {
      s.node.scrollTop = s.top;
    });

    window.scrollTo(
      0,
      pageScrollY
    );
  };

  html2pdf()
    .set({
      filename:
        `CV-${name}-${track}.pdf`,

      margin: 0,

      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth:
          document.documentElement
            .scrollWidth
      },

      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
      },

      pagebreak: {
        mode: [
          'css',
          'legacy'
        ],
        avoid: [
          '.experience-item',
          '.section'
        ]
      }
    })
    .from(el)
    .save()
    .then(restoreScroll)
    .catch(restoreScroll);
}

/* ---------- Cover letter ---------- */

function openModal(id) {
  const modal =
    document.getElementById(
      id + 'Modal'
    );

  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeModal() {
  document
    .querySelectorAll('.modal')
    .forEach(modal => {
      modal.style.display = 'none';
    });
}

function generateCoverLetter() {
  const data =
    collectData();

  const company =
    document
      .getElementById('companyName')
      .value.trim() ||
    'your company';

  const job =
    document
      .getElementById('jobTitle')
      .value.trim() ||
    'this role';

  const name =
    data.name ||
    'Your Name';

  const topSkills =
    skills
      .slice(0, 4)
      .join(', ') ||
    'a strong mix of relevant skills';

  const opener =
    data.summary ||
    'I bring a strong work ethic, relevant experience and a commitment to delivering excellent results.';

  const letter = `Dear Hiring Manager,

I'm writing to apply for ${job} at ${company}. ${opener}

Among the strengths I'd bring to this role are ${topSkills}.

I'd welcome the opportunity to discuss how I can contribute to ${company}.

Sincerely,
${name}`;

  document.getElementById(
    'generatedCL'
  ).textContent = letter;
}

/* ---------- Start application ---------- */

restoreOnLoad();
