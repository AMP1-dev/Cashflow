import os
import tarfile
import paramiko

VPS_HOST = "185.245.182.23"
VPS_USER = "root"
VPS_PASS = "p5p3ALM1!007"
REMOTE_DIR = "/var/www/amplificadora"
LOCAL_DIR = r"C:\Users\Administrador\.gemini\antigravity\scratch\amp-flow"
DIST_DIR = os.path.join(LOCAL_DIR, "dist")

def main():
    print("1. Empacotando dist...")
    tar_path = os.path.join(LOCAL_DIR, "dist.tar.gz")
    with tarfile.open(tar_path, "w:gz") as tar:
        tar.add(DIST_DIR, arcname=".")
    print(f"dist.tar.gz criado: {os.path.getsize(tar_path)/1024/1024:.2f} MB")

    print("2. Conectando SSH...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASS)
    sftp = ssh.open_sftp()

    print("3. Enviando para VPS...")
    sftp.put(tar_path, "/tmp/dist.tar.gz")
    cmd = f"tar -xzf /tmp/dist.tar.gz -C {REMOTE_DIR} && rm -f /tmp/dist.tar.gz && chmod -R 755 {REMOTE_DIR}"
    stdin, stdout, stderr = ssh.exec_command(cmd)
    stdout.channel.recv_exit_status()

    # Verify index.html in remote
    stdin, stdout, stderr = ssh.exec_command(f"head -n 25 {REMOTE_DIR}/index.html")
    print("Remote index.html:")
    print(stdout.read().decode())

    # Reload caddy / nginx if needed
    ssh.exec_command("docker restart amplificadora")

    sftp.close()
    ssh.close()
    print("Deploy concluído com sucesso!")

if __name__ == "__main__":
    main()
