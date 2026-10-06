import os
import tarfile
import paramiko
import time

VPS_HOST = "185.245.182.23"
VPS_USER = "root"
VPS_PASS = "p5p3ALM1!007"
REMOTE_DIR = "/var/www/amplificadora"
LOCAL_DIR = r"C:\Users\Administrador\.gemini\antigravity\scratch\amp-flow"
DIST_DIR = os.path.join(LOCAL_DIR, "dist")
SPOTS_DIR = os.path.join(DIST_DIR, "spots")

def main():
    print("=== ETAPA 1: EMPACOTANDO DIST ===")
    tar_path = os.path.join(LOCAL_DIR, "dist.tar.gz")
    with tarfile.open(tar_path, "w:gz") as tar:
        tar.add(DIST_DIR, arcname=".")
    print(f"Empacotado: {tar_path} ({os.path.getsize(tar_path)/1024/1024:.2f} MB)")

    print("\n=== ETAPA 2: CONECTANDO À VPS ===")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASS)
    sftp = ssh.open_sftp()

    print("Enviando dist.tar.gz para a VPS...")
    sftp.put(tar_path, "/tmp/dist.tar.gz")

    print("Extraindo arquivos em /var/www/amplificadora...")
    ssh.exec_command(f"mkdir -p {REMOTE_DIR} && tar -xzf /tmp/dist.tar.gz -C {REMOTE_DIR} && rm -f /tmp/dist.tar.gz && chmod -R 755 {REMOTE_DIR}")

    print("\n=== ETAPA 3: PROCESSANDO E MASTERIZANDO SPOTS NA VPS ===")
    ssh.exec_command(f"mkdir -p /tmp/amp_spots {REMOTE_DIR}/spots")

    # Upload dry spots
    for fname in os.listdir(SPOTS_DIR):
        if fname.endswith(".mp3"):
            local_f = os.path.join(SPOTS_DIR, fname)
            remote_f = f"/tmp/amp_spots/{fname}"
            sftp.put(local_f, remote_f)
            # Also copy dry version to web spots directory
            sftp.put(local_f, f"{REMOTE_DIR}/spots/{fname}")
            print(f"Enviado spot voz: {fname}")

    # Script on VPS to mix with background bed
    vps_mix_script = '''#!/usr/bin/env python3
import subprocess
import glob
import os

WEB_SPOTS = "/var/www/amplificadora/spots"
os.makedirs(WEB_SPOTS, exist_ok=True)

# Find lounge/chic bed
bed_files = glob.glob("/var/azuracast/stations/caribu_burgers__bistrô/media/**/*.mp3", recursive=True)
clair = [f for f in bed_files if "Clair" in f]
bed_track = clair[0] if clair else (bed_files[0] if bed_files else None)
print("Trilha de fundo utilizada:", bed_track)

dry_spots = [
    ("spot_amp_vivienne_erotic_1.mp3", "spot_amp_vivienne_erotic_1_master.mp3", "Amplificadora - Vivienne Sussurrada (Erotic Whisper)", "-12%"),
    ("spot_amp_vivienne_sensual_2.mp3", "spot_amp_vivienne_sensual_2_master.mp3", "Amplificadora - Vivienne Sensual Onda Musical", "-12%"),
    ("spot_amp_emma_intimate_3.mp3", "spot_amp_emma_intimate_3_master.mp3", "Amplificadora - Emma Intimate Whisper", "-14%"),
    ("spot_amp_vivienne_night_4.mp3", "spot_amp_vivienne_night_4_master.mp3", "Amplificadora - Vivienne Night Whisper", "-16%")
]

for dry_name, out_name, title, rate in dry_spots:
    voice_path = f"/tmp/amp_spots/{dry_name}"
    out_path = f"{WEB_SPOTS}/{out_name}"
    
    if not os.path.exists(voice_path):
        continue
        
    # Get voice duration
    probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", voice_path], capture_output=True, text=True)
    dur = float(probe.stdout.strip() or "6.0")
    total_dur = dur + 2.5
    fade_out_start = max(0.5, total_dur - 2.0)
    
    if bed_track and os.path.exists(bed_track):
        # Mix voice + soft chic bed
        cmd = [
            "ffmpeg", "-y",
            "-i", voice_path,
            "-ss", "1.0", "-t", str(total_dur), "-i", bed_track,
            "-filter_complex",
            f"[0:a]volume=1.35[v];[1:a]volume=0.12,afade=t=in:ss=0:d=1.0,afade=t=out:st={fade_out_start}:d=2.0[b];[v][b]amix=inputs=2:duration=first:dropout_transition=2,loudnorm=I=-14:TP=-1.0:LRA=8.0[out]",
            "-map", "[out]",
            "-c:a", "libmp3lame", "-b:a", "320k", "-ar", "44100",
            "-metadata", f"title={title}",
            "-metadata", "artist=Rádio Amplificadora",
            "-metadata", "album=Spots Oficiais Amplificadora",
            out_path
        ]
    else:
        # Fallback normalize dry
        cmd = [
            "ffmpeg", "-y",
            "-i", voice_path,
            "-af", "loudnorm=I=-14:TP=-1.0:LRA=8.0",
            "-c:a", "libmp3lame", "-b:a", "320k", "-ar", "44100",
            "-metadata", f"title={title}",
            "-metadata", "artist=Rádio Amplificadora",
            out_path
        ]
        
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    if res.returncode == 0:
        print(f"[OK] Masterizado: {out_name} ({total_dur:.1f}s)")
    else:
        print(f"[ERRO] {out_name}:", res.stderr.decode("utf-8", errors="ignore")[-200:])

subprocess.run(["chmod", "-R", "755", WEB_SPOTS], check=True)
print("Spots publicados na web com sucesso!")
'''
    with open(os.path.join(LOCAL_DIR, "vps_mix_spots.py"), "w", encoding="utf-8") as f:
        f.write(vps_mix_script)
    sftp.put(os.path.join(LOCAL_DIR, "vps_mix_spots.py"), "/tmp/vps_mix_spots.py")

    stdin, stdout, stderr = ssh.exec_command("python3 /tmp/vps_mix_spots.py")
    print(stdout.read().decode())

    # Check web server
    print("\n=== ETAPA 4: VERIFICANDO SERVIÇO WEB ===")
    stdin, stdout, stderr = ssh.exec_command("ls -la /var/www/amplificadora/spots/")
    print(stdout.read().decode())

    sftp.close()
    ssh.close()
    print("\n=== DEPLOY CONCLUÍDO COM SUCESSO TOTAL! ===")

if __name__ == "__main__":
    main()
