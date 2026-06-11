// Run: node tests/test_food_guide.js
const { FOOD_GUIDE, getFoodGuide } = require('../food-guide.js');
const { getTextureGuide } = require('../gemini.js');

let pass = 0, fail = 0;
function assert(condition, msg) {
  if (condition) { console.log(`  ✓ ${msg}`); pass++; }
  else { console.error(`  ✗ ${msg}`); fail++; }
}

// getFoodGuide: 各期の境界
assert(getFoodGuide(5).stage.includes('初期'),  'getFoodGuide(5) → 初期');
assert(getFoodGuide(6).stage.includes('初期'),  'getFoodGuide(6) → 初期');
assert(getFoodGuide(7).stage.includes('中期'),  'getFoodGuide(7) → 中期');
assert(getFoodGuide(9).stage.includes('後期'),  'getFoodGuide(9) → 後期');
assert(getFoodGuide(12).stage.includes('完了期'), 'getFoodGuide(12) → 完了期');
assert(getFoodGuide(24).stage.includes('完了期'), 'getFoodGuide(24) → 完了期');
assert(getFoodGuide(4) === null,  'getFoodGuide(4) → null（離乳食開始前）');
assert(getFoodGuide(100) === null, 'getFoodGuide(100) → null（範囲外）');

// 全期にok/ng/textureが定義されている
FOOD_GUIDE.forEach(g => {
  assert(g.ok.length > 0 && g.ng.length > 0 && g.texture, `${g.stage}: ok/ng/texture あり`);
});

// 初期のNGにはちみつ（乳児ボツリヌス症）が必ず含まれる
assert(getFoodGuide(5).ng.some(f => f.includes('はちみつ')), '初期NGに「はちみつ」が含まれる');

// getTextureGuide: 月齢境界
assert(getTextureGuide(5).includes('ペースト'),  'getTextureGuide(5) → ペースト状');
assert(getTextureGuide(6).includes('ペースト'),  'getTextureGuide(6) → ペースト状');
assert(getTextureGuide(7).includes('舌'),        'getTextureGuide(7) → 舌でつぶせる');
assert(getTextureGuide(9).includes('歯茎でつぶせる'), 'getTextureGuide(9) → 歯茎でつぶせる');
assert(getTextureGuide(12).includes('歯茎で噛める'),  'getTextureGuide(12) → 歯茎で噛める');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
