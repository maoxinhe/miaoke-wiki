---
title: 喵科大SSO · 使用与FAQ
---

# 喵科大 SSO 统一身份认证 · 使用指南与常见问题

> 面向使用「喵科大 SSO（MZY SSO）」统一登录的团队成员与接入应用方。

## 一、如何访问

- **用户入口**：`https://sso.camzy.uno/login`
- **管理后台**：`https://sso.camzy.uno/admin`（仅管理员）

## 二、常用功能

### 登录

1. 打开任意应用 → 自动跳转到喵科大登录页。
2. 输入用户名 + 密码，或点「Microsoft 登录」。
3. 首次使用某应用会弹一次授权确认 → 点「同意」。
4. 之后同一应用自动登录，不再弹确认。

### 注册

登录页 →「注册新账户」→ 填用户名/邮箱/密码。

### 绑定 Microsoft

个人中心 → 点 Microsoft 登录自动关联。

## 三、权限说明

| 角色 | 能力 |
| --- | --- |
| 普通用户 | 登录、注册、查看个人信息、授权应用 |
| 管理员 | 以上 + 用户列表、创建 OAuth 应用、查看日志 |

## 四、使用限制

- 会话有效期 7 天，超时需重新登录。
- 授权码 5 分钟内有效，access_token 2 小时过期。
- 撤销授权：个人中心 → 已授权应用 → 撤销。

## 五、常见问题（FAQ）

### Q1：登录后跳回应用还是没登录？
**原因**：应用后端没用 code 换 token，或 redirect_uri 不匹配。
**解决**：检查应用后端是否调了 `/oauth/token`，确认回调地址与后台登记的完全一致。

### Q2：每次都弹授权确认页？
**原因**：该应用从未被授权过，或被撤销了。
**解决**：点一次「同意」后，之后自动放行；若想强制弹页，URL 加 `prompt=consent`。

### Q3：Microsoft 登录报 redirect_uri_mismatch？
**原因**：Azure 后台回调地址没配对。
**解决**：Azure App Registrations → Authentication → 添加 `https://sso.camzy.uno/auth/microsoft/callback`。

### Q4：页面显示 500 Internal Server Error？
**原因**：Worker 代码报错或 D1 查询失败。
**解决**：Cloudflare Dashboard → Workers → Observability 看错误日志，常见为绑定未配或表结构缺失。

### Q5：忘记密码？
**原因**：忘记。
**解决**：登录页 →「忘记密码」→ 邮箱收验证码重置（需先绑定邮箱）。

### Q6：如何新增一个接 SSO 的应用？
**原因**：需要接入。
**解决**：管理员后台 → 创建应用 → 拿到 `client_id` / `client_secret` → 按文档把登录按钮指向 `/oauth/authorize`。

### Q7：R2 背景图/Logo 怎么换？
**原因**：要换素材。
**解决**：R2 bucket `mzy-sso-assets` 覆盖 `/bg/bg1.webp` 或 `/bg/logo.webp`，刷新即生效。
