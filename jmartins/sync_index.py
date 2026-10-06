import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

sftp = ssh.open_sftp()
local_path = r'c:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\jmartins\index.html'
remote_path = '/var/www/jmartins/index.html'
sftp.put(local_path, remote_path)
sftp.close()
ssh.close()
print('SUCCESS_SYNC_INDEX')
