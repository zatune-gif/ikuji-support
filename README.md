# 育児サポートアプリ

離乳食レシピAI提案と予防接種スケジュール管理を行うWebアプリ。

## 機能

- **離乳食レシピ** — 月齢・食材・アレルギーを入力するとAIがレシピを提案。月齢に応じた食感・固さを自動判断
- **食材ガイド** — 月齢ごとに使える食材・避ける食材を表示
- **予防接種スケジュール** — 生年月日から厚労省標準スケジュールに基づく接種日程を自動計算
- **接種記録** — 済チェックでlocalStorageに記録

## 使い方

1. `⚙️ 設定` タブで以下を入力して「保存する」
   - Gemini APIキー（[Google AI Studio](https://aistudio.google.com) で取得）
   - 赤ちゃんの生年月日
   - アレルギー除外食材（任意）
2. `🍼 離乳食` タブで月齢・食材を選択して「レシピを作る」
3. `💉 予防接種` タブで接種スケジュールを確認

## Gemini APIキーの取得

> **💡 初期設定はPCで行うことを推奨します。**  
> Google AI Studio（aistudio.google.com）はPC向けのサイトのため、スマホでの操作は手間がかかります。  
> APIキーをPCで取得・確認しておき、スマホのアプリ設定タブに貼り付けるのがスムーズです。

1. PC で [https://aistudio.google.com](https://aistudio.google.com) にアクセス
2. 左メニュー「Get API key」→「Create API key」
3. 発行されたキー（`AIza...`）をコピーしてメモアプリ等に保存
4. アプリの設定タブを開き、APIキー欄に貼り付けて「保存する」

### スマホで使う場合の注意

アプリの設定（APIキー・生年月日・アレルギー）は**ブラウザのlocalStorage**に保存されます。  
これはデバイスごとに独立しているため、**同じGoogleアカウントでログインしても設定は共有されません。**

スマホで使い始める場合は、設定タブで改めて入力が必要です。  
APIキーは [Google AI Studio](https://aistudio.google.com) にログインすれば同じGoogleアカウントでいつでも確認できます。

## ⚠️ APIレート制限について

本アプリはユーザー自身のGemini APIキーを使用します。  
Google AI Studioの**無料枠**では以下の制限があります：

| モデル | RPM（分あたり） | RPD（日あたり） |
|---|---|---|
| Gemini 2.5 Flash | 5回 | **20回** |

1日20回を超えるとエラーになります。  
制限を超えた場合は翌日リセットされるまでお待ちください。

制限を増やしたい場合は [Google AI Studio](https://aistudio.google.com) でお支払い情報を設定すると従量制の有料枠が利用できます（使った分のみ課金）。

## 技術スタック

- HTML / CSS / Vanilla JavaScript（フレームワークなし）
- [Gemini API](https://ai.google.dev/) (gemini-2.5-flash)
- localStorage（データ保存）
- GitHub Pages（ホスティング）
