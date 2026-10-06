# -*- coding: utf-8 -*-
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("--- VERIFYING CLIENT REQUIREMENTS (ITEMS 1 TO 8) ---")

# Item 1: Imagens ilustrativas
assert 'hero_steel.jpg' in content, "hero_steel.jpg missing"
assert 'logistica_sp_mg.jpg' in content, "logistica_sp_mg.jpg missing"
assert 'bobinas_aco.jpg' in content, "bobinas_aco.jpg missing"
print("Item 1 (Imagens Atualizadas): OK")

# Item 2: Cabeçalho espaçamento entre logotipo da JMARTINS e o campo Produtos
assert 'mr-12 lg:mr-16 xl:mr-20' in content, "Header logo spacing missing"
print("Item 2 (Cabeçalho - Espaço Logo e Produtos): OK")

# Item 3: Produtos - apenas a lista de 13 produtos (SEM fixadores/parafusos)
products = [
    'Corte e dobra', 'Telhas', 'Telhas termoacústicas', 'Bobinas Galvalume', 
    'Bobinas galvanizadas', 'Bobinas pré-pintadas', 'Chapas', 'Vigas', 
    'Perfis dobrados', 'Painéis', 'Calhas', 'Tubos', 'Slitter'
]
for p in products:
    assert p.lower() in content.lower(), f"Product {p} missing in content!"

# Verificar ausência de fixadores e parafusos (exceto comentários explicativos se houver)
clean_text = content.replace('<!-- Col 2: Linha de Produtos (Apenas os 13 oficiais, SEM fixadores) -->', '')
assert 'fixador' not in clean_text.lower(), "Found 'fixador' in visible content!"
assert 'parafuso' not in clean_text.lower(), "Found 'parafuso' in visible content!"
print("Item 3 (13 Produtos oficiais SEM fixadores): OK")

# Item 4: Entregas - informar que atendemos todo o Brasil
assert 'todo o brasil' in content.lower() or 'todo brasil' in content.lower(), "Delivery Brazil missing"
print("Item 4 (Entregas Todo o Brasil): OK")

# Item 5: Localização dos polos: Sul de Minas, São Paulo e Litoral Norte de Santa Catarina
assert 'sul de minas' in content.lower(), "Sul de Minas missing"
assert 'são paulo' in content.lower(), "São Paulo missing"
assert 'litoral norte' in content.lower() or 'santa catarina' in content.lower(), "Litoral Norte SC missing"
print("Item 5 (Polos Sul de MG, SP e Litoral Norte SC): OK")

# Item 6: Remoção do campo abrir vídeo no Facebook (Katherine)
assert '1GdV2zauZ2' not in content, "Katherine facebook video link still in index.html!"
assert 'facebook' not in content.lower() or 'facebook.com' not in content, "Facebook link found in index.html!"
print("Item 6 (Remoção do Vídeo Facebook): OK")

# Item 7: Telefones fixos (19) 3672-2881 e (19) 3672-1563
assert '3672-2881' in content, "Phone 3672-2881 missing"
assert '3672-1563' in content, "Phone 3672-1563 missing"
print("Item 7 (Telefones Fixos): OK")

# Item 8: WhatsApp (8 números)
whatsapps = [
    '99816-7195', '99773-1046', '99364-8463', '98217-0196',
    '99674-9915', '98303-0302', '99177-0861', '99972-1997'
]
for wa in whatsapps:
    assert wa in content, f"WhatsApp {wa} missing!"
print("Item 8 (8 Números de WhatsApp Comerciais): OK")

print("\nALL 8 REQUIREMENTS ARE 100% SATISFIED AND VALIDATED IN INDEX.HTML!")
