---
title: cmy-patch · 运维
---

# cmy-patch · 运维知识

> 本文档为「cmy-patch（梦之韵整合包更新系统）」的运维与部署规范。**所有密钥、Token 一律使用占位符，真实值存放于私有配置**。

## 一、项目概览

- **项目名称**：cmy-patch（梦之韵整合包更新系统）
- **用途**：管理 Minecraft 整合包发布，玩家端启动前自动校验/增量更新，支持签名验证、回滚、可选内容组、备份归档。
- **一句话说明**：借鉴 DreamingFish-Updater 思路独立实现的「管理端发布 + 玩家端更新」双端系统。
- **技术栈 / 依赖**：Java 17（JDK17）、Jackson（JSON）、Ed25519 签名、SHA-256 内容寻址对象存储、Vue 3 + Vite（admin-ui/player-ui）、Tauri（player-ui 可选壳）、JDK 内置 HttpServer（本地管理服务）。
- **负责人**：梦之韵（CMY）运营组；联系：团队飞书群 / 工号 `<负责人工号>`。

## 二、运维注意事项

### 1. 运行环境

| 项 | 值 |
| --- | --- |
| 管理服务端口 | `127.0.0.1:18990`（仅回环，禁止绑定 0.0.0.0） |
| 许可通道 | `127.0.0.1:48912`（PermitGate，玩家端启动授权） |
| 云端 API | `https://apc.camzy.uno`（Cloudflare Worker + KV） |
| 官网 | `https://www.camzy.tech` |

环境变量：`JAVA_HOME`（JDK17）、`VITE_API_BASE`（admin-ui，默认 `http://127.0.0.1:18990`）。
密钥一律存放于私有配置：Cloudflare Token、GitHub PAT、签名私钥、S3/WebDAV 凭据 → 占位为 `<你的密钥在私有配置>`，**禁止明文写入代码/文档/日志**。

### 2. 启动与停止

```bash
# 编译打包
export JAVA_HOME=<JDK17路径> && export PATH=$JAVA_HOME/bin:$PATH
javac -cp "libs/jackson-*.jar" -d build/classes @build/all-sources.txt
jar cfe build/jars/cmy-patch.jar com.cmy.patch.cli.Main -C build/classes .

# 启动管理服务（后台）
java -cp "build/jars/cmy-patch.jar:libs/jackson-*.jar" \
  com.cmy.patch.cli.Main serve <projectId> <sourceDir> <outputDir> 18990

# 停止：按端口查 PID 后 kill
PID=$(lsof -ti:18990); [ -n "$PID" ] && kill $PID
```

### 3. 部署与发布

```bash
java -cp "build/jars/cmy-patch.jar:libs/*" com.cmy.patch.cli.Main init      <projectId> <sourceDir> <outputDir>
java -cp "build/jars/cmy-patch.jar:libs/*" com.cmy.patch.cli.Main configure <projectId> <outputDir> <rules.json>
java -cp "build/jars/cmy-patch.jar:libs/*" com.cmy.patch.cli.Main publish   <projectId> <sourceDir> <outputDir> <版本号> "<变更日志>"
java -cp "build/jars/cmy-patch.jar:libs/*" com.cmy.patch.cli.Main rollback  <projectId> <outputDir> <releaseId>
```

流程：扫描 → 发布（自动 Ed25519 签名）→ 上传对象 → 部署（S3/WebDAV）→ 玩家端下次检查更新自动收敛。回滚 = 生成新回滚发布（序列号递增），不覆盖历史。

### 4. 监控与告警

- **关键指标**：发布序列号、对象存储大小、备份数量、扫描变更数（admin-ui 控制台）。
- **日志**：serve 启动日志 stdout（如 `/tmp/cmy-serve.log`）；服务无独立日志文件，重定向输出后按 `grep -i error` 排查。
- **告警规则**：待建设（当前无自动告警，建议后续接入云监控）。

### 5. 数据与存储

- **结构**：`<outputDir>/data/projects/<projectId>/`（`database.json`、`private-key.json`、`binding.json`）+ `objects/`（内容寻址）+ `releases/`（清单）。
- **备份**：`backup` 命令 / `POST /api/backup`；备份列表 `GET /api/backups`；恢复语义待实现（UI 已置灰）。
- **迁移**：整目录拷贝 `outputDir` 即可；`private-key.json` **必须一并迁移**，否则玩家端验签失败。

### 6. 安全红线

- 管理服务无认证，仅限回环；远程暴露前必须先加鉴权层（ROADMAP E12）。
- `private-key.json` 泄露 = 更新链被接管，**严禁上传/外发/入库**。
- 逆向接入第三方网盘（139 等）仅供备份归档，禁止作为玩家热下载主源（风控+接口不稳定）。
- 开源仓仅公示脱敏代码（GPLv3 合规），CMY 特定功能放私有仓。
- 故障应急联系：`<负责人工号>`。
