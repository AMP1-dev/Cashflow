import urllib.request
import ssl
import json

ctx = ssl.create_default_context()

def test_endpoint(url, data=None):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    if data:
        req.data = json.dumps(data).encode('utf-8')
        req.headers['Content-Type'] = 'application/json'
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        return resp.status, json.loads(resp.read().decode('utf-8'))

print('1. Testing /api/health:')
status, res = test_endpoint('https://jmartins.ind.br/api/health')
print(f'STATUS: {status}, RES: {res}')

print('\n2. Testing /api/config:')
status, res = test_endpoint('https://jmartins.ind.br/api/config')
print(f'STATUS: {status}, TOTAL CONFIGS: {len(res.get("config", {}))}')

print('\n3. Testing /api/posts:')
status, res = test_endpoint('https://jmartins.ind.br/api/posts')
print(f'STATUS: {status}, TOTAL POSTS: {len(res.get("posts", []))}')

print('\n4. Testing /api/auth/login with admin / JMartins#2026:')
status, res = test_endpoint('https://jmartins.ind.br/api/auth/login', {'username': 'admin', 'password': 'JMartins#2026'})
print(f'STATUS: {status}, OK: {res.get("ok")}, TOKEN: {res.get("token")[:10]}...')
