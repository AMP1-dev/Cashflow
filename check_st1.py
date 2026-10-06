import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

stdin, stdout, stderr = ssh.exec_command('docker exec azuracast azuracast_cli dbal:run-sql "SELECT id, name, frontend_type, backend_type, radio_base_dir FROM station WHERE id=1"')
print("Station 1 info:\n", stdout.read().decode())

ssh.close()
