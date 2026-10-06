import paramiko
import os

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=15)

# Criar pastas
stdin, stdout, stderr = ssh.exec_command('mkdir -p /opt/jmartins_build /var/www/jmartins_data')
stdout.read()

sftp = ssh.open_sftp()
local_dir = r'c:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\jmartins'
files = ['Dockerfile', 'default.conf', 'api.py', 'entrypoint.sh']

for f in files:
    src = os.path.join(local_dir, f)
    dst = f'/opt/jmartins_build/{f}'
    print(f'Uploading {f} -> {dst}')
    sftp.put(src, dst)

sftp.close()

# Build e Run
deploy_cmd = """
cd /opt/jmartins_build
# Converter finais de linha para Unix
sed -i 's/\\r$//' entrypoint.sh default.conf api.py Dockerfile
chmod +x entrypoint.sh api.py

docker build -t jmartins:app .

# Parar container antigo se existir
docker stop jmartins || true
docker rm jmartins || true

# Subir novo container com SQLite e Nginx
docker run -d --name jmartins \
  --restart unless-stopped \
  --network wgdashboard_default \
  -v /var/www/jmartins:/usr/share/nginx/html:ro \
  -v /var/www/jmartins_data:/data:rw \
  jmartins:app

sleep 2
docker ps --filter name=jmartins
curl -s http://127.0.0.1:80/api/health || docker logs --tail 20 jmartins
"""

print('Building and launching container...')
stdin, stdout, stderr = ssh.exec_command(deploy_cmd)
out = stdout.read().decode()
err = stderr.read().decode()

print('OUTPUT:\n', out)
if err:
    print('STDERR:\n', err)

ssh.close()
