const STORAGE_KEYS = {
  API_KEY: 'ikuji_api_key',
  BIRTHDATE: 'ikuji_birthdate',
  NAME: 'ikuji_name',
  ALLERGIES: 'ikuji_allergies',
  VACCINATION_DONE: 'ikuji_vaccination_done',
};

function storageSave(key, value) {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch {
    console.error(`storage: save failed for key "${key}"`);
  }
}

function storageLoad(key, defaultValue = null) {
  const item = localStorage.getItem(key);
  if (item === null) return defaultValue;
  try { return JSON.parse(item); } catch { return item; }
}

function storageClearAll() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
}
