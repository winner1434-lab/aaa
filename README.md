# DQ RMS MVP (NestJS + React + PostgreSQL + Python Crawler)

此專案根據 `DQ-RMS-PRD-2025002 V2.0` 建立 MVP 基礎版本，包含：

- `apps/api`: NestJS API（JWT + TOTP、事件觸發關房、手動覆蓋、PMS 同步、Audit Log）
- `apps/web`: React 前端（登入、結果列表、手動調整與同步）
- `services/crawler`: Python 爬蟲微服務（排程、重試、寫入 events）
- `infra/sql/schema.sql`: PostgreSQL 資料表設計

## 快速啟動

### 1) API

```bash
cd apps/api
npm install
npm run start:dev
```

API 預設：`http://localhost:3000`

### 2) Web

```bash
cd apps/web
npm install
npm run dev
```

Web 預設：`http://localhost:5173`

### 3) Crawler

```bash
cd services/crawler
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py --once
```


## 前端試玩功能

`apps/web` 已提供可互動 Demo，直接可在頁面操作：

- 免安裝版本：直接開啟 `apps/web/playground.html`
- Demo 登入（JWT 顯示）
- 新增事件並觸發 HIGH 事件自動關房
- 手動覆蓋指定日期/房型價格與房況
- 模擬 PMS 同步成功/失敗
- 檢視事件清單與 Audit Logs

## 功能對照（節錄）

- FR-01/02/03：登入、JWT、TOTP 設定/重置、角色隔離
- FR-04/05：房價查詢補漏與強制重抓（以 PMS adapter stub 模擬）
- FR-06~09：事件寫入、距離判定、高影響事件自動關房、通知 stub
- FR-13/14/15：結果檢視、手動覆蓋、PMS 同步結果與 audit log

> 注意：目前為 MVP skeleton，PMS 與通知為可替換 adapter，方便後續串接真實服務。
