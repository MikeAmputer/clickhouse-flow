# ch-flow

[![GitHub release](https://img.shields.io/github/v/release/MikeAmputer/clickhouse-flow)](https://github.com/MikeAmputer/clickhouse-flow/releases)
[![Docker](https://img.shields.io/badge/docker-ch--flow-blue?logo=docker)](https://hub.docker.com/r/mikeamputer/ch-flow)
[![GHCR](https://img.shields.io/badge/ghcr.io-ch--flow-blue?logo=github)](https://github.com/MikeAmputer/clickhouse-flow/pkgs/container/ch-flow)
[![Wiki](https://img.shields.io/badge/wiki-docs-lightgrey?logo=github)](https://github.com/MikeAmputer/clickhouse-flow/wiki)

Web service for visualizing ClickHouse data flows. Primarily designed for development environments, it helps developers quickly understand and explore data dependencies and transformation paths in their local or dev setups.

- Renders a directed acyclic graph of tables, views, and materialized views.
- Supports export to `PDF` and `SVG` formats
- Supports multiple database configurations

<p align="center">
  <img src="https://github.com/user-attachments/assets/57b19456-3363-4c41-8306-2bf2ecc1e66f" alt="Example flow" width="75%"/>
</p>

> [!NOTE]
> This is an unofficial tool and is not affiliated with or endorsed by ClickHouse Inc.
> 
> "ClickHouse" is a registered trademark of ClickHouse Inc. — [clickhouse.com](https://clickhouse.com/)

## Quick Setup

bash:
```bash
docker run -d -p 3000:3000 \
  -e CHF_DB_URL="http://clickhouse:8123" \
  -e CHF_DB_USERNAME="developer" \
  -e CHF_DB_PASSWORD="developer" \
  -e CHF_DB_NAME="my_db" \
  mikeamputer/ch-flow:latest
``` 

PowerShell:
```powershell
docker run -d -p 3000:3000 `
  -e CHF_DB_URL="http://clickhouse:8123" `
  -e CHF_DB_USERNAME="developer" `
  -e CHF_DB_PASSWORD="developer" `
  -e CHF_DB_NAME="my_db" `
  mikeamputer/ch-flow:latest
```

Docker Compose:
```yaml
services:
  ch-flow:
    image: mikeamputer/ch-flow:latest
    environment:
      CHF_DB_URL: "http://clickhouse:8123"
      CHF_DB_USERNAME: "developer"
      CHF_DB_PASSWORD: "developer"
      CHF_DB_NAME: "my_db"
    ports:
      - "3000:3000"
```

You can customize behavior using [environment variables](https://github.com/MikeAmputer/clickhouse-flow/wiki/Environment-Variables) or mounting a custom [config file](https://github.com/MikeAmputer/clickhouse-flow/wiki/Config-File).

Image is also available at GHCR: `ghcr.io/mikeamputer/ch-flow:latest`

## Demo

**Try it instantly in your browser using GitHub Codespaces:**

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/mikeamputer/clickhouse-flow?quickstart=1)

1. Click the link above to create a new Codespace
1. Wait a few minutes for the Codespace to initialize
1. Open **Ports** tab: `Ctrl+Shift+P` > `View: Toggle Ports`
1. Locate the forwarded port `3000` and open it in a new browser tab
