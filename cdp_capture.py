import subprocess
import time
import json
import urllib.request

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
port = 9222
proc = subprocess.Popen([
    chrome,
    '--headless=new',
    f'--remote-debugging-port={port}',
    'https://amplificadora.com.br'
])

time.sleep(3)

try:
    # Query DevTools targets
    targets = json.loads(urllib.request.urlopen(f'http://localhost:{port}/json').read().decode())
    print("Targets:", targets)
    ws_url = targets[0].get('webSocketDebuggerUrl')
    print("WebSocket URL:", ws_url)
finally:
    proc.terminate()
