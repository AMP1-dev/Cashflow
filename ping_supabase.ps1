# Script de Keep-Alive / Ping para todos os projetos Supabase
# Mantém os bancos ativos no plano Free sem risco de pausa por inatividade (7 dias)

$projects = @(
    @{
        Name = "AMP Flow Financeiro"
        Ref  = "eornunjxcmtyrdrihiqk"
        Url  = "https://eornunjxcmtyrdrihiqk.supabase.co/rest/v1/lancamentos?select=id&limit=1"
        Key  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcm51bmp4Y210eXJkcmloaXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Njg5NDYsImV4cCI6MjA5NzQ0NDk0Nn0.fGBiJI_Mx0qFd0lLhvC_FKDkH4To56FMFTvkhwKviV0"
    },
    @{
        Name = "Fixos / Drywall"
        Ref  = "ogqahhmxsmjoyjdikafm"
        Url  = "https://ogqahhmxsmjoyjdikafm.supabase.co/rest/v1/drywall_cotacoes?select=id&limit=1"
        Key  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ncWFoaG14c21qb3lqZGlrYWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNzUwMDIsImV4cCI6MjEwNDY1MTAwMn0.mzImAieq-IkJL5eVumhW5QxK5u70yN_cnW2H48B-0bs"
    }
)

Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "   SUPABASE KEEP-ALIVE PING - AMP ECOSYSTEM" -ForegroundColor Cyan
Write-Host "===============================================`n" -ForegroundColor Cyan

foreach ($p in $projects) {
    Write-Host -NoNewline "[$($p.Name)] Pingando ref $($p.Ref)... "
    try {
        $headers = @{
            "apikey"        = $p.Key
            "Authorization" = "Bearer $($p.Key)"
        }
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $resp = Invoke-RestMethod -Uri $p.Url -Headers $headers -Method Get -TimeoutSec 10
        $sw.Stop()
        Write-Host "OK ($($sw.ElapsedMilliseconds)ms) - Atividade registrada!" -ForegroundColor Green
    }
    catch {
        Write-Host "AVISO / ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nContadores de inatividade zerados com sucesso!`n" -ForegroundColor Cyan
