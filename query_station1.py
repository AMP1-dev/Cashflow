import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

cmd = """docker exec azuracast azuracast_cli dbal:run-sql "SHOW TABLES LIKE '%playlist%';" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Playlist tables:\n", stdout.read().decode())

cmd = """docker exec azuracast azuracast_cli dbal:run-sql "SELECT id, station_id, name, type, is_enabled FROM station_playlists;" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Station playlists:\n", stdout.read().decode())

cmd = """docker exec azuracast azuracast_cli dbal:run-sql "SELECT id, short_name, backend_config FROM station WHERE id=1;" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Station 1 config:\n", stdout.read().decode())

ssh.close()
