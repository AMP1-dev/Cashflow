# ==============================================================================
# Script de Deploy Automático: Esporte Clube Palmeirense (Desde 1908)
# VPS IP: 185.245.182.23 (Docker nginx:alpine + Caddy Reverse Proxy + SSL)
# Domínio Oficial: esporteclubepalmeirense.com / www.esporteclubepalmeirense.com
# ==============================================================================

$VPS_IP = "185.245.182.23"
$VPS_USER = "root"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  PUBLICANDO: ESPORTE CLUBE PALMEIRENSE NA VPS ($VPS_IP)" -ForegroundColor Cyan
Write-Host "  Domínio:   https://esporteclubepalmeirense.com" -ForegroundColor Yellow
Write-Host "  Container: palmeirense" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Compilar arquivos de produção com Vite
Write-Host "`n[1/3] Compilando arquivos de produção com Vite..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no build! Abortando deploy." -ForegroundColor Red
    exit 1
}

# 2. Empacotar distribuição
Write-Host "`n[2/3] Gerando pacote palmeirense_dist.tar.gz..." -ForegroundColor Yellow
tar -czf palmeirense_dist.tar.gz -C dist .

if (-not (Test-Path "palmeirense_dist.tar.gz")) {
    Write-Host "Erro: Arquivo palmeirense_dist.tar.gz não encontrado!" -ForegroundColor Red
    exit 1
}

# 3. Enviar arquivos para a VPS e executar configuração remota
Write-Host "`n[3/3] Enviando pacote e script para a VPS via SCP..." -ForegroundColor Yellow
Write-Host "(Digite a senha da VPS root@$VPS_IP se solicitada)" -ForegroundColor Gray

scp palmeirense_dist.tar.gz ${VPS_USER}@${VPS_IP}:/tmp/
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no envio do pacote via SCP. Verifique a senha ou rede." -ForegroundColor Red
    exit 1
}

scp setup_remote_palmeirense.sh ${VPS_USER}@${VPS_IP}:/tmp/
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no envio do script via SCP." -ForegroundColor Red
    exit 1
}

Write-Host "`nExecutando configuração do Docker e Caddyfile na VPS via SSH..." -ForegroundColor Yellow
ssh ${VPS_USER}@${VPS_IP} "bash /tmp/setup_remote_palmeirense.sh && rm -f /tmp/setup_remote_palmeirense.sh"

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "  DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "  O portal já está ativo e com SSL automático no ar:" -ForegroundColor Cyan
Write-Host "  - https://esporteclubepalmeirense.com" -ForegroundColor White
Write-Host "  - https://www.esporteclubepalmeirense.com" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Green
