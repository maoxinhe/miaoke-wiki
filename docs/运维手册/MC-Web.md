---
title: MC Web · 运维
---

# MC Web 网页版 Minecraft · 运维知识

> 本文档为「MC Web（mc.web.camzy.tech）」的运维与部署规范，归档于团队 wiki「运维手册」板块。**所有密钥、Token 一律使用占位符，真实值存放于私有配置**。

## 一、项目概览

- **项目名称**：MC Web（`mc.web.camzy.tech`）
- **用途**：浏览器直接游玩的 Java 版 Minecraft 1.12.2 网页客户端（Eaglercraft 1.12.2，单文件自包含），单机可玩。
- **技术栈**：单文件 `index.html`（JS/WASM 编译，约 20MB）；部署于 GitHub Pages；域名 `mc.web.camzy.tech`（CNAME → `maoxinhe.github.io`）；DNS 托管于腾讯云（camzy.tech）；前端套腾讯 EdgeOne WAF（人机验证）。无数据库、无后端服务，世界存档存于浏览器 IndexedDB。
- **负责人**：猫星河（GitHub：maoxinhe）。

## 二、运维注意事项

### 1. 运行环境

- **托管**：GitHub Pages（公开仓库 `maoxinhe/mc-web`，`main` 分支 `/` 根目录）。
- **域名**：`mc.web.camzy.tech` → CNAME → `maoxinhe.github.io`（A 记录备选：185.199.108~111.153）。
- **密钥/凭据**：腾讯云 DNS API 密钥、GitHub/Cloudflare token 一律存于 `<私有配置>`，禁明文入库/文档。
- **无环境变量清单**（纯静态托管）。

### 2. 启动 / 停止 / 重启

- 无常驻进程，无需手动启动；变更即时生效。

### 3. 部署与发布

```bash
# 修改客户端（如加载屏、服务器列表）后：
cd /path/to/mc-web
git add index.html
git commit -m "描述"
git push
```

- Pages 自动重建（约 1 分钟），无需构建命令。
- **回滚**：`git revert <commit>` 或 `git reset` 后 push。
- **注意**：仓库根目录只保留 `index.html` + `CNAME` + `README.md`，禁止 push 临时文件（zip/tar 等）。

### 4. 监控与告警

- 无内置监控；以人工访问 `https://mc.web.camzy.tech/` 验证：加载屏是否显示、能否进主 UI、WAF 是否拦截。
- 构建日志：GitHub 仓库 → Actions 页；无应用日志。

### 5. 数据与存储

- 无服务端数据库/对象存储；玩家世界存各自浏览器 IndexedDB，换设备/清缓存即丢失。
- 客户端文件即 Git 仓库本身 = 天然备份。

### 6. 安全红线

- 密钥（腾讯云 DNS、GitHub、Cloudflare）只存私有配置，禁止明文。
- 改 DNS 前确认记录指向，勿覆盖既有服务。
- 联机若接入服务器，注意 Eaglercraft 的 EULA/版权灰区风险。
- 故障应急：联系负责人 猫星河（maoxinhe）。
