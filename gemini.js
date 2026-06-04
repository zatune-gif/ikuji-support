const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function getTextureGuide(months) {
  if (months <= 6)  return 'なめらかなペースト状（トロトロ）';
  if (months <= 8)  return '舌でつぶせる固さ（豆腐くらい）';
  if (months <= 11) return '歯茎でつぶせる固さ（バナナくらい）';
  return '歯茎で噛める固さ（軟飯くらい）';
}

async function generateRecipe({ apiKey, ageMonths, ingredients, allergies }) {
  const allergyText = allergies && allergies.length > 0
    ? allergies.join('、') : 'なし';

  const prompt = `あなたは離乳食の専門家です。以下の条件で離乳食レシピを1品提案してください。

赤ちゃんの月齢: ${ageMonths}ヶ月
使用できる食材: ${ingredients}
アレルギー・除外食材: ${allergyText}
この月齢の食感・固さの目安: ${getTextureGuide(ageMonths)}

以下の形式で正確に答えてください：

【レシピ名】
（レシピ名をここに）

【材料（赤ちゃん1食分）】
（材料を箇条書きで）

【作り方】
（手順を番号付きで）

【この月齢のポイント】
（注意点を1〜2文で）`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `APIエラー: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('APIから回答を取得できませんでした');
    return text;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('タイムアウト：30秒以内に応答がありませんでした');
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
