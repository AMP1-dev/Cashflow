import re

sql_file = r'C:\Users\Administrador\Downloads\wp_comments_ecp.sql'

print("Lendo dump do banco...")
with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

print("Tamanho carregado:", len(content), "caracteres")

# Extrair options
opt_matches = re.findall(r"\(\d+,\s*'([^']+)',\s*'([^']*)',\s*'([^']*)'\)", content)
options = {m[0]: m[1] for m in opt_matches if m[0] in ['blogname', 'blogdescription', 'siteurl', 'home', 'admin_email']}
print("\n--- OPCOES PRINCIPAIS ---")
for k, v in options.items():
    print(f"{k}: {v}")

# Categorias / Terms
terms_matches = re.findall(r"\((\d+),\s*'([^']*)',\s*'([^']*)',\s*(\d+)\)", content)
print(f"\n--- TERMOS / CATEGORIAS (Total: {len(terms_matches)}) ---")
for tid, name, slug, _ in terms_matches[:30]:
    print(f"[{tid}] {name} ({slug})")

# Pages and Posts
page_matches = re.findall(r"\((?:\d+,\s*){4}'[^']*',\s*'([^']*)',\s*'[^']*',\s*'publish',\s*'(?:[^']*)',\s*'(?:[^']*)',\s*'(?:[^']*)',\s*'([^']*)',\s*'(?:[^']*)',\s*'(?:[^']*)',\s*'([^']*)',\s*'(?:[^']*)',\s*'(?:[^']*)',\s*\d+,\s*'([^']*)',\s*\d+,\s*'page'", content)
print(f"\n--- PAGINAS PUBLICADAS (Total: {len(page_matches)}) ---")
for p in page_matches[:30]:
    print(f"Pagina: {p[0]} (slug: {p[1]})")

# Hugeit Slider
slider_slides = re.findall(r"INSERT INTO `wp_hugeit_slider_slide`.*?VALUES\s*(.*?);", content, re.DOTALL)
if slider_slides:
    print("\n--- SLIDERS DETECTADOS ---")
    slides = re.findall(r"\((.*?)\)", slider_slides[0])
    for s in slides[:10]:
        print("Slide:", s[:150])

