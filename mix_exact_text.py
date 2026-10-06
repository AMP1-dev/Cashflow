import paramiko
import os

VPS_HOST = "185.245.182.23"
VPS_USER = "root"
VPS_PASS = "p5p3ALM1!007"
LOCAL_DIR = r"C:\Users\Administrador\.gemini\antigravity\scratch\amp-flow\public\audio_demos"
REMOTE_RAW_DIR = "/tmp/raw_exact"

print("1. Conectando SSH...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASS, timeout=25)

ssh.exec_command(f"mkdir -p {REMOTE_RAW_DIR} /var/www/amplificadora/audio_demos")
sftp = ssh.open_sftp()

files = [
    "onda_vivienne_natural.mp3",
    "onda_emma_natural.mp3",
    "onda_thalita_br.mp3",
    "onda_francisca_suave.mp3"
]

print("2. Enviando vozes puras para VPS...")
for f in files:
    local_p = os.path.join(LOCAL_DIR, f)
    remote_p = f"{REMOTE_RAW_DIR}/{f}"
    sftp.put(local_p, remote_p)
    # Also put direct clean to web public
    sftp.put(local_p, f"/var/www/amplificadora/audio_demos/{f}")
    print(f"Enviado {f}")

sftp.close()

# Python script to run on VPS with ffmpeg for Lounge Mix
vps_script = """
import glob
import subprocess
import os

beds = glob.glob("/var/lib/docker/volumes/azuracast_station_data/_data/caribu_burgers__bistrô/media/**/*.mp3", recursive=True)
if not beds:
    beds = glob.glob("/var/azuracast/stations/httpsamplificadora.com.br/media/Vintage*/**/*.mp3", recursive=True)
lounge_bed = [b for b in beds if "Clair" in b or "Get Lucky" in b or "Vintage" in b or "Bossa" in b]
bed = lounge_bed[0] if lounge_bed else beds[0]
print("Trilha lounge:", os.path.basename(bed))

items = [
    ("onda_vivienne_natural.mp3", "onda_vivienne_lounge.mp3", "Amplificadora - Vivienne (Lounge Master)"),
    ("onda_emma_natural.mp3", "onda_emma_lounge.mp3", "Amplificadora - Emma (Lounge Master)"),
    ("onda_thalita_br.mp3", "onda_thalita_lounge.mp3", "Amplificadora - Thalita BR (Lounge Master)"),
    ("onda_francisca_suave.mp3", "onda_francisca_lounge.mp3", "Amplificadora - Francisca Suave (Lounge Master)")
]

for src, out_name, title in items:
    voice = f"/tmp/raw_exact/{src}"
    out = f"/var/www/amplificadora/audio_demos/{out_name}"
    
    probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", voice], capture_output=True, text=True)
    dur = float(probe.stdout.strip())
    total_dur = dur + 2.0
    fade_out = max(1.0, total_dur - 1.8)
    
    cmd = [
        "ffmpeg", "-y",
        "-i", voice,
        "-ss", "4.0", "-t", str(total_dur), "-i", bed,
        "-filter_complex",
        f"[0:a]volume=1.35[v];[1:a]volume=0.15,afade=t=in:ss=0:d=0.8,afade=t=out:st={fade_out}:d=1.8[b];[v][b]amix=inputs=2:duration=first:dropout_transition=2,loudnorm=I=-14:TP=-1.0:LRA=7.0[out]",
        "-map", "[out]",
        "-c:a", "libmp3lame", "-b:a", "320k", "-ar", "44100",
        "-metadata", f"title={title}",
        "-metadata", "artist=Rádio Amplificadora",
        out
    ]
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    if res.returncode == 0:
        print(f"[OK] Masterizado: {out_name}")
    else:
        print(f"Erro em {src}:", res.stderr.decode()[-150:])

subprocess.run(["chmod", "644", "/var/www/amplificadora/audio_demos/*.mp3"], check=False)
"""

print("3. Executando masterização com trilha no VPS...")
sftp = ssh.open_sftp()
with open("remote_exact_mixer.py", "w", encoding="utf-8") as f:
    f.write(vps_script)
sftp.put("remote_exact_mixer.py", "/tmp/remote_exact_mixer.py")
sftp.close()

stdin, stdout, stderr = ssh.exec_command("python3 /tmp/remote_exact_mixer.py")
print("VPS Output:\n", stdout.read().decode())
print("VPS Stderr:\n", stderr.read().decode())

ssh.close()
print("Upload e mixagem concluídos!")
