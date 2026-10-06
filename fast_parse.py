sql_file = r"C:\Users\Administrador\Downloads\wp_comments_ecp.sql"

pages = []
posts = []

with open(sql_file, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        if "INSERT INTO `wp_posts`" in line or (line.startswith("(") and ("'page'" in line or "'post'" in line)):
            # Quebra por tuplas no formato aproximado
            items = line.split("),(")
            for it in items:
                if "'publish'" in it:
                    if "'page'" in it:
                        pages.append(it)
                    elif "'post'" in it:
                        posts.append(it)

print(f"Total paginas publicadas brutas: {len(pages)}")
print(f"Total posts publicados brutos: {len(posts)}")

# Vamos extrair os titulos
import re
print("\n--- TITULOS DE PAGINAS ---")
for p in pages:
    # procurar o titulo (geralmente entre o post_content e post_excerpt)
    m = re.findall(r"'([^']{3,80})'", p)
    # candidatos a titulo
    for cand in m:
        if any(w in cand.lower() for w in ['historia', 'clube', 'diretoria', 'estatuto', 'social', 'esporte', 'futebol', 'contato', 'sede', 'parque', 'piscina', 'boate', 'academia', 'evento', 'palmeirense', 'baile', 'sauna', 'quiosque']):
            print("Página:", cand)

print("\n--- AMOSTRA DE POSTS / NOTICIAS ---")
for p in posts[:20]:
    m = re.findall(r"'([^']{4,80})'", p)
    for cand in m:
        if any(w in cand.lower() for w in ['baile', 'festa', 'torneio', 'carnaval', 'show', 'campeonato', 'reveillon', 'boate', 'genesis', 'clube', 'social', 'esporte']):
            print("Post:", cand)
