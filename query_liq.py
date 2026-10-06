import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

stdin, stdout, stderr = ssh.exec_command('docker exec azuracast cat /var/azuracast/stations/httpsamplificadora.com.br/config/liquidsoap.liq | head -n 40')
print("Liquidsoap top config:\n", stdout.read().decode())

stdin, stdout, stderr = ssh.exec_command('docker exec azuracast cat /var/azuracast/stations/httpsamplificadora.com.br/config/liquidsoap.liq | grep -i -C 5 crossfade')
print("Crossfade in liq:\n", stdout.read().decode())

ssh.close()
