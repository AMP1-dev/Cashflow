import urllib.request, urllib.parse, http.cookiejar, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj), urllib.request.HTTPSHandler(context=ctx))

# 1. Get CSRF token from login page
res = opener.open('https://radio.amplificadora.com.br/login')
html = res.read().decode()

import re
csrf = ""
m = re.search(r'name=["\']csrf["\']\s+value=["\']([^"\']+)["\']', html)
if m:
    csrf = m.group(1)
print("CSRF token found:", bool(csrf))

# 2. Try POST login
data = urllib.parse.urlencode({
    'username': 'admin@amplificadora.com.br',
    'password': 'qnLxMwW6CjCMy4P',
    'csrf': csrf
}).encode()

try:
    req = urllib.request.Request('https://radio.amplificadora.com.br/login', data=data, headers={'User-Agent': 'Mozilla/5.0'})
    post_res = opener.open(req)
    print("Post status:", post_res.status)
    print("Final URL:", post_res.url)
    resp_text = post_res.read().decode()
    if 'Invalid' in resp_text or 'error' in resp_text.lower():
        print("Login message snippet:", resp_text[:500])
    else:
        print("Login SUCCESS! Redirected to:", post_res.url)
except Exception as e:
    print("Login error:", e)
