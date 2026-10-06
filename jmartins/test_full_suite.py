import urllib.request
import ssl
import json

ctx = ssl.create_default_context()

def req(url, method='GET', data=None, token=None):
    headers = {'User-Agent': 'Mozilla/5.0'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    payload = None
    if data is not None:
        headers['Content-Type'] = 'application/json'
        payload = json.dumps(data).encode('utf-8')
    r = urllib.request.Request(url, data=payload, headers=headers, method=method)
    with urllib.request.urlopen(r, context=ctx, timeout=10) as resp:
        return resp.status, resp.read().decode('utf-8')

print('--- TEST 1: INDEX HTML CONTENT ---')
status, html = req('https://jmartins.ind.br')
assert 'adminLoginModal' in html, 'adminLoginModal missing'
assert 'tabSecurity' in html, 'tabSecurity missing'
assert 'loadSiteConfigFromAPI' in html, 'loadSiteConfigFromAPI missing'
print('Index HTML OK!')

print('\n--- TEST 2: AUTH LOGIN ---')
status, res_raw = req('https://jmartins.ind.br/api/auth/login', 'POST', {'username': 'admin', 'password': 'JMartins#2026'})
res = json.loads(res_raw)
assert res.get('ok') is True, 'Login failed'
token = res['token']
print(f'Login OK! Token: {token[:12]}...')

print('\n--- TEST 3: AUTH ME ---')
status, res_raw = req('https://jmartins.ind.br/api/auth/me', 'GET', token=token)
res = json.loads(res_raw)
assert res.get('ok') is True, 'Auth me failed'
print('Auth ME OK! User:', res['user'])

print('\n--- TEST 4: FORGOT PASSWORD FLOW ---')
status, res_raw = req('https://jmartins.ind.br/api/auth/forgot-password', 'POST', {'identifier': 'admin'})
res = json.loads(res_raw)
assert res.get('ok') is True, 'Forgot password failed'
code = res['recovery_code']
print(f'Forgot Password OK! Recovery code: {code}')

print('\n--- TEST 5: GET CONFIG ---')
status, res_raw = req('https://jmartins.ind.br/api/config')
res = json.loads(res_raw)
assert res.get('ok') is True, 'Get config failed'
print('Config OK! Keys count:', len(res['config']))

print('\n--- TEST 6: GET POSTS ---')
status, res_raw = req('https://jmartins.ind.br/api/posts')
res = json.loads(res_raw)
assert res.get('ok') is True, 'Get posts failed'
print('Posts OK! Count:', len(res['posts']))

print('\nALL TESTS PASSED SUCCESSFULLY! EVERYTHING IS LIVE AND OPERATIONAL!')
