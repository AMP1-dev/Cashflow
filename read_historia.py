with open(r"C:\Users\Administrador\Downloads\wp_comments_ecp.sql", "r", encoding="latin1") as f:
    for i, line in enumerate(f):
        if i == 52035:
            # limpar tags maliciosas injetadas pelo malware ushort
            import re
            cleaned = re.sub(r'<meta http-equiv=[^>]+>', '', line)
            cleaned = re.sub(r'<script>.*?</script>', '', cleaned)
            with open("historia_extraida.txt", "w", encoding="utf-8") as out:
                out.write(cleaned)
            print("Gravado em historia_extraida.txt com sucesso! Tamanho:", len(cleaned))
            break
