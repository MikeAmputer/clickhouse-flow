# ch-flow
Lightweight web service for visualizing ClickHouse data flows. Primarily designed for development environments, it helps developers quickly understand and explore data dependencies and transformation paths in their local or dev setups.

- Renders a directed acyclic graph of tables, views, and materialized views.
- Supports export to `PDF` and `SVG` formats
- Supports multiple database configurations

<p align="center">
  <img src="https://github.com/user-attachments/assets/a829f38f-716b-4403-94f3-56e4fda0f135" alt="Example flow" width="75%"/>
</p>

## Quick Setup

bash:
```bash
docker run -d -p 3000:3000 \
  -e CHF_DB_URL="http://clickhouse:8123" \
  -e CHF_DB_USERNAME="developer" \
  -e CHF_DB_PASSWORD="developer" \
  -e CHF_DB_NAME="my_db" \
  ghcr.io/mikeamputer/ch-flow:latest
``` 

PowerShell:
```powershell
docker run -d -p 3000:3000 `
  -e CHF_DB_URL="http://clickhouse:8123" `
  -e CHF_DB_USERNAME="developer" `
  -e CHF_DB_PASSWORD="developer" `
  -e CHF_DB_NAME="my_db" `
  ghcr.io/mikeamputer/ch-flow:latest
```

Docker Compose:
```yaml
services:
  ch-flow:
    image: ghcr.io/mikeamputer/ch-flow:latest
    environment:
      CHF_DB_URL: "http://clickhouse:8123"
      CHF_DB_USERNAME: "developer"
      CHF_DB_PASSWORD: "developer"
      CHF_DB_NAME: "my_db"
    ports:
      - "3000:3000"
```

You can customize behavior using [environment variables](https://github.com/MikeAmputer/clickhouse-flow/wiki/Environment-Variables) or mounting a custom [config file](https://github.com/MikeAmputer/clickhouse-flow/wiki/Config-File).
