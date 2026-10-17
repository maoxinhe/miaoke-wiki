---
title: 喵科大SSO · 运维
---

# 喵科大 SSO 统一身份认证 · 运维知识

> 本文档为「喵科大 SSO（MZY SSO）」的运维与部署规范，归档于团队 wiki「运维手册」板块。**所有密钥、Token 一律使用占位符，真实值存放于私有配置**。

## 一、项目概览

- **项目名称**：喵科大 SSO（MZY SSO）
- **用途**：统一登录中心，所有站内应用共用一套账号体系，支持 OAuth2 授权码、密码登录、Microsoft 第三方登录。
- **技术栈**：
  - 运行时：Cloudflare Workers（无服务器，无主机）
  - 数据库：Cloudflare D1（SQLite）
  - 对象存储：Cloudflare R2（背景图、Logo）
  - 缓存/会话：Cloudflare KV
  - 第三方：Microsoft Graph OAuth、Resend 邮件服务
- **负责人**：maoxinhe。

## 二、运维注意事项

### 1. 运行环境

| 项目 | 值 |
| --- | --- |
| 域名 | `https://sso.camzy.uno` |
| Worker 名 | `mzy-sso` |
| D1 数据库 ID | `79056b56-…`（见私有配置） |
| R2 Bucket | `mzy-sso-assets` |
| KV 命名空间 | `SSO_KV` |

环境变量（全部为 Worker Secrets，禁止明文）：

```plaintext
TURNSTILE_SECRET     → <已停用，置空>
QQ_APPKEY            → <QQ 应用密钥>
RESEND_API_KEY       → <Resend API 密钥>
ADMIN_API_TOKEN      → <管理员 API Token>
JWT_SECRET           → <JWT 签名密钥>
MS_CLIENT_SECRET     → <Microsoft 应用密钥>
```

### 2. 部署与发布

Worker 通过 Cloudflare API 直接部署，无本地构建：

```bash
# 部署（multipart PUT）
PUT /accounts/<account_id>/workers/scripts/mzy-sso
Body: metadata.json + index.js
Authorization: Bearer <CF API Token>
```

**发布流程**：

1. 修改 `mzy_sso_worker.full.js`
2. `node --check mzy_sso_worker.full.js` 语法校验
3. PUT 到 Cloudflare Workers API
4. 线上验证 `/login` 返回 200

**回滚**：Cloudflare Dashboard → Workers → mzy-sso → Deployments → 选历史版本 → Rollback。

### 3. 监控与日志

- **日志**：Cloudflare Dashboard → Workers → mzy-sso → Observability（实时请求日志）。
- **关键指标**：请求成功率、P95 延迟、D1 查询耗时。
- **告警**：目前依赖 Cloudflare 默认监控，错误率突增时手动查看日志。

### 4. 数据与存储

- **D1 备份**：Cloudflare Dashboard → D1 → 导出（CSV/SQL）。
- **R2 资源**：`/bg/bg1.webp`（背景图）、`/bg/logo.webp`（Logo），替换即生效。
- **注意**：D1 无自动定时备份，重大变更前手动导出一次。

### 5. 安全红线

- ❌ 禁止在代码中硬编码任何密钥。
- ❌ 禁止删除 `ADMIN_API_TOKEN`、`JWT_SECRET`。
- ❌ 禁止向非授权域名添加 OAuth 回调地址。
- ✅ 新增 OAuth 应用必须在管理员后台创建，分配独立 `client_id` / `client_secret`。
- ✅ 紧急故障联系：maoxinhe。
