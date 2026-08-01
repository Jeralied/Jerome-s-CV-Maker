let selectedType = '';
let formData = {};

const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const cvForm = document.getElementById('cvForm');
const cvPreview = document.getElementById('cvPreview');
const photoUpload = document.getElementById('photoUpload');

document.querySelectorAll('.template-card').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedType = btn.dataset.type;
    if(selectedType === 'cabin') photoUpload.classList.remove('hidden');
    else photoUpload.classList.add('hidden');
    showScreen(step2);
  });
});

document.getElementById('backBtn').onclick = () => showScreen(step1);
document.getElementById('editBtn').onclick = () => showScreen(step2);

cvForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formData = {
    name: document.getElementById('fullName').value,
    title: document.getElementById('jobTitle').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    summary: document.getElementById('summary').value,
    skills: document.getElementById('skills').value,
    experience: document.getElementById('experience').value,
    education: document.getElementById('education').value,
    photo: document.getElementById('photoPreview').src
  };

  cvPreview.innerHTML = TEMPLATES[selectedType](formData);
  showScreen(step3);
});

// Photo preview
document.getElementById('photo').onchange = (e) => {
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById('photoPreview').src = reader.result;
    document.getElementById('photoPreview').classList.remove('hidden');
  }
  reader.readAsDataURL(e.target.files[0]);
}

// PDF Download
document.getElementById('downloadPDF').onclick = () => {
  const opt = {
    margin: 0.5,
    filename: `JeromeCV-${formData.name}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(cvPreview).save();
}

function showScreen(el) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}
