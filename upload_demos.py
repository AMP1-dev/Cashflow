import paramiko
import os

VPS_HOST = "185.245.182.23"
VPS_USER = "root"
VPS_PASS = "p5p3ALM1!007"
REMOTE_DIR = "/var/www/amplificadora/audio_demos"
LOCAL_DIR = r"C:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\public\audio_demos"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASS, timeout=10)

stdin, stdout, stderr = ssh.exec_command(f"mkdir -p {REMOTE_DIR} && chmod 755 {REMOTE_DIR}")
stdout.channel.recv_exit_status()

sftp = ssh.open_sftp()
for fname in os.listdir(LOCAL_DIR):
    if fname.endswith(".mp3"):
        local_p = os.path.join(LOCAL_DIR, fname)
        remote_p = f"{REMOTE_DIR}/{fname}"
        print(f"Enviando {fname} -> {remote_p}")
        sftp.put(local_p, remote_p)
        ssh.exec_command(f"chmod 644 {remote_p}")

sftp.close()
ssh.close()
print("Upload de demos concluído com sucesso!")
