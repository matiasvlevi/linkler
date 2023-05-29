# Linkler

Customizable link landing page

[See Deployed example](https://links.matiasvlevi.com)

#### Features

- Strapi CMS
- Google Tag Manager & Google Analitics (Optional)
- SSL (Optional)

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

## Build

```
docker compose build
```

```
docker compose up
```

<br/>

---

### Notes

You might want to add `find` and `findOne` permissions to `links` and `meta` apis in the strapi Role Settings.
This is planned to be bootstrapped by default in the next versions.
