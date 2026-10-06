import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

sftp = ssh.open_sftp()

print('Uploading assets/logistica_sp_mg.jpg...')
sftp.put('assets/logistica_sp_mg.jpg', '/var/www/jmartins/assets/logistica_sp_mg.jpg')
print('Uploaded logistica_sp_mg.jpg successfully!')

print('Uploading index.html...')
sftp.put('index.html', '/var/www/jmartins/index.html')
print('Uploaded index.html successfully!')

sftp.close()
ssh.close()
print('ALL_UPDATES_SYNCED_SUCCESS')
