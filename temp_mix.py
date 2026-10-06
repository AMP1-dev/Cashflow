
import glob
import subprocess
import os

beds = glob.glob("/var/lib/docker/volumes/azuracast_station_data/_data/caribu_burgers__bistrô/media/**/*.mp3", recursive=True)
lounge_bed = [b for b in beds if "Clair" in b or "Get Lucky" in b or "Vintage" in b]
bed = lounge_bed[0] if lounge_bed else beds[0]
print("Using bed:", os.path.basename(bed))

spots = [
    ("spot_amp_vivienne_erotic_1.mp3", "spot_amp_vivienne_erotic_1_lounge.mp3", "Amplificadora - Vivienne Erotic (Lounge Mix)"),
    ("spot_amp_vivienne_sensual_2.mp3", "spot_amp_vivienne_sensual_2_lounge.mp3", "Amplificadora - Vivienne Sensual (Lounge Mix)"),
    ("spot_amp_emma_intimate_3.mp3", "spot_amp_emma_intimate_3_lounge.mp3", "Amplificadora - Emma Whisper (Lounge Mix)")
]

for src, out_name, title in spots:
    voice = f"/var/www/amplificadora/spots/{src}"
    out = f"/var/www/amplificadora/spots/{out_name}"
    probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", voice], capture_output=True, text=True)
    dur = float(probe.stdout.strip())
    total_dur = dur + 2.5
    fade_out = max(1.0, total_dur - 2.0)
    
    cmd = [
        "ffmpeg", "-y",
        "-i", voice,
        "-ss", "3.0", "-t", str(total_dur), "-i", bed,
        "-filter_complex",
        f"[0:a]volume=1.4[v];[1:a]volume=0.13,afade=t=in:ss=0:d=1.0,afade=t=out:st={fade_out}:d=2.0[b];[v][b]amix=inputs=2:duration=first:dropout_transition=2,loudnorm=I=-14:TP=-1.0:LRA=8.0[out]",
        "-map", "[out]",
        "-c:a", "libmp3lame", "-b:a", "320k", "-ar", "44100",
        "-metadata", f"title={title}",
        "-metadata", "artist=Rádio Amplificadora",
        out
    ]
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    if res.returncode == 0:
        print(f"[OK] Criado mix: {out_name}")
    else:
        print("Erro:", res.stderr.decode()[-150:])

subprocess.run(["chmod", "-R", "755", "/var/www/amplificadora/spots"], check=True)
