# Linkler

Simple link landing page, features a strapi CMS for adding new link entries

## Configure

Copy the `.env.example` file to `.env` and modify the relevant fields

## SSL (Optional)

If you have an SSL certificate and private key, you can put the files in the `./linkler-frontend/ssl/` directory.

| file                 | location                          |
| -------------------- | --------------------------------- |
| Private key          | `./linkler-frontend/ssl/key.pem`  |
| Certificate          | `./linkler-frontend/ssl/cert.pem` |
| CA bundle (optional) | `./linkler-frontend/ssl/ca.pem`   |

If no files are found in the SSL directory, the server will host as a regular HTTP server

## Docker Build

```
docker compose build
```

```
docker compose up
```
