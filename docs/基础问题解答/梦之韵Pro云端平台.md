---
title: 梦之韵Pro云端平台 · 使用与FAQ
---

# 梦之韵 Pro 云端平台 · 使用指南与常见问题

> 面向使用「梦之韵 Pro 云端平台（Cloudflare Worker API）」的团队成员与调用方。

## 一、如何访问 / 登录

- 管理后台：`admin.camzy.uno`（登录页 + 管理界面，assets 由 Worker 托管）。

## 二、常用功能与操作步骤

- **更新检测/下载**：`/update/check`、`/update/latest`、`/update/download`（启动器内置）。
- **整合包反代**：`/mc/mzy*`（反代至 functions.liminalily.com）。
- **客户端配置**：`/api/launcher/config`。
- **内容查询**：`/api/packs`、`/api/mods`、`/api/modlist`、`/api/deps/<id>`。
- **玩家与白名单**：`/api/whitelist/check`、`/api/player/stats`。
- **上报/诊断**：`/api/log/upload`、`/api/tools/modcheck`、`/api/tools/memadvice`、`/error/report`（AI 分析）。
- **下载直链**：`/api/dl`、`/proxy`、`/update_link`。

## 三、权限说明

- **玩家**：更新/下载/白名单/上报等公开端点。
- **管理员**：后台登录（admin.camzy.uno）；白名单快照写入由 cron + GitHub token 完成。

## 四、使用中的注意事项与限制

- `/mc/mzy` 依赖第三方上游，上游不可达时该路径会失败（待核对）。
- 直链/日志类 KV 有保留条数上限，超限旧记录被自动清理。
- 修改路由需同步更新依赖方（启动器/官网）的调用，避免版本不同步。

## 五、常见问题（FAQ）

### Q1：玩家反馈下载很慢/被劫持？
**原因**：DNS 或路由问题（历史上曾发生 DNS 劫持）。
**解决**：确认域名解析指向 Cloudflare；国内用户优先 `apc.camzy.uno`；必要时换备用域名。

### Q2：`/api/status` 返回 5xx？
**原因**：Worker 脚本报错或上游不可达。
**解决**：查 CF 仪表盘日志定位路由；核对 KV 是否可读；回滚至上一稳定版本。

### Q3：`/mc/mzy` 失败？
**原因**：第三方上游 `functions.liminalily.com` 不可达。
**解决**：确认上游状态；临时关闭反代并通知依赖方（待核对）。

### Q4：白名单快照不更新？
**原因**：cron（每分钟）未触发或 GitHub token 失效。
**解决**：核对 CF cron 运行记录；`wrangler secret put GITHUB_TOKEN` 更新令牌。

### Q5：`/error/report` 无 AI 分析结果？
**原因**：智谱 token 失效或已硬编码被轮换。
**解决**：把 token 移入 secret 并用 `wrangler secret put` 更新（安全红线项）。

### Q6：KV 旧记录莫名消失？
**原因**：`sh:`/`clog:` 前缀有保留条数上限，超限自动清理。
**解决**：属预期行为；如需长期保留改上限或另存外部。

### Q7：改了 worker.js 后线上无变化？
**原因**：未 `wrangler deploy` 或发到了错误环境。
**解决**：确认工作目录与 KV 绑定后重新 `wrangler deploy`。
