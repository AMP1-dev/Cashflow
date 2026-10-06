import json
import re

with open(r'C:\Users\Administrador\.gemini\antigravity\brain\49555547-ae11-4398-8707-c2f8d91a966d\.system_generated\steps\6875\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.DOTALL)
for item in m:
    try:
        data = json.loads(item)
        if 'track' in data:
            print("Album:", data.get('name'))
            print("By:", data.get('byArtist', {}).get('name'))
            print("Tracks:")
            for t in data['track']:
                print(f"  - {t.get('name')}")
    except Exception as e:
        pass
