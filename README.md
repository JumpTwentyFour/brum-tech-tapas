# Brum Tech Tapas

## Getting Started

This project uses [Docker](https://docs.docker.com/get-docker/).

### Clone this repository

```
git clone git@github.com:JumpTwentyFour/brum-tech-tapas.git
```

### Setup your env file

Copy `.env.example` to `.env` (no changes are required, it contains the correct settings for development.)

```
cd brum-tech-tapas/
cp .env.example .env
```

### Setup your hosts file

Add these lines to your `/etc/hosts` file:

```
127.0.0.1   brumtechtapas-wordpress.local
127.0.0.1   brumtechtapas-static.local
```

### Start Docker

```
docker-compose up --build -d
```

### Install PHP Dependencies using Composer

```
docker-compose exec php composer install
```

### Test

Visit https://brumtechtapas-wordpress.local in your browser.

---

## Frontend Development with Node

Either you can run the commands locally, or using Docker.

### Locally

```
nvm use
npm install
npm run start
npm run build
```

### Docker

```
docker-compose run --rm node npm install
docker-compose run --rm node npm run start
docker-compose run --rm node npm run build
```


---

## Regenerate SSL Certificates

If the self-signed SSL certificate expires and you need to regenerate it, then navigate to the SSL directory.

```
cd docker/nginx/ssl/
```

Generate the SSL certificate and private key.

```
openssl req -config openssl.cnf \
-new -sha256 -newkey rsa:2048 -nodes -keyout localhost.key \
-x509 -days 365 -out localhost.crt
```

Any changes you make, you will need to rebuild the docker containers.

```
docker-compose down
docker-compose up --build -d
```

If the new certificate is still not being recognised, you can completely rebuild the containers from scratch.

```
docker-compose down
docker-compose build --no-cache
docker-compose up --build -d
```


### Debugging SSL Certificates

View Certificate information.

```
openssl x509 -text -noout -in localhost.crt
```

Read the SSL Certificate information from a remote server.

```
openssl s_client -showcerts -connect localhost:443
```
