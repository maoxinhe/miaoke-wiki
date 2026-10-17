---
title: cmy-patch · 使用与FAQ
---

# CMY Patch 更新系统 · 使用指南与常见问题

> 面向使用「CMY Patch（梦之韵 Minecraft 整合包更新系统）」的团队成员。

## 一、如何访问 / 登录

- 本地启动 serve 后，admin-ui（`http://localhost:5173` 或 `vite preview`）`#/overview` 直接可用，**无登录**（本地单用户）。

## 二、常用功能与操作步骤

1. **初始化项目**：`init <projectId> <sourceDir> <outputDir> <项目名>`。
2. **配置规则**：`configure <projectId> <outputDir> <rules.json>`；或在 UI「维护规则」页编辑并保存。
3. **扫描预览**：`scan`，或 UI「控制台」查看变更。
4. **发布**：UI「+ 发布新版本」向导，或 `publish ...`。
5. **回滚**：UI「版本发布→详情/回滚」，或 `rollback`。
6. **部署**：UI「分发部署」配 S3/WebDAV 并「立即部署」，或 `deploy-s3`/`deploy-webdav`。
7. **备份**：UI「备份恢复→立即备份」，或 `backup`。

## 三、权限说明

- 本地单用户、无权限体系；对外暴露前必须加账号鉴权。

## 四、使用中的注意事项与限制

- 玩家端侧（player-ui Rust/Tauri）尚未在本机编译验证（工具链缺失）。
- Keys 视图未接后端 API；Backup 恢复、POST /api/deploy 真实 S3/WebDAV 未实战验证（待核对）。

## 五、常见问题（FAQ）

### Q1：admin-ui 显示「未连接后端」？
**原因**：serve 未启动或测试目录被清理导致 `scan` 400。
**解决**：重启 serve（指向存在的 sourceDir），`curl 127.0.0.1:18990/api/health` 验证。

### Q2：`scan` 返回 HTTP 400 "Unable to scan directory"？
**原因**：sourceDir 不存在（如 `/tmp` 被清理）。
**解决**：把测试现场迁到项目持久目录，重建 source 后重启服务。

### Q3：编译报错「cannot find symbol」？
**原因**：改了模块但未全量重编，或漏 import。
**解决**：用 `javac @build/all-sources.txt` 全量重编，检查 `build/all-sources.txt` 覆盖。

### Q4：`serve` 端口占用？
**原因**：旧进程未退。
**解决**：`lsof -ti:18990 | xargs kill` 后重启。

### Q5：发布后玩家端验签失败？
**原因**：output 迁移时丢了 `private-key.json`。
**解决**：整目录迁移并保留私钥；勿单独拷贝公钥。

### Q6：回滚没有生效？
**原因**：回滚产生的是新的回滚发布记录，需玩家端再次检查更新。
**解决**：回滚后确认 `/api/releases` 出现回滚版本，通知玩家刷新。

### Q7：UI 里 Keys/Backup 恢复点了没反应？
**原因**：这两处后端尚未实现（已知遗留）。
**解决**：属待开发项，勿在生产依赖；用 CLI 对应能力代替（待核对）。
