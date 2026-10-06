# ==============================================================================
# Script de Publicação Automática: Rádio Amplificadora na VPS
# Arquitetura Padronizada VPS: Docker / Nginx / Caddy Reverse Proxy
# VPS IP: 185.245.182.23
# ==============================================================================

param (
    [string]$SiteName = "amplificadora",
    [string]$Domain = "amplificadora.com.br"
)

$VPS_IP = "185.245.182.23"
$VPS_USER = "root"
$REMOTE_DIR = "/var/www/$SiteName"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  PUBLICANDO: RÁDIO AMPLIFICADORA NA VPS" -ForegroundColor Cyan
Write-Host "  VPS IP:       $VPS_IP" -ForegroundColor Yellow
Write-Host "  Domínio:      $Domain / www.$Domain" -ForegroundColor Yellow
Write-Host "  Pasta Remota: $REMOTE_DIR" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Gerar Build de Produção
Write-Host "`n[1/3] Compilando arquivos de produção com Vite..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro durante o build! Abortando deploy." -ForegroundColor Red
    exit 1
}

# 2. Compactar pasta dist
Write-Host "`n[2/3] Empacotando dist.tar.gz..." -ForegroundColor Yellow
tar -czf dist.tar.gz -C dist .

# 3. Enviar para a VPS
Write-Host "`n[3/3] Enviando dist.tar.gz para a VPS ($VPS_IP:/tmp/)..." -ForegroundColor Yellow
Write-Host "Insira a senha do servidor caso solicitada:" -ForegroundColor Gray
scp dist.tar.gz ${VPS_USER}@${VPS_IP}:/tmp/dist.tar.gz

if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha no envio via SCP. Verifique a senha ou a conexão." -ForegroundColor Red
    exit 1
}

# 4. Extrair na pasta remota
Write-Host "`nExtraindo arquivos em $REMOTE_DIR na VPS..." -ForegroundColor Yellow
ssh ${VPS_USER}@${VPS_IP} "mkdir -p $REMOTE_DIR && tar -xzf /tmp/dist.tar.gz -C $REMOTE_DIR && rm -f /tmp/dist.tar.gz && chmod -R 755 $REMOTE_DIR"

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "  DEPLOY CONCLUÍDO COM SUCESSO EM https://$Domain !" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
