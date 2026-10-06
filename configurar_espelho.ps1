# ==============================================================================
# Script de Configuração do Domínio Espelho amp.ia.br na VPS (185.245.182.23)
# ==============================================================================

$VPS_IP = "185.245.182.23"
$VPS_USER = "root"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  CONFIGURANDO ESPELHO amp.ia.br NA VPS ($VPS_IP)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Enviar script bash para /tmp da VPS
Write-Host "`n[1/2] Enviando script de configuração para a VPS..." -ForegroundColor Yellow
Write-Host "(Digite a senha da VPS root@$VPS_IP caso solicitada)" -ForegroundColor Gray
scp configurar_espelho.sh ${VPS_USER}@${VPS_IP}:/tmp/

if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no envio via SCP. Verifique a senha ou conexao." -ForegroundColor Red
    exit 1
}

# 2. Executar script remoto
Write-Host "`n[2/2] Executando atualizacao do Caddy na VPS..." -ForegroundColor Yellow
ssh ${VPS_USER}@${VPS_IP} "bash /tmp/configurar_espelho.sh && rm -f /tmp/configurar_espelho.sh"

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "  PROCESSO CONCLUIDO!" -ForegroundColor Green
Write-Host "  O Caddy agora responde e emite SSL automatico para:" -ForegroundColor Cyan
Write-Host "  - https://amp.ia.br" -ForegroundColor White
Write-Host "  - https://www.amp.ia.br" -ForegroundColor White
Write-Host "  - https://amp.adm.br" -ForegroundColor White
Write-Host "  - https://www.amp.adm.br" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Green
