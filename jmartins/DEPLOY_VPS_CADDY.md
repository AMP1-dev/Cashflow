# 🚀 Guia de Deploy na VPS com Caddy (Sem Alterar Serviços Existentes)

> **ATENÇÃO CRÍTICA**: Conforme a regra do projeto, **nada que já estiver rodando no Caddy pode ser modificado ou interrompido**.
> O Caddy suporta recarregamento gracioso (*graceful reload*) sem queda de conexões ativas (`caddy reload`), e novos domínios devem ser adicionados como **blocos novos e independentes** ou através de inclusão (`import`).

---

## 📁 Estrutura do Projeto JMartins

Os arquivos para a VPS estão na pasta `jmartins/`:
```text
jmartins/
├── assets/
│   ├── hero_steel.jpg             # Foto imponente do Hero (Bobinas e Fábrica)
│   ├── telhas_trapezoidais.jpg    # Foto em alta definição de telhas trapezoidais e termoacústicas
│   ├── bobinas_aco.jpg            # Foto de bobinas de aço galvalume
│   └── logistica_sp_mg.jpg        # Foto da frota na rodovia SP/MG
├── index.html                     # Landing Page Completa + Simulador + Painel Admin
└── DEPLOY_VPS_CADDY.md            # Este guia
```

---

## 🛠️ Método 1: Hospedagem Estática Direta no Caddy (Recomendado & Mais Leve)

Como a Landing Page é uma aplicação web autônoma e ultra rápida, ela pode ser servida diretamente pelo Caddy com consumo de memória e CPU praticamente zero.

### 1. Criar o diretório de destino na VPS
Conecte-se na sua VPS via SSH e crie a pasta:
```bash
sudo mkdir -p /var/www/jmartins/assets
sudo chown -R www-data:www-data /var/www/jmartins
```

### 2. Copiar os arquivos para a VPS
Do seu computador local (PowerShell ou terminal):
```powershell
# Exemplo via scp:
scp -r jmartins/* root@SEU_IP_VPS:/var/www/jmartins/
```

### 3. Adicionar o bloco do novo domínio no `Caddyfile` SEM ALTERAR OS ATUAIS

Abra o arquivo de configuração do Caddy:
```bash
sudo nano /etc/caddy/Caddyfile
```

**Vá até o final do arquivo** (sem apagar ou editar nenhuma linha de cima) e cole o seguinte bloco:

```caddy
# --- BLOCO JMARTINS INDUSTRIAL (ISOLADO) ---
jmartins.ind.br, www.jmartins.ind.br {
    # Pasta raiz dos arquivos estáticos
    root * /var/www/jmartins
    
    # Compressão automática de alta velocidade
    encode gzip zstd
    
    # Servidor de arquivos estáticos
    file_server
    
    # Tratamento de rotas e segurança
    try_files {path} /index.html
    
    # Cabeçalhos de cache otimizados para assets
    @assets path /assets/*
    header @assets Cache-Control "public, max-age=2592000, immutable"

    # Logs de acesso independentes
    log {
        output file /var/log/caddy/jmartins_access.log {
            roll_size 10MiB
            roll_keep 5
        }
    }
}
```

> **Dica**: Se ainda não apontou o domínio definitivo ou quer testar em um subdomínio provisório, substitua o domínio por `teste.seudominio.com.br` ou pela porta designada.

### 4. Testar a sintaxe ANTES de recarregar (Segurança Total)
Execute:
```bash
sudo caddy validate --config /etc/caddy/Caddyfile
```
Se a saída for `Valid configuration`, o Caddy confirmou que não há erros e nada será afetado!

### 5. Recarregar o Caddy sem derrubar nada
```bash
sudo systemctl reload caddy
# ou:
# sudo caddy reload --config /etc/caddy/Caddyfile
```
✅ O Caddy obterá os certificados SSL automaticamente e colocará o site no ar instantaneamente, **sem reiniciar e sem interromper nenhuma aplicação que já estava rodando!**

---

## 🐳 Método 2: Executar em Docker / Nginx Container com Caddy como Reverse Proxy

Se você preferir rodar a Landing Page isolada em um container Docker em uma porta interna (por exemplo `localhost:3085`):

### 1. Criar o `Dockerfile` dentro de `jmartins/`:
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Rodar o container na VPS:
```bash
docker build -t jmartins-lp .
docker run -d --name jmartins-site --restart always -p 127.0.0.1:3085:80 jmartins-lp
```

### 3. Adicionar o bloco de Proxy no Caddyfile (no final do arquivo):
```caddy
jmartins.ind.br, www.jmartins.ind.br {
    reverse_proxy 127.0.0.1:3085
}
```

### 4. Validar e Recarregar:
```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

---

## 🛡️ Checklist de Segurança e Validação
- [x] Nenhuma linha anterior do `Caddyfile` foi editada ou excluída.
- [x] A validação `caddy validate` retornou sucesso.
- [x] O comando `systemctl reload caddy` manteve os processos existentes operando normalmente.
- [x] Certificado SSL HTTPS gerado automaticamente pelo Caddy via Let's Encrypt.
- [x] Posts do painel administrativo gravados e editáveis diretamente no navegador.
