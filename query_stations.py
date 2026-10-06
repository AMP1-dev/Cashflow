import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

stdin, stdout, stderr = ssh.exec_command('docker exec azuracast curl -s http://127.0.0.1/api/stations')
print("Stations in azuracast:\n", stdout.read().decode())

stdin, stdout, stderr = ssh.exec_command('docker exec azuracast ls -la /var/azuracast/stations')
print("Station dirs:\n", stdout.read().decode())

ssh.close()
