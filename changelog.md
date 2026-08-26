# Changelog

本文件记录 Mylog 项目的每次重要变更。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

---

## [Unreleased]

（暂无）

---

## [2026-08-26] — 简历改为纯 PDF 存储

### Changed
- 移除简历 JSON 正文编辑，简历仅以 PDF 源文件保存（磁盘 + `resume_file` 表）
- 前台 `/resume` 在线预览 PDF，并提供下载
- 管理后台 `/admin/resume` 仅保留 PDF 上传与管理

### Removed
- `/api/admin/resume/content` JSON 读写接口
- `site_content` 中的 `resume` 键

---

## [2026-08-26] — 管理员前台可编辑全站内容

### Added
- 后端 `site_content` 表与 `SiteContentService`：学生工作、简历正文持久化到数据库
- 公开 API `GET /api/content/student-work`；管理 API 读写学生工作与简历正文
- 前台 `/admin/student-work` 结构化表单编辑学生工作页
- 前台 `/admin/resume` 扩展：PDF 上传 + 简历正文 JSON 编辑
- 管理员登录后，各公开页右上角显示「编辑此页」快捷入口

### Changed
- 学生工作页改为从 API 加载，不再依赖静态 TS 文件
- 简历正文从数据库读取（首次访问自动 seed）

---

## [2026-08-26] — 学生工作内容更新

### Changed
- 调研部工作经历：补充 2024.3–2025.6 共 10 项活动时间线，更新职责概述与学生代表大会表述

---

## [2026-08-26] — 导航菜单重组

### Changed
- 顶栏菜单顺序调整为：**首页 → 简历 → 项目 → 博客 → 学生工作 → 笔记**
- 「项目」页合并原「关于」内容：个人简介 + 项目列表 + 联系方式
- 新增 `/student-work` 学生工作页（展示 profile 亮点/组织经历）
- `/about` 自动重定向至 `/projects`
- 首页「联系我」链接改为 `/projects#contact`
- 更新 `sitemap.xml`

---

## [2026-08-26] — GitHub Dim 渐变深色

### Changed
- 全站配色改为用户指定色板（GitHub Dim 风格）：
  - `--color-black: #0D1117`
  - `--color-carbon: #161B22`
  - `--color-link-blue: #58A6FF`
  - `--color-text-gray: #C9D1D9`
- 新增渐变样式：页面背景光晕、首页 `gradient-hero` 英雄区、卡片 `gradient-card`、按钮 `gradient-btn`
- 深色底 + 链接蓝强调，卡片自 Carbon 向 Link Blue 渐变（参考 GitHub Dim 视觉）
- 字体改为系统 UI 栈，更贴近开发者工具风格
- favicon 改为黑底渐变蓝、theme-color 同步

---

## [2026-08-26] — 北极蓝配色

### Changed
- 全站配色改为用户指定色板：
  - `--color-frost: #E8F0F8`
  - `--color-glacier: #B8D4E8`
  - `--color-arctic-blue: #6BA3C8`
  - `--color-deep-tide: #2E6B8A`
- 由 Bottega 绿羊皮纸风切换为**清冷 Arctic 蓝**风格
- 背景、按钮、导航、标签、链接统一冰川蓝渐变与深潮蓝主色
- favicon 与 `theme-color` 同步更新

---

## [2026-08-26] — Bottega 绿 + 羊皮纸配色

### Changed
- 全站配色改为用户指定色板：
  - `--color-bottega-green: #1F4D2D`
  - `--color-pasture: #3F7E5A`
  - `--color-parchment: #E8E2D2`
  - `--color-ink: #1A1A1A`
- 由黑色极客风切换为**浅色自然风**：羊皮纸背景、深绿主色、牧场绿点缀
- 字体改回 Source Serif / 思源无衬线；移除 JetBrains Mono
- 导航、按钮、标签、卡片统一新配色；首页恢复简洁标题样式
- favicon 与 `theme-color` 同步更新

---

## [2026-08-26] — 黑色极客风主题

### Changed
- 全站视觉改为**黑色极客风**：深黑背景、终端绿强调色（`#00ff88`）、JetBrains Mono 等宽字体
- 新增全局样式组件：`geek-card`、`geek-tag`、`geek-btn-primary`、`geek-btn-secondary`、`geek-input`、`alert-error`
- 导航栏改为 `> mylog/王焕` 终端风格；首页增加 `> personal_site.init()`、`$ 王焕` 命令行元素
- 博客/项目卡片、标签筛选、404 页、Markdown 代码块样式统一为深色主题
- 管理后台（登录、侧边栏、表单）同步深色极客风格
- favicon 更换为 `>_` 终端图标；`index.html` 增加 JetBrains Mono 字体与 `theme-color`

### Deploy
- 重新构建并部署 Docker 前端容器

---

## [2026-08-26] — 取消手机号脱敏

### Changed
- 移除 `ProfileService.maskPhone()`，公开 API 与后台一致返回完整手机号
- 后台个人资料表单标签由「手机（存真实号，前台脱敏）」改为「手机」

### Deploy
- 重新构建并部署 Docker 后端容器

---

## [2026-08-26] — Docker 构建与部署

### Added
- 从 `.env.example` 生成 `.env` 供本地 Docker 使用

### Changed
- `docker-compose.yml`：MySQL 镜像由 `8.4` 改为本地已有的 `8.0`
- `docker-compose.yml`：后端对外端口由 `8080` 改为 `8088`（避免与 RocketMQ 冲突）
- `backend/Dockerfile`、`frontend/Dockerfile`：基础镜像改用 DaoCloud 镜像加速（`docker.m.daocloud.io`）
- 移除 Dockerfile 中 `# syntax=docker/dockerfile:1`（避免 Docker Hub 拉取失败）

### Fixed
- 修复 admin 页面 TypeScript 编译错误（`FormEvent` type import、错误 import 路径）

### Deploy
- 成功构建 `mylog-backend`、`mylog-frontend` 镜像并启动 compose 三件套（MySQL + Backend + Frontend）
- 简历 PDF 复制进后端容器 volume

---

## [2026-08-26] — M5：打磨与部署

### Added
- 404 页、Loading / Empty 通用状态组件
- 移动端导航菜单、路由级 SEO（`PageMeta`）
- `robots.txt`、`sitemap.xml`、favicon
- 页面访问统计：`POST /api/pageviews`，后台 `GET /api/admin/pageviews`
- Docker 部署：`docker-compose.yml`、`backend/Dockerfile`、`frontend/Dockerfile` + `nginx.conf`
- `application-docker.yml`、`.env.example`

---

## [2026-08-26] — M4：管理后台

### Added
- JWT 鉴权：`POST /api/auth/login`，`JwtAuthInterceptor` 保护 `/api/admin/**`
- 后台 CRUD：个人资料、项目、文章、简历 PDF 上传
- 前端：`/admin/login`、路由守卫、侧边栏布局
- 默认开发账号：`admin` / `admin123`（见 `application.yml`）

---

## [2026-08-26] — M3：博客与笔记

### Added
- 数据表：`post`、`tag`、`post_tag`
- API：`GET /api/posts`、`GET /api/posts/{slug}`、`GET /api/tags`
- 前端：`/blog`、`/notes` 列表与详情，Markdown 渲染（`react-markdown`）
- 种子数据：1 篇博客 + 1 篇笔记；首页「最新文章」区块

---

## [2026-08-26] — M2：招聘主路径

### Added
- 简历：`GET /api/resume`、`GET /api/resume/download`，`/resume` 页面
- 项目：`project` 表，4 个种子项目，列表/详情 API 与页面
- 关于页 + 页脚邮箱；首页精选项目从 API 加载
- 简历 PDF 源文件复制至 `backend/uploads/resume/wanghuan-resume.pdf`

---

## [2026-08-26] — M1：骨架与首页

### Added
- `frontend/`：React + Vite + TypeScript + Tailwind + React Router + axios
- `backend/`：Spring Boot 4.1.1 + Java 21 + Maven Wrapper + H2 开发库
- `GET /api/profile`、CORS、统一 `ApiResponse`、种子个人资料
- 首页展示姓名、定位、技能标签

---

## [2026-08-26] — M0：规划

### Added
- `agent.md` 作为单一事实来源（SSOT）：定位、技术栈、里程碑、任务清单
- 确认联系方式策略：邮箱完整展示；手机最初计划脱敏（后于同日取消）

---

## 维护说明

每次有功能、修复、样式或部署相关变更时，在 **`[Unreleased]`** 下追加条目；发布或合并一批改动时，将 `[Unreleased]` 内容移到新日期区块，并清空 `[Unreleased]`。

条目类型：

| 类型 | 用途 |
|------|------|
| Added | 新功能 |
| Changed | 已有功能的变更 |
| Fixed | Bug 修复 |
| Removed | 移除的功能 |
| Deploy | 构建、部署、环境相关 |
