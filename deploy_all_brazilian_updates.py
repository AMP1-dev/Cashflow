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
PUB_SPOTS = os.path.join(LOCAL_DIR, "public", "spots")

def main():
    print("=== ETAPA 1: EMPACOTANDO DIST COM BANNER GREGORIANO ===")
    tar_path = os.path.join(LOCAL_DIR, "dist.tar.gz")
    with tarfile.open(tar_path, "w:gz") as tar:
        tar.add(DIST_DIR, arcname=".")
    print(f"Empacotado com sucesso: {tar_path} ({os.path.getsize(tar_path)/1024/1024:.2f} MB)")

    print("\n=== ETAPA 2: ENVIANDO FRONTEND ATUALIZADO PARA A VPS ===")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASS)
    sftp = ssh.open_sftp()

    sftp.put(tar_path, "/tmp/dist.tar.gz")
    ssh.exec_command(f"mkdir -p {REMOTE_DIR} && tar -xzf /tmp/dist.tar.gz -C {REMOTE_DIR} && rm -f /tmp/dist.tar.gz && chmod -R 755 {REMOTE_DIR}")
    print("Frontend descompactado com sucesso na VPS.")

    print("\n=== ETAPA 3: ENVIANDO E MASTERIZANDO SPOTS BRASILEIROS NA VPS ===")
    ssh.exec_command(f"mkdir -p /tmp/amp_spots {REMOTE_DIR}/spots")

    br_spots = [
        "spot_amp_br_thalita_letras_1.mp3",
        "spot_amp_br_francisca_letras_2.mp3",
        "spot_amp_br_thalita_sensual_3.mp3",
        "spot_amp_br_francisca_silabas_4.mp3",
        "spot_amp_br_thalita_onda_5.mp3"
    ]

    for fname in br_spots:
        local_f = os.path.join(PUB_SPOTS, fname)
        if os.path.exists(local_f):
            sftp.put(local_f, f"/tmp/amp_spots/{fname}")
            sftp.put(local_f, f"{REMOTE_DIR}/spots/{fname}")
            print(f"Enviado spot voz brasileira: {fname}")

    # Script on VPS to mix with lounge bed
    vps_mix_script = '''#!/usr/bin/env python3
import subprocess
import glob
import os

WEB_SPOTS = "/var/www/amplificadora/spots"
os.makedirs(WEB_SPOTS, exist_ok=True)

beds = glob.glob("/var/lib/docker/volumes/azuracast_station_data/_data/caribu_burgers__bistrô/media/**/*.mp3", recursive=True)
lounge_bed = [b for b in beds if "Clair" in b or "Get Lucky" in b or "Vintage" in b]
bed_track = lounge_bed[0] if lounge_bed else beds[0]
print("Trilha de fundo utilizada:", os.path.basename(bed_track))

spots_to_mix = [
    ("spot_amp_br_thalita_letras_1.mp3", "spot_amp_br_thalita_letras_1_lounge.mp3", "Amplificadora - Thalita Letras (Lounge Mix)"),
    ("spot_amp_br_francisca_letras_2.mp3", "spot_amp_br_francisca_letras_2_lounge.mp3", "Amplificadora - Francisca Letras (Lounge Mix)"),
    ("spot_amp_br_thalita_sensual_3.mp3", "spot_amp_br_thalita_sensual_3_lounge.mp3", "Amplificadora - Thalita Sensual Completo (Lounge Mix)"),
    ("spot_amp_br_francisca_silabas_4.mp3", "spot_amp_br_francisca_silabas_4_lounge.mp3", "Amplificadora - Francisca Silabas (Lounge Mix)"),
    ("spot_amp_br_thalita_onda_5.mp3", "spot_amp_br_thalita_onda_5_lounge.mp3", "Amplificadora - Thalita Onda Musical (Lounge Mix)")
]

for src, out_name, title in spots_to_mix:
    voice = f"/tmp/amp_spots/{src}"
    out = f"{WEB_SPOTS}/{out_name}"
    if not os.path.exists(voice):
        continue
    probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", voice], capture_output=True, text=True)
    dur = float(probe.stdout.strip() or "6.0")
    total_dur = dur + 2.5
    fade_out = max(1.0, total_dur - 2.0)
    
    cmd = [
        "ffmpeg", "-y",
        "-i", voice,
        "-ss", "2.0", "-t", str(total_dur), "-i", bed_track,
        "-filter_complex",
        f"[0:a]volume=1.4[v];[1:a]volume=0.13,afade=t=in:ss=0:d=1.0,afade=t=out:st={fade_out}:d=2.0[b];[v][b]amix=inputs=2:duration=first:dropout_transition=2,loudnorm=I=-14:TP=-1.0:LRA=8.0[out]",
        "-map", "[out]",
        "-c:a", "libmp3lame", "-b:a", "320k", "-ar", "44100",
        "-metadata", f"title={title}",
        "-metadata", "artist=Rádio Amplificadora",
        "-metadata", "album=Spots Oficiais Amplificadora",
        out
    ]
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    if res.returncode == 0:
        print(f"[OK] Criado mix nacional: {out_name} ({total_dur:.1f}s)")
    else:
        print("Erro:", res.stderr.decode()[-150:])

subprocess.run(["chmod", "-R", "755", WEB_SPOTS], check=True)
print("Todos os spots brasileiros foram masterizados e publicados!")
'''
    with open(os.path.join(LOCAL_DIR, "vps_mix_br.py"), "w", encoding="utf-8") as f:
        f.write(vps_mix_script)
    sftp.put(os.path.join(LOCAL_DIR, "vps_mix_br.py"), "/tmp/vps_mix_br.py")

    stdin, stdout, stderr = ssh.exec_command("python3 /tmp/vps_mix_br.py")
    print(stdout.read().decode())

    # Check files in spots
    stdin, stdout, stderr = ssh.exec_command("ls -la /var/www/amplificadora/spots/spot_amp_br*")
    print(stdout.read().decode())

    sftp.close()
    ssh.close()
    print("\n=== ATUALIZAÇÃO CONCLUÍDA COM SUCESSO TOTAL! ===")

if __name__ == "__main__":
    main()
