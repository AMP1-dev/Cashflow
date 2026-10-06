FROM nginx:alpine

RUN apk add --no-cache python3 sqlite-libs

COPY default.conf /etc/nginx/conf.d/default.conf
COPY api.py /usr/local/bin/api.py
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh /usr/local/bin/api.py

VOLUME ["/data"]

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
