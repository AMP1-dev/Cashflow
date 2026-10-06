import urllib.request
import urllib.parse
import json

def search_rb(tag):
    url = f"https://de1.api.radio-browser.info/json/stations/bytag/{urllib.parse.quote(tag)}?limit=15&order=votes&reverse=true"
    req = urllib.request.Request(url, headers={'User-Agent': 'AmplificadoraApp/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=6) as r:
            data = json.loads(r.read().decode())
            print(f"=== TAG: {tag} ({len(data)} results) ===")
            for s in data:
                print(f"Name: {s.get('name')} | Bitrate: {s.get('bitrate')} | Codec: {s.get('codec')} | URL: {s.get('url_resolved')}")
    except Exception as e:
        print(f"Error {tag}: {e}")

def search_name(name):
    url = f"https://de1.api.radio-browser.info/json/stations/byname/{urllib.parse.quote(name)}?limit=15&order=votes&reverse=true"
    req = urllib.request.Request(url, headers={'User-Agent': 'AmplificadoraApp/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=6) as r:
            data = json.loads(r.read().decode())
            print(f"=== NAME: {name} ({len(data)} results) ===")
            for s in data:
                print(f"Name: {s.get('name')} | Bitrate: {s.get('bitrate')} | Codec: {s.get('codec')} | URL: {s.get('url_resolved')}")
    except Exception as e:
        print(f"Error {name}: {e}")

search_name("gregorian")
search_name("gregorien")
search_name("concert")
search_tag = search_rb
search_tag("live concert")
