// templates.js
// Each template takes a flat data object `d` (already HTML-escaped by script.js)
// and returns the markup for the CV body. The wrapping .sheet element in the
// page provides the paper background/padding — these templates only render
// what goes inside it, and every class they use is styled in style.css.

const TEMPLATES = {

  tech: (d) => {
    const contact = [d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(' • ');
    const skillChips = (d.skills || '')
      .split('|').map(s => s.trim()).filter(Boolean)
      .map(s => `<span>${s}</span>`).join('');

    return `
    <div class="cv cv-tech">
      <div class="header-tech">
        <h1>${d.name || 'YOUR NAME'}</h1>
        <h2>${d.title || 'SOFTWARE ENGINEER'}</h2>
        ${contact ? `<div class="contact-bar">${contact}</div>` : ''}
      </div>
      ${d.summary ? `<div class="section"><h3>Summary</h3><p>${d.summary}</p></div>` : ''}
      ${skillChips ? `<div class="section"><h3>Technical skills</h3><div class="skills-grid">${skillChips}</div></div>` : ''}
      ${d.experience ? `<div class="section"><h3>Experience</h3><div class="exp-block">${d.experience}</div></div>` : ''}
      ${d.education ? `<div class="section"><h3>Education</h3><div class="exp-block">${d.education}</div></div>` : ''}
      ${d.certs ? `<div class="section"><h3>Certifications</h3><p>${d.certs}</p></div>` : ''}
    </div>`;
  },

  // Emirates-style cabin crew CV: black/white split header with a portrait
  // photo panel, a "personal details" strip (age, height, arm reach, etc.),
  // then customer-service-forward sections.
  cabin: (d) => {
    const photoHTML = d.photo
      ? `<img src="${d.photo}" class="passport-photo" alt="">`
      : `<div class="passport-photo photo-placeholder">Photo</div>`;

    const contact = [d.email, d.phone, d.location].filter(Boolean).join(' • ');

    const personal = [
  d.nationality ? `Nationality: ${d.nationality}` : '',
  d.height ? `Height: ${d.height} cm` : '',
  d.armReach ? `Reach: ${d.armReach} cm` : ''
].filter(Boolean).join(' • ');

    const skillsList = (d.skills || '')
      .split('|').map(s => s.trim()).filter(Boolean)
      .map(s => `<li>${s}</li>`).join('');

    return `
    <div class="cv cv-cabin-emirates">
      <div class="header-cabin-emirates">
        <div class="header-left">
          <h1>${d.name || 'YOUR NAME'}</h1>
          <h2>${d.title || 'CABIN CREW'}</h2>
          ${contact ? `<div class="contact-line">${contact}</div>` : ''}
        </div>
        <div class="header-right">${photoHTML}</div>
      </div>
      ${personal ? `<div class="personal-line">${personal}</div>` : ''}
      ${d.languages ? `<div class="personal-line">Languages: ${d.languages}</div>` : ''}
      ${d.summary ? `<div class="section"><h3>Professional profile</h3><p>${d.summary}</p></div>` : ''}
      ${skillsList ? `<div class="section"><h3>Core competencies</h3><ul class="plain-skills">${skillsList}</ul></div>` : ''}
      ${d.experience ? `<div class="section"><h3>Customer service experience</h3><div class="exp-block">${d.experience}</div></div>` : ''}
      ${d.education ? `<div class="section"><h3>Education</h3><div class="exp-block">${d.education}</div></div>` : ''}
      ${d.cabinTraining ? `<div class="section"><h3>Training &amp; qualifications</h3><p>${d.cabinTraining}</p></div>` : ''}
      ${d.certs ? `<div class="section"><h3>Certifications</h3><p>${d.certs}</p></div>` : ''}
    </div>`;
  },

  corporate: (d) => {
    const contact = [d.email, d.phone, d.location, d.linkedin].filter(Boolean).join('  ·  ');

    return `
    <div class="cv cv-corporate">
      <div class="header-corporate">
        <h1>${d.name || 'Your Name'}</h1>
        <h2>${d.title || 'Business Professional'}</h2>
        ${contact ? `<div class="contact-line">${contact}</div>` : ''}
      </div>
      ${d.summary ? `<div class="section"><h3>Executive summary</h3><p>${d.summary}</p></div>` : ''}
      ${d.experience ? `<div class="section"><h3>Professional experience</h3><div class="exp-block">${d.experience}</div></div>` : ''}
      <div class="two-col">
        ${d.education ? `<div class="section"><h3>Education</h3><div class="exp-block">${d.education}</div></div>` : ''}
        ${d.skills ? `<div class="section"><h3>Key skills</h3><p>${d.skills.split('|').map(s => s.trim()).filter(Boolean).join(' · ')}</p></div>` : ''}
      </div>
      ${d.certs ? `<div class="section"><h3>Certifications &amp; awards</h3><p>${d.certs}</p></div>` : ''}
    </div>`;
  }
};
