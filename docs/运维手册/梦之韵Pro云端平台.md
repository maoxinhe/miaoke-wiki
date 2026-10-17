---
title: 梦之韵Pro云端平台 · 运维
---

# 梦之韵 Pro 云端平台 · 运维知识

> 本文档为「梦之韵 Pro 云端平台（Cloudflare Worker API）」的运维与部署规范，归档于团队 wiki「运维手册」板块。**所有密钥、Token 一律使用占位符，真实值存放于私有配置**。

## 一、项目概览

- **项目名称**：梦之韵 Pro 云端平台（Cloudflare Worker API）
- **用途**：启动器更新检测/下载、整合包 API 反代、玩家数据与白名单快照、错误上报 AI 诊断、管理后台。
- **技术栈 / 依赖**：Cloudflare Workers + KV（wrangler）；智谱 GLM-4-flash（错误 AI 诊断）；GitHub REST API（白名单快照）；邮件/APIHZ；RCON（`rcon_bot.py`、`fc_rcon_executor.py`）。
- **负责人**：梦之韵团队 · 代运营（工号：`<你的工号>`）；故障应急见第六节。

## 二、运维注意事项

### 1. 运行环境

- **平台**：Cloudflare Workers（worker 名 `mzy-admin` / `mzy-api-worker`）。
- **域名**：`apc.camzy.uno`（下载/更新）、`fk.camzy.uno`（反馈）、`admin.camzy.uno`（后台）、`dll.camzy.uno`。
- **KV 命名空间**（见 `wrangler.toml`）：`API_KV`、`ADMIN_KV`、`FEEDBACK_KV`（id 以 `<KV_ID>` 占位）。
- **环境变量（密钥一律放私有配置，勿入仓库）**：`GITHUB_TOKEN=<GitHub令牌>`、`RCON_WEBHOOK_URL=<内网Webhook>`、`APIHZ_ID/APIHZ_KEY=<API密钥>`、智谱 token `<AI密钥>`（建议用 `wrangler secret put` 注入）。

### 2. 启动与停止

- 无本地进程，云端常驻；**无需启动/停止**，修改即部署。

### 3. 部署与发布

发布（更新 worker）：

```bash
cd mzy-cloud/梦之韵Pro-API平台-worker
wrangler deploy   # 用 wrangler.toml 绑定 KV 与 cron
```

- 敏感变量注入：`wrangler secret put GITHUB_TOKEN` 等（勿写死在 worker.js）。
- 回滚：用上一稳定版本 `worker.js` 重新 `wrangler deploy`（无版本回滚按钮时用 git 历史恢复后重发）。

### 4. 监控与告警

- **可观测性**：`wrangler.toml` 已开 `[observability] enabled=true`；CF 仪表盘看请求/错误/日志。
- **关键指标**：`/api/status`、`/update/latest` 可用性；KV 读写错误率；cron（每分钟，白名单快照等）执行状态。
- **告警**：CF 告警规则（限流/5xx）建议在仪表盘配置（待配置）。

### 5. 数据与存储

- **KV 前缀**：`dl:`（下载记录）、`fb:`（反馈）、`wla:`/`wl:snapshot:names`（白名单）、`lp:`、`sh:`（限时直链）、`clog:`（变更日志）。
- **容量治理**：`sh:` 保留最近 300 条、`clog:` 保留最近 500 条，超限自动清理（脚本内已实现）。
- **迁移/备份**：KV 无内建导出，建议定期 `wrangler kv key` 批量导出快照到外部存储（待配置）。

### 6. 安全红线

- **禁止在 worker.js 明文硬编码 token**（当前 `/error/report` 内有一处智谱 token 硬编码，**必须移入 env/secret**）。
- GitHub、APIHZ、RCON、AI 密钥一律走 env / `wrangler secret`，仓库只留占位符。
- 外发邮件/Webhook 地址属内网信息，用 `<内网地址>` 占位。
- **故障应急**：先看 CF 仪表盘异常 → 查日志 → 核对 KV 前缀 → 回滚 worker；紧急联系负责人。
