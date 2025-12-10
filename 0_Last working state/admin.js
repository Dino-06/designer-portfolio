// Admin Panel Logic (accent color preview + custom color picker, sized previews)
// Netlify AI integration disabled
const PROJECTS_JSON_PATH = '/designer-portfolio/projects.json';
const API_SAVE_ENDPOINT = ''; // Leave empty to disable "Save to Server"
const LOCAL_STORAGE_KEY = 'admin_projects_draft_v2';
const LOCAL_STORAGE_HISTORY_KEY = 'admin_projects_history_v2';

let projects = [];
let originalProjects = [];
let selectedIndex = -1;

const $ = (id) => document.getElementById(id);
const log = (...args) => console.log('[Admin]', ...args);

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }
function downloadFile(filename, content) {
  try {
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  } catch (e) {
    console.error('Download failed', e);
    const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(content);
    window.open(dataUrl, '_blank', 'noopener');
  }
}
function toast(msg) { alert(msg); }

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function generateProjectId(title = '') {
  const slug = slugify(title) || 'untitled';
  const suffix = Math.random().toString(36).slice(2, 6);
  return `project-${slug}-${suffix}`;
}
function generateSectionId(title = '', idx = 1) {
  const slug = slugify(title);
  return slug ? slug : `section-${idx}`;
}

// Load / Save
async function loadProjects() {
  try {
    const resp = await fetch(PROJECTS_JSON_PATH, { cache: 'no-store' });
    if (!resp.ok) throw new Error('Fetch failed');
    const data = await resp.json();
    setWorkingData(data);
    toast('Loaded /projects.json');
  } catch (err) {
    console.warn('Failed to fetch /projects.json', err);
    const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (draft) {
      setWorkingData(JSON.parse(draft));
      toast('Loaded local draft (network error).');
    } else {
      toast('Could not load projects; no draft found.');
    }
  }
}
function importJsonFromFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      setWorkingData(data);
      toast('Imported JSON file.');
    } catch {
      toast('Invalid JSON file.');
    }
  };
  reader.readAsText(file);
}
function setWorkingData(data) {
  projects = deepClone(data);
  originalProjects = deepClone(data);
  pushHistorySnapshot(projects);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  renderProjectsList();
  clearEditor();
}
function exportJson() { downloadFile('projects.json', JSON.stringify(projects, null, 2)); }
function exportBackup() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  downloadFile(`projects-backup-${ts}.json`, JSON.stringify(projects, null, 2));
}
async function saveToServer() {
  if (!API_SAVE_ENDPOINT) { toast('API endpoint not configured.'); return; }
  try {
    const resp = await fetch(API_SAVE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(projects) });
    if (!resp.ok) throw new Error('Server error');
    toast('Saved to server.');
  } catch (err) {
    console.error(err);
    toast('Error saving to server.');
  }
}
function pushHistorySnapshot(data) {
  try {
    const hist = JSON.parse(localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY) || '[]');
    hist.push({ ts: Date.now(), data });
    while (hist.length > 10) hist.shift();
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(hist));
  } catch {}
}

// Delete
function deleteProjectById(projectId) {
  if (!projectId) { toast('Cannot delete: missing project ID.'); return; }
  const idx = projects.findIndex(p => p.id === projectId);
  if (idx === -1) { toast('Project not found.'); return; }

  const title = projects[idx].title || 'Untitled';
  projects.splice(idx, 1);

  if (selectedIndex === idx) { selectedIndex = -1; clearEditor(); }
  else if (selectedIndex > idx) { selectedIndex -= 1; }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  pushHistorySnapshot(projects);
  renderProjectsList();
  toast(`Deleted: ${title}`);
}

// Sidebar list
function renderProjectsList() {
  const list = $('projectsList');
  if (!list) return;
  list.innerHTML = '';

  const search = $('searchInput')?.value?.toLowerCase() || '';
  const showHidden = $('showHiddenToggle')?.checked;

  const filtered = projects.filter(p => {
    const hay = `${p.title || ''} ${p.category || ''} ${p.year || ''}`.toLowerCase();
    const matches = hay.includes(search);
    return matches && (showHidden || !p.isHidden);
  });

  filtered.forEach(proj => {
    const actualIndex = projects.findIndex(p => p.id === proj.id);
    const item = document.createElement('div');
    item.className = 'list-item flex items-center gap-3';
    item.draggable = true;

    item.addEventListener('dragstart', (e) => {
      item.classList.add('dragging');
      e.dataTransfer.setData('text/plain', actualIndex.toString());
    });
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
    item.addEventListener('dragover', (e) => e.preventDefault());
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
      const toIdx = actualIndex;
      if (Number.isNaN(fromIdx) || fromIdx === toIdx) return;
      const [moved] = projects.splice(fromIdx, 1);
      projects.splice(toIdx, 0, moved);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      renderProjectsList();
    });

    const info = document.createElement('div');
    info.className = 'flex-1';
    info.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="min-w-0">
          <div class="font-semibold truncate">${proj.title || ''}</div>
          <div class="text-xs text-gray-500 truncate">${proj.category || '—'} • ${proj.year || '—'}</div>
        </div>
        <span class="text-xs px-2 py-1 rounded-full ${proj.isHidden ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-700'}">
          ${proj.isHidden ? 'Hidden' : 'Visible'}
        </span>
      </div>
    `;

    const actions = document.createElement('div');
    actions.className = 'flex items-center gap-2';

    const editBtn = document.createElement('button');
    editBtn.className = 'px-3 py-1 rounded-full border hover:bg-gray-100';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => { selectProject(actualIndex); $('proj_title')?.focus(); };

    const dupBtn = document.createElement('button');
    dupBtn.className = 'px-3 py-1 rounded-full border hover:bg-gray-100';
    dupBtn.textContent = 'Duplicate';
    dupBtn.onclick = () => duplicateProject(actualIndex);

    const hideBtn = document.createElement('button');
    hideBtn.className = 'px-3 py-1 rounded-full border hover:bg-gray-100';
    hideBtn.textContent = proj.isHidden ? 'Unhide' : 'Hide';
    hideBtn.onclick = () => {
      projects[actualIndex].isHidden = !projects[actualIndex].isHidden;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      renderProjectsList();
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'px-3 py-1 rounded-full border border-red-300 text-red-700 hover:bg-red-50';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteProjectById(proj.id);

    actions.append(editBtn, dupBtn, hideBtn, delBtn);
    item.append(info, actions);
    list.appendChild(item);
  });
}

// Selection + previews
function selectProject(idx) {
  selectedIndex = idx;
  const p = projects[idx];
  if (!p) return;

  $('emptyState')?.classList.add('hidden');
  $('projectForm')?.classList.remove('hidden');

  $('proj_id').value = p.id || '';
  $('proj_title').value = p.title || '';
  $('proj_category').value = p.category || '';
  $('proj_year').value = p.year || '';
  $('proj_accentColor').value = p.accentColor || '';
  $('accentPreset').value = ''; // don’t override saved custom class/hex
  $('proj_isHidden').checked = !!p.isHidden;
  $('proj_heroImage').value = p.heroImage || '';

  updateHeroPreview();
  updateProjectHeaderPreview();
  updateAccentPreview();

  const cs = p.caseStudy || { client: '', role: '', duration: '', brief: '', sections: [] };
  $('case_client').value = cs.client || '';
  $('case_role').value = cs.role || '';
  $('case_duration').value = cs.duration || '';
  $('case_brief').value = cs.brief || '';

  renderSections(cs.sections || []);
  initializeAllMediaPreviews();

  const delBtn = $('deleteProjectBtn');
  if (delBtn) delBtn.dataset.deleteProjectId = p.id;
  const dupBtn = $('duplicateProjectBtn');
  if (dupBtn) dupBtn.dataset.projectId = p.id;
}

function clearEditor() {
  selectedIndex = -1;
  $('projectForm')?.classList.add('hidden');
  $('emptyState')?.classList.remove('hidden');
  $('sectionsContainer').innerHTML = '';
  $('validationContainer')?.classList.add('hidden');
  $('diffContainer')?.classList.add('hidden');
  $('projectPreviewTitle').textContent = '—';
  $('projectPreviewBadge').textContent = '—';
  $('projectPreviewThumb')?.classList.add('hidden');
  $('accentBadgePreview').className = 'badge-preview bg-indigo-600';
  $('accentSwatch').style.backgroundColor = '';
  $('accentColorPicker').value = '#6366f1';
}

// New / Duplicate
function newProject() {
  const proj = {
    id: generateProjectId(),
    title: 'Untitled Project',
    category: '',
    year: '',
    heroImage: '',
    accentColor: 'bg-indigo-600',
    isHidden: false,
    caseStudy: { client: '', role: '', duration: '', brief: '', sections: [] }
  };
  projects.unshift(proj);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  renderProjectsList();
  selectProject(0);
}
function duplicateProject(idx) {
  const base = projects[idx];
  if (!base) return;
  const clone = deepClone(base);
  clone.title = `${base.title || 'Untitled Project'} (Copy)`;
  clone.id = generateProjectId(clone.title);
  const seen = new Set();
  clone.caseStudy?.sections?.forEach((s, i) => {
    const baseId = s.id || generateSectionId(s.title, i + 1);
    let uniqueId = baseId;
    let counter = 2;
    while (seen.has(uniqueId)) uniqueId = `${baseId}-${counter++}`;
    s.id = uniqueId;
    seen.add(uniqueId);
  });
  projects.splice(idx + 1, 0, clone);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  pushHistorySnapshot(projects);
  renderProjectsList();
  const newIndex = projects.findIndex(p => p.id === clone.id);
  selectProject(newIndex);
  $('proj_title')?.focus();
  toast('Project duplicated.');
}

// Apply / Discard
function applyChanges() {
  if (selectedIndex < 0) { toast('No project selected.'); return; }
  const p = projects[selectedIndex];
  const titleVal = $('proj_title').value.trim();
  p.id = $('proj_id').value.trim() || p.id || generateProjectId(titleVal);
  p.title = titleVal;
  p.category = $('proj_category').value.trim();
  p.year = $('proj_year').value.trim();

  const preset = $('accentPreset').value.trim();
  const customInput = $('proj_accentColor').value.trim();
  const colorPickerVal = $('accentColorPicker').value;

  let accent = preset || customInput || colorPickerVal || 'bg-indigo-600';
  // Normalize hex to Tailwind arbitrary color class
  if (isHexColor(accent)) {
    accent = `bg-[${accent}]`;
  } else {
    const extracted = extractHexFromArbitrary(accent);
    if (extracted) accent = `bg-[${extracted}]`;
  }
  p.accentColor = accent;

  p.isHidden = $('proj_isHidden').checked;
  p.heroImage = $('proj_heroImage').value.trim();

  p.caseStudy = p.caseStudy || {};
  p.caseStudy.client = $('case_client').value.trim();
  p.caseStudy.role = $('case_role').value.trim();
  p.caseStudy.duration = $('case_duration').value.trim();
  p.caseStudy.brief = $('case_brief').value.trim();
  p.caseStudy.sections = collectSectionsFromDOM();

  autoGenerateIds(p);

  const errors = validateProjects(projects);
  if (errors.length) {
    renderDiffAndValidation();
    highlightInvalidFields(errors);
    toast('Fix validation errors.');
    return;
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  pushHistorySnapshot(projects);
  renderProjectsList();
  renderDiffAndValidation();
  toast('Changes applied.');
}

function discardChanges() {
  if (!confirm('Discard current edits?')) return;
  if (selectedIndex >= 0) selectProject(selectedIndex);
}

// Auto IDs
function autoGenerateIds(project) {
  if (!project.id || !project.id.trim()) {
    project.id = generateProjectId(project.title);
    $('proj_id').value = project.id;
  }
  const seen = new Set();
  project.caseStudy.sections.forEach((s, idx) => {
    if (!s.id || !s.id.trim()) s.id = generateSectionId(s.title, idx + 1);
    let baseId = s.id;
    let uniqueId = baseId;
    let counter = 2;
    while (seen.has(uniqueId)) uniqueId = `${baseId}-${counter++}`;
    s.id = uniqueId;
    seen.add(uniqueId);
  });
}

// Sections + media previews
let dynamicElementCounter = 0;
function nextDynamicId(prefix) { dynamicElementCounter += 1; return `${prefix}-${dynamicElementCounter}`; }
function renderSections(sections) {
  const container = $('sectionsContainer');
  container.innerHTML = '';
  sections.forEach((sec, i) => container.appendChild(sectionEditor(sec, i)));
  Array.from(container.children).forEach((child) => {
    child.draggable = true;
    child.addEventListener('dragstart', () => child.classList.add('dragging'));
    child.addEventListener('dragend', () => child.classList.remove('dragging'));
  });
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = container.querySelector('.dragging');
    if (!dragging) return;
    const siblings = Array.from(container.children).filter(c => c !== dragging);
    let nextSibling = siblings.find(sib => e.clientY <= sib.getBoundingClientRect().top + sib.offsetHeight / 2);
    container.insertBefore(dragging, nextSibling || null);
  });
}
function sectionEditor(section, idx) {
  const wrapper = document.createElement('div');
  wrapper.className = 'card section-card';
  wrapper.dataset.index = idx;

  const title = section.title || '';
  const idVal = section.id || generateSectionId(title, idx + 1);
  const content = section.content || '';
  const mediaItems = section.mediaItems || [];
  const chip = String(idx + 1).padStart(2, '0');

  const sectionIdInputId = nextDynamicId('sec-id');
  const sectionTitleInputId = nextDynamicId('sec-title');
  const sectionContentId = nextDynamicId('sec-content');
  const sectionPreviewId = nextDynamicId('sec-md-preview');

  wrapper.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="section-chip">${chip}</span>
        <h4 class="font-semibold">Section</h4>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" class="px-2 py-1 rounded-full border hover:bg-gray-100" data-action="gen-id">Generate ID</button>
        <button type="button" class="px-2 py-1 rounded-full border border-red-300 text-red-700 hover:bg-red-50" data-action="delete">Delete</button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
      <div>
        <label class="block text-sm font-medium" for="${sectionIdInputId}">Section ID</label>
        <input id="${sectionIdInputId}" class="w-full px-3 py-2 rounded-lg border" data-field="id" value="${idVal}" />
      </div>
      <div>
        <label class="block text-sm font-medium" for="${sectionTitleInputId}">Section Title</label>
        <input id="${sectionTitleInputId}" class="w-full px-3 py-2 rounded-lg border" data-field="title" value="${title}" placeholder="01. Title" />
      </div>
    </div>
    <div class="mt-2">
      <label class="block text sm font-medium" for="${sectionContentId}">Content (Markdown supported)</label>
      <textarea id="${sectionContentId}" class="w-full px-3 py-2 rounded-lg border" data-field="content" rows="4">${content}</textarea>
      <div class="mt-2 p-3 rounded-lg border bg-gray-50">
        <div class="text-xs text-gray-500 mb-2">Preview</div>
        <div id="${sectionPreviewId}" class="prose prose-sm max-w-none"></div>
      </div>
    </div>
    <div class="mt-3">
      <div class="flex items-center justify-between">
        <div class="font-semibold">Media Items</div>
        <button type="button" class="px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-black" data-action="add-media">Add Media</button>
      </div>
      <div class="space-y-3 mt-2" data-container="media">
        ${mediaItems.map((m, j) => mediaItemEditorHTML(m, j)).join('')}
      </div>
      <p class="text-xs text-gray-500 mt-1">Drag to reorder media.</p>
    </div>
  `;

  const contentEl = wrapper.querySelector(`#${sectionContentId}`);
  const previewEl = wrapper.querySelector(`#${sectionPreviewId}`);
  if (previewEl && typeof renderMarkdown === 'function') {
    const updateMdPreview = () => { previewEl.innerHTML = renderMarkdown(contentEl.value); };
    updateMdPreview();
    contentEl.addEventListener('input', updateMdPreview);
  }

  wrapper.querySelector('[data-action="delete"]').onclick = () => wrapper.remove();
  wrapper.querySelector('[data-action="gen-id"]').onclick = () => {
    const titleInput = wrapper.querySelector('[data-field="title"]');
    const idInput = wrapper.querySelector('[data-field="id"]');
    idInput.value = generateSectionId(titleInput.value, idx + 1);
  };
  wrapper.querySelector('[data-action="add-media"]').onclick = () => {
    const container = wrapper.querySelector('[data-container="media"]');
    container.insertAdjacentHTML('beforeend', mediaItemEditorHTML({ url: '', isVideo: false }, container.children.length));
    enableMediaDrag(container);
    const newCard = container.lastElementChild;
    const preview = newCard.querySelector('div[id*="media-preview"]');
    renderMediaPreview(preview, '', false);
  };

  const mediaContainer = wrapper.querySelector('[data-container="media"]');
  mediaContainer.querySelectorAll('.media-item-card').forEach(card => {
    const url = card.querySelector('input[data-field="url"]')?.value.trim() || '';
    const isVideo = card.querySelector('input[data-field="isVideo"]')?.checked || false;
    const preview = card.querySelector('div[id*="media-preview"]');
    renderMediaPreview(preview, url, isVideo);
  });
  enableMediaDrag(mediaContainer);

  return wrapper;
}
function enableMediaDrag(container) {
  Array.from(container.children).forEach(child => {
    child.draggable = true;
    child.addEventListener('dragstart', () => child.classList.add('dragging'));
    child.addEventListener('dragend', () => child.classList.remove('dragging'));
  });
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = container.querySelector('.dragging');
    if (!dragging) return;
    const siblings = Array.from(container.children).filter(c => c !== dragging);
    let nextSibling = siblings.find(sib => e.clientY <= sib.getBoundingClientRect().top + sib.offsetHeight / 2);
    container.insertBefore(dragging, nextSibling || null);
  });
}
function mediaItemEditorHTML(item, idx) {
  const url = item.url || '';
  const isVideo = !!item.isVideo;
  const previewLabel = isVideo ? 'Open Video' : 'Open Image';
  const mediaUrlId = nextDynamicId('media-url');
  const mediaIsVideoId = nextDynamicId('media-isvideo');
  const previewId = nextDynamicId('media-preview');

  return `
    <div class="media-item-card rounded-xl border bg-white p-3" data-media-index="${idx}">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium" for="${mediaUrlId}">URL</label>
          <input id="${mediaUrlId}" class="w-full px-3 py-2 rounded-lg border" data-field="url" value="${url}" placeholder="https://..." />
        </div>
        <div class="flex items-center gap-2 md:col-span-1">
          <input id="${mediaIsVideoId}" type="checkbox" data-field="isVideo" ${isVideo ? 'checked' : ''} />
          <label for="${mediaIsVideoId}" class="text-sm">Is Video</label>
        </div>
      </div>
      <div class="mt-2 flex items-center gap-2">
        <button type="button" class="px-3 py-1 rounded-full border hover:bg-gray-100" data-action="preview">${previewLabel}</button>
        <button type="button" class="px-3 py-1 rounded-full border border-red-300 text-red-700 hover:bg-red-50" data-action="delete">Delete</button>
      </div>
      <div id="${previewId}" class="mt-3 preview-card"></div>
    </div>
  `;
}
function collectSectionsFromDOM() {
  const container = $('sectionsContainer');
  const sections = [];
  container.querySelectorAll('.card.section-card').forEach(secEl => {
    const id = secEl.querySelector('[data-field="id"]').value.trim();
    const title = secEl.querySelector('[data-field="title"]').value.trim();
    const content = secEl.querySelector('[data-field="content"]').value.trim();
    const mediaItems = [];
    secEl.querySelectorAll('.media-item-card').forEach(mEl => {
      const url = mEl.querySelector('[data-field="url"]').value.trim();
      const isVideo = mEl.querySelector('[data-field="isVideo"]').checked;
      if (url) mediaItems.push({ url, isVideo });
    });
    sections.push({ id, title, content, mediaItems });
  });
  return sections;
}

// Diff & Validation
function renderDiffAndValidation() {
  const diffC = $('diffContainer');
  const valC = $('validationContainer');
  const diffO = $('diffOutput');
  const diffSummary = $('diffSummary');
  const valList = $('validationList');

  const current = JSON.stringify(projects, null, 2);
  const baseline = JSON.stringify(originalProjects, null, 2);

  diffC.classList.remove('hidden');
  diffO.textContent = computeSimpleDiff(baseline, current);
  diffSummary.innerHTML = summarizeChanges(projects, originalProjects);

  const errors = validateProjects(projects);
  valC.classList.remove('hidden');
  valList.innerHTML = '';
  if (errors.length) {
    errors.forEach(err => {
      const li = document.createElement('li');
      li.textContent = err;
      li.className = 'text-red-700';
      valList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No validation errors found.';
    li.className = 'text-emerald-700';
    valList.appendChild(li);
  }
}
function computeSimpleDiff(a, b) {
  const aLines = a.split('\n'); const bLines = b.split('\n');
  const max = Math.max(aLines.length, bLines.length);
  let out = '';
  for (let i = 0; i < max; i++) {
    if (aLines[i] !== bLines[i]) out += `- ${aLines[i] || ''}\n+ ${bLines[i] || ''}\n`;
  }
  return out || 'No changes vs baseline.';
}
function summarizeChanges(curr, base) {
  const baseMap = new Map((base || []).map(p => [p.id, p]));
  const changed = (curr || []).filter(p => {
    const bp = baseMap.get(p.id);
    return bp && (bp.title !== p.title || bp.heroImage !== p.heroImage || bp.isHidden !== p.isHidden);
  });
  return `<div class="text-gray-700">
    <div>Total projects: ${(curr || []).length} (baseline: ${(base || []).length})</div>
    <div>Changed projects: ${changed.length ? changed.map(c => c.title).join(', ') : 'none'}</div>
  </div>`;
}
function validateProjects(arr) {
  const errs = [];
  if (!Array.isArray(arr)) { errs.push('Root must be an array.'); return errs; }
  const ids = new Set();
  arr.forEach((p, idx) => {
    if (!p.id) errs.push(`Project[${idx}] missing id.`);
    else if (ids.has(p.id)) errs.push(`Duplicate project id: ${p.id}`); else ids.add(p.id);
    if (!p.title) errs.push(`Project[${idx}] missing title.`);
    if (typeof p.isHidden !== 'boolean') errs.push(`Project[${idx}] isHidden must be boolean.`);
    if (!p.caseStudy) errs.push(`Project[${idx}] missing caseStudy.`);
    else {
      const cs = p.caseStudy;
      if (!Array.isArray(cs.sections)) errs.push(`Project[${idx}] caseStudy.sections must be array.`);
      const secIds = new Set();
      (cs.sections || []).forEach((s, jdx) => {
        if (!s.id) errs.push(`Project[${idx}].sections[${jdx}] missing id.`);
        else if (secIds.has(s.id)) errs.push(`Project[${idx}] duplicate section id: ${s.id}`); else secIds.add(s.id);
        if (!s.title) errs.push(`Project[${idx}].sections[${jdx}] missing title.`);
        if (!Array.isArray(s.mediaItems)) errs.push(`Project[${idx}].sections[${jdx}] mediaItems must be array.`);
        (s.mediaItems || []).forEach((m, kdx) => {
          if (typeof m.url !== 'string' || !m.url.trim()) errs.push(`Project[${idx}].sections[${jdx}].mediaItems[${kdx}] url empty.`);
          if (typeof m.isVideo !== 'boolean') errs.push(`Project[${idx}].sections[${jdx}].mediaItems[${kdx}] isVideo must be boolean.`);
        });
      });
    }
  });
  return errs;
}
function highlightInvalidFields(errors) {
  document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  const mark = (selector) => document.querySelectorAll(selector).forEach(el => el.classList.add('invalid'));
  errors.forEach(e => {
    if (e.includes('missing title') && selectedIndex >= 0) mark('#proj_title');
    if (e.includes('url empty')) mark('[data-field="url"]');
    if (e.includes('missing id') || e.includes('duplicate section id')) mark('[data-field="id"]');
  });
}

// Preview functions
function updateHeroPreview() {
  const url = $('proj_heroImage').value.trim();
  const img = $('heroPreview');
  const thumb = $('projectPreviewThumb');
  if (url) {
    img.src = url; img.classList.remove('hidden');
    if (thumb) { thumb.src = url; thumb.classList.remove('hidden'); }
  } else {
    img.classList.add('hidden');
    if (thumb) thumb.classList.add('hidden');
  }
}
function updateProjectHeaderPreview() {
  const title = $('proj_title').value.trim() || '—';
  const cat = $('proj_category').value.trim() || '—';
  const year = $('proj_year').value.trim() || '—';
  $('projectPreviewTitle').textContent = title;
  $('projectPreviewBadge').textContent = `${cat} • ${year}`;
}

// Accent color preview logic
function isHexColor(str) { return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(str.trim()); }
function extractHexFromArbitrary(str) {
  const m = (str || '').trim().match(/^bg-\[#([0-9a-f]{3}|[0-9a-f]{6})\]$/i);
  return m ? `#${m[1]}` : null;
}
function updateAccentPreview() {
  const preset = $('accentPreset')?.value?.trim() || '';
  const custom = $('proj_accentColor')?.value?.trim() || '';
  const picker = $('accentColorPicker')?.value || '';
  const badge = $('accentBadgePreview');
  const swatch = $('accentSwatch');

  let displayHex = '';
  let tailwindClass = '';

  if (preset && !preset.startsWith('#')) {
    tailwindClass = preset;
  } else if (isHexColor(custom)) {
    displayHex = custom;
  } else {
    const extracted = extractHexFromArbitrary(custom);
    if (extracted) {
      displayHex = extracted;
    } else if (isHexColor(picker)) {
      displayHex = picker;
    } else if (custom && !custom.startsWith('#')) {
      tailwindClass = custom;
    } else {
      tailwindClass = 'bg-indigo-600';
      displayHex = '';
    }
  }

  if (badge) {
    badge.className = `badge-preview ${tailwindClass || ''}`.trim();
    if (displayHex) {
      badge.style.backgroundColor = displayHex;
      badge.style.color = '#ffffff';
    } else {
      badge.style.backgroundColor = '';
      badge.style.color = '#ffffff';
    }
  }
  if (swatch) {
    swatch.style.backgroundColor = displayHex || '';
    swatch.className = `accent-swatch`.trim();
  }
}

// Bind events
function bindEvents() {
  $('loadProjectsBtn')?.addEventListener('click', loadProjects);
  $('importJsonBtn')?.addEventListener('click', () => $('importFileInput').click());
  $('importFileInput')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) importJsonFromFile(file);
    e.target.value = '';
  });
  $('exportJsonBtn')?.addEventListener('click', exportJson);
  $('exportBackupBtn')?.addEventListener('click', exportBackup);
  $('saveToServerBtn')?.addEventListener('click', saveToServer);
  $('newProjectBtn')?.addEventListener('click', newProject);
  $('applyChangesBtn')?.addEventListener('click', applyChanges);
  $('discardChangesBtn')?.addEventListener('click', discardChanges);
  $('duplicateProjectBtn')?.addEventListener('click', () => {
    if (selectedIndex < 0) { toast('No project selected.'); return; }
    duplicateProject(selectedIndex);
  });
  $('deleteProjectBtn')?.addEventListener('click', (e) => {
    const pid = e.currentTarget.dataset.deleteProjectId;
    deleteProjectById(pid);
  });

  // Preview updates
  $('proj_title')?.addEventListener('input', updateProjectHeaderPreview);
  $('proj_category')?.addEventListener('input', updateProjectHeaderPreview);
  $('proj_year')?.addEventListener('input', updateProjectHeaderPreview);
  $('proj_heroImage')?.addEventListener('input', updateHeroPreview);

  // Accent color interactions
  $('accentPreset')?.addEventListener('change', () => {
    const val = $('accentPreset').value;
    if (val) { $('proj_accentColor').value = val; }
    updateAccentPreview();
  });
  $('proj_accentColor')?.addEventListener('input', updateAccentPreview);
  $('accentColorPicker')?.addEventListener('input', () => {
    const hex = $('accentColorPicker').value;
    $('proj_accentColor').value = hex;
    updateAccentPreview();
  });

  // Media inline preview live updates
  document.addEventListener('input', (e) => {
    const urlInput = e.target.closest('input[data-field="url"]');
    const isVideoToggle = e.target.closest('input[data-field="isVideo"]');
    if (urlInput || isVideoToggle) {
      const card = (urlInput || isVideoToggle).closest('.media-item-card');
      if (!card) return;
      const url = card.querySelector('input[data-field="url"]')?.value.trim() || '';
      const isVideo = card.querySelector('input[data-field="isVideo"]')?.checked || false;
      const preview = card.querySelector('div[id*="media-preview"]');
      renderMediaPreview(preview, url, isVideo);
    }
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'preview') {
      const card = btn.closest('.media-item-card');
      const url = card.querySelector('[data-field="url"]').value.trim();
      if (!url) { toast('No URL to preview.'); return; }
      window.open(url, '_blank', 'noopener');
    } else if (action === 'delete') {
      const card = btn.closest('.media-item-card');
      card.remove();
    }
  });

  // Section add
  $('addSectionBtn')?.addEventListener('click', () => {
    const container = $('sectionsContainer');
    const idx = container.children.length;
    container.appendChild(sectionEditor({
      id: generateSectionId('Section', idx + 1),
      title: `${String(idx + 1).padStart(2, '0')}. Section`,
      content: '',
      mediaItems: []
    }, idx));
    container.lastElementChild?.querySelector('[data-field="title"]')?.focus();
  });

  // ID generation helpers
  $('genProjIdBtn')?.addEventListener('click', () => {
    const title = $('proj_title').value.trim();
    $('proj_id').value = generateProjectId(title);
  });
  $('genSectionIdsBtn')?.addEventListener('click', () => {
    document.querySelectorAll('#sectionsContainer .card.section-card').forEach((secEl, idx) => {
      const titleInput = secEl.querySelector('[data-field="title"]');
      const idInput = secEl.querySelector('[data-field="id"]');
      idInput.value = generateSectionId(titleInput.value, idx + 1);
    });
  });

  // Load draft if present
  const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (draft) {
    try {
      const data = JSON.parse(draft);
      projects = deepClone(data);
      originalProjects = deepClone(data);
      renderProjectsList();
    } catch (err) {
      console.warn('Failed to parse draft', err);
    }
  }
}

document.addEventListener('DOMContentLoaded', bindEvents);

// Inline media preview rendering
function renderMediaPreview(container, url, isVideo) {
  if (!container) return;
  if (!url) { container.innerHTML = ''; return; }
  if (isVideo) {
    container.innerHTML = `
      <div class="preview-video-container shadow-2xl transition duration-300 hover:scale-[1.005]">
        <iframe src="${url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `;
  } else {
    container.innerHTML = `
      <img src="${url}" alt="Media preview" class="preview-image-lg shadow-2xl transition duration-300 hover:scale-[1.005]" />
    `;
  }
}

// Initialize media previews
function initializeAllMediaPreviews() {
  document.querySelectorAll('#sectionsContainer .media-item-card').forEach(card => {
    const url = card.querySelector('input[data-field="url"]')?.value.trim() || '';
    const isVideo = card.querySelector('input[data-field="isVideo"]')?.checked || false;
    const preview = card.querySelector('div[id*="media-preview"]');
    renderMediaPreview(preview, url, isVideo);
  });
}

// Minimal Markdown renderer
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
function renderMarkdown(md) {
  if (!md) return '';
  md = md.replace(/\r\n/g, '\n');
  let out = escapeHtml(md);
  out = out.replace(/^(#{3})\s+(.*)$/gm, '<h3 class="font-semibold mt-3 mb-2">$2</h3>');
  out = out.replace(/^(#{2})\s+(.*)$/gm, '<h2 class="font-bold mt-3 mb-2 text-lg">$2</h2>');
  out = out.replace(/^(#{1})\s+(.*)$/gm, '<h1 class="font-bold mt-3 mb-2 text-xl">$2</h1>');
  out = out.replace(/(^\d+\.\s+.*(\n(?!\n).*)*)/gm, (block) => {
    const items = block.split('\n').map(line => {
      const m = line.match(/^\d+\.\s+(.*)$/);
      return m ? `<li>${m[1]}</li>` : '';
    }).join('');
    return `<ol class="list-decimal ml-6 my-2">${items}</ol>`;
  });
  out = out.replace(/(^[-*]\s+.*(\n(?!\n).*)*)/gm, (block) => {
    const items = block.split('\n').map(line => {
      const m = line.match(/^[-*]\s+(.*)$/);
      return m ? `<li>${m[1]}</li>` : '';
    }).join('');
    return `<ul class="list-disc ml-6 my-2">${items}</ul>`;
  });
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>');
  out = out.replace(/`([^`]+?)`/g, '<code class="px-1 py-0.5 rounded bg-gray-100">$1</code>');
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-indigo-600 hover:underline">$1</a>');
  out = out.split(/\n{2,}/).map(chunk => {
    if (/^\s*<(h\d|ol|ul)/.test(chunk)) return chunk;
    const lines = chunk.split('\n').filter(l => l.trim().length > 0);
    return lines.length ? `<p class="my-2 text-gray-700">${lines.join('<br/>')}</p>` : '';
  }).join('\n');
  return out;
}