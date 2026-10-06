import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

stdin, stdout, stderr = ssh.exec_command('docker ps --format "{{.Names}}: {{.Status}}"')
print("Containers:\n", stdout.read().decode())

stdin, stdout, stderr = ssh.exec_command('docker exec azuracast azuracast_cli azuracast:station:list')
print("Stations:\n", stdout.read().decode())

stdin, stdout, stderr = ssh.exec_command('curl -s http://127.0.0.1:80/api/stations')
print("API Stations:\n", stdout.read().decode()[:500])

ssh.close()
