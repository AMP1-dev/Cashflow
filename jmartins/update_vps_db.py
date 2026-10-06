import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('185.245.182.23', username='root', password='p5p3ALM1!007', timeout=10)

update_script = """# -*- coding: utf-8 -*-
import sqlite3

conn = sqlite3.connect('/var/www/jmartins_data/jmartins.db')
c = conn.cursor()

updates = {
    'whatsappNumber': '5519998167195',
    'phone': '(19) 3672-2881 / (19) 3672-1563',
    'email': 'contato@jmartins.ind.br',
    'instagram': '@jmartinsindustrial',
    'address': 'Sul de Minas, São Paulo e Litoral Norte de SC • Entregas em todo o Brasil',
    'heroBadge': 'Fornecimento Industrial Direto • Entregas em Todo o Brasil',
    'heroTitle1': 'POTÊNCIA E PRECISÃO EM',
    'heroTitle2': 'AÇO PLANO E TELHAS',
    'heroTitle3': 'SOLUÇÕES SOB MEDIDA',
    'heroSubtitle': 'Corte e dobra, telhas galvalume e termoacústicas, bobinas, chapas, vigas, perfis, painéis, calhas, tubos e slitter. Polos em Minas Gerais, São Paulo e Santa Catarina com atendimento em todo o Brasil.',
    'heroCta': 'SOLICITAR COTAÇÃO RÁPIDA',
    'videoType': 'mp4',
    'videoUrl': 'assets/video_institucional.mp4'
}

for k, v in updates.items():
    c.execute('INSERT INTO site_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', (k, v))

conn.commit()
print('SUCCESS_DB_UPDATED')
c.execute('SELECT key, value FROM site_config')
for row in c.fetchall():
    print(row)
conn.close()
"""

sftp = ssh.open_sftp()
with sftp.file('/tmp/update_db.py', 'w') as f:
    f.write(update_script)
sftp.close()

stdin, stdout, stderr = ssh.exec_command('python3 /tmp/update_db.py')
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())

ssh.close()
