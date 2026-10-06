import urllib.request

urls = [
    # Gregorian chant
    ('Radio Esperance Chant Gregorien (24/7 Oficial)', 'https://radio-esperance.fr:8000/gregorien.mp3'),
    ('Gregorian Chants 24h', 'https://streaming.radio.co/s29b689a94/listen'),
    ('Calm Radio Gregorian Chant', 'http://streams.calmradio.com:2128/stream'),
    ('Monastic Gregorian Chants', 'https://stream.zeno.fm/k2y9wqg7b18uv'),
    # Classical
    ('Radio Swiss Classic (SRG SSR - 100% Sem Comerciais)', 'https://stream.srg-ssr.ch/m/rsc_de/mp3_128'),
    ('Classic FM UK', 'https://media-ice.musicradio.com/ClassicFMMP3'),
    ('WQXR New York Classical HD', 'https://stream.wqxr.org/wqxr'),
    # Live Concerts / Shows
    ('1.FM All Time Greatest Live Concerts (Shows Ao Vivo 24h)', 'http://strm112.1.fm/live_mobile_mp3'),
    ('Live Concerts Rock HD', 'https://strm112.1.fm/rockclassics_mobile_mp3'),
    ('SomaFM Concerts / Live 128k', 'https://ice1.somafm.com/live-128-mp3')
]

for name, u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'VLC/3.0.18', 'Icy-MetaData': '1'})
        with urllib.request.urlopen(req, timeout=4) as r:
            ct = r.headers.get("Content-Type", "")
            icy = r.headers.get("icy-name", "")
            print(f"[OK] {name} -> Status: {r.status} | {ct} | {icy}")
    except Exception as e:
        print(f"[FAIL] {name} -> {e}")
