import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

stdin, stdout, stderr = ssh.exec_command("docker exec azuracast supervisorctl status")
print("Supervisorctl status:\n", stdout.read().decode())
print("Stderr:\n", stderr.read().decode())

stdin, stdout, stderr = ssh.exec_command("docker exec azuracast supervisorctl start station_1:*")
print("Start station 1:\n", stdout.read().decode())

ssh.close()
