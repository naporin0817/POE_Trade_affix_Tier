# POE_Trade_affix_Tier

POE1 公式トレードサイト向けの **Tampermonkey スクリプト**です。  
affix を選んだあとに、対応する Tier 候補と数値レンジを行の近くへ表示し、Tier をクリックすると min/max へ値を自動入力します。

## 実装方針

- `https://jp.pathofexile.com/trade/search/*` と `https://www.pathofexile.com/trade/search/*` に対応します。
- Tampermonkey 上で動く単一ファイルの userscript として実装しています。
- 公式トレードサイトは JavaScript ベースの SPA なので、`MutationObserver` でフィルタ行の追加・更新を監視します。
- Tier データは初期版ではスクリプト内に内包しています。
- ページ上の stat 名は可能であれば `fetch('/api/trade/data/stats')` でも参照し、埋め込みデータとの照合を補助します。
- 複合 affix は「入力欄が順番で対応づけられる」ケースに限って自動入力します。

## できること

- affix 行を検出して Tier パネルを差し込む
- Tier ボタン押下で min/max 自動入力
- min/max 手入力時に一致する Tier をハイライト
- 日本語 UI / 英語 UI の主要 affix エイリアス照合
- 主要な単一レンジ affix と一部の複合 affix に初期対応

## 現時点の制限

- 公式トレードサイトの DOM は変更される可能性があるため、必要に応じて行検出ロジックの微調整が必要です。
- Tier データは初期シードのみです。全 affix 完全対応にはデータ拡充が必要です。
- ローカル mod や複雑なハイブリッド mod は、UI 上の入力欄と 1 対 1 / 1 対多で素直に対応づけられない場合があります。

## 使い方

1. Chrome に Tampermonkey をインストールします。
2. `poe-trade-affix-tier.user.js` を新規 userscript として貼り付けます。
3. `https://jp.pathofexile.com/trade/search/<league>` を開きます。
4. stat filter 行で affix を選ぶと、該当する Tier パネルがその行の下に表示されます。
5. Tier を押すと、その行の入力欄へ値が即反映されます。

## 今後の拡張候補

- affix データの JSON 外出し
- 武器 / 防具 / ジュエルごとのカテゴリ別データ整備
- trade stat ID と affix テーブルの対応表生成
- 行検出ロジックの専用セレクタ化
