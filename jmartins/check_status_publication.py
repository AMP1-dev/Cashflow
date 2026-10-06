import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

commands = [
    ("Status Container Docker", "docker ps --filter name=jmartins --format '{{.Names}}: {{.Status}}'"),
    ("API Health no VPS", "docker exec jmartins curl -s http://127.0.0.1/api/health"),
    ("Telefones no index.html VPS", "grep -o '(19) 3672-2881' /var/www/jmartins/index.html | head -n 1"),
    ("WhatsApp no index.html VPS", "grep -o 'whatsappModal' /var/www/jmartins/index.html | head -n 1"),
    ("Timestamp index.html VPS", "stat -c '%y' /var/www/jmartins/index.html"),
    ("Caddy Reverse Proxy Test", "curl -s -k -I https://jmartins.ind.br | head -n 5")
]

for title, cmd in commands:
    _, out, _ = ssh.exec_command(cmd)
    print(f"{title}: {out.read().decode().strip()}")

ssh.close()
