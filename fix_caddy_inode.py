import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

cmds = """
# 1. Ajustar o Caddyfile sem mudar o inode (usando cp ou cat direto)
python3 -c "
with open('/opt/wgdashboard/Caddyfile', 'r') as f:
    content = f.read()
content = content.replace('jmartinsindustrial.com.br', 'jmartins.ind.br')
with open('/opt/wgdashboard/Caddyfile', 'w') as f:
    f.write(content)
"

# 2. Verificar se dentro do container Caddy agora reflete jmartins.ind.br
echo "=== CADDYFILE DENTRO DO CONTAINER ==="
docker exec caddy tail -n 8 /etc/caddy/Caddyfile

# 3. Se ainda estiver com o inode antigo, copiar direto para dentro do container
docker cp /opt/wgdashboard/Caddyfile caddy:/etc/caddy/Caddyfile

echo "=== APOS DOCKER CP ==="
docker exec caddy tail -n 8 /etc/caddy/Caddyfile

# 4. Validar e recarregar
docker exec caddy caddy validate --config /etc/caddy/Caddyfile
docker exec caddy caddy reload --config /etc/caddy/Caddyfile

echo "=== AGUARDANDO EMISSAO DO CERTIFICADO SSL ==="
sleep 5
docker exec caddy wget -S --spider https://jmartins.ind.br 2>&1 | head -n 20
"""

stdin, stdout, stderr = ssh.exec_command(cmds)
print(stdout.read().decode('utf-8', errors='ignore'))
err = stderr.read().decode('utf-8', errors='ignore')
if err:
    print("LOG/ERR:", err)
ssh.close()
