# ==============================================================================
# Script de Publicação Automática: Drywall Distribuidora / Di Brunelli
# Arquitetura Padronizada VPS: Docker nginx:alpine + Caddy Reverse Proxy + SSL
# VPS IP: 185.245.182.23 | Rede Docker: wgdashboard_default
# Domínio Oficial: drywalldistribuidora.com.br
# Domínio Loja (Redirecionamento): dibrunelli.com.br -> drywalldistribuidora.com.br
# ==============================================================================

param (
    [string]$SiteName = "drywall",
    [string]$MainDomain = "drywalldistribuidora.com.br",
    [string]$StoreDomain = "dibrunelli.com.br"
)

$VPS_IP = "185.245.182.23"
$VPS_USER = "root"
$REMOTE_DIR = "/var/www/$SiteName"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  PUBLICANDO: DRYWALL DISTRIBUIDORA NA VPS" -ForegroundColor Cyan
Write-Host "  VPS IP:             $VPS_IP" -ForegroundColor Yellow
Write-Host "  Container:          $SiteName" -ForegroundColor Yellow
Write-Host "  Domínio Principal:  $MainDomain / www.$MainDomain" -ForegroundColor Yellow
Write-Host "  Domínio Loja (Redir): $StoreDomain / www.$StoreDomain" -ForegroundColor Yellow
Write-Host "  Pasta Remota:       $REMOTE_DIR" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Gerar Build de Produção com Vite
Write-Host "`n[1/4] Compilando arquivos de produção com Vite..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro durante o build! Abortando deploy." -ForegroundColor Red
    exit 1
}

# 2. Compactar pasta dist
Write-Host "`n[2/4] Compactando pacote dist.tar.gz..." -ForegroundColor Yellow
tar -czf dist.tar.gz -C dist .

if (-not (Test-Path "dist.tar.gz")) {
    Write-Host "Erro: Arquivo dist.tar.gz não encontrado!" -ForegroundColor Red
    exit 1
}

# 3. Enviar pacote para /tmp da VPS via SCP
Write-Host "`n[3/4] Enviando dist.tar.gz para a VPS (${VPS_IP}:/tmp/)..." -ForegroundColor Yellow
Write-Host "(Digite a senha da VPS caso seja solicitada)" -ForegroundColor Gray
scp dist.tar.gz ${VPS_USER}@${VPS_IP}:/tmp/dist.tar.gz

if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no envio via SCP. Verifique a conexão com a VPS." -ForegroundColor Red
    exit 1
}

# 4. Configurar Container Docker e Caddyfile na VPS via SSH
Write-Host "`n[4/4] Executando configuração na VPS via SSH..." -ForegroundColor Yellow

$RemoteCommands = @"
# 1. Criar pasta e extrair
mkdir -p ${REMOTE_DIR}
tar -xzf /tmp/dist.tar.gz -C ${REMOTE_DIR}
rm -f /tmp/dist.tar.gz
chmod -R 755 ${REMOTE_DIR}

# 2. Criar ou reiniciar container Docker nginx:alpine isolado
docker stop ${SiteName} 2>/dev/null || true
docker rm ${SiteName} 2>/dev/null || true

docker run -d \
  --name ${SiteName} \
  --restart always \
  --network wgdashboard_default \
  -v ${REMOTE_DIR}:/usr/share/nginx/html:ro \
  nginx:alpine

echo "Container Docker '$SiteName' ativo e rodando!"

# 3. Atualizar Caddyfile para os domínios
CADDY_UPDATED=0

# Bloco 1: drywalldistribuidora.com.br (Site oficial da distribuidora)
if ! grep -q "$MainDomain" /opt/wgdashboard/Caddyfile 2>/dev/null; then
    echo "Adicionando bloco de $MainDomain no Caddyfile..."
    cat << 'EOF_MAIN' >> /opt/wgdashboard/Caddyfile

$MainDomain, www.$MainDomain {
    reverse_proxy $SiteName:80
}
EOF_MAIN
    CADDY_UPDATED=1
fi

# Bloco 2: dibrunelli.com.br (Redirecionamento para a distribuidora)
if ! grep -q "$StoreDomain" /opt/wgdashboard/Caddyfile 2>/dev/null; then
    echo "Adicionando redirecionamento de $StoreDomain para $MainDomain no Caddyfile..."
    cat << 'EOF_STORE' >> /opt/wgdashboard/Caddyfile

$StoreDomain, www.$StoreDomain {
    redir https://$MainDomain{uri} permanent
}
EOF_STORE
    CADDY_UPDATED=1
fi

if [ "`$CADDY_UPDATED" -eq 1 ]; then
    echo "Recarregando Caddy para emissão automática de SSL..."
    docker exec `$(docker ps -qf "name=caddy") caddy reload --config /etc/caddy/Caddyfile
else
    echo "Domínios já configurados no Caddyfile. Caddy pronto!"
fi
"@

ssh ${VPS_USER}@${VPS_IP} $RemoteCommands

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "  DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "  Domínio Oficial:  https://$MainDomain" -ForegroundColor Cyan
Write-Host "  Domínio Loja:     https://$StoreDomain (redireciona para o oficial)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Green
