import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

commands = [
    ("Laut Alive in bundle", "grep -o 'stream.laut.fm/alive' /var/www/amplificadora/assets/index-Cx0zdGwN.js"),
    ("Channels cache key", "grep -o 'amp_radio_channels_v20_live_arena' /var/www/amplificadora/assets/index-Cx0zdGwN.js"),
    ("Index HTML script", "grep -o 'index-Cx0zdGwN.js' /var/www/amplificadora/index.html"),
    ("Gregorian image size", "ls -lh /var/www/amplificadora/gregorian.jpg"),
    ("Spots count", "ls -l /var/www/amplificadora/spots/*.mp3 | wc -l")
]

for label, cmd in commands:
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()
    print(f"{label}: {out}")

ssh.close()
