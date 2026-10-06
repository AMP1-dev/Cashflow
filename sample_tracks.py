import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

folders = ['ANT1ALP', 'MPB', 'POP23', 'Vintage Chic 100', 'DSCO', 'RCKINT']
for folder in folders:
    sql = f"""
    SELECT artist, title, round(length/60, 1) as min 
    FROM station_media 
    WHERE storage_location_id = (SELECT media_storage_location_id FROM station WHERE id=1)
      AND path LIKE '{folder}/%'
    ORDER BY RAND()
    LIMIT 4;
    """
    cmd = f'docker exec azuracast mariadb -u azuracast -pmxNcCfgFEChJ azuracast -e "{sql}"'
    stdin, stdout, stderr = ssh.exec_command(cmd)
    print(f"=== {folder} Samples ===")
    print(stdout.read().decode())

ssh.close()
