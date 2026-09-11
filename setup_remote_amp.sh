#!/bin/bash
set -e

SITE_NAME="$1"
DOMAIN="$2"
REMOTE_DIR="$3"

echo "=== [VPS] Configurando $SITE_NAME ($DOMAIN) ==="

# 1. Criar pasta e extrair
mkdir -p "$REMOTE_DIR"
tar -xzf /tmp/amp_dist.tar.gz -C "$REMOTE_DIR"
rm -f /tmp/amp_dist.tar.gz
chmod -R 755 "$REMOTE_DIR"
echo "Arquivos extraídos em $REMOTE_DIR"

# 2. Iniciar container Docker isolado
docker stop "$SITE_NAME" 2>/dev/null || true
docker rm "$SITE_NAME" 2>/dev/null || true

docker run -d \
  --name "$SITE_NAME" \
  --restart always \
  --network wgdashboard_default \
  -v "$REMOTE_DIR:/usr/share/nginx/html:ro" \
  nginx:alpine

echo "Container '$SITE_NAME' ativo!"

# 3. Localizar Caddyfile
CADDY_PATH="/opt/wgdashboard/Caddyfile"
if [ ! -f "$CADDY_PATH" ]; then
    if [ -f "/etc/caddy/Caddyfile" ]; then
        CADDY_PATH="/etc/caddy/Caddyfile"
    fi
fi

echo "Caddyfile encontrado em: $CADDY_PATH"

# 4. Atualizar Caddyfile se necessário
if ! grep -q "$DOMAIN" "$CADDY_PATH" 2>/dev/null; then
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    cp "$CADDY_PATH" "${CADDY_PATH}.bak_${TIMESTAMP}"
    echo "Backup criado em ${CADDY_PATH}.bak_${TIMESTAMP}"

    cat << EOF_CADDY >> "$CADDY_PATH"

$DOMAIN, www.$DOMAIN {
    reverse_proxy $SITE_NAME:80
}
EOF_CADDY
    echo "Bloco $DOMAIN adicionado com sucesso!"

    # Recarregar Caddy
    CADDY_CID=$(docker ps -qf "name=caddy" | head -n 1)
    if [ -n "$CADDY_CID" ]; then
        docker exec "$CADDY_CID" caddy reload --config /etc/caddy/Caddyfile
        echo "Caddy recarregado via Docker!"
    else
        systemctl reload caddy 2>/dev/null || caddy reload 2>/dev/null || true
        echo "Caddy recarregado no sistema!"
    fi
else
    echo "Domínio $DOMAIN já estava configurado no Caddyfile."
fi

echo "=== Configuração concluída com sucesso! ==="
