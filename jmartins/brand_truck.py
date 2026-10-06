from PIL import Image
import numpy as np

# Load base image
base = Image.open(r'C:\Users\Administrador\.gemini\antigravity\brain\e1ccb35e-16cb-46c7-b8a1-bf4bff8fb899\jmartins_logistica_nova_1790703719150.jpg').convert('RGBA')
logo = Image.open('assets/logo_jmartins_white.png').convert('RGBA')

# Target area on truck door:
# Door surface roughly around x: 635 to 715, y: 505 to 555
# Perspective transform:
target_w = 78
target_h = int(logo.size[1] * (target_w / logo.size[0]))

logo_resized = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Create an overlay image
overlay = Image.new('RGBA', base.size, (0, 0, 0, 0))

# Place on door
pos_x = 636
pos_y = 512
overlay.paste(logo_resized, (pos_x, pos_y), logo_resized)

# Save test
branded = Image.alpha_composite(base, overlay).convert('RGB')
branded.save('scratch_branded_truck.jpg', quality=95)
print('Saved scratch_branded_truck.jpg')
