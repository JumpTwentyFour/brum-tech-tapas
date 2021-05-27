# Offical Docker Image for Nginx
# https://hub.docker.com/_/nginx
FROM nginx:latest

# Nginx Config
# COPY ./config/nginx.conf /etc/nginx/nginx.conf

# Vhost Config
COPY ./config/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY ./config/conf.d/static.conf /etc/nginx/conf.d/static.conf

# Self-signed SSL Certificates
COPY ./ssl/localhost.crt /etc/nginx/ssl/localhost.crt
COPY ./ssl/localhost.key /etc/nginx/ssl/localhost.key

# Set Current Directory
WORKDIR /var/www/brumtechtapas/
