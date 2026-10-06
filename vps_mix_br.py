#!/usr/bin/env python3
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
