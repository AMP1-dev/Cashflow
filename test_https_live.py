import urllib.request

streams = [
    ('RTBF Classic 21 Live', 'https://radios.rtbf.be/wr-c21-live-128.mp3'),
    ('Alive Laut FM HTTPS', 'https://stream.laut.fm/alive'),
    ('Concerts Radio France HTTPS', 'https://icecast.radiofrance.fr/francemusiqueconcertsradiofrance-hifi.aac'),
    ('1.FM Rock Classics HTTPS', 'https://strm112.1.fm/rockclassics_mobile_mp3'),
    ('SomaFM Live HTTPS', 'https://ice1.somafm.com/live-128-mp3')
]

for name, u in streams:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0', 'Origin': 'https://amplificadora.com.br'})
        with urllib.request.urlopen(req, timeout=5) as r:
            ct = r.headers.get("Content-Type", "")
            print(f"[OK] {name} -> Status: {r.status} | URL: {r.geturl()} | Type: {ct}")
    except Exception as e:
        print(f"[FAIL] {name} -> {e}")
