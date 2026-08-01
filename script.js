<script>
let track = null; let photoData = null; let skills = [];
let experiences = [{title:'', org:'', date:'', desc:''}];
let educations = [{title:'', org:'', date:''}];
const tint = {tech:'#000000', cabin:'#B8860B', bank:'#1a1a1a'}; // all professional now
const accent = {tech:'#000', cabin:'#B8860B', bank:'#1a1a1a'};
const trackLabel = {tech:'Tech / CS', cabin:'Cabin Crew', bank:'Banking / Corporate'};

function selectTrack(t){ track = t; document.querySelectorAll('.track-card').forEach(c=>c.classList.remove('selected')); document.querySelector(`.track-card[data-track="${t}"]`).classList.add('selected'); document.getElementById('continueBtn').disabled = false; document.getElementById('photoField').style.display = (t === 'cabin')? 'block' : 'none'; }
function goToStep2(){ document.getElementById('step1').style.display = 'none'; document.getElementById('workspace').classList.add('active'); document.getElementById('stepIndicator').innerHTML = `<b>02</b> Tell us about you · ${trackLabel[track]}`; document.getElementById('trackCaption').textContent = trackLabel[track]; renderRepeaters(); render(); }
function goToStep1(){ document.getElementById('step1').style.display = 'block'; document.getElementById('workspace').classList.remove('active'); document.getElementById('review').classList.remove('active'); }
function goToStep3(){ document.getElementById('workspace').classList.remove('active'); document.getElementById('review').classList.add('active'); render(); }
function handlePhoto(e){ const file = e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = function(ev){ photoData = ev.target.result; document.getElementById('photoPreview').innerHTML = `<img src="${photoData}" alt="">`; render(); }; reader.readAsDataURL(file); }
function addExperience(){ experiences.push({title:'', org:'', date:'', desc:''}); renderRepeaters(); }
function removeExperience(i){ experiences.splice(i,1); renderRepeaters(); render(); }
function addEducation(){ educations.push({title:'', org:'', date:''}); renderRepeaters(); }
function removeEducation(i){ educations.splice(i,1); renderRepeaters(); render(); }
function renderRepeaters(){
  document.getElementById('experienceList').innerHTML = experiences.map((exp, i) => `<div class="repeat-block">${experiences.length > 1? `<button class="repeat-remove" onclick="removeExperience(${i})">×</button>` : ''}<div class="row2"><div class="field"><label>Role</label><input value="${exp.title}" oninput="experiences[${i}].title=this.value; render()"></div><div class="field"><label>Company</label><input value="${exp.org}" oninput="experiences[${i}].org=this.value; render()"></div></div><div class="field"><label>Dates</label><input value="${exp.date}" oninput="experiences[${i}].date=this.value; render()"></div><div class="field"><label>Achievements - Start with bullet •</label><textarea oninput="experiences[${i}].desc=this.value; render()" placeholder="• Increased sales by 32%...">${exp.desc}</textarea></div></div>`).join('');
  document.getElementById('educationList').innerHTML = educations.map((edu, i) => `<div class="repeat-block">${educations.length > 1? `<button class="repeat-remove" onclick="removeEducation(${i})">×</button>` : ''}<div class="field"><label>Degree</label><input value="${edu.title}" oninput="educations[${i}].title=this.value; render()"></div><div class="row2"><div class="field"><label>Institution</label><input value="${edu.org}" oninput="educations[${i}].org=this.value; render()"></div><div class="field"><label>Year</label><input value="${edu.date}" oninput="educations[${i}].date=this.value; render()"></div></div></div>`).join('');
}
function handleSkillEnter(e){ if(e.key === 'Enter' && e.target.value.trim()){ skills.push(e.target.value.trim()); e.target.value = ''; renderSkillChips(); render(); } }
function removeSkill(i){ skills.splice(i,1); renderSkillChips(); render(); }
function renderSkillChips(){ document.getElementById('skillChips').innerHTML = skills.map((s,i) => `<span class="chip">${s}<button onclick="removeSkill(${i})">×</button></span>`).join(''); }

function buildSheetHTML(){
  const name = document.getElementById('fullName').value || 'YOUR NAME';
  const role = document.getElementById('roleTitle').value || 'TARGET ROLE';
  const email = document.getElementById('email').value; const phone = document.getElementById('phone').value;
  const location = document.getElementById('location').value; const linkedin = document.getElementById('linkedin').value;
  const summary = document.getElementById('summary').value;
  const contactBits = [email][phone][location][linkedin].filter(Boolean).join(' | ');
  const skillsHTML = skills.length? `<div style="columns:3; font-size:10.5px;">${skills.map(s=>`• ${s}<br>`).join('')}</div>` : ``;
  const expHTML = experiences.filter(e=>e.title||e.org).map(e => `<div style="margin-bottom:10px;"><div style="display:flex; justify-content:space-between;"><b>${e.title||'Role'}</b><span style="font-size:10px;">${e.date}</span></div><div style="font-size:11px; font-style:italic;">${e.org||''}</div><div style="font-size:10.5px; white-space:pre-line; line-height:1.4;">${e.desc}</div></div>`).join('');
  const eduHTML = educations.filter(e=>e.title||e.org).map(e => `<div style="margin-bottom:8px;"><div style="display:flex; justify-content:space-between;"><b>${e.title}</b><span style="font-size:10px;">${e.date}</span></div><div style="font-size:11px;">${e.org}</div></div>`).join('');

  let headerRow = ''; let bodyOrder = ''; let layoutClass = ''; let font = 'Arial, sans-serif';

  if(track === 'tech'){ // ATS TEMPLATE
    layoutClass = 'layout-tech';
    font = "'IBM Plex Mono', monospace";
    headerRow = `<div style="text-align:center; border-bottom:2px solid #000; padding-bottom:8px;"><h1 class="cv-name" style="font-size:20px; margin:0;">${name.toUpperCase()}</h1><div class="cv-role" style="font-size:11px;">${role.toUpperCase()}</div><div class="cv-contact" style="font-size:10px; justify-content:center;">${contactBits}</div></div>`;
    bodyOrder = summary? `<div class="cv-section-title">SUMMARY</div><p style="font-size:10.5px; line-height:1.4;">${summary}</p>` : '' + `<div class="cv-section-title">TECHNICAL SKILLS</div>` + skillsHTML + `<div class="cv-section-title">PROFESSIONAL EXPERIENCE</div>` + expHTML + `<div class="cv-section-title">EDUCATION</div>` + eduHTML;

  } else if(track === 'cabin'){ // AIRLINE TEMPLATE
    layoutClass = 'layout-cabin';
    font = "'Fraunces', serif";
    const photoHTML = photoData? `<img src="${photoData}" alt="">` : '';
    headerRow = `<div class="cv-header-row"><div class="cv-photo">${photoHTML}</div><div><h1 class="cv-name" style="font-size:24px;">${name}</h1><div class="cv-role">${role}</div><div class="cv-contact">${contactBits}</div></div></div>`;
    bodyOrder = `<div class="cv-section-title">PROFESSIONAL PROFILE</div><p style="font-size:11px; line-height:1.5;">${summary}</p>` + `<div class="cv-section-title">LANGUAGES</div><p style="font-size:11px;">English - Fluent • French - Conversational • Twi - Native</p>` + `<div class="cv-section-title">WORK EXPERIENCE</div>` + expHTML + `<div class="cv-section-title">EDUCATION & TRAINING</div>` + eduHTML + `<div class="cv-section-title">CORE COMPETENCIES</div>` + skillsHTML;

  } else { // BANKING TEMPLATE
    layoutClass = 'layout-bank';
    font = "'Times New Roman', serif";
    headerRow = `<div style="text-align:center;"><h1 class="cv-name">${name}</h1><div class="cv-role">${role}</div><div class="cv-contact">${contactBits}</div></div>`;
    bodyOrder = `<div class="cv-section-title">EDUCATION</div>` + eduHTML + `<div class="cv-section-title">PROFESSIONAL EXPERIENCE</div>` + expHTML + `<div class="cv-section-title">PROFESSIONAL SUMMARY</div><p style="font-size:11px;">${summary}</p>` + `<div class="cv-section-title">KEY SKILLS</div>` + `<p style="font-size:11px;">${skills.join(' • ')}</p>`;
  }
  return {html: `<div style="font-family:${font};">` + headerRow + bodyOrder + `</div>`, layoutClass};
}

function render(){
  if(!track) return;
  const {html, layoutClass} = buildSheetHTML();
  const acc = accent[track]; const tin = tint[track];
  ['sheetLive','sheetFinal'].forEach(id=>{
    const el = document.getElementById(id); if(!el) return;
    el.className = 'sheet ' + layoutClass;
    el.style.setProperty('--accent', acc); el.style.setProperty('--accent-tint', tin);
    el.innerHTML = html;
  });
}

function downloadPDF(){
  const element = document.getElementById('sheetFinal');
  html2pdf().set({ margin: [0.5, 0.5, 0.5, 0.5], filename: `CV-${document.getElementById('fullName').value || 'Jerome'}.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'a4' } }).from(element).save();
}
renderRepeaters();
</script>
