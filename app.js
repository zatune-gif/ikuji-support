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

// ===== 初期化 =====
function init() {
  initSettingsTab();
  renderRecipeAllergyDisplay();
}

document.addEventListener('DOMContentLoaded', init);
