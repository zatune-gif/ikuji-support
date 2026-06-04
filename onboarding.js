function obToggleHelp(id) {
  const box = document.getElementById(id);
  box.classList.toggle('hidden');
}

function obGoStep(step) {
  document.querySelectorAll('.ob-step').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.ob-dot').forEach(el => el.classList.remove('active', 'done'));
  document.getElementById(`ob-step-${step}`).classList.add('active');

  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`ob-dot-${i}`);
    if (i < step) dot.classList.add('done');
    else if (i === step) dot.classList.add('active');
  }
}

function obStep2Next() {
  const keyInput = document.getElementById('ob-api-key-input');
  const errorEl = document.getElementById('ob-api-key-error');
  const val = keyInput.value.trim();

  if (val.length < 10) {
    errorEl.classList.remove('hidden');
    keyInput.focus();
    return;
  }
  errorEl.classList.add('hidden');
  storageSave(STORAGE_KEYS.API_KEY, val);
  obGoStep(3);
}

function obStep3Complete() {
  const birthdateInput = document.getElementById('ob-birthdate-input');
  const errorEl = document.getElementById('ob-birthdate-error');

  if (!birthdateInput.value) {
    errorEl.classList.remove('hidden');
    birthdateInput.focus();
    return;
  }
  errorEl.classList.add('hidden');

  storageSave(STORAGE_KEYS.BIRTHDATE, birthdateInput.value);
  const name = document.getElementById('ob-name-input').value.trim();
  if (name) storageSave(STORAGE_KEYS.NAME, name);

  // 設定タブのUIに反映
  document.getElementById('api-key-input').value   = storageLoad(STORAGE_KEYS.API_KEY)   || '';
  document.getElementById('birthdate-input').value = storageLoad(STORAGE_KEYS.BIRTHDATE) || '';
  document.getElementById('name-input').value      = storageLoad(STORAGE_KEYS.NAME)      || '';

  document.getElementById('onboarding').classList.add('hidden');

  // 離乳食タブの月齢・アレルギー表示を更新
  renderRecipeAllergyDisplay();
}

function obCheckAndShow() {
  const apiKey = storageLoad(STORAGE_KEYS.API_KEY);
  if (!apiKey) {
    document.getElementById('onboarding').classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', obCheckAndShow);
