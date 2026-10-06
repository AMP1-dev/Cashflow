import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

cmd = """docker exec azuracast azuracast_cli dbal:run-sql "SELECT id, name, short_name, is_enabled FROM station;" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("DBAL stations:\n", stdout.read().decode())
print("DBAL err:\n", stderr.read().decode())

cmd = """docker exec azuracast azuracast_cli dbal:run-sql "SELECT id, station_id, name, type, is_enabled, play_per_songs FROM station_playlist;" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("DBAL playlists:\n", stdout.read().decode())

ssh.close()
