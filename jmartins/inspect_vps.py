import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

def run(cmd):
    print("=== CMD:", cmd)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    if out: print("STDOUT:", out)
    if err: print("STDERR:", err)

run("docker ps")
run("docker inspect jmartins --format '{{json .Mounts}}'")
run("docker exec jmartins ls -la /app")
run("grep -n 'flex-1 flex items-center justify-center' /var/www/jmartins/index.html")
run("docker restart jmartins")

ssh.close()
