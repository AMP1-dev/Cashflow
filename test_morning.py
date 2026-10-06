import urllib.request, ssl
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    'https://amplificadora.com.br',
    'https://amplificadora.com.br/assets/index-pr9pQp13.js',
    'https://amplificadora.com.br/assets/index-CnhqDLZa.css',
    'https://radio.amplificadora.com.br',
    'https://radio.amplificadora.com.br/api/nowplaying',
    'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALPHAFM.mp3',
    'https://stream.laut.fm/alive',
    'https://esperance.streamakaci.com/gregorien.mp3'
]

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5, context=ctx)
        ctype = res.headers.get("content-type")
        print(f"{u} -> {res.status} OK (content-type: {ctype})")
    except Exception as e:
        print(f"{u} -> ERROR: {e}")
