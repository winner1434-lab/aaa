# Minimal Playground

如果你之前「無法啟動」，請直接用這個一鍵指令：

```bash
./scripts/start.sh
```

預設網址：

```text
http://127.0.0.1:8000/apps/web/playground.html
```

## 可選：指定 port

```bash
./scripts/start.sh 9000
```

對應網址：

```text
http://127.0.0.1:9000/apps/web/playground.html
```

## 排錯

- 若出現「Permission denied」：先執行 `chmod +x scripts/start.sh`
- 若 8000 被占用：改用 `./scripts/start.sh 9000`
- 若找不到 python：先安裝 Python 3
