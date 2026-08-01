const TEMPLATES = {
  tech: (data) => `
    <div class="cv cv-tech">
      <h1>${data.name}</h1>
      <h2>${data.title}</h2>
      <p class="contact">${data.email} | ${data.phone}</p>
      <hr>
      <h3>SUMMARY</h3>
      <p>${data.summary}</p>
      <h3>SKILLS</h3>
      <p>${data.skills}</p>
      <h3>PROJECTS & EXPERIENCE</h3>
      <p>${data.experience}</p>
      <h3>EDUCATION</h3>
      <p>${data.education}</p>
    </div>
  `,
  cabin: (data) => `
    <div class="cv cv-cabin">
      <div class="header">
        <img src="${data.photo}" class="cv-photo">
        <div>
          <h1>${data.name}</h1>
          <h2>${data.title}</h2>
          <p class="contact">${data.email} | ${data.phone}</p>
        </div>
      </div>
      <h3>PROFESSIONAL SUMMARY</h3>
      <p>${data.summary}</p>
      <h3>LANGUAGES & CUSTOMER SERVICE</h3>
      <p>${data.skills}</p>
      <h3>WORK EXPERIENCE</h3>
      <p>${data.experience}</p>
      <h3>EDUCATION</h3>
      <p>${data.education}</p>
    </div>
  `,
  banking: (data) => `
    <div class="cv cv-banking">
      <div class="header-banking">
        <div>
          <h1>${data.name}</h1>
          <h2>${data.title}</h2>
        </div>
        ${data.photo? `<img src="${data.photo}" class="cv-photo-small">` : ''}
      </div>
      <p class="contact">${data.email} | ${data.phone}</p>
      <h3>EDUCATION</h3>
      <p>${data.education}</p>
      <h3>PROFESSIONAL EXPERIENCE</h3>
      <p>${data.experience}</p>
      <h3>KEY SKILLS & CERTIFICATIONS</h3>
      <p>${data.skills}</p>
    </div>
  `
};
