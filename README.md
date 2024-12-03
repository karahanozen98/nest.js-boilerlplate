# Features

- Dot ENV
- Logging
- Caching
- Pagination
- Localization
- Rate Limitting
- Authentication Guard
- Authorization Guard
- Dynamic Modules
- Swagger
- View Engine (ejs)

# Getting Started

Setup .env.dev like below
NODE_ENV=development
BACKEND_URL=https://swapi.dev/api/
ENABLE_DOCUMENTATION=true
PORT=3000
FALLBACK_LANG=en
PUBLIC_CACHE=redis://127.0.0.1:6379
SESSION_CACHE=redis://127.0.0.1:6379
API_VERSION=1

then execute

> npm install
> npm run start

visit http://localhost:3000/documentation for API documentation
