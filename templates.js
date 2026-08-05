const TEMPLATES = {

  tech: (d) => { /* unchanged */ return `
    <div class="cv cv-tech">
      <div class="header-tech">
        <h1>${d.name || 'YOUR NAME'}</h1>
        <h2>${d.title || 'SOFTWARE ENGINEER'}</h2>
        ${[d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(' • ') ? `<div class="contact-bar">${[d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(' • ')}</div>` : ''}
      </div>
      ${d.summary ? `<div class="section"><h3>Summary</h3><p>${d.summary}</p></div>` : ''}
      ${(d.skills || '') ? `<div class="section"><h3>Technical skills</h3><div class="skills-grid">${(d.skills || '').split('|').map(s => s.trim()).filter(Boolean).map(s => `<span>${s}</span>`).join('')}</div></div>` : ''}
      ${d.experience ? `<div class="section"><h3>Experience</h3><div class="exp-block">${d.experience}</div></div>` : ''}
      ${d.education ? `<div class="section"><h3>Education</h3><div class="exp-block">${d.education}</div></div>` : ''}
      ${d.certs ? `<div class="section"><h3>Certifications</h3><p>${d.certs}</p></div>` : ''}
    </div>`; 
  },

  cabin: (d) => {
    const contact = [d.email, d.phone, d.location].filter(Boolean).join('  ·  ');
    const photoHTML = d.photo
      ? `<img src="${d.photo}" class="photo-border" alt="">`
      : `<div class="photo-border photo-placeholder">Photo</div>`;
    
    // NEW: Emirates required stats line
    const stats = [d.age, d.height, d.armreach, d.swim].filter(Boolean).join(' | ');

    return `
    <div class="cv cv-cabin">
      <div class="header-cabin">
        ${photoHTML}
        <div class="header-info">
          <h1>${d.name || 'Your Name'}</h1>
          <h2>${d.title || 'Cabin Crew'}</h2>
          ${stats ? `<p><strong>${stats}</strong></p>` : ''}
          ${contact ? `<p>${contact}</p>` : ''}
        </div>
      </div>
      ${d.summary ? `<div class="section"><h3>Profile</h3><p>${d.summary}</p></div>` : ''}
      <div class="two-col">
        <div>
          ${d.skills ? `<div class="section"><h3>Core competencies</h3><p>${d.skills.split('|').map(s => s.trim()).filter(Boolean).join(' · ')}</p></div>` : ''}
          ${d.languages ? `<div class="section"><h3>Languages</h3><p>${d.languages}</p></div>` : ''}
        </div>
        <div>
          ${d.education ? `<div class="section"><h3>Education</h3><div class="exp-block">${d.education}</div></div>` : ''}
          ${d.certs ? `<div class="section"><h3>Training & certs</h3><p>${d.certs}</p></div>` : ''}
        </div>
      </div>
      ${d.experience ? `<div class="section"><h3>Work experience</h3><div class="exp-block">${d.experience}</div></div>` : ''}
    </div>`;
  },

  corporate: (d) => { /* unchanged */ return `
    <div class="cv cv-corporate">
      <div class="header-corporate">
        <h1>${d.name || 'Your Name'}</h1>
        <h2>${d.title || 'Business Professional'}</h2>
        ${[d.email, d.phone, d.location, d.linkedin].filter(Boolean).join('  ·  ') ? `<div class="contact-line">${[d.email, d.phone, d.location, d.linkedin].filter(Boolean).join('  ·  ')}</div>` : ''}
      </div>
      ${d.summary ? `<div class="section"><h3>Executive summary</h3><p>${d.summary}</p></div>` : ''}
      ${d.experience ? `<div class="section"><h3>Professional experience</h3><div class="exp-block">${d.experience}</div></div>` : ''}
      <div class="two-col">
        ${d.education ? `<div class="section"><h3>Education</h3><div class="exp-block">${d.education}</div></div>` : ''}
        ${d.skills ? `<div class="section"><h3>Key skills</h3><p>${d.skills.split('|').map(s => s.trim()).filter(Boolean).join(' · ')}</p></div>` : ''}
      </div>
      ${d.certs ? `<div class="section"><h3>Certifications & awards</h3><p>${d.certs}</p></div>` : ''}
    </div>`;
  }
};
