sql_file = r"C:\Users\Administrador\Downloads\wp_comments_ecp.sql"

targets = ["historia-do-clube", "dependencias-do-clube", "estatuto-do-clube", "academia"]

with open(sql_file, "r", encoding="latin1") as f:
    for line in f:
        if "INSERT INTO `wp_posts`" in line:
            for t in targets:
                idx = line.find(f"'{t}'")
                if idx != -1:
                    start = line.rfind("(", 0, idx)
                    end = line.find(")", idx)
                    chunk = line[start:end]
                    # pegar partes
                    print(f"=== ENCONTRADO: {t} ===")
                    print(chunk[:1000])
                    print("\n" + "="*40 + "\n")
