# Environment Variable Management Guide

## Local Development

### 1. Create your `.env` file

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

**Never commit `.env` to git.** The `.gitignore` already excludes it.

### 2. Required variables

| Variable       | Description                              | Required for         |
|----------------|------------------------------------------|----------------------|
| `MONGODB_URI`  | MongoDB connection string (Atlas/local)  | Production API       |
| `JWT_SECRET`   | Random 64+ char secret for JWT signing  | API (auth)           |
| `CORS_ORIGIN`  | Allowed frontend origin                  | API (security)       |
| `SMTP_HOST`    | SMTP server host                         | Email verification   |
| `SMTP_PORT`    | SMTP server port (587 for TLS)           | Email verification   |
| `SMTP_USER`    | SMTP username / email address            | Email verification   |
| `SMTP_PASS`    | SMTP app password (not your login pass)  | Email verification   |
| `EMAIL_FROM`   | From address for outbound emails         | Email verification   |
| `VITE_API_URL` | Backend API URL for the frontend build   | Frontend (Vite)      |

### 3. Generate a strong JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Get a free MongoDB URI (Atlas)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user with a strong password
4. Whitelist your IP (or 0.0.0.0/0 for all — not recommended for prod)
5. Click "Connect" → "Drivers" → copy the connection string
6. Replace `<password>` with your database user password

### 5. Gmail SMTP setup

1. Enable 2FA on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate an App Password for "Mail"
4. Use that 16-char password as `SMTP_PASS`

---

## GitHub Secrets (for CI/CD)

Go to **GitHub → Settings → Secrets and variables → Actions → New repository secret**

### Backend deployment (Render / Railway)

Set these directly in the platform's environment variables dashboard — do NOT use GitHub secrets for server environment variables.

On Render:
- Dashboard → your service → Environment → Add environment variable

Required on your server platform:
```
MONGODB_URI         mongodb+srv://...
JWT_SECRET          <your-64-char-secret>
CORS_ORIGIN         https://your-frontend.vercel.app
SMTP_HOST           smtp.gmail.com
SMTP_PORT           587
SMTP_USER           your@email.com
SMTP_PASS           <app-password>
EMAIL_FROM          your@email.com
NODE_ENV            production
PORT                8080
```

### Frontend deployment (Vercel via GitHub Actions)

Add these GitHub secrets for the CI/CD workflow:

| Secret Name          | Value                                          |
|----------------------|------------------------------------------------|
| `VERCEL_TOKEN`       | From vercel.com → Settings → Tokens           |
| `VERCEL_ORG_ID`      | From `.vercel/project.json` after `vercel link`|
| `VERCEL_PROJECT_ID`  | From `.vercel/project.json` after `vercel link`|
| `VITE_API_URL`       | `https://your-api.onrender.com/api`            |

### How to add GitHub secrets:

```
GitHub repo → Settings → Secrets and variables → Actions → New repository secret
Name:  VERCEL_TOKEN
Value: <paste token here>
```

---

## Security Best Practices

1. **Never hardcode secrets** in source code or commit them
2. **Rotate JWT_SECRET** if compromised (all existing tokens become invalid)
3. **Use different secrets** per environment (dev, staging, prod)
4. **Enable MongoDB Atlas IP whitelist** in production
5. **Use short-lived tokens** for email verification (24h) and password reset (1h) — already implemented
6. **Keep SMTP_PASS as an App Password** — never your real Google login password
7. **Add `.env` to `.gitignore`** — already done in this project

---

## Environment-Specific Configs

| Setting         | Development            | Production                       |
|-----------------|------------------------|----------------------------------|
| MONGODB_URI     | (blank = in-memory)    | MongoDB Atlas connection string  |
| JWT_SECRET      | any string             | strong 64-char random hex        |
| CORS_ORIGIN     | http://localhost:5173  | https://your-app.vercel.app      |
| NODE_ENV        | development            | production                       |

In development on Replit: set `MONGODB_URI` in the Replit Secrets panel (sidebar padlock icon) to connect to MongoDB Atlas. Leave it blank to use the auto-started in-memory MongoDB.
