import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ASSETS_DIR = r'c:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\jmartins\assets'

# ==========================================
# 1. EDITAR HERO_STEEL.JPG
# ==========================================
print('--- Editing hero_steel.jpg ---')
hero = Image.open(os.path.join(ASSETS_DIR, 'hero_steel.jpg')).convert('RGBA')

# 1.1 Remover 'BEMAG' do guindaste amarelo no fundo
# Cor amarela do guindaste ao redor de (650, 390)
crane_color = hero.getpixel((640, 390))
draw_hero = ImageDraw.Draw(hero)
draw_hero.rectangle([645, 383, 685, 397], fill=crane_color)

# 1.2 Remover 'VALE AÇO' e sobrepor marca JMARTINS
# O banner escuro fica aproximadamente entre (200, 150) e (520, 270)
# Vamos preencher a área do texto com o cinza escuro do banner
# Polígono do banner com perspectiva
banner_bg = (38, 44, 48, 255)
# Cobrir o texto 'VALE AÇO...' com polígono suave
draw_hero.polygon([
    (200, 140),
    (540, 305),
    (540, 335),
    (200, 175)
], fill=banner_bg)

# Adicionar faixa vermelha institucional JMARTINS no topo do banner
draw_hero.polygon([
    (200, 137),
    (540, 302),
    (540, 308),
    (200, 143)
], fill=(220, 38, 38, 255))

# Carregar logo oficial branco da JMartins
logo_white = Image.open(os.path.join(ASSETS_DIR, 'logo_jmartins_white.png')).convert('RGBA')
# Redimensionar logo para caber com perfeição no banner
lw, lh = logo_white.size
target_w = 260
target_h = int(lh * (target_w / lw))
logo_resized = logo_white.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Rotacionar ligeiramente para coincidir com a perspectiva do trilho (~22 graus)
angle = -22.5
logo_rotated = logo_resized.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)

# Colar no banner
hero.paste(logo_rotated, (235, 170), logo_rotated)

hero.convert('RGB').save(os.path.join(ASSETS_DIR, 'hero_steel.jpg'), quality=95)
print('hero_steel.jpg updated successfully!')

# ==========================================
# 2. EDITAR LOGISTICA_SP_MG.JPG
# ==========================================
print('--- Editing logistica_sp_mg.jpg ---')
logistica = Image.open(os.path.join(ASSETS_DIR, 'logistica_sp_mg.jpg')).convert('RGBA')
draw_log = ImageDraw.Draw(logistica)

# 2.1 Remover 'USIMINAS' no pórtico ao fundo
# Obter cor média da viga cinza do pórtico
arch_color = logistica.getpixel((300, 402))
draw_log.rectangle([300, 390, 440, 418], fill=arch_color)

# Escrever JMARTINS no pórtico ao fundo com fonte limpa
try:
    font_arch = ImageFont.truetype("arialbd.ttf", 15)
except Exception:
    font_arch = ImageFont.load_default()
draw_log.text((320, 396), "JMARTINS", fill=(220, 38, 38, 255), font=font_arch)

# 2.2 Cobrir 'METALSUL' e logo na lateral do caminhão (porta prata)
door_color = (205, 210, 215, 255) # Prata metálico da porta
# Cobrir área do logo e texto na porta
draw_log.polygon([
    (280, 500),
    (410, 440),
    (415, 520),
    (285, 580)
], fill=door_color)

# Colocar logotipo JMartins na porta
logo_truck = Image.open(os.path.join(ASSETS_DIR, 'logo_jmartins.png')).convert('RGBA')
lw, lh = logo_truck.size
truck_logo_w = 120
truck_logo_h = int(lh * (truck_logo_w / lw))
truck_logo_res = logo_truck.resize((truck_logo_w, truck_logo_h), Image.Resampling.LANCZOS)
# Rotação da perspectiva da porta (~ -25 graus)
truck_logo_rot = truck_logo_res.rotate(-25, expand=True, resample=Image.Resampling.BICUBIC)
logistica.paste(truck_logo_rot, (290, 475), truck_logo_rot)

# 2.3 Cobrir 'METALSUL' no quebra-sol vermelho do teto
roof_color = (200, 25, 25, 255)
draw_log.polygon([
    (210, 515),
    (310, 515),
    (310, 535),
    (210, 535)
], fill=roof_color)

try:
    font_truck = ImageFont.truetype("arialbd.ttf", 13)
except Exception:
    font_truck = ImageFont.load_default()
draw_log.text((220, 518), "JMARTINS", fill=(255, 255, 255, 255), font=font_truck)

# 2.4 Alterar a faixa 'MINAS GERAIS - SÃO PAULO' para 'ENTREGAS TODO O BRASIL'
front_color = (210, 30, 30, 255)
draw_log.polygon([
    (110, 425),
    (250, 465),
    (250, 495),
    (110, 455)
], fill=front_color)

try:
    font_front = ImageFont.truetype("arialbd.ttf", 12)
except Exception:
    font_front = ImageFont.load_default()
# Leve rotação de texto ou linha
draw_log.text((115, 442), "ENTREGAS TODO BRASIL", fill=(255, 255, 255, 255), font=font_front)

logistica.convert('RGB').save(os.path.join(ASSETS_DIR, 'logistica_sp_mg.jpg'), quality=95)
print('logistica_sp_mg.jpg updated successfully!')

# ==========================================
# 3. EDITAR BOBINAS_ACO.JPG
# ==========================================
print('--- Editing bobinas_aco.jpg ---')
bobinas = Image.open(os.path.join(ASSETS_DIR, 'bobinas_aco.jpg')).convert('RGBA')
draw_bob = ImageDraw.Draw(bobinas)

# 3.1 Cobrir 'PRIME STEEL' na borda inferior da bobina
# Amostra de cor do aço galvanizado ao redor
steel_color = (195, 200, 205, 255)
draw_bob.polygon([
    (670, 770),
    (765, 815),
    (760, 835),
    (665, 790)
], fill=steel_color)

# 3.2 Cobrir 'PRIME AZ150' na borda direita da bobina
draw_bob.polygon([
    (810, 475),
    (865, 520),
    (850, 565),
    (795, 520)
], fill=steel_color)

# Colocar 'JMARTINS' na etiqueta da bobina
try:
    font_coil = ImageFont.truetype("arialbd.ttf", 14)
except Exception:
    font_coil = ImageFont.load_default()

draw_bob.text((675, 785), "JMARTINS", fill=(50, 55, 60, 255), font=font_coil)
draw_bob.text((805, 510), "JMARTINS", fill=(50, 55, 60, 255), font=font_coil)

bobinas.convert('RGB').save(os.path.join(ASSETS_DIR, 'bobinas_aco.jpg'), quality=95)
print('bobinas_aco.jpg updated successfully!')

print('All 3 images cleanly edited with JMartins branding!')
