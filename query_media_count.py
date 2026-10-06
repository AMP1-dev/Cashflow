import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

cmd = """docker exec azuracast azuracast_cli dbal:run-sql "SELECT count(*) as total_media FROM station_media WHERE storage_location_id = (SELECT media_storage_location_id FROM station WHERE id=1);" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Station 1 total indexed media:\n", stdout.read().decode())

cmd = """docker exec azuracast azuracast_cli dbal:run-sql "SELECT path FROM station_media WHERE path LIKE 'vhts/%' LIMIT 10;" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("VHTS in station_media:\n", stdout.read().decode())

ssh.close()
