// templates.js
// Each template receives a flat data object from script.js.
// The .sheet wrapper provides the paper background and padding.

const TEMPLATES = {

  /* =========================
     TECH / COMPUTER SCIENCE
     ========================= */

  tech: (d) => {
    const contact = [
      d.email,
      d.phone,
      d.location,
      d.linkedin
    ].filter(Boolean).join(' • ');

    const skillChips = (d.skills || '')
      .split('|')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => `<span>${s}</span>`)
      .join('');

    const experienceHTML = (d.experience || [])
      .map(exp => `
        <div class="exp-block">
          <div class="experience-top">
            <strong>${exp.role || ''}</strong>
            ${exp.dates ? `<span>${exp.dates}</span>` : ''}
          </div>

          ${exp.company
            ? `<div class="experience-company">${exp.company}</div>`
            : ''
          }

          ${exp.desc
            ? `
              <ul>
                ${exp.desc
                  .split(/\r?\n/)
                  .map(line => line.trim())
                  .filter(Boolean)
                  .map(line =>
                    `<li>${line.replace(/^[-•]\s*/, '')}</li>`
                  )
                  .join('')
                }
              </ul>
            `
            : ''
          }
        </div>
      `)
      .join('');

    return `
      <div class="cv cv-tech">

        <div class="header-tech">
          <h1>${d.name || 'YOUR NAME'}</h1>
          <h2>${d.title || 'SOFTWARE ENGINEER'}</h2>

          ${contact
            ? `<div class="contact-bar">${contact}</div>`
            : ''
          }
        </div>

        ${d.summary
          ? `
            <div class="section">
              <h3>Summary</h3>
              <p>${d.summary}</p>
            </div>
          `
          : ''
        }

        ${skillChips
          ? `
            <div class="section">
              <h3>Technical Skills</h3>
              <div class="skills-grid">${skillChips}</div>
            </div>
          `
          : ''
        }

        ${experienceHTML
          ? `
            <div class="section">
              <h3>Professional Experience</h3>
              ${experienceHTML}
            </div>
          `
          : ''
        }

        ${d.education
          ? `
            <div class="section">
              <h3>Education</h3>
              <div class="exp-block">${d.education}</div>
            </div>
          `
          : ''
        }

        ${d.certs
          ? `
            <div class="section">
              <h3>Certifications</h3>
              <p>${d.certs}</p>
            </div>
          `
          : ''
        }

      </div>
    `;
  },


  /* =========================
     CABIN CREW
     ========================= */

  cabin: (d) => {

    const photoHTML = d.photo
      ? `<img src="${d.photo}" class="passport-photo" alt="Profile photo">`
      : `<div class="passport-photo photo-placeholder">Photo</div>`;

    const contact = [
      d.email,
      d.phone,
      d.location
    ].filter(Boolean).join(' • ');

    const personal = [
      d.nationality ? `Nationality: ${d.nationality}` : '',
      d.age ? `Age: ${d.age}` : '',
      d.height ? `Height: ${d.height} cm` : '',
      d.armReach ? `Reach: ${d.armReach} cm` : '',
      d.swimming ? `Swimming: ${d.swimming}` : ''
    ]
      .filter(Boolean)
      .join(' • ');

    const skillsList = (d.skills || '')
      .split('|')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => `<li>${s}</li>`)
      .join('');

    const experienceHTML = (d.experience || [])
      .map(exp => `
        <div class="exp-block">

          <div class="experience-top">
            <strong>${exp.role || ''}</strong>
            ${exp.dates ? `<span>${exp.dates}</span>` : ''}
          </div>

          ${exp.company
            ? `<div class="experience-company">${exp.company}</div>`
            : ''
          }

          ${exp.desc
            ? `
              <ul>
                ${exp.desc
                  .split(/\r?\n/)
                  .map(line => line.trim())
                  .filter(Boolean)
                  .map(line =>
                    `<li>${line.replace(/^[-•]\s*/, '')}</li>`
                  )
                  .join('')
                }
              </ul>
            `
            : ''
          }

        </div>
      `)
      .join('');

    return `
      <div class="cv cv-cabin-premium">

        <div class="header-cabin-premium">

          <div class="header-left">
            <h1>${d.name || 'YOUR NAME'}</h1>

            <h2>${d.title || 'CABIN CREW'}</h2>

            ${contact
              ? `<div class="contact-line">${contact}</div>`
              : ''
            }
          </div>

          <div class="header-right">
            ${photoHTML}
          </div>

        </div>

        ${personal
          ? `<div class="personal-line">${personal}</div>`
          : ''
        }

        ${d.languages
          ? `<div class="personal-line">Languages: ${d.languages}</div>`
          : ''
        }

        ${d.summary
          ? `
            <div class="section">
              <h3>Professional Profile</h3>
              <p>${d.summary}</p>
            </div>
          `
          : ''
        }

        ${skillsList
          ? `
            <div class="section">
              <h3>Core Competencies</h3>
              <ul class="plain-skills">
                ${skillsList}
              </ul>
            </div>
          `
          : ''
        }

        ${experienceHTML
          ? `
            <div class="section">
              <h3>Customer Service Experience</h3>
              ${experienceHTML}
            </div>
          `
          : ''
        }

        ${d.education
          ? `
            <div class="section">
              <h3>Education</h3>
              <div class="exp-block">${d.education}</div>
            </div>
          `
          : ''
        }

        ${d.cabinTraining
          ? `
            <div class="section">
              <h3>Training &amp; Qualifications</h3>
              <p>${d.cabinTraining}</p>
            </div>
          `
          : ''
        }

        ${d.certs
          ? `
            <div class="section">
              <h3>Certifications &amp; Awards</h3>
              <p>${d.certs}</p>
            </div>
          `
          : ''
        }

      </div>
    `;
  },


  /* =========================
     BANKING / CORPORATE
     ========================= */

  corporate: (d) => {

    const contact = [
      d.email,
      d.phone,
      d.location,
      d.linkedin
    ].filter(Boolean).join('  ·  ');

    const experienceHTML = (d.experience || [])
      .map(exp => `
        <div class="exp-block">

          <div class="experience-top">
            <strong>${exp.role || ''}</strong>
            ${exp.dates ? `<span>${exp.dates}</span>` : ''}
          </div>

          ${exp.company
            ? `<div class="experience-company">${exp.company}</div>`
            : ''
          }

          ${exp.desc
            ? `
              <ul>
                ${exp.desc
                  .split(/\r?\n/)
                  .map(line => line.trim())
                  .filter(Boolean)
                  .map(line =>
                    `<li>${line.replace(/^[-•]\s*/, '')}</li>`
                  )
                  .join('')
                }
              </ul>
            `
            : ''
          }

        </div>
      `)
      .join('');

    const skillsHTML = (d.skills || '')
      .split('|')
      .map(s => s.trim())
      .filter(Boolean)
      .join(' · ');

    return `
      <div class="cv cv-corporate">

        <div class="header-corporate">
          <h1>${d.name || 'YOUR NAME'}</h1>
          <h2>${d.title || 'BUSINESS PROFESSIONAL'}</h2>

          ${contact
            ? `<div class="contact-line">${contact}</div>`
            : ''
          }
        </div>

        ${d.summary
          ? `
            <div class="section">
              <h3>Executive Summary</h3>
              <p>${d.summary}</p>
            </div>
          `
          : ''
        }

        ${experienceHTML
          ? `
            <div class="section">
              <h3>Professional Experience</h3>
              ${experienceHTML}
            </div>
          `
          : ''
        }

        <div class="two-col">

          ${d.education
            ? `
              <div class="section">
                <h3>Education</h3>
                <div class="exp-block">${d.education}</div>
              </div>
            `
            : ''
          }

          ${skillsHTML
            ? `
              <div class="section">
                <h3>Key Skills</h3>
                <p>${skillsHTML}</p>
              </div>
            `
            : ''
          }

        </div>

        ${d.certs
          ? `
            <div class="section">
              <h3>Certifications &amp; Awards</h3>
              <p>${d.certs}</p>
            </div>
          `
          : ''
        }

      </div>
    `;
  }

};
