---
title: cmy-patch · 运维
---

# CMY Patch 更新系统 · 运维知识

> 本文档为「CMY Patch（梦之韵 Minecraft 整合包更新系统）」的运维与部署规范，归档于团队 wiki「运维手册」板块。**所有密钥、Token 一律使用占位符，真实值存放于私有配置**。

## 一、项目概览

- **项目名称**：CMY Patch（梦之韵 Minecraft 整合包更新系统）
- **用途**：服主管理整合包版本，玩家端启动前自动增量更新，支持签名验证与回滚。
- **技术栈 / 依赖**：Java 17（JDK 17）+ 4 个 Jackson lib；Vue 3 + Vite（admin-ui）；Tauri + Rust（player-ui，Rust 侧待核）；更新引擎为原生 JDK HttpServer。
- **负责人**：梦之韵团队 · 代运营（工号：`<你的工号>`）；故障应急见第六节。

## 二、运维注意事项

### 1. 运行环境

- **主机**：本地服务器（当前演示环境 `/home/user/Doubao/.../cmy-patch/`）。
- **服务端口**：管理服务 `127.0.0.1:18990`（**仅回环，不对外**）。
- **域名**：无对外域名（本地管理服务 + 本地 UI）。
- **环境变量**：`VITE_API_BASE`（admin-ui 后端地址，默认 `http://127.0.0.1:18990`）。
- **密钥（一律在私有配置，勿入仓库）**：Ed25519 签名私钥 `<签名私钥>`；项目绑定 `binding.json`；`private-key.json`；管理库 `database.json`。

### 2. 启动与停止

启动管理服务：

```bash
export JAVA_HOME=/home/user/jdk-17 && export PATH=$JAVA_HOME/bin:$PATH
CP="build/jars/cmy-patch.jar:libs/jackson-*.jar"
java -cp "$CP" com.cmy.patch.cli.Main serve <projectId> <sourceDir> <outputDir> 18990
```

启动 admin-ui：`cd admin-ui && npm run dev`（或 `npm run build` + `npx vite preview`）。

停止：`kill <18990 端口进程PID>`（`lsof -ti:18990 | xargs kill`）；重启按上列命令重跑。

### 3. 部署与发布

构建（全量编译 + 打包 jar）：

```bash
export JAVA_HOME=/home/user/jdk-17 && export PATH=$JAVA_HOME/bin:$PATH
javac -cp "libs/jackson-annotations.jar:libs/jackson-core.jar:libs/jackson-databind.jar:libs/jackson-datatype-jsr310.jar" -d build/classes @build/all-sources.txt
jar cfe build/jars/cmy-patch.jar com.cmy.patch.cli.Main -C build/classes .
```

发布新版本：`publish <projectId> <sourceDir> <outputDir> <version> [changelog]`。
**回滚**：`POST /api/rollback {"releaseId": ...}`（UI「版本发布→回滚」），或 CLI `rollback`。
前端发布：`cd admin-ui && npm run build`，产物在 `dist/`。

### 4. 监控与告警

- **关键指标**：`GET /api/health`、`/api/state`（当前版本/文件数/对象/备份）、`/api/scan`（变更数）。
- **日志位置**：serve 启动日志 `<日志路径>`（演示为 `/tmp/cmy-serve.log`）。
- **查日志**：`tail -f <日志路径>`；UI 侧看 admin-ui 每页顶部连接状态徽章（绿=已连接/琥珀=演示数据）。
- **告警**：无内置告警；建议对 `health` 探活失败、`scan` 连续 400 设外部探针（待配置）。

### 5. 数据与存储

- **对象存储**：`output/objects/`（按 SHA-256 内容寻址）。
- **清单/发布**：`output/releases/`、`binding.json`、`public.key`、`private-key.json`、`database.json`。
- **备份**：CLI `backup`；`POST /api/backup` 创建快照，`GET /api/backups` 列表。**「恢复」后端未实现，UI 已置灰（待开发）**。
- **测试现场**：`<项目根>/.e2e/`（source/rules.json/out），勿用于生产。
- **迁移**：迁移时整目录拷贝 `output/` + 保留 `private-key.json`，否则玩家端验签失败。

### 6. 安全红线

- 私钥不可泄露/不可入 git；公钥 `public.key` 可公开。
- 管理服务**仅绑定 127.0.0.1，无内置认证**；如需远程部署必须先加鉴权层（见 ROADMAP E12）。
- 密钥、Token、内网地址一律放私有配置，**禁止明文进仓库/文档**。
- **故障应急**：服务挂了先查日志 → 恢复 serve → 验证 `/api/health`；紧急联系负责人。
