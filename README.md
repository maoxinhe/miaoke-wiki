# 喵科大服务站

团队**运维手册 · 基础问题解答 · AI 知识库**的统一站点。基于 [VitePress](https://vitepress.dev/) 构建，内容为 Markdown，存放在 Git 仓库中多人协作维护，推送到 `main` 分支后由 GitHub Actions 自动构建并发布到 GitHub Pages。

## 目录结构

```
.
├── package.json                  # 依赖与脚本
├── .github/workflows/deploy.yml  # 自动发布流水线
└── docs/
    ├── .vitepress/config.mjs     # 站点配置（导航/侧边栏/主题）
    ├── .vitepress/theme/         # 主题样式
    ├── public/                   # 静态资源（图标等）
    ├── index.md                  # 首页
    ├── 运维手册/                 # 板块一：运维手册
    ├── 基础问题解答/             # 板块二：FAQ
    ├── AI知识库/                 # 板块三：AI 知识库
    └── 贡献指南.md               # 协作说明
```

## 本地开发

```bash
npm install        # 安装依赖
npm run docs:dev   # 本地预览（热更新）
npm run docs:build # 本地构建检查
npm run docs:preview # 预览构建产物
```

## 首次部署（一次性设置）

1. 在 GitHub 创建**私有仓库**（建议名为 `miaoke-wiki`），将本目录推送上去。
2. 在仓库 **Settings → Pages** 中，把「Source / Build and deployment」设为 **GitHub Actions**。
3. 推送 `main` 后，Actions 会自动构建发布。首次完成后，在 Pages 设置里开启 HTTPS。
4. 如需自定义域名（如 `wiki.camzy.tech`），在 Pages 的「Custom domain」处填写并完成 DNS 解析。

## 内容维护

- 新增/修改内容：编辑 `docs/` 下的 `.md` 文件，走 Pull Request 合并到 `main`。
- 导航与侧边栏：编辑 `docs/.vitepress/config.mjs`。
- 详见「参与贡献」页。

## 安全提醒

- 涉及密钥、内网地址、个人隐私等内容**禁止明文写入**本仓库与站点。
- 仓库保持私有，仅授权成员可见。
