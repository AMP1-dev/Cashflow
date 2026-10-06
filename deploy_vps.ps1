# Script de Deploy do Portal FMA Advogados para VPS 185.245.182.23
# Executa build de produção, transfere os arquivos e atualiza o Caddy

$VPS_IP = "185.245.182.23"
$VPS_USER = "root"
$REMOTE_DIR = "/var/www/fmadv"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  DEPLOY: PORTAL FMA ADVOGADOS -> VPS $VPS_IP" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Gerar Build de Produção
Write-Host "`n[1/3] Gerando build de produção com Vite..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no build! Abortando deploy." -ForegroundColor Red
    exit 1
}

# 2. Compactar o diretório dist
Write-Host "`n[2/3] Empacotando fma_dist.tar.gz..." -ForegroundColor Yellow
tar -czf fma_dist.tar.gz -C dist .

# 3. Enviar para a VPS
Write-Host "`n[3/3] Enviando para a VPS $VPS_IP:$REMOTE_DIR..." -ForegroundColor Yellow
Write-Host "Insira a senha do servidor caso solicitada:" -ForegroundColor Gray

# Cria diretório remoto e extrai
scp fma_dist.tar.gz ${VPS_USER}@${VPS_IP}:/tmp/fma_dist.tar.gz
ssh ${VPS_USER}@${VPS_IP} "mkdir -p $REMOTE_DIR && tar -xzf /tmp/fma_dist.tar.gz -C $REMOTE_DIR && rm /tmp/fma_dist.tar.gz && chown -R www-data:www-data $REMOTE_DIR 2>/dev/null || true"

Write-Host "`nDeploy dos arquivos concluído com sucesso!" -ForegroundColor Green
Write-Host "Verifique a configuração do seu Caddyfile em /etc/caddy/Caddyfile:" -ForegroundColor Cyan
Write-Host @"
fmadv.net, www.fmadv.net {
    root * /var/www/fmadv
    file_server
    try_files {path} /index.html
    encode gzip zstd
}
"@ -ForegroundColor Gray
