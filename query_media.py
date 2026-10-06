import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

stdin, stdout, stderr = ssh.exec_command('docker exec azuracast ls -la /var/azuracast/stations/httpsamplificadora.com.br/media')
print("Media files:\n", stdout.read().decode())

stdin, stdout, stderr = ssh.exec_command('docker exec azuracast ls -la /var/azuracast/stations/httpsamplificadora.com.br/playlists')
print("Playlists config:\n", stdout.read().decode())

ssh.close()
