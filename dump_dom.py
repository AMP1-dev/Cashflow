import subprocess, os

chrome_paths = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
]

browser = None
for p in chrome_paths:
    if os.path.exists(p):
        browser = p
        break

print("Using browser:", browser)
if browser:
    cmd = [browser, '--headless=new', '--dump-dom', 'https://amplificadora.com.br']
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
    print("DOM output length:", len(res.stdout))
    idx = res.stdout.find('id="root"')
    if idx != -1:
        print("Root section:\n", res.stdout[idx:idx+400])
    else:
        print("Full DOM:\n", res.stdout[:1000])
