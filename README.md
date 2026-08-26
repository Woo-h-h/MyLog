# Mylog

个人作品集网站：首页、简历、项目、博客、笔记、学生工作，以及内置管理后台。

前台与后台是**同一个前端应用**，一次部署即可同时访问。

---

## 功能概览

| 模块 | 前台路径 | 后台编辑 |
|------|---------|---------|
| 首页 / 个人资料 | `/` | `/admin/profile` |
| 简历（在线 + PDF） | `/resume` | `/admin/resume` |
| 项目 | `/projects` | `/admin/projects` |
| 博客 | `/blog` | `/admin/posts` |
| 笔记 | `/notes` | `/admin/posts` |
| 学生工作 | `/student-work` | `/admin/student-work` |

管理员登录后，前台页面右上角会显示 **「编辑此页」** 快捷入口。

---

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 19 + Vite + Tailwind CSS + TypeScript |
| 后端 | Spring Boot 4 + Java 21 |
| 数据库 | MySQL 8（本地开发可用 H2） |
| 鉴权 | JWT（仅管理端） |
| 部署 | Docker Compose（Nginx + Spring Boot + MySQL） |

---

## 项目结构

```
Mylog/
├── frontend/          # React 前端（含前台 + /admin 后台）
├── backend/           # Spring Boot API
├── docker-compose.yml # 生产部署
├── .env               # 生产环境变量（勿提交 Git）
├── agent.md           # 项目规划文档
└── changelog.md       # 变更记录
```

---

## 本地开发

### 环境要求

- Node.js 22+
- Java 21
- Maven（或使用 backend 自带的 `mvnw`）

### 启动后端

```bash
cd backend
./mvnw spring-boot:run
```

默认端口 `8080`，使用 H2 文件数据库。开发账号：

- 用户名：`admin`
- 密码：`admin123`

### 启动前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173 ，API 通过 Vite 代理到 `http://localhost:8080`。

### 管理后台（本地）

- 登录页：http://localhost:5173/admin/login
- 账号：`admin` / `admin123`

---

## Docker 部署（推荐）

前台、后台、数据库三个容器一起启动，无需分开部署。

### 1. 配置环境变量

复制并修改 `.env`：

```env
MYSQL_PASSWORD=强密码1
MYSQL_ROOT_PASSWORD=强密码2
JWT_SECRET=至少32位的随机字符串
ADMIN_USERNAME=admin
ADMIN_PASSWORD=你的管理员密码
CORS_ORIGINS=http://localhost
```

有域名时将 `CORS_ORIGINS` 改为 `https://你的域名`。

### 2. 构建并启动

```bash
docker compose up -d --build
```

### 3. 访问

| 地址 | 说明 |
|------|------|
| http://localhost/ | 前台首页 |
| http://localhost/admin/login | 管理后台 |
| http://localhost:8088 | 后端 API（调试用，生产可不对公网开放） |

### 常用命令

```bash
docker compose ps              # 查看容器状态
docker compose logs -f         # 查看日志
docker compose up -d --build   # 更新代码后重新部署
docker compose down            # 停止并移除容器（数据卷保留）
```

---

## 云服务器部署（阿里云轻量应用服务器）

### 防火墙（入方向）

轻量服务器没有「安全组」，在控制台 **防火墙** 中放行：

| 端口 | 用途 |
|------|------|
| 22 | SSH |
| 80 | 网站 |
| 443 | HTTPS（可选） |

### 部署步骤

```bash
# 1. 安装 Docker
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl enable docker && sudo systemctl start docker
sudo usermod -aG docker $USER

# 2. 上传代码到 /opt/mylog（Git clone 或 SCP）

# 3. 创建 .env（见上文，CORS_ORIGINS 改为 http://你的公网IP）

# 4. 启动
cd /opt/mylog
docker compose up -d --build
```

访问：

- 前台：`http://你的公网IP/`
- 后台：`http://你的公网IP/admin/login`

> **提示：** 2GB 内存机器建议先加 2GB swap，避免构建时内存不足。若 80 端口被占用，可修改 `docker-compose.yml` 中 frontend 端口映射。

### 上传代码到服务器

若 SCP 报 `Permission denied (publickey)`，可选：

1. **Git**：推到 GitHub/Gitee，服务器上 `git clone`
2. **开启密码 SSH**：控制台重置密码 + 修改 `/etc/ssh/sshd_config` 中 `PasswordAuthentication yes`
3. **SSH 密钥**：本机 `ssh-keygen`，公钥写入服务器 `~/.ssh/authorized_keys`

---

## 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `MYSQL_PASSWORD` | MySQL 应用用户密码 | `mylog` |
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码 | `rootpass` |
| `JWT_SECRET` | JWT 签名密钥（≥32 字符） | — |
| `ADMIN_USERNAME` | 管理员用户名 | `admin` |
| `ADMIN_PASSWORD` | 管理员密码 | `please-change-me` |
| `CORS_ORIGINS` | 允许的前端来源 | `http://localhost` |

修改 `.env` 后需重新启动：`docker compose up -d --build`

---

## 数据持久化

Docker 卷：

- `mysql_data` — 数据库（个人资料、项目、文章、站点内容等）
- `resume_data` — 上传的简历 PDF

---

## 相关文档

- [agent.md](./agent.md) — 项目规划与里程碑
- [changelog.md](./changelog.md) — 变更日志

---

## License

Private / Personal use.
