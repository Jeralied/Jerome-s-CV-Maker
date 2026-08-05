// templates.js
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

  cabin: (d) => {
    const photoHTML = d.photo
      ? `<img src="${d.photo}" class="passport-photo" alt="">`
      : `<div class="passport-photo photo-placeholder">Photo</div>`;

    const contact = [d.email,d.phone,d.location].filter(Boolean).join(" • ");

    const personal = [
      d.age ? `Age: ${d.age}` : "",
      d.nationality ? `Nationality: ${d.nationality}` : "",
      d.height ? `Height: ${d.height} cm` : "",
      d.armReach ? `Arm Reach: ${d.armReach} cm` : "",
      d.swimming ? `Swimming: ${d.swimming}` : ""
    ].filter(Boolean).join(" • ");

    const skills = (d.skills || "").split("|").map(s=>s.trim()).filter(Boolean).map(s=>`<li>${s}</li>`).join("");

    return `
    <div class="cv cv-cabin">
      <div class="header-cabin">
        <div class="header-left">
          <h1>${d.name || "YOUR NAME"}</h1>
          <h2>${d.title || "CABIN CREW"}</h2>
          ${contact ? `<div class="contact-line">${contact}</div>` : ""}
          ${personal ? `<div class="contact-line">${personal}</div>` : ""}
          ${d.languages ? `<div class="contact-line">Languages: ${d.languages}</div>` : ""}
        </div>
        <div class="header-right">${photoHTML}</div>
      </div>
      ${d.summary ? `<div class="section"><h3>Professional Profile</h3><p>${d.summary}</p></div>` : ""}
      ${skills ? `<div class="section"><h3>Core Competencies</h3><ul class="plain-skills">${skills}</ul></div>` : ""}
      ${d.experience ? `<div class="section"><h3>Customer Service Experience</h3><div class="exp-block">${d.experience}</div></div>` : ""}
      ${d.education ? `<div class="section"><h3>Education</h3><div class="exp-block">${d.education}</div></div>` : ""}
      ${d.cabinTraining ? `<div class="section"><h3>Training & Certifications</h3><p>${d.cabinTraining}</p></div>` : ""}
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
