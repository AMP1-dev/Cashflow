from PIL import Image

# 1. Inspecionar hero_steel.jpg
im = Image.open('assets/hero_steel.jpg')
banner = im.crop((180, 140, 550, 310))
banner.save('scratch_banner.jpg')
crane = im.crop((630, 375, 700, 410))
crane.save('scratch_crane.jpg')

# 2. Inspecionar logistica_sp_mg.jpg
im2 = Image.open('assets/logistica_sp_mg.jpg')
truck_door = im2.crop((200, 500, 420, 750))
truck_door.save('scratch_truck_door.jpg')
truck_roof = im2.crop((200, 510, 410, 580))
truck_roof.save('scratch_truck_roof.jpg')
arch = im2.crop((240, 380, 580, 430))
arch.save('scratch_arch.jpg')

# 3. Inspecionar bobinas_aco.jpg
im3 = Image.open('assets/bobinas_aco.jpg')
coil_text = im3.crop((650, 760, 790, 830))
coil_text.save('scratch_coil.jpg')
coil_tag = im3.crop((800, 470, 870, 580))
coil_tag.save('scratch_coil_tag.jpg')

print('Crops saved successfully!')
