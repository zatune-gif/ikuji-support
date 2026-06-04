// ===== アレルギーリスト（設定タブのローカル状態） =====
let allergies = [];

// ===== タブ切り替え =====
function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tabId}`).classList.add('active');
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  if (tabId === 'vaccine') renderVaccineTab();
  if (tabId === 'recipe') renderRecipeAllergyDisplay();
}

document.querySelectorAll('.tab-btn').forEach(btn =>
  btn.addEventListener('click', () => switchTab(btn.dataset.tab))
);

// ===== 設定タブ =====
function renderAllergyChips() {
  document.getElementById('allergy-chip-list').innerHTML = allergies.map((a, i) => `
    <span class="allergy-chip">
      ${a}
      <button onclick="removeAllergy(${i})" aria-label="${a}を削除">×</button>
    </span>
  `).join('');
}

function removeAllergy(index) {
  allergies.splice(index, 1);
  renderAllergyChips();
}

function initSettingsTab() {
  const apiKeyInput     = document.getElementById('api-key-input');
  const nameInput       = document.getElementById('name-input');
  const birthdateInput  = document.getElementById('birthdate-input');
  const allergyNewInput = document.getElementById('allergy-new-input');

  apiKeyInput.value    = storageLoad(STORAGE_KEYS.API_KEY) || '';
  nameInput.value      = storageLoad(STORAGE_KEYS.NAME) || '';
  birthdateInput.value = storageLoad(STORAGE_KEYS.BIRTHDATE) || '';
  allergies            = storageLoad(STORAGE_KEYS.ALLERGIES, []);
  renderAllergyChips();

  function addAllergy() {
    const val = allergyNewInput.value.trim();
    if (val && !allergies.includes(val)) {
      allergies.push(val);
      allergyNewInput.value = '';
      renderAllergyChips();
    }
  }

  document.getElementById('allergy-add-btn').addEventListener('click', addAllergy);
  allergyNewInput.addEventListener('keydown', e => { if (e.key === 'Enter') addAllergy(); });

  document.getElementById('save-settings-btn').addEventListener('click', () => {
    storageSave(STORAGE_KEYS.API_KEY,   apiKeyInput.value.trim());
    storageSave(STORAGE_KEYS.NAME,      nameInput.value.trim());
    storageSave(STORAGE_KEYS.BIRTHDATE, birthdateInput.value);
    storageSave(STORAGE_KEYS.ALLERGIES, allergies);
    alert('設定を保存しました');
    renderRecipeAllergyDisplay();
  });

  document.getElementById('clear-all-btn').addEventListener('click', () => {
    if (!confirm('すべてのデータを削除します。よろしいですか？')) return;
    storageClearAll();
    apiKeyInput.value = '';
    nameInput.value = '';
    birthdateInput.value = '';
    allergies = [];
    renderAllergyChips();
    alert('データを削除しました');
  });
}

// ===== 離乳食タブ：アレルギー表示・月齢自動セット =====
function renderRecipeAllergyDisplay() {
  const saved = storageLoad(STORAGE_KEYS.ALLERGIES, []);
  const el = document.getElementById('recipe-allergy-display');
  el.innerHTML = saved.length === 0
    ? '<span style="color:var(--text-muted);font-size:13px">なし</span>'
    : saved.map(a => `<span class="allergy-chip">${a}</span>`).join('');

  const birthdate = storageLoad(STORAGE_KEYS.BIRTHDATE);
  if (birthdate) {
    const ageInput = document.getElementById('age-input');
    if (!ageInput.value) ageInput.value = getMonthsAge(birthdate);
  }
}

// ===== 離乳食タブ =====
function initRecipeTab() {
  document.getElementById('generate-btn').addEventListener('click', async () => {
    const apiKey      = storageLoad(STORAGE_KEYS.API_KEY);
    const ageInput    = document.getElementById('age-input');
    const ingInput    = document.getElementById('ingredients-input');
    const loadingEl   = document.getElementById('loading');
    const errorEl     = document.getElementById('error-msg');
    const resultEl    = document.getElementById('recipe-result');
    const generateBtn = document.getElementById('generate-btn');

    errorEl.classList.add('hidden');
    resultEl.classList.add('hidden');

    if (!apiKey) {
      errorEl.textContent = 'APIキーが設定されていません。設定タブで登録してください。';
      errorEl.classList.remove('hidden');
      return;
    }
    if (!ageInput.value) {
      errorEl.textContent = '月齢を入力してください。';
      errorEl.classList.remove('hidden');
      return;
    }
    if (!ingInput.value.trim()) {
      errorEl.textContent = '使える食材を入力してください。';
      errorEl.classList.remove('hidden');
      return;
    }

    generateBtn.disabled = true;
    loadingEl.classList.remove('hidden');

    try {
      const recipe = await generateRecipe({
        apiKey,
        ageMonths:   parseInt(ageInput.value),
        ingredients: ingInput.value.trim(),
        allergies:   storageLoad(STORAGE_KEYS.ALLERGIES, []),
      });
      resultEl.textContent = recipe;
      resultEl.classList.remove('hidden');
    } catch (err) {
      errorEl.textContent = `エラー: ${err.message}`;
      errorEl.classList.remove('hidden');
    } finally {
      loadingEl.classList.add('hidden');
      generateBtn.disabled = false;
    }
  });
}

// ===== 予防接種タブ =====
function renderVaccineTab() {
  const birthdate      = storageLoad(STORAGE_KEYS.BIRTHDATE);
  const noBirthdateEl  = document.getElementById('vaccine-no-birthdate');
  const listEl         = document.getElementById('vaccine-list');

  if (!birthdate) {
    noBirthdateEl.classList.remove('hidden');
    listEl.innerHTML = '';
    return;
  }
  noBirthdateEl.classList.add('hidden');

  const done     = storageLoad(STORAGE_KEYS.VACCINATION_DONE, []);
  const schedule = calculateSchedule(birthdate);

  listEl.innerHTML = schedule.map(v => {
    const isDone      = done.includes(v.id);
    const isUpcoming  = v.isUpcoming && !isDone;
    const classes     = ['vaccine-item', isDone ? 'done' : '', isUpcoming ? 'upcoming' : '']
      .filter(Boolean).join(' ');

    return `
      <div class="${classes}">
        <input type="checkbox" id="v-${v.id}" ${isDone ? 'checked' : ''}
          onchange="toggleVaccineDone('${v.id}', this.checked)">
        <div class="vaccine-info">
          <div class="vaccine-name">${v.name}</div>
          ${v.note ? `<div class="vaccine-note">${v.note}</div>` : ''}
          <div class="vaccine-dates">${v.startDateStr} 〜 ${v.endDateStr}</div>
        </div>
        ${isUpcoming ? '<span class="badge-upcoming">接種時期</span>' : ''}
      </div>
    `;
  }).join('');
}

function toggleVaccineDone(id, checked) {
  let done = storageLoad(STORAGE_KEYS.VACCINATION_DONE, []);
  done = checked ? [...new Set([...done, id])] : done.filter(d => d !== id);
  storageSave(STORAGE_KEYS.VACCINATION_DONE, done);
  renderVaccineTab();
}

// ===== 初期化 =====
function init() {
  initSettingsTab();
  initRecipeTab();
  renderRecipeAllergyDisplay();
}

document.addEventListener('DOMContentLoaded', init);
