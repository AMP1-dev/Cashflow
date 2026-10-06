import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

cmd = """docker exec azuracast azuracast_cli dbal:run-sql "SELECT sp.id, sp.name, count(spm.media_id) as tracks FROM station_playlists sp LEFT JOIN station_playlist_media spm ON sp.id = spm.playlist_id WHERE sp.station_id=1 GROUP BY sp.id;" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Station 1 playlist tracks count:\n", stdout.read().decode())

ssh.close()
