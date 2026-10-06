import paramiko
import time

for attempt in range(3):
    try:
        print(f"Tentativa {attempt+1}...")
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect("185.245.182.23", username="root", password="p5p3ALM1!007", timeout=25)
        
        sftp = ssh.open_sftp()
        sftp.put(r"C:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\public\audios-aprovacao.html", "/var/www/amplificadora/audios-aprovacao.html")
        ssh.exec_command("chmod 644 /var/www/amplificadora/audios-aprovacao.html")
        
        sftp.close()
        ssh.close()
        print("Upload realizado com sucesso!")
        break
    except Exception as e:
        print(f"Erro: {e}")
        time.sleep(3)
