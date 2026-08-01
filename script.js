let selectedType = ''; let formData = {};
const screens = document.querySelectorAll('.screen');
const cvForm = document.getElementById('cvForm');
const cvPreview = document.getElementById('cvPreview');
const photoUpload = document.getElementById('photoUpload');

document.querySelectorAll('.template-card').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedType = btn.dataset.type;
    photoUpload.classList.toggle('hidden', selectedType!== 'cabin');
    showScreen(1);
  });
});

document.getElementById('backBtn').onclick = () => showScreen(0);
document.getElementById('editBtn').onclick = () => showScreen(1);

cvForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formData = {
    name: fullName.value, title: jobTitle.value, email: email.value, phone: phone.value,
    location: location.value, linkedin: linkedin.value, summary: summary.value,
    skills: skills.value, experience: experience.value, education: education.value,
    certs: certs.value, photo: photoPreview.src
  };
  cvPreview.innerHTML = TEMPLATES[selectedType](formData);
  showScreen(2);
});

document.getElementById('photo').onchange = (e) => {
  const reader = new FileReader();
  reader.onload = () => { photoPreview.src = reader.result; photoPreview.classList.remove('hidden'); }
  reader.readAsDataURL(e.target.files[0]);
}

document.getElementById('downloadPDF').onclick = () => {
  html2pdf().set({
    margin: 0, filename: `CV-${formData.name}.pdf`,
    html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }).from(cvPreview).save();
}

function showScreen(n) { screens.forEach((s,i) => s.classList.toggle('active', i===n)); }
