import urllib.request

candidates = [
    ('Esperance Gregorien (Franca)', 'https://esperance.streamakaci.com/gregorien.mp3'),
    ('Concertzender Gregoriaans (Holanda)', 'http://streams.greenhost.nl:8080/gregoriaans'),
    ('Radio Swiss Classic (Suica)', 'https://stream.srg-ssr.ch/m/rsc_de/mp3_128'),
    ('WQXR Classical NY (EUA)', 'https://stream.wqxr.org/wqxr'),
    ('Alive 24h Live Music (Rock/Pop Ao Vivo)', 'http://stream.laut.fm/alive'),
    ('Charivari Live Hits (Shows Ao Vivo)', 'https://rs24.stream24.net/live-hits'),
    ('RTBF Classic 21 Live (Shows/Concerts)', 'https://radios.rtbf.be/wr-c21-live-128.mp3')
]

for name, u in candidates:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'VLC/3.0.18', 'Icy-MetaData': '1'})
        with urllib.request.urlopen(req, timeout=5) as r:
            ct = r.headers.get("Content-Type", "")
            icy = r.headers.get("icy-name", "")
            print(f"[OK] {name} -> Status: {r.status} | {ct} | {icy}")
    except Exception as e:
        print(f"[FAIL] {name} -> {e}")
