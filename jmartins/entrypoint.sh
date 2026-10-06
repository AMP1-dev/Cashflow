#!/bin/sh
set -e

echo "Iniciando API SQLite JMartins..."
python3 /usr/local/bin/api.py &

echo "Iniciando Nginx na porta 80..."
exec nginx -g "daemon off;"
