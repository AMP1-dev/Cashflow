import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

sql = """
SELECT 
    CASE 
        WHEN INSTR(path, '/') > 0 THEN SUBSTRING(path, 1, INSTR(path, '/') - 1)
        ELSE 'Raiz'
    END AS folder,
    COUNT(*) as total_tracks,
    ROUND(AVG(length)/60, 1) as avg_min,
    MIN(ROUND(length/60, 1)) as min_min,
    MAX(ROUND(length/60, 1)) as max_min
FROM station_media
WHERE storage_location_id = (SELECT media_storage_location_id FROM station WHERE id=1)
GROUP BY folder
ORDER BY total_tracks DESC;
"""

cmd = f'docker exec azuracast mariadb -u azuracast -pmxNcCfgFEChJ azuracast -e "{sql}"'
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Folder statistics:\n", stdout.read().decode())

# Check sample genres
sql_genres = """
SELECT genre, count(*) as count 
FROM station_media 
WHERE storage_location_id = (SELECT media_storage_location_id FROM station WHERE id=1) AND genre != ''
GROUP BY genre 
ORDER BY count DESC 
LIMIT 15;
"""
cmd = f'docker exec azuracast mariadb -u azuracast -pmxNcCfgFEChJ azuracast -e "{sql_genres}"'
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Top Genres:\n", stdout.read().decode())

# Check extra_metadata sample
sql_extra = """
SELECT title, artist, length, extra_metadata 
FROM station_media 
WHERE storage_location_id = (SELECT media_storage_location_id FROM station WHERE id=1) AND extra_metadata IS NOT NULL AND extra_metadata != ''
LIMIT 3;
"""
cmd = f'docker exec azuracast mariadb -u azuracast -pmxNcCfgFEChJ azuracast -e "{sql_extra}"'
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Extra metadata sample:\n", stdout.read().decode())

ssh.close()
