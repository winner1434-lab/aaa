# Demo Playground（已接上 GitHub Pages 自動部署）

這個專案已設定好 GitHub Pages 工作流程：只要把目前分支推到 GitHub，就會自動部署，產生可分享連結。

## 分享連結（部署後）

- 主連結：`https://<你的 GitHub 帳號>.github.io/<你的 repo 名稱>/`
- Demo 頁面：`https://<你的 GitHub 帳號>.github.io/<你的 repo 名稱>/playground.html`

## 已完成的部署設定

- 新增 GitHub Actions：`.github/workflows/deploy-pages.yml`
- Pages 發佈來源：`apps/web`
- `apps/web/index.html` 會自動導向到 `playground.html`

