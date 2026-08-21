# Abouelsaad Portfolio API

Base URL:

```text
http://localhost:4000
```

Production example:

```text
https://abouelsaad.cloud
```

The API is an Express service. The default port is `4000`, configured with `API_PORT`.

## Authentication

Protected endpoints require a JWT returned by the login endpoint:

```http
Authorization: Bearer YOUR_TOKEN
```

Roles:

- `admin`: manage users, articles, portfolio projects, and contact messages
- `editor`: manage articles, portfolio projects, and contact messages
- `author`: create and update owned articles

## Common responses

### Validation error — `400`

```json
{
  "error": "Invalid input",
  "details": {
    "formErrors": [],
    "fieldErrors": {}
  }
}
```

### Authentication error — `401`

```json
{ "error": "Authentication required" }
```

### Permission error — `403`

```json
{ "error": "Insufficient permissions" }
```

## Health

### `GET /api/health`

Checks whether the API process is running.

```bash
curl http://localhost:4000/api/health
```

Response:

```json
{ "ok": true }
```

## Authentication routes

### `POST /api/auth/login`

Logs in an admin user. Email is normalized to lowercase.

Request:

```json
{
  "email": "admin@example.com",
  "password": "StrongPassword123!"
}
```

Response — `200`:

```json
{
  "token": "JWT_TOKEN",
  "role": "admin"
}
```

### `POST /api/auth/users`

Creates an admin user. Requires an `admin` token.

Request:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "StrongPassword123!",
  "role": "admin"
}
```

Allowed roles: `admin`, `editor`, `author`.

Response — `201`:

```json
{
  "id": "uuid",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin"
}
```

## Article routes

### `GET /api/articles`

Returns published articles, newest first. No authentication required.

```bash
curl http://localhost:4000/api/articles
```

### `POST /api/articles`

Creates an article. Requires `admin`, `editor`, or `author`.

Request:

```json
{
  "title": "Building Better Products",
  "slug": "building-better-products",
  "excerpt": "A short article summary.",
  "content": "Full article content.",
  "imageUrl": "https://example.com/article.jpg",
  "published": true
}
```

Required fields: `title`, `slug`, `excerpt`, `content`.

The slug must contain only lowercase letters, numbers, and hyphens.

### `PUT /api/articles/:id`

Updates an article. Requires `admin`, `editor`, or the article author. All fields are optional.

```json
{
  "title": "Updated title",
  "published": true
}
```

### `DELETE /api/articles/:id`

Deletes an article. Requires `admin` or `editor`.

Response: `204 No Content`.

## Portfolio routes

### `GET /api/portfolio`

Returns all portfolio projects, newest first.

Optional filter:

```text
GET /api/portfolio?category=web
```

Allowed categories: `web`, `mobile`, `self`.

### `POST /api/portfolio`

Creates a portfolio project. Requires `admin` or `editor`.

Request:

```json
{
  "title": "Clinic Platform",
  "slug": "clinic-platform",
  "description": "A clinic management platform.",
  "imageUrl": "https://example.com/project.jpg",
  "category": "web",
  "url": "https://example.com"
}
```

Required fields: `title`, `slug`, `description`, `category`.

### `DELETE /api/portfolio/:id`

Deletes a portfolio project. Requires `admin` or `editor`.

Response: `204 No Content`.

## Contact routes

### `POST /api/contact`

Stores a contact message. If SMTP variables are configured, it also emails `mohamed@abouelsaad.cloud`.

Request:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I would like to discuss a project with you."
}
```

Response — `201`:

```json
{ "message": "Message received" }
```

### `GET /api/contact`

Returns contact messages, newest first. Requires `admin` or `editor`.

## Environment variables

```env
API_PORT=4000
DATABASE_URL=your_postgres_connection_string
BETTER_AUTH_SECRET=your_secret
JWT_SECRET=your_fallback_secret
FRONTEND_URL=http://localhost:3000
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=your_sender_address
```

Never commit real passwords, database URLs, JWT secrets, or SMTP credentials.

## Start the API

```bash
pnpm install
pnpm start:api
```

Development mode:

```bash
pnpm dev:api
```

The API initializes its required PostgreSQL tables during startup.
