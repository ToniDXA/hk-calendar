# 離線 PWA 更新檔

把本 ZIP 解壓後，將以下檔案上傳／覆蓋至你的 hk-calendar repo：
- package.json
- vite.config.js
- index.html
- src/main.jsx

不要刪除現有 src/App.jsx、src/components、src/hooks、src/utils、src/index.css 或 public icon / holidays.json。

之後 GitHub Actions 需要重新執行 npm install 和 npm run build，才會安裝 vite-plugin-pwa 並產生 Service Worker。

iPhone/iPad 測試：在線開啟網站至少 20 秒、重新整理一次、加入主畫面；再在飛航模式下由主畫面圖示開啟。
