import subprocess

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
cmd = [chrome, '--headless=new', '--enable-logging=stderr', '--v=1', 'https://amplificadora.com.br']
try:
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=8)
    print("STDOUT:\n", res.stdout)
    print("STDERR:\n", res.stderr)
except subprocess.TimeoutExpired as te:
    print("TIMEOUT STDOUT:\n", te.stdout)
    print("TIMEOUT STDERR:\n", te.stderr)
