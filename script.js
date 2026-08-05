// 1. IN HTML: Add this inside <div class="row2"> after location field
<div class="row2" id="emiratesStats" style="display:none;">
  <div class="field"><label for="age">Age</label><input id="age" placeholder="22" oninput="render()"></div>
  <div class="field"><label for="height">Height</label><input id="height" placeholder="175cm" oninput="render()"></div>
</div>
<div class="row2" id="emiratesStats2" style="display:none;">
  <div class="field"><label for="armreach">Arm Reach</label><input id="armreach" placeholder="215cm" oninput="render()"></div>
  <div class="field"><label for="swim">Swimming</label><input id="swim" placeholder="50m" oninput="render()"></div>
</div>

// 2. IN script.js: Add to FIELD_IDS
const FIELD_IDS = ['fullName', 'roleTitle', 'email', 'phone', 'location', 'linkedin', 'summary', 'certs', 'languages', 'age', 'height', 'armreach', 'swim'];

// 3. IN script.js: Show/hide fields in goToStep2() and switchProfile()
document.getElementById('emiratesStats').style.display = track === 'cabin' ? 'grid' : 'none';
document.getElementById('emiratesStats2').style.display = track === 'cabin' ? 'grid' : 'none';
