import re

sql_file = r"C:\Users\Administrador\Downloads\wp_comments_ecp.sql"

with open(sql_file, "r", encoding="latin1") as f:
    sql = f.read()

# Vamos buscar o post_content onde slug seja historia-do-clube ou o-clube ou estatuto-do-clube ou dependencias-do-clube
pages_to_find = ['historia-do-clube', 'dependencias-do-clube', 'academia', 'estatuto-do-clube', 'o-clube']

for p in pages_to_find:
    pattern = rf"\(\s*\d+,\s*\d+,\s*'[^']*',\s*'[^']*',\s*'((?:\\.|[^'])*)',\s*'[^']*',\s*'[^']*',\s*'publish',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'{p}'"
    m = re.search(pattern, sql)
    if m:
        content = m.group(1).replace("\\r\\n", "\n").replace("\\'", "'").replace('\\"', '"')
        print(f"\n==================== CONTEÚDO: {p} ====================")
        print(content[:1500])
