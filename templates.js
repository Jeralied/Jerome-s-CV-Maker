const TEMPLATES = {
  tech: (d) => {
    const contact = [d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(' • ');
    return `
    <div class="cv cv-tech">
      <div class="header-tech">
        <h1>${d.name || "YOUR NAME"}</h1>
        <h2>${d.title || "SOFTWARE ENGINEER"}</h2>
        ${contact ? `<div class="contact-bar">${contact}</div>` : ''}
      </div>

      ${d.summary? `<div class="section"><h3>PROFESSIONAL SUMMARY</h3><p>${d.summary}</p></div>` : ''}

      ${d.skills? `<div class="section"><h3>TECHNICAL SKILLS</h3>
        <div class="skills-grid">${d.skills.split('|').filter(s=>s.trim()).map(s=>`<span>${s.trim()}</span>`).join('')}</div>
      </div>` : ''}

      ${d.experience? `<div class="section"><h3>PROFESSIONAL EXPERIENCE</h3>
        <div class="exp-block" style="white-space: pre-line;">${d.experience}</div>
      </div>` : ''}

      ${d.education? `<div class="section"><h3>EDUCATION</h3>
        <div style="white-space: pre-line;">${d.education}</div>
      </div>` : ''}

      ${d.certs? `<div class="section"><h3>CERTIFICATIONS</h3><p>${d.certs}</p></div>` : ''}
    </div>
  `},

  cabin: (d) => {
    const contact = [d.email, d.phone, d.location].filter(Boolean).join(' | ');
    return `
    <div class="cv cv-cabin">
      <div class="header-cabin">
        <img src="${d.photo || 'https://via.placeholder.com/120'}" class="photo-border">
        <div class="header-info">
          <h1>${d.name || "YOUR NAME"}</h1>
          <h2>${d.title || "CABIN CREW / FLIGHT ATTENDANT"}</h2>
          ${contact ? `<p>${contact}</p>` : ''}
        </div>
      </div>

      ${d.summary? `<div class="section"><h3>PROFESSIONAL PROFILE</h3><p>${d.summary}</p></div>` : ''}

      <div class="two-col">
        <div>
          ${d.skills? `<div class="section"><h3>CORE COMPETENCIES</h3><p>${d.skills}</p></div>` : ''}
          <div class="section"><h3>LANGUAGES</h3>
            <p>English - Fluent<br>French - Conversational<br>Twi - Native</p>
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
  `},

  corporate: (d) => {
    const contact = [d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(' | ');
    return `
    <div class="cv cv-corporate">
      <div class="header-corporate">
        <h1>${d.name || "YOUR NAME"}</h1>
        <h2>${d.title || "BUSINESS PROFESSIONAL"}</h2>
        ${contact ? `<div class="contact-line">${contact}</div>` : ''}
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
  }
};
