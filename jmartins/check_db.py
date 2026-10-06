import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

cmd = """python3 -c "
import sqlite3
conn = sqlite3.connect('/var/www/jmartins_data/jmartins.db')
c = conn.cursor()
c.execute('SELECT key, value FROM site_config')
for row in c.fetchall():
    print(row)
"
"""
stdin, stdout, stderr = ssh.exec_command(cmd)
print('Site Config on VPS:')
print(stdout.read().decode())
print('Errors:', stderr.read().decode())
ssh.close()
