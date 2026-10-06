import re

sql_file = r'C:\Users\Administrador\Downloads\wp_comments_ecp.sql'

with open(sql_file, 'r', encoding='latin1') as f:
    sql = f.read()

# Vamos pegar títulos de wp_posts onde post_status = 'publish'
# No dump do WP: (ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)

# Regex para pegar post_title e post_type de posts publicados
posts = re.findall(r"\(\s*(\d+),\s*\d+,\s*'[^']*',\s*'[^']*',\s*'(?:\\.|[^'])*',\s*'((?:\\.|[^'])*)',\s*'(?:\\.|[^'])*',\s*'publish',\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'((?:\\.|[^'])*)',\s*'(?:\\.|[^'])*',\s*'(?:\\.|[^'])*',\s*'[^']*',\s*'[^']*',\s*'(?:\\.|[^'])*',\s*\d+,\s*'((?:\\.|[^'])*)',\s*\d+,\s*'([^']*)'", sql)

pages_list = []
posts_list = []
nav_menu_items = []
for p in posts:
    pid, title, slug, guid, ptype = p
    title = title.replace("\\'", "'").replace('\\"', '"')
    if ptype == 'page':
        pages_list.append((pid, title, slug))
    elif ptype == 'post':
        posts_list.append((pid, title, slug))
    elif ptype == 'nav_menu_item':
        nav_menu_items.append((pid, title, slug))

print(f"Total Paginas: {len(pages_list)}")
print(f"Total Posts: {len(posts_list)}")
print(f"Total Menus: {len(nav_menu_items)}")

print("\n--- TODAS AS PAGINAS DO CLUBE ---")
for pid, title, slug in pages_list:
    print(f"- [{pid}] {title} (slug: {slug})")

print("\n--- PRINCIPAIS POSTS / NOTICIAS (Amostra) ---")
for pid, title, slug in posts_list[:25]:
    print(f"- {title}")
