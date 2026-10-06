import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

cmd = """docker exec azuracast azuracast_cli dbal:run-sql "DESCRIBE station_media;" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Station_media columns:\n", stdout.read().decode())

cmd = """docker exec azuracast azuracast_cli dbal:run-sql "
SELECT 
  SUBSTRING_INDEX(path, '/', 1) as folder, 
  count(*) as count 
FROM station_media 
WHERE storage_location_id = (SELECT media_storage_location_id FROM station WHERE id=1) 
GROUP BY folder 
ORDER BY count DESC;" """
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Folders and track counts:\n", stdout.read().decode())

ssh.close()
