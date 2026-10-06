import os
import sys
import json
import sqlite3
import hashlib
import secrets
import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

DB_PATH = os.environ.get('DB_PATH', '/data/jmartins.db')
PORT = int(os.environ.get('PORT', 5000))

# Garantir diretório do banco
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return dk.hex(), salt

def verify_password(password, stored_hash, salt):
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return secrets.compare_digest(dk.hex(), stored_hash)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    
    # Tabela de Administradores
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            recovery_code TEXT,
            recovery_expires TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Tabela de Sessões
    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            username TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL
        )
    ''')

    # Tabela de Configurações do Site
    c.execute('''
        CREATE TABLE IF NOT EXISTS site_config (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Tabela de Posts
    c.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            image TEXT NOT NULL,
            excerpt TEXT NOT NULL,
            content TEXT NOT NULL,
            date TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Criar usuário admin inicial se não existir
    c.execute('SELECT COUNT(*) as count FROM users')
    if c.fetchone()['count'] == 0:
        p_hash, salt = hash_password('JMartins#2026')
        c.execute('''
            INSERT INTO users (username, email, password_hash, salt)
            VALUES (?, ?, ?, ?)
        ''', ('admin', 'contato@jmartins.ind.br', p_hash, salt))
        print('Admin inicial criado com sucesso: admin / JMartins#2026')

    # Inserir configs padrão se tabela vazia
    default_config = {
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

    for k, v in default_config.items():
        c.execute('INSERT OR IGNORE INTO site_config (key, value) VALUES (?, ?)', (k, v))

    # Inserir posts padrão se tabela vazia
    c.execute('SELECT COUNT(*) as count FROM posts')
    if c.fetchone()['count'] == 0:
        initial_posts = [
            (
                'post-1',
                'Bobinas Galvalume vs Galvanizado: Qual a Melhor Escolha para Sua Cobertura?',
                'Dica Técnica',
                'assets/bobinas_aco.jpg',
                'Descubra por que a liga Aluzinc (55% Alumínio, 43,5% Zinco e 1,5% Silício) dura até 4 vezes mais em regiões com variações de umidade.',
                """A escolha entre Galvalume e Galvanizado é crucial para o custo-benefício de um galpão industrial ou comercial.

Principais Diferenças:
1. Galvalume: Combina a barreira física do alumínio com a proteção galvânica do zinco. É imbatível em coberturas expostas a chuva e sol.
2. Galvanizado tradicional: Camada 100% de zinco, excelente para ambientes internos ou estruturas que receberão pintura automotiva/industrial posterior.
3. Resistência Térmica: O Galvalume reflete o calor solar melhor, mantendo o ambiente interno até 5°C mais ameno.

Na JMartins Industrial, trabalhamos com bobinas certificadas com garantia total de espessura e teor de revestimento.""",
                '28/09/2026'
            ),
            (
                'post-2',
                'Telhas Sanduíche (EPS): Como Reduzir em até 90% o Calor e Barulho na Sua Empresa',
                'Telhas Galvanizadas',
                'assets/telhas_trapezoidais.jpg',
                'Conheça o sistema termoacústico que está substituindo o fibrocimento e garantindo conforto térmico absoluto no Sul de MG e SP.',
                """As telhas termoacústicas, popularmente conhecidas como 'telhas sanduíche', são compostas por duas telhas de aço galvalume coladas a um núcleo isolante de EPS ou PIR.

Vantagens Imediatas:
• Redução de temperatura no interior do galpão de até 10°C;
• Eliminação quase total do barulho de chuva torrencial;
• Economia de até 40% na conta de energia elétrica com ar condicionado;
• Núcleo antichama com retardante, homologado conforme normas de segurança.

Peça seu orçamento sob medida na JMartins Industrial com frete direto para sua obra.""",
                '25/09/2026'
            ),
            (
                'post-3',
                'Logística Inteligente no Sul de Minas e São Paulo: Entregas Sem Atrasar Seu Cronograma',
                'Logística & Região',
                'assets/logistica_sp_mg.jpg',
                'Como estruturamos nossa frota e rotas para atender serralheiros e construtoras com rapidez recorde nas principais rodovias.',
                """O atraso na chegada das telhas ou bobinas trava serralherias e montagens de galpões. Pensando nisso, a JMartins Industrial possui logística dedicada interligando:

• Sul de Minas: Pouso Alegre, Varginha, Poços de Caldas, Extrema, Santa Rita do Sapucaí e Itajubá.
• Estado de São Paulo: Vale do Paraíba, Campinas, Capital, Circuito das Águas e Região de Bragança.

Nossos caminhões contam com amarrações especiais que protegem as abas e o acabamento das telhas contra amassados durante o transporte.""",
                '22/09/2026'
            )
        ]
        c.executemany('''
            INSERT INTO posts (id, title, category, image, excerpt, content, date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', initial_posts)
        print('Posts iniciais inseridos com sucesso.')

    conn.commit()
    conn.close()

class RequestHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def _read_json(self):
        length = int(self.headers.get('Content-Length', 0))
        if length == 0:
            return {}
        raw = self.rfile.read(length).decode('utf-8')
        try:
            return json.loads(raw)
        except Exception:
            return {}

    def _get_auth_user(self):
        auth = self.headers.get('Authorization', '')
        if not auth.startswith('Bearer '):
            return None
        token = auth.split(' ', 1)[1].strip()
        conn = get_db()
        c = conn.cursor()
        c.execute('''
            SELECT s.token, s.user_id, s.username, u.email
            FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP
        ''', (token,))
        row = c.fetchone()
        conn.close()
        if row:
            return dict(row)
        return None

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')

        # Healthcheck
        if path == '/api/health':
            self._send_json({'status': 'ok', 'time': datetime.datetime.now().isoformat()})
            return

        # Obter dados do usuário logado
        if path == '/api/auth/me':
            user = self._get_auth_user()
            if not user:
                self._send_json({'error': 'Não autorizado'}, 401)
                return
            self._send_json({'ok': True, 'user': {'username': user['username'], 'email': user['email']}})
            return

        # Obter configurações públicas do site
        if path == '/api/config':
            conn = get_db()
            c = conn.cursor()
            c.execute('SELECT key, value FROM site_config')
            rows = c.fetchall()
            conn.close()
            cfg = {row['key']: row['value'] for row in rows}
            self._send_json({'ok': True, 'config': cfg})
            return

        # Obter posts públicos
        if path == '/api/posts':
            conn = get_db()
            c = conn.cursor()
            c.execute('SELECT id, title, category, image, excerpt, content, date FROM posts ORDER BY created_at DESC')
            rows = c.fetchall()
            conn.close()
            posts = [dict(row) for row in rows]
            self._send_json({'ok': True, 'posts': posts})
            return

        self._send_json({'error': 'Rota não encontrada'}, 404)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')
        data = self._read_json()

        # LOGIN
        if path == '/api/auth/login':
            username = (data.get('username') or '').strip()
            password = data.get('password') or ''
            if not username or not password:
                self._send_json({'error': 'Usuário e senha são obrigatórios'}, 400)
                return

            conn = get_db()
            c = conn.cursor()
            c.execute('SELECT id, username, email, password_hash, salt FROM users WHERE username = ? OR email = ?', (username, username))
            user = c.fetchone()

            if not user or not verify_password(password, user['password_hash'], user['salt']):
                conn.close()
                self._send_json({'error': 'Credenciais inválidas. Verifique usuário e senha.'}, 401)
                return

            # Criar sessão de 7 dias
            token = secrets.token_hex(32)
            expires = datetime.datetime.now() + datetime.timedelta(days=7)
            c.execute('''
                INSERT INTO sessions (token, user_id, username, expires_at)
                VALUES (?, ?, ?, ?)
            ''', (token, user['id'], user['username'], expires.isoformat()))
            conn.commit()
            conn.close()

            self._send_json({
                'ok': True,
                'token': token,
                'user': {'username': user['username'], 'email': user['email']}
            })
            return

        # LOGOUT
        if path == '/api/auth/logout':
            auth = self.headers.get('Authorization', '')
            if auth.startswith('Bearer '):
                token = auth.split(' ', 1)[1].strip()
                conn = get_db()
                c = conn.cursor()
                c.execute('DELETE FROM sessions WHERE token = ?', (token,))
                conn.commit()
                conn.close()
            self._send_json({'ok': True, 'message': 'Desconectado com sucesso'})
            return

        # TROCAR SENHA (Autenticado)
        if path == '/api/auth/change-password':
            user = self._get_auth_user()
            if not user:
                self._send_json({'error': 'Não autorizado'}, 401)
                return

            current_password = data.get('current_password', '')
            new_password = data.get('new_password', '')
            if not new_password or len(new_password) < 6:
                self._send_json({'error': 'A nova senha deve ter no mínimo 6 caracteres.'}, 400)
                return

            conn = get_db()
            c = conn.cursor()
            c.execute('SELECT id, password_hash, salt FROM users WHERE id = ?', (user['user_id'],))
            db_user = c.fetchone()

            if not verify_password(current_password, db_user['password_hash'], db_user['salt']):
                conn.close()
                self._send_json({'error': 'A senha atual informada está incorreta.'}, 400)
                return

            p_hash, salt = hash_password(new_password)
            c.execute('UPDATE users SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', (p_hash, salt, user['user_id']))
            conn.commit()
            conn.close()

            self._send_json({'ok': True, 'message': 'Senha alterada com sucesso!'})
            return

        # ESQUECI MINHA SENHA (Gerar Código de Recuperação)
        if path == '/api/auth/forgot-password':
            ident = (data.get('identifier') or '').strip()
            if not ident:
                self._send_json({'error': 'Informe seu usuário ou e-mail cadastrado.'}, 400)
                return

            conn = get_db()
            c = conn.cursor()
            c.execute('SELECT id, username, email FROM users WHERE username = ? OR email = ?', (ident, ident))
            user = c.fetchone()

            if not user:
                conn.close()
                # Não vazar se existe ou não, mas dar feedback seguro
                self._send_json({'error': 'Usuário ou e-mail não localizado.'}, 404)
                return

            # Gerar código de 6 dígitos numéricos
            code = f"{secrets.randbelow(900000) + 100000}"
            expires = datetime.datetime.now() + datetime.timedelta(hours=1)
            c.execute('UPDATE users SET recovery_code = ?, recovery_expires = ? WHERE id = ?', (code, expires.isoformat(), user['id']))
            conn.commit()
            conn.close()

            self._send_json({
                'ok': True,
                'message': 'Código de recuperação gerado com sucesso!',
                'recovery_code': code,
                'email': user['email']
            })
            return

        # REDEFINIR SENHA COM CÓDIGO
        if path == '/api/auth/reset-password':
            code = (data.get('recovery_code') or '').strip()
            new_password = data.get('new_password') or ''

            if not code or not new_password or len(new_password) < 6:
                self._send_json({'error': 'Código de recuperação e nova senha (mínimo 6 dígitos) são obrigatórios.'}, 400)
                return

            conn = get_db()
            c = conn.cursor()
            c.execute('''
                SELECT id, username, recovery_expires 
                FROM users 
                WHERE recovery_code = ? AND recovery_expires > CURRENT_TIMESTAMP
            ''', (code,))
            user = c.fetchone()

            if not user:
                conn.close()
                self._send_json({'error': 'Código de recuperação inválido ou expirado.'}, 400)
                return

            p_hash, salt = hash_password(new_password)
            c.execute('''
                UPDATE users 
                SET password_hash = ?, salt = ?, recovery_code = NULL, recovery_expires = NULL, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (p_hash, salt, user['id']))
            conn.commit()
            conn.close()

            self._send_json({'ok': True, 'message': 'Senha redefinida com sucesso! Você já pode entrar com a nova senha.'})
            return

        # SALVAR CONFIGURAÇÕES DO SITE (Protegido)
        if path == '/api/config':
            user = self._get_auth_user()
            if not user:
                self._send_json({'error': 'Acesso negado. Faça login no Painel Adm.'}, 401)
                return

            cfg = data.get('config', {})
            conn = get_db()
            c = conn.cursor()
            for k, v in cfg.items():
                c.execute('''
                    INSERT INTO site_config (key, value, updated_at)
                    VALUES (?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
                ''', (k, str(v)))
            conn.commit()
            conn.close()

            self._send_json({'ok': True, 'message': 'Configurações salvas no banco com sucesso!'})
            return

        # CRIAR POST (Protegido)
        if path == '/api/posts':
            user = self._get_auth_user()
            if not user:
                self._send_json({'error': 'Acesso negado. Faça login no Painel Adm.'}, 401)
                return

            title = (data.get('title') or '').strip()
            category = (data.get('category') or '').strip()
            image = (data.get('image') or '').strip()
            excerpt = (data.get('excerpt') or '').strip()
            content = (data.get('content') or '').strip()
            post_date = data.get('date') or datetime.date.today().strftime('%d/%m/%Y')

            if not title or not excerpt or not content:
                self._send_json({'error': 'Título, resumo e conteúdo são obrigatórios.'}, 400)
                return

            post_id = 'post-' + str(int(datetime.datetime.now().timestamp() * 1000))
            conn = get_db()
            c = conn.cursor()
            c.execute('''
                INSERT INTO posts (id, title, category, image, excerpt, content, date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (post_id, title, category, image, excerpt, content, post_date))
            conn.commit()
            conn.close()

            self._send_json({'ok': True, 'id': post_id, 'message': 'Post publicado no banco de dados com sucesso!'})
            return

        self._send_json({'error': 'Rota não encontrada'}, 404)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')

        # REMOVER POST (Protegido): /api/posts/<id>
        if path.startswith('/api/posts/'):
            user = self._get_auth_user()
            if not user:
                self._send_json({'error': 'Acesso negado. Faça login no Painel Adm.'}, 401)
                return

            post_id = path.replace('/api/posts/', '').strip()
            conn = get_db()
            c = conn.cursor()
            c.execute('DELETE FROM posts WHERE id = ?', (post_id,))
            conn.commit()
            conn.close()

            self._send_json({'ok': True, 'message': 'Post removido do banco com sucesso.'})
            return

        self._send_json({'error': 'Rota não encontrada'}, 404)

def run():
    init_db()
    server_address = ('0.0.0.0', PORT)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f'Servidor API JMartins iniciado em http://0.0.0.0:{PORT}')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

if __name__ == '__main__':
    run()
