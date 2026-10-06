#!/bin/bash
set -e

echo "=================================================="
echo "  CONFIGURANDO DOMÍNIO ESPELHO: amp.ia.br NA VPS"
echo "=================================================="

# 1. Localizar Caddyfile
CADDY_PATH="/opt/wgdashboard/Caddyfile"
if [ ! -f "$CADDY_PATH" ]; then
    if [ -f "/etc/caddy/Caddyfile" ]; then
        CADDY_PATH="/etc/caddy/Caddyfile"
    fi
fi

echo "Caddyfile encontrado em: $CADDY_PATH"

# Fazer backup do Caddyfile atual
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp "$CADDY_PATH" "${CADDY_PATH}.bak_${TIMESTAMP}"
echo "Backup criado em ${CADDY_PATH}.bak_${TIMESTAMP}"

# 2. Adicionar bloco para amp.ia.br se não existir
if ! grep -q "amp.ia.br" "$CADDY_PATH" 2>/dev/null; then
    cat << 'EOF' >> "$CADDY_PATH"

amp.ia.br, www.amp.ia.br {
    reverse_proxy amp-portal:80
}
EOF
    echo "Bloco amp.ia.br e www.amp.ia.br adicionado com sucesso!"
else
    echo "amp.ia.br já estava presente no Caddyfile."
fi

# 3. Garantir que www.amp.adm.br também esteja presente
if ! grep -q "www.amp.adm.br" "$CADDY_PATH" 2>/dev/null; then
    sed -i 's/amp.adm.br {/amp.adm.br, www.amp.adm.br {/g' "$CADDY_PATH"
    echo "Subdomínio www.amp.adm.br garantido no Caddyfile!"
fi

echo "--- Caddyfile Atualizado ---"
tail -n 25 "$CADDY_PATH"
echo "----------------------------"

# 4. Recarregar o Caddy para aplicar certificados SSL e rotas
echo "Recarregando Caddy..."
CADDY_CID=$(docker ps -qf "name=caddy" | head -n 1)
if [ -n "$CADDY_CID" ]; then
    docker exec "$CADDY_CID" caddy reload --config /etc/caddy/Caddyfile
    echo "Caddy recarregado via Docker!"
else
    systemctl reload caddy 2>/dev/null || caddy reload 2>/dev/null || true
    echo "Caddy recarregado no sistema!"
fi

echo "=================================================="
echo "  CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!"
echo "=================================================="
