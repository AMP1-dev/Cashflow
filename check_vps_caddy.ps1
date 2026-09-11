# Script para verificar o estado atual dos sites e do Caddy na VPS 185.245.182.23
$VPS_IP = "185.245.182.23"
$VPS_USER = "root"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  VERIFICANDO ESTADO ATUAL DA VPS ($VPS_IP)" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Executa comandos simples e limpos sem conflito de aspas
ssh ${VPS_USER}@${VPS_IP} "docker ps; echo '--- CADDYFILE ---'; cat /opt/wgdashboard/Caddyfile 2>/dev/null || cat /etc/caddy/Caddyfile 2>/dev/null"
