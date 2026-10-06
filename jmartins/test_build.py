import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=15)

cmd = """
mkdir -p /var/www/jmartins_data
mkdir -p /opt/jmartins_build
cat << 'EOF' > /opt/jmartins_build/Dockerfile
FROM nginx:alpine
RUN apk add --no-cache python3
EOF
docker build -t jmartins_test:latest /opt/jmartins_build
"""

stdin, stdout, stderr = ssh.exec_command(cmd)
print('STDOUT:\n', stdout.read().decode())
print('STDERR:\n', stderr.read().decode())

ssh.close()
