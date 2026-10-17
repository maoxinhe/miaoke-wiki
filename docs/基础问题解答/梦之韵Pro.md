---
title: 梦之韵Pro · 使用与FAQ
---

# 梦之韵Pro · 使用指南与常见问题

> 面向使用「梦之韵Pro」（Minecraft 服务器启动器 + 云端服务）的玩家与运维成员。

## 一、如何访问 / 登录

- **玩家**：官网 `www.camzy.tech` 下载启动器；API 域名 `apc.camzy.uno`。
- **管理**：管理后台 `admin.camzy.uno`，需 `<ADMIN_TOKEN>`。

## 二、常用功能与操作步骤

- **更新检测**：启动器启动自动调 `/update/check?v=<本地版本>` → `needUpdate=true` 弹窗显示更新日志 → 点下载跳 `/update/download`。
- **玩家中心**：输入玩家名 → `/api/player/stats?name=` 查看时长/白名单/在线；申请白名单走 `/api/whitelist/apply`。
- **AI 助手 / 日志分析**：`POST /api/ai/chat`（问答）或 `/api/log/upload`（崩溃日志自动分析）。
- **卡密激活**：`POST /api/verify`（仅验证）或 `/api/redeem`（兑换绑定玩家）。
- **工单**：`POST /api/tickets` 提交（保存返回的查看码 `token`），`GET /api/tickets/my?token=` 追踪。
- **运维发布新版本**：push 源码到 `hmcl-dev` 分支触发 Actions，完成后核对 KV 版本号已更新。

## 三、权限说明

- **玩家**：公开 GET/POST（状态、玩家数据、AI、卡密验证、工单提交）。
- **管理员**：卡密生成（`/api/codes`）、反馈/工单列表与处理、后台静态上传。

## 四、注意事项与限制

- 版本号以云端为准，勿手动覆盖启动器本地逻辑。
- `/api/checkin`（签到）、`/api/cmd/*`（RCON 分发）已废弃，不要实现。
- 同一 IP 调 AI 每分钟限 20 次。

## 五、常见问题（FAQ）

### Q1：启动器一直提示"需要更新"？
**原因**：云端 KV 版本号比本地新。
**解决**：点下载更新，或核对本地 exe 版本。

### Q2：更新后仍是旧版？
**原因**：KV `latest_version` 未同步。
**解决**：重跑 GitHub Actions 或手动写回 KV。

### Q3：下载龟速？
**原因**：走 GitHub Release 被墙。
**解决**：用 Cloudflare 代理 / 镜像加速。

### Q4：启动报错 / 崩溃？
**原因**：启动器或云端问题。
**解决**：复制日志贴 `/api/ai/chat` 或用 `/api/log/upload` 自动分析。

### Q5：卡密提示不存在/已使用？
**原因**：卡密未生成或被兑换。
**解决**：管理员 `/api/codes` 生成，玩家 `/api/verify` 查状态。

### Q6：管理接口返回 401？
**原因**：缺少或错误的 `<ADMIN_TOKEN>`。
**解决**：检查 `Authorization: Bearer` 头。

### Q7：官网打不开？
**原因**：GitHub Pages（`mzy-pro` 仓库）构建失败或域名解析问题。
**解决**：检查 Pages 构建状态。

### Q8：版本号对不上？
**原因**：本地与 KV 不一致。
**解决**：以 KV `latest_version` 为准。
