import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

stdin, stdout, stderr = ssh.exec_command("docker inspect amplificadora --format '{{json .Mounts}}'")
print("Mounts:\n", stdout.read().decode())
stdin, stdout, stderr = ssh.exec_command("curl -s -I https://amplificadora.com.br")
print("Curl response:\n", stdout.read().decode())

ssh.close()
