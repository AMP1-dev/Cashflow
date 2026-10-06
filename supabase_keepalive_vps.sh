#!/bin/bash
# ==============================================================================
# Supabase Keep-Alive Ping (Executar via Cron na VPS ou localmente no Linux)
# Mantém os bancos Supabase ativos no plano gratuito, evitando a pausa por 7 dias.
# ==============================================================================

LOG_FILE="/var/log/supabase_keepalive.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE" 2>/dev/null || echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Iniciando ping Supabase..."

# 1. AMP Flow Financeiro
AMP_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcm51bmp4Y210eXJkcmloaXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Njg5NDYsImV4cCI6MjA5NzQ0NDk0Nn0.fGBiJI_Mx0qFd0lLhvC_FKDkH4To56FMFTvkhwKviV0"
AMP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "apikey: $AMP_KEY" \
  -H "Authorization: Bearer $AMP_KEY" \
  "https://eornunjxcmtyrdrihiqk.supabase.co/rest/v1/lancamentos?select=id&limit=1")
log "AMP Flow (eornunjxcmtyrdrihiqk): HTTP $AMP_STATUS"

# 2. Fixos / Drywall
DRYWALL_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ncWFoaG14c21qb3lqZGlrYWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNzUwMDIsImV4cCI6MjEwNDY1MTAwMn0.mzImAieq-IkJL5eVumhW5QxK5u70yN_cnW2H48B-0bs"
DRYWALL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "apikey: $DRYWALL_KEY" \
  -H "Authorization: Bearer $DRYWALL_KEY" \
  "https://ogqahhmxsmjoyjdikafm.supabase.co/rest/v1/drywall_cotacoes?select=id&limit=1")
log "Fixos / Drywall (ogqahhmxsmjoyjdikafm): HTTP $DRYWALL_STATUS"

log "Pings concluídos."
