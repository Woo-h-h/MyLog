#!/usr/bin/env bash
# Mylog 云服务器一键部署（在服务器上运行）
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/mylog}"
REPO="${REPO:-https://github.com/Woo-h-h/MyLog.git}"
PUBLIC_IP="${PUBLIC_IP:-114.55.64.220}"

echo "==> 1/6 安装 Docker（若已安装则跳过）"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sudo sh
  sudo systemctl enable docker
  sudo systemctl start docker
fi
sudo usermod -aG docker "$USER" 2>/dev/null || true

echo "==> 2/6 添加 swap（2GB 内存机器建议）"
if ! swapon --show | grep -q /swapfile; then
  sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "==> 3/6 拉取代码到 ${APP_DIR}"
sudo mkdir -p "$APP_DIR"
sudo chown -R "$USER:$USER" "$APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull
else
  git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"

echo "==> 4/6 检查 .env"
if [ ! -f .env ]; then
  cp .env.example .env
  sed -i "s|CORS_ORIGINS=.*|CORS_ORIGINS=http://${PUBLIC_IP}|" .env
  echo ""
  echo "已创建 .env，请编辑密码后再部署："
  echo "  nano ${APP_DIR}/.env"
  echo "至少修改：MYSQL_PASSWORD、MYSQL_ROOT_PASSWORD、JWT_SECRET、ADMIN_PASSWORD"
  exit 0
fi

echo "==> 5/6 检查 80 端口"
if ss -tlnp 2>/dev/null | grep -q ':80 '; then
  echo "警告：80 端口已被占用。Mylog 需要 80 端口，或修改 docker-compose.yml 中 frontend 端口。"
  ss -tlnp | grep ':80 ' || true
  read -r -p "仍要继续构建？(y/N) " ans
  [[ "${ans,,}" == "y" ]] || exit 1
fi

echo "==> 6/6 构建并启动（约 5~15 分钟）"
DOCKER="${DOCKER:-docker}"
if ! $DOCKER info >/dev/null 2>&1; then
  DOCKER="sudo docker"
fi
$DOCKER compose up -d --build

echo ""
echo "部署完成。访问："
echo "  前台： http://${PUBLIC_IP}/"
echo "  后台： http://${PUBLIC_IP}/admin/login"
echo "查看日志： cd ${APP_DIR} && $DOCKER compose logs -f"
