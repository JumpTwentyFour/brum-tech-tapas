# Offical Docker Image for PHP
# https://hub.docker.com/_/php
FROM php:8.0-fpm

# Update System Dependencies
RUN apt-get clean && apt-get update --fix-missing && apt-get upgrade --yes

# Install System Dependencies
RUN apt-get install --yes \
    git \
    libcurl4-openssl-dev \
    libicu-dev \
    libjpeg-dev \
    libmagickwand-dev \
    libonig-dev \
    libpng-dev \
    libssl-dev \
    libxml2-dev \
    libzip-dev \
    unzip \
    wget \
    zip

# PHP Extensions
# https://github.com/mlocati/docker-php-extension-installer
RUN docker-php-ext-install \
    bcmath \
    ctype \
    exif \
    fileinfo \
    gd \
    json \
    mbstring \
    openssl \
    mysqli \
    intl \
    opcache \
    pdo_mysql \
    tokenizer \
    xml \
    zip

RUN pecl install imagick && docker-php-ext-enable imagick

# PHP Config
# COPY ./config/php.ini /usr/local/etc/php/php.ini
COPY ./config/conf.d/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Install Composer from Official Docker Image
# https://hub.docker.com/_/composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set Current Directory
WORKDIR /var/www/brumtechtapas/
