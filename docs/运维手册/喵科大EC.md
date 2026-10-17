---
title: 喵科大EC · 运维
---

# 喵科大EC · 运维知识

> 本文档为「喵科大EC 便携浏览器」的运维与发布规范。**所有密钥、Token 一律使用占位符，真实值存放于私有配置**。

## 一、项目概览

- **项目名称**：喵科大EC 便携浏览器
- **用途**：基于 Chromium 内核的免安装便携浏览器，支持 U 盘即开即用、云端账号配置同步、版本自动检测。
- **一句话说明**：把浏览器装进口袋，到哪台电脑都是你的浏览环境。
- **技术栈**：Electron 31 + Chromium（前端/壳）、Cloudflare Worker + KV（云端 API）、Node.js（构建/工具）。
- **第三方服务**：Cloudflare（Worker/KV/DNS）、GitHub（源码/CI/Release）。
- **代码仓库**：`maoxinhe/miaokeda-ec`
- **主要负责人**：猫星河（运维/开发）。

## 二、运维注意事项

### 1. 运行环境

| 组件 | 环境 | 说明 |
| --- | --- | --- |
| 浏览器客户端 | Windows 10+ / Linux x64 | 免安装，双击运行 |
| 云端 API | Cloudflare Worker | 无服务器，无需运维主机 |
| 云端存储 | Cloudflare KV namespace: `MKEC_KV` | — |
| 本地开发 | Node.js 18+ | `wrangler dev` 本地调试 |

- **云端域名**：`https://api.mcy.camzy.uno`
- **本地调试端口**：`8788`（wrangler dev）
- **环境变量/密钥**（均为私有配置，禁止明文提交）：
  - `CLOUDFLARE_API_TOKEN`：`<你的 Cloudflare Token 在私有配置>`
  - `ADMIN_KEY`：`<云端管理密钥在私有配置>`（版本管理接口鉴权）
  - `MIAOKEDA_CLOUD_API`：可选，覆盖云端 API 地址（本地测试用）

### 2. 启动与停止

云端（Worker）无需手动启停，部署后自动运行。

本地调试云端：

```bash
# 启动本地 Worker（端口 8788）
npx wrangler dev --port 8788
# Ctrl+C 停止
```

本地运行浏览器：

```bash
npm start              # 正常模式
npm run start:portable # 便携模式（数据写入程序旁 data/）
```

### 3. 部署与发布

云端 API 部署：

```bash
npx wrangler deploy   # 部署 Worker 到生产
```

浏览器客户端发布（已自动化）：

1. 代码 push 到 `main` 分支 → GitHub Actions 自动构建 Windows exe + Linux AppImage。
2. 打 tag 触发 Release：`git tag v1.x.x && git push --tags`。
3. 发布后必须更新云端版本号（Admin Key 鉴权）：

```bash
# PUT /api/version，body: {"platform":"win","version":"1.x.x","url":"<下载地址>"}
```

**回滚**：Git revert 对应 commit 后重新 push；云端 Worker 支持版本回滚（Cloudflare 控制台 → Deployments）。

### 4. 监控与告警

- **健康检查**：`GET https://api.mcy.camzy.uno/api/health`
- **关键指标**：Worker 请求量/错误率（Cloudflare 仪表盘）、KV 读写延迟。
- **日志**：Cloudflare Worker 实时日志（`wrangler tail`）。
- **告警**：待核对（建议配置 Worker 错误率 > 5% 告警）。

### 5. 数据与存储

KV 数据结构：

| Key | 说明 |
| --- | --- |
| `user:<username>` | 用户信息（密码哈希、userid） |
| `token:<uuid>` | 登录 token（30 天有效） |
| `config:<userid>` | 用户云端配置 |
| `version:latest` | 最新版本号与下载地址 |

- **备份**：KV 数据通过 `wrangler kv key list` + `get` 导出备份，建议每月一次。
- **注意**：删除 KV namespace 会丢失全部用户数据，操作前必须确认。

### 6. 安全红线

- `ADMIN_KEY`、`CLOUDFLARE_API_TOKEN` 禁止写入代码、日志、聊天记录。
- 用户密码使用 PBKDF2 + SHA-256（10 万次迭代加盐）存储，禁止明文保存。
- 禁止在未授权情况下读取/修改其他用户的 KV 数据。
- 故障应急联系：猫星河。
