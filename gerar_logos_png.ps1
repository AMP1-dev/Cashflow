# Script PowerShell para gerar os logos PNG em alta resolução (2048x2048) com fundo transparente

Add-Type -AssemblyName System.Drawing

function Gerar-Globo-PNG {
    param (
        [string]$CaminhoSaida,
        [string]$CorHex = "#0052D9",
        [int]$Tamanho = 2048
    )

    $bmp = New-Object System.Drawing.Bitmap($Tamanho, $Tamanho, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Alta qualidade de renderização e antialiasing
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $cor = [System.Drawing.ColorTranslator]::FromHtml($CorHex)
    
    # Espessura proporcional
    $penGrossa = New-Object System.Drawing.Pen($cor, ($Tamanho * 0.055))
    $penMedia = New-Object System.Drawing.Pen($cor, ($Tamanho * 0.045))
    $penFina = New-Object System.Drawing.Pen($cor, ($Tamanho * 0.038))

    $margem = $Tamanho * 0.08
    $diametro = $Tamanho - (2 * $margem)
    $centro = $Tamanho / 2

    # 1. Círculo Externo (Perímetro)
    $g.DrawEllipse($penGrossa, [float]$margem, [float]$margem, [float]$diametro, [float]$diametro)

    # 2. Linha do Equador (Horizontal)
    $g.DrawLine($penMedia, [float]$margem, [float]$centro, [float]($Tamanho - $margem), [float]$centro)

    # 3. Meridiano Central (Vertical)
    $g.DrawLine($penMedia, [float]$centro, [float]$margem, [float]$centro, [float]($Tamanho - $margem))

    # 4. Paralelo Superior
    $latSupY = $centro - ($diametro * 0.22)
    $latSupH = $diametro * 0.38
    $latSupW = $diametro * 0.90
    $latSupX = $centro - ($latSupW / 2)
    $g.DrawEllipse($penFina, [float]$latSupX, [float]($latSupY - ($latSupH/2)), [float]$latSupW, [float]$latSupH)

    # 5. Paralelo Inferior
    $latInfY = $centro + ($diametro * 0.22)
    $g.DrawEllipse($penFina, [float]$latSupX, [float]($latInfY - ($latSupH/2)), [float]$latSupW, [float]$latSupH)

    # 6. Meridiano Esquerdo
    $merd1W = $diametro * 0.52
    $merd1X = $centro - ($merd1W / 2)
    $g.DrawEllipse($penFina, [float]$merd1X, [float]$margem, [float]$merd1W, [float]$diametro)

    # 7. Meridiano Direito
    $merd2W = $diametro * 0.80
    $merd2X = $centro - ($merd2W / 2)
    $g.DrawEllipse($penFina, [float]$merd2X, [float]$margem, [float]$merd2W, [float]$diametro)

    $bmp.Save($CaminhoSaida, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Criado: $CaminhoSaida" -ForegroundColor Green
}

function Gerar-Logo-Completo-PNG {
    param (
        [string]$CaminhoSaida,
        [string]$CorHex = "#0052D9",
        [string]$TaglineCorHex = "#64748B",
        [int]$Largura = 2400,
        [int]$Altura = 900
    )

    $bmp = New-Object System.Drawing.Bitmap($Largura, $Altura, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    $cor = [System.Drawing.ColorTranslator]::FromHtml($CorHex)
    $corTag = [System.Drawing.ColorTranslator]::FromHtml($TaglineCorHex)

    # --- DESENHO DO GLOBO À ESQUERDA ---
    $globoTam = 560
    $margemEsq = 120
    $globoY = ($Altura - $globoTam) / 2 - 30

    $penGrossa = New-Object System.Drawing.Pen($cor, 30)
    $penMedia = New-Object System.Drawing.Pen($cor, 24)
    $penFina = New-Object System.Drawing.Pen($cor, 18)

    $g.DrawEllipse($penGrossa, [float]$margemEsq, [float]$globoY, [float]$globoTam, [float]$globoTam)
    
    $gCentroX = $margemEsq + ($globoTam / 2)
    $gCentroY = $globoY + ($globoTam / 2)

    $g.DrawLine($penMedia, [float]$margemEsq, [float]$gCentroY, [float]($margemEsq + $globoTam), [float]$gCentroY)
    $g.DrawLine($penMedia, [float]$gCentroX, [float]$globoY, [float]$gCentroX, [float]($globoY + $globoTam))

    # Paralelos
    $latH = $globoTam * 0.38
    $latW = $globoTam * 0.90
    $g.DrawEllipse($penFina, [float]($gCentroX - $latW/2), [float]($gCentroY - $globoTam*0.22 - $latH/2), [float]$latW, [float]$latH)
    $g.DrawEllipse($penFina, [float]($gCentroX - $latW/2), [float]($gCentroY + $globoTam*0.22 - $latH/2), [float]$latW, [float]$latH)

    # Meridianos
    $merdW1 = $globoTam * 0.52
    $g.DrawEllipse($penFina, [float]($gCentroX - $merdW1/2), [float]$globoY, [float]$merdW1, [float]$globoTam)

    # --- DESENHO DO TEXTO "AMP" ---
    $penLetras = New-Object System.Drawing.Pen($cor, 46)
    $penLetras.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penLetras.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penLetras.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $ampX = $margemEsq + $globoTam + 140
    $ampYTop = $globoY + 80
    $ampYBottom = $globoY + 480
    $ampAlt = $ampYBottom - $ampYTop

    # Letra A
    $aW = 260
    $g.DrawLine($penLetras, [float]$ampX, [float]$ampYBottom, [float]($ampX + $aW/2), [float]$ampYTop)
    $g.DrawLine($penLetras, [float]($ampX + $aW/2), [float]$ampYTop, [float]($ampX + $aW), [float]$ampYBottom)
    $g.DrawLine($penLetras, [float]($ampX + 45), [float]($ampYTop + $ampAlt*0.62), [float]($ampX + $aW - 45), [float]($ampYTop + $ampAlt*0.62))

    # Letra M
    $mX = $ampX + $aW + 110
    $mW = 340
    $g.DrawLine($penLetras, [float]$mX, [float]$ampYBottom, [float]$mX, [float]$ampYTop)
    $g.DrawLine($penLetras, [float]$mX, [float]$ampYTop, [float]($mX + $mW/2), [float]($ampYTop + $ampAlt*0.62))
    $g.DrawLine($penLetras, [float]($mX + $mW/2), [float]($ampYTop + $ampAlt*0.62), [float]($mX + $mW), [float]$ampYTop)
    $g.DrawLine($penLetras, [float]($mX + $mW), [float]$ampYTop, [float]($mX + $mW), [float]$ampYBottom)

    # Letra P
    $pX = $mX + $mW + 110
    $pW = 230
    $g.DrawLine($penLetras, [float]$pX, [float]$ampYBottom, [float]$pX, [float]$ampYTop)
    $g.DrawLine($penLetras, [float]$pX, [float]$ampYTop, [float]($pX + $pW*0.6), [float]$ampYTop)
    
    $pArcH = $ampAlt * 0.52
    $g.DrawArc($penLetras, [float]($pX + $pW*0.1), [float]$ampYTop, [float]($pW * 0.9), [float]$pArcH, [float]-90, [float]180)
    $g.DrawLine($penLetras, [float]($pX + $pW*0.6), [float]($ampYTop + $pArcH), [float]$pX, [float]($ampYTop + $pArcH))

    # --- TAGLINE "AMPLIANDO SUA TECNOLOGIA" ---
    $fontFamily = New-Object System.Drawing.FontFamily("Arial")
    $font = New-Object System.Drawing.Font($fontFamily, 44, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush($corTag)
    $g.DrawString("AMPLIANDO SUA TECNOLOGIA", $font, $brush, [float]($ampX + 5), [float]($ampYBottom + 70))

    $bmp.Save($CaminhoSaida, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Criado: $CaminhoSaida" -ForegroundColor Green
}

# 1. Gerar na Área de Trabalho (Desktop)
$desktop = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$publicDir = "c:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\public"

# Ícones do Globo Isolados (Alta Resolução 2048x2048 - Transparente)
Gerar-Globo-PNG -CaminhoSaida "$desktop\logo_globo_amp_azul_petroleo.png" -CorHex "#0052D9" -Tamanho 2048
Gerar-Globo-PNG -CaminhoSaida "$desktop\logo_globo_amp_branco.png" -CorHex "#FFFFFF" -Tamanho 2048
Gerar-Globo-PNG -CaminhoSaida "$desktop\logo_globo_amp_grafite.png" -CorHex "#0F172A" -Tamanho 2048

# Logos Completos com Tipografia (2400x900 - Transparente)
Gerar-Logo-Completo-PNG -CaminhoSaida "$desktop\logo_completo_amp_azul.png" -CorHex "#0052D9" -TaglineCorHex "#64748B"
Gerar-Logo-Completo-PNG -CaminhoSaida "$desktop\logo_completo_amp_branco.png" -CorHex "#FFFFFF" -TaglineCorHex "#E2E8F0"

# Cópias na pasta public do projeto
Gerar-Globo-PNG -CaminhoSaida "$publicDir\logo_globo_amp_azul_petroleo.png" -CorHex "#0052D9" -Tamanho 2048
Gerar-Globo-PNG -CaminhoSaida "$publicDir\logo_globo_amp_branco.png" -CorHex "#FFFFFF" -Tamanho 2048
Gerar-Logo-Completo-PNG -CaminhoSaida "$publicDir\logo_completo_amp_azul.png" -CorHex "#0052D9" -TaglineCorHex "#64748B"
