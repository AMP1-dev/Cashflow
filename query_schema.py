import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

stdin, stdout, stderr = ssh.exec_command('docker exec azuracast env | grep -E "MYSQL|DB"')
print("DB env:\n", stdout.read().decode())

cmd = """docker exec azuracast azuracast_cli dbal:run-sql "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'station_media';" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Columns:\n", stdout.read().decode())

ssh.close()
