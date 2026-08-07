// templates.js
// Each template receives a flat data object from script.js.
// All user-entered values have already been HTML-escaped.

function renderExperience(experiences) {
  if (!Array.isArray(experiences) || !experiences.length) {
    return '';
  }

  return experiences.map(exp => {
    const bullets = (exp.desc || '')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line =>
        line.replace(/^[-•]\s*/, '')
      )
      .map(line => `<li>${line}</li>`)
      .join('');

    return `
      <div class="experience-item">

        <div class="experience-top">
          <strong>
            ${exp.role || ''}
          </strong>

          ${
            exp.dates
              ? `<span>${exp.dates}</span>`
              : ''
          }
        </div>

        ${
          exp.company
            ? `<div class="experience-company">
                ${exp.company}
              </div>`
            : ''
        }

        ${
          bullets
            ? `<ul class="experience-bullets">
                ${bullets}
              </ul>`
            : ''
        }

      </div>
    `;
  }).join('');
}

function renderEducation(education) {
  if (!Array.isArray(education) || !education.length) {
    return '';
  }

  return education.map(edu => `
    <div class="education-item">

      ${
        edu.degree
          ? `<strong>${edu.degree}</strong>`
          : ''
      }

      ${
        edu.school
          ? `<span>${edu.school}</span>`
          : ''
      }

      ${
        edu.year
          ? `<span>${edu.year}</span>`
          : ''
      }

    </div>
  `).join('');
}

const TEMPLATES = {

  /* ---------- TECH ---------- */

  tech: d => {
    const contact = [
      d.email,
      d.phone,
      d.location,
      d.linkedin
    ]
      .filter(Boolean)
      .join(' • ');

    const skillChips =
      (d.skills || [])
        .filter(Boolean)
        .map(skill =>
          `<span>${skill}</span>`
        )
        .join('');

    const experience =
      renderExperience(
        d.experience
      );

    const education =
      renderEducation(
        d.education
      );

    return `
      <div class="cv cv-tech">

        <div class="header-tech">

          <h1>
            ${d.name || 'YOUR NAME'}
          </h1>

          <h2>
            ${d.title || 'SOFTWARE ENGINEER'}
          </h2>

          ${
            contact
              ? `<div class="contact-bar">
                  ${contact}
                </div>`
              : ''
          }

        </div>

        ${
          d.summary
            ? `
              <div class="section">
                <h3>Professional summary</h3>
                <p>${d.summary}</p>
              </div>
            `
            : ''
        }

        ${
          skillChips
            ? `
              <div class="section">
                <h3>Technical skills</h3>

                <div class="skills-grid">
                  ${skillChips}
                </div>
              </div>
            `
            : ''
        }

        ${
          experience
            ? `
              <div class="section">
                <h3>Professional experience</h3>
                ${experience}
              </div>
            `
            : ''
        }

        ${
          education
            ? `
              <div class="section">
                <h3>Education</h3>
                ${education}
              </div>
            `
            : ''
        }

        ${
          d.certs
            ? `
              <div class="section">
                <h3>Certifications & awards</h3>
                <p>${d.certs}</p>
              </div>
            `
            : ''
        }

      </div>
    `;
  },


  /* ---------- CABIN CREW ---------- */

  cabin: d => {

    const photoHTML = d.photo
      ? `
        <img
          src="${d.photo}"
          class="passport-photo"
          alt="Professional CV photo"
        >
      `
      : `
        <div class="passport-photo photo-placeholder">
          Photo
        </div>
      `;

    const contact = [
      d.email,
      d.phone,
      d.location
    ]
      .filter(Boolean)
      .join(' • ');

    const personal = [
      d.nationality
        ? `Nationality: ${d.nationality}`
        : '',

      d.age
        ? `Age: ${d.age}`
        : '',

      d.height
        ? `Height: ${d.height} cm`
        : '',

      d.armReach
        ? `Reach: ${d.armReach} cm`
        : '',

      d.swimming
        ? `Swimming: ${d.swimming}`
        : ''
    ]
      .filter(Boolean)
      .join(' • ');

    const languages =
      d.languages
        ? `Languages: ${d.languages}`
        : '';

    const skillsList =
      (d.skills || [])
        .filter(Boolean)
        .map(skill =>
          `<li>${skill}</li>`
        )
        .join('');

    const experience =
      renderExperience(
        d.experience
      );

    const education =
      renderEducation(
        d.education
      );

    return `
      <div class="cv cv-cabin-premium">

        <div class="header-cabin-premium">

          <div class="header-left">

            <h1>
              ${d.name || 'YOUR NAME'}
            </h1>

            <h2>
              ${d.title || 'CABIN CREW'}
            </h2>

            ${
              contact
                ? `
                  <div class="contact-line">
                    ${contact}
                  </div>
                `
                : ''
            }

          </div>

          <div class="header-right">
            ${photoHTML}
          </div>

        </div>

        ${
          personal
            ? `
              <div class="personal-line">
                ${personal}
              </div>
            `
            : ''
        }

        ${
          languages
            ? `
              <div class="personal-line">
                ${languages}
              </div>
            `
            : ''
        }

        ${
          d.summary
            ? `
              <div class="section">
                <h3>Professional profile</h3>
                <p>${d.summary}</p>
              </div>
            `
            : ''
        }

        ${
          skillsList
            ? `
              <div class="section">
                <h3>Core competencies</h3>

                <ul class="plain-skills">
                  ${skillsList}
                </ul>
              </div>
            `
            : ''
        }

        ${
          experience
            ? `
              <div class="section">
                <h3>Customer service experience</h3>
                ${experience}
              </div>
            `
            : ''
        }

        ${
          education
            ? `
              <div class="section">
                <h3>Education</h3>
                ${education}
              </div>
            `
            : ''
        }

        ${
          d.cabinTraining
            ? `
              <div class="section">
                <h3>Training & qualifications</h3>
                <p>${d.cabinTraining}</p>
              </div>
            `
            : ''
        }

        ${
          d.certs
            ? `
              <div class="section">
                <h3>Certifications & awards</h3>
                <p>${d.certs}</p>
              </div>
            `
            : ''
        }

      </div>
    `;
  },


  /* ---------- CORPORATE ---------- */

  corporate: d => {

    const contact = [
      d.email,
      d.phone,
      d.location,
      d.linkedin
    ]
      .filter(Boolean)
      .join(' · ');

    const experience =
      renderExperience(
        d.experience
      );

    const education =
      renderEducation(
        d.education
      );

    const skills =
      (d.skills || [])
        .filter(Boolean)
        .join(' · ');

    return `
      <div class="cv cv-corporate">

        <div class="header-corporate">

          <h1>
            ${d.name || 'YOUR NAME'}
          </h1>

          <h2>
            ${d.title || 'BUSINESS PROFESSIONAL'}
          </h2>

          ${
            contact
              ? `
                <div class="contact-line">
                  ${contact}
                </div>
              `
              : ''
          }

        </div>

        ${
          d.summary
            ? `
              <div class="section">
                <h3>Professional summary</h3>
                <p>${d.summary}</p>
              </div>
            `
            : ''
        }

        ${
          experience
            ? `
              <div class="section">
                <h3>Professional experience</h3>
                ${experience}
              </div>
            `
            : ''
        }

        ${
          education || skills
            ? `
              <div class="two-col">

                ${
                  education
                    ? `
                      <div class="section">
                        <h3>Education</h3>
                        ${education}
                      </div>
                    `
                    : ''
                }

                ${
                  skills
                    ? `
                      <div class="section">
                        <h3>Key skills</h3>
                        <p>${skills}</p>
                      </div>
                    `
                    : ''
                }

              </div>
            `
            : ''
        }

        ${
          d.certs
            ? `
              <div class="section">
                <h3>Certifications & awards</h3>
                <p>${d.certs}</p>
              </div>
            `
            : ''
        }

      </div>
    `;
  }
};
