# ==============================================================================
# Script de Publicação Automática: Portal Corporativo Universo AMP na VPS
# Arquitetura Padronizada VPS: Docker nginx:alpine + Caddy Reverse Proxy + SSL
# VPS IP: 185.245.182.23 | Rede Docker: wgdashboard_default
# Domínio: amp.adm.br / www.amp.adm.br
# ==============================================================================

param (
    [string]$SiteName = "amp-portal",
    [string]$Domain = "amp.adm.br"
)

$VPS_IP = "185.245.182.23"
$VPS_USER = "root"
$REMOTE_DIR = "/var/www/$SiteName"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  PUBLICANDO: PORTAL CORPORATIVO UNIVERSO AMP NA VPS" -ForegroundColor Cyan
Write-Host "  VPS IP:       $VPS_IP" -ForegroundColor Yellow
Write-Host "  Container:    $SiteName" -ForegroundColor Yellow
Write-Host "  Domínio:      $Domain / www.$Domain" -ForegroundColor Yellow
Write-Host "  Pasta Remota: $REMOTE_DIR" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Gerar Build de Produção com Vite
Write-Host "`n[1/4] Compilando arquivos de produção com Vite..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro durante o build! Abortando deploy." -ForegroundColor Red
    exit 1
}

# 2. Compactar pasta dist
Write-Host "`n[2/4] Compactando pacote amp_dist.tar.gz..." -ForegroundColor Yellow
tar -czf amp_dist.tar.gz -C dist .

if (-not (Test-Path "amp_dist.tar.gz")) {
    Write-Host "Erro: Arquivo amp_dist.tar.gz não encontrado!" -ForegroundColor Red
    exit 1
}

# 3. Enviar pacote e script para /tmp da VPS via SCP
Write-Host "`n[3/4] Enviando arquivos para a VPS (${VPS_IP}:/tmp/)..." -ForegroundColor Yellow
Write-Host "(Digite a senha da VPS root@$VPS_IP caso solicitada)" -ForegroundColor Gray
scp amp_dist.tar.gz setup_remote_amp.sh ${VPS_USER}@${VPS_IP}:/tmp/

if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no envio via SCP. Verifique a conexão com a VPS." -ForegroundColor Red
    exit 1
}

# 4. Executar o script remoto na VPS
Write-Host "`n[4/4] Executando configuração segura na VPS via SSH..." -ForegroundColor Yellow
ssh ${VPS_USER}@${VPS_IP} "bash /tmp/setup_remote_amp.sh '$SiteName' '$Domain' '$REMOTE_DIR' && rm -f /tmp/setup_remote_amp.sh"

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "  DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "  Com o DNS apontado para $VPS_IP, o portal estará no ar em:" -ForegroundColor Cyan
Write-Host "  https://$Domain  (e https://www.$Domain)" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Green
