let selectedType = ''; 
let formData = {};
const screens = document.querySelectorAll('.screen');
const cvForm = document.getElementById('cvForm');
const cvPreview = document.getElementById('cvPreview');
const photoUpload = document.getElementById('photoUpload');
const photoPreview = document.getElementById('photoPreview');

// HIGH STANDARD TEMPLATES
const TEMPLATES = {
  tech: (d) => `
    <div class="cv cv-tech">
      <div class="header-tech">
        <h1>${d.name || "YOUR NAME"}</h1>
        <h2>${d.title || "SOFTWARE ENGINEER"}</h2>
        <div class="contact-bar">
          ${[d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(' • ')}
        </div>
      </div>

      ${d.summary? `<div class="section"><h3>PROFESSIONAL SUMMARY</h3><p>${d.summary}</p></div>` : ''}

      ${d.skills? `<div class="section"><h3>TECHNICAL SKILLS</h3>
        <div class="skills-grid">${d.skills.split('|').map(s=>`<span>${s.trim()}</span>`).join('')}</div>
      </div>` : ''}

      ${d.experience? `<div class="section"><h3>PROFESSIONAL EXPERIENCE</h3>
        <div class="exp-block" style="white-space: pre-line;">${d.experience}</div>
      </div>` : ''}

      ${d.education? `<div class="section"><h3>EDUCATION</h3>
        <div style="white-space: pre-line;">${d.education}</div>
      </div>` : ''}

      ${d.certs? `<div class="section"><h3>CERTIFICATIONS</h3><p>${d.certs}</p></div>` : ''}
    </div>
  `,

  cabin: (d) => `
    <div class="cv cv-cabin">
      <div class="header-cabin">
        <img src="${d.photo || 'https://via.placeholder.com/120'}" class="photo-border">
        <div class="header-info">
          <h1>${d.name || "YOUR NAME"}</h1>
          <h2>${d.title || "CABIN CREW / FLIGHT ATTENDANT"}</h2>
          <p>${[d.email, d.phone, d.location].filter(Boolean).join(' | ')}</p>
        </div>
      </div>

      ${d.summary? `<div class="section"><h3>PROFESSIONAL PROFILE</h3><p>${d.summary}</p></div>` : ''}

      <div class="two-col">
        <div>
          ${d.skills? `<div class="section"><h3>CORE COMPETENCIES</h3><p>${d.skills}</p></div>` : ''}
          <div class="section"><h3>LANGUAGES</h3>
            <p>English - Fluent<br>French - Conversational</p>
          </div>
        </div>
        <div>
          ${d.education? `<div class="section"><h3>EDUCATION</h3><div style="white-space: pre-line;">${d.education}</div></div>` : ''}
          ${d.certs? `<div class="section"><h3>TRAINING & CERTS</h3><p>${d.certs}</p></div>` : ''}
        </div>
      </div>

      ${d.experience? `<div class="section"><h3>WORK EXPERIENCE</h3>
        <div style="white-space: pre-line;">${d.experience}</div>
      </div>` : ''}
    </div>
  `,

  corporate: (d) => `
    <div class="cv cv-corporate">
      <div class="header-corporate">
        <h1>${d.name || "YOUR NAME"}</h1>
        <h2>${d.title || "BUSINESS PROFESSIONAL"}</h2>
        <div class="contact-line">
          ${[d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(' | ')}
        </div>
      </div>

      ${d.summary? `<div class="section"><h3>EXECUTIVE SUMMARY</h3><p>${d.summary}</p></div>` : ''}

      ${d.experience? `<div class="section"><h3>PROFESSIONAL EXPERIENCE</h3>
        <div style="white-space: pre-line;">${d.experience}</div>
      </div>` : ''}

      <div class="two-col">
        ${d.education? `<div class="section"><h3>EDUCATION</h3><div style="white-space: pre-line;">${d.education}</div></div>` : ''}
        ${d.skills? `<div class="section"><h3>KEY SKILLS</h3><p>${d.skills}</p></div>` : ''}
      </div>

      ${d.certs? `<div class="section"><h3>CERTIFICATIONS & AWARDS</h3><p>${d.certs}</p></div>` : ''}
    </div>
  `
};

document.querySelectorAll('.template-card').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedType = btn.dataset.type;
    photoUpload.classList.toggle('hidden', selectedType!== 'cabin');
    showScreen(1);
    updatePreview(); // load blank preview
  });
});

document.getElementById('backBtn').onclick = () => showScreen(0);
document.getElementById('editBtn').onclick = () => showScreen(1);

// LIVE PREVIEW ON EVERY KEYSTROKE
cvForm.addEventListener('input', updatePreview);

function updatePreview() {
  formData = {
    name: fullName.value, title: jobTitle.value, email: email.value, phone: phone.value,
    location: location.value, linkedin: linkedin.value, summary: summary.value,
    skills: skills.value, experience: experience.value, education: education.value,
    certs: certs.value, photo: photoPreview.src
  };
  if(selectedType) {
    cvPreview.innerHTML = TEMPLATES[selectedType](formData);
  }
}

cvForm.addEventListener('submit', (e) => {
  e.preventDefault();
  updatePreview();
  showScreen(2);
});

document.getElementById('photo').onchange = (e) => {
  const reader = new FileReader();
  reader.onload = () => { 
    photoPreview.src = reader.result; 
    photoPreview.classList.remove('hidden'); 
    updatePreview();
  }
  reader.readAsDataURL(e.target.files[0]);
}

document.getElementById('downloadPDF').onclick = () => {
  html2pdf().set({
    margin: 0.3, 
    filename: `CV-${formData.name || 'Jerome'}.pdf`,
    html2canvas: { scale: 2, useCORS: true }, 
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).from(cvPreview).save();
}

function showScreen(n) { 
  screens.forEach((s,i) => s.classList.toggle('active', i===n)); 
}
