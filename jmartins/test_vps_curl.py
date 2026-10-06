import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

stdin, stdout, stderr = ssh.exec_command('curl -s http://127.0.0.1:5000/api/config')
print('Container 5000 output:')
print(stdout.read().decode())

stdin, stdout, stderr = ssh.exec_command("curl -s -H 'Host: jmartins.ind.br' http://127.0.0.1/api/config")
print('Nginx/Caddy output:')
print(stdout.read().decode())

ssh.close()
