import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

tests = [
    ("Health Check", "docker exec jmartins curl -s http://127.0.0.1/api/health"),
    ("Config Check", "docker exec jmartins curl -s http://127.0.0.1/api/config"),
    ("Index.html check", "docker exec jmartins curl -s http://127.0.0.1/ | grep -o 'Equipe Comercial no WhatsApp'"),
    ("Check No Fixadores", "docker exec jmartins grep -i 'parafuso' /usr/share/nginx/html/index.html || echo 'CLEAN_NO_PARAFUSO'")
]

for title, cmd in tests:
    stdin, stdout, stderr = ssh.exec_command(cmd)
    res = stdout.read().decode().strip()
    print(f"[{title}]: {res}")

ssh.close()
