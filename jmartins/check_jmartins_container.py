import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

stdin, stdout, stderr = ssh.exec_command('docker exec jmartins which nginx; docker exec jmartins cat /etc/os-release')
print('=== INSIDE JMARTINS CONTAINER ===\n' + stdout.read().decode())

ssh.close()
