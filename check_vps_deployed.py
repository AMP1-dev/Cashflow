import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007')

cmd = """
echo "=== JS FILES ON VPS ==="
ls -lt /var/www/amplificadora/assets/*.js | head -n 5

echo "=== INDEX.HTML ON VPS ==="
cat /var/www/amplificadora/index.html | grep -o 'assets/index-[^"]*'

echo "=== GREP CH-LIVESHOWS IN LATEST JS ==="
grep -o 'id:"ch-liveshows"[^}]*' /var/www/amplificadora/assets/index-*.js
"""

stdin, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode())
print(stderr.read().decode())
ssh.close()
