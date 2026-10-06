import paramiko
import json

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

stdin, stdout, stderr = ssh.exec_command("curl -s http://127.0.0.1/api/stations || curl -s https://radio.amplificadora.com.br/api/stations")
raw = stdout.read().decode()
try:
    data = json.loads(raw)
    for st in data:
        print(f"ID: {st.get('id')} | Nome: {st.get('name')} | Shortcode: {st.get('shortcode')} | Listeners: {st.get('listen_url')}")
except Exception as e:
    print("Raw output:", raw[:500])
    print("Error:", e)

ssh.close()
