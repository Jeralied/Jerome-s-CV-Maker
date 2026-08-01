:root {
  --bg: #0a0a0f;
  --card: #111827;
  --text: #f3f4f6;
  --muted: #9ca3af;
  --accent: #6366f1;
  --accent-2: #8b5cf6;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; line-height: 1.6; padding: 2rem 1rem; }
header { text-align: center; margin-bottom: 3rem; }
header h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; color: var(--accent); }
.screen { display: none; max-width: 900px; margin: 0 auto; }
.screen.active { display: block; }
h2 { margin-bottom: 1.5rem; text-align: center; }
.template-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
.template-card { background: var(--card); border: 2px solid #1f2937; padding: 2rem; border-radius: 16px; cursor: pointer; transition: 0.3s; text-align: left; }
.template-card:hover { border-color: var(--accent); transform: translateY(-4px); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
input, textarea { width: 100%; padding: 12px; background: #1f2937; border: 1px solid #374151; color: white; border-radius: 8px; font-family: 'Inter'; margin: 8px 0; }
.btn-group { display: flex; gap: 1rem; margin-top: 1.5rem; }
.btn-primary { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color: white; padding: 14px 28px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; flex: 1; }
.btn-ghost { background: transparent; border: 1px solid #374151; color: var(--muted); padding: 14px 28px; border-radius: 10px; cursor: pointer; }
#photoPreview { width: 100px; height: 100px; border-radius: 8px; object-fit: cover; margin-top: 10px; }
.hidden { display: none; }

/* CV PREVIEW STYLES */
.cv-preview { background: white; color: #111; padding: 0; margin: 2rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.cv { padding: 2.5rem; font-size: 10.5pt; }
.cv h1 { font-size: 24pt; margin-bottom: 4px; }
.cv h2 { font-size: 12pt; color: #555; font-weight: 500; margin-bottom: 12px; }
.cv h3 { font-size: 11pt; font-weight: 700; border-bottom: 2px solid #eee; padding-bottom: 4px; margin: 16px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }
