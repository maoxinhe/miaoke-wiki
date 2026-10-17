---
title: 梦之韵Pro · 运维
---

# 梦之韵Pro · 运维知识

> 本文档为「梦之韵Pro」（Minecraft 服务器专属启动器 + 云端服务）的运维与部署规范，归档于团队 wiki「运维手册」板块。**所有密钥、Token 一律使用占位符，真实值存放于私有配置**。

## 一、项目概览

- **项目名称**：梦之韵Pro
- **用途**：Minecraft 1.21.1 服务器（入口 `remv.top:11111`）的专属启动器 + 云端服务。
- **一句话**：为服务器玩家提供 HMCL 基底的自研启动器，配套云端 API 与自动构建发布链。
- **技术栈 / 依赖**：
  - 启动器：HMCL 开发版（Java/Kotlin，Gradle 构建，产出 exe）
  - 云端 API：Cloudflare Worker（JavaScript）+ Cloudflare KV
  - AI 大脑：智谱 GLM `glm-4-flash`（免费模型）
  - 自动构建：GitHub Actions（windows-latest runner）
  - 官网：GitHub Pages（`www.camzy.tech`）；API 域名 `apc.camzy.uno`
- **负责人**：maoxinhe（主开发者）。

## 二、运维注意事项

### 1. 运行环境

- **Cloudflare Worker**：`mzy-api-worker`（部署于 `apc.camzy.uno`）。
- **KV namespace**：`5c3d5bfc...`（存版本号、卡密、工单等）。
- **环境变量**（密钥一律存私有配置/Secret，禁止明文）：

| 变量 | 用途 |
| --- | --- |
| `<CF_API_TOKEN>` | Cloudflare 部署 / KV 操作 |
| `<GITHUB_TOKEN>` | GitHub 构建 / Release |
| `<ZHIPU_KEY>` | 智谱 AI 调用 |
| `<ADMIN_TOKEN>` | 管理接口鉴权 |
| `<MZY_PFX_PASSWORD>` | 启动器签名证书密码 |

### 2. 启动与停止

- Cloudflare Worker 无传统进程，改代码即热更新：

```bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/<CF_ACCOUNT_ID>/workers/scripts/mzy-api-worker" \
  -H "Authorization: Bearer <CF_API_TOKEN>" \
  -F "worker.js=@worker.js;type=application/javascript+module" \
  -F "metadata=@metadata.json;type=application/json"
```

### 3. 部署与发布

- **启动器发布流程**（必须按序，不许跳步）：

```plaintext
exe → 签名(自签证书,发行商"苏州梦之韵科技") → 改名(MZY-Pro_打包日期_架构_版本.exe)
→ 版本号写云端KV → 下放GitHub/OneDrive → 云端推送更新给玩家
```

- **自动构建**：源码 push 到 `mzy-pro-source` 的 `hmcl-dev` 分支 → GitHub Actions 自动编译、签名、改名、发 Release、写 KV。
- **回滚**：恢复 KV `latest_version` 为旧版本号，或重发对应版本 Release。

### 4. 监控与告警

- **关键指标**：`/api/status`（在线人数/状态）、`/api/ping`（存活）、版本号 KV 与本地是否一致。
- **日志**：Cloudflare dashboard → Workers → 对应 Worker 的 Logs；命令 `wrangler tail mzy-api-worker`。
- **错误上报**：启动器调 `/error/report`，日志存 KV `sh:*`。

### 5. 数据与存储

- **KV 数据**：`latest_version`（版本）、`code:*`（卡密）、`dl:*`（下载统计）、`tkt:*`（工单）、`fb:*`（反馈）。
- **备份**：KV 全量导出（list + get）到 JSON 存档；卡密数据谨慎，勿丢失。
- **迁移**：更换 namespace 时需同步迁移全部业务 key。

### 6. 安全红线

- 所有密钥/Token 只存私有配置，禁止写入代码、文档、聊天明文。
- 管理接口（`/api/codes`、`/api/feedback`、`/api/tickets` GET 等）必须带 `Bearer <ADMIN_TOKEN>`。
- 版本号以云端 KV 为唯一权威，启动器只上报本地版本，不做本地强制判断。
- 禁止改动已废弃接口（`/api/checkin`、`/api/cmd/*`）。
- 故障应急：联系负责人 maoxinhe。
