# Deploying Connectly to Netlify

This project is pre-configured for deployment to **Netlify** with full Single Page Application (SPA) routing and Serverless Functions support for the Express backend.

---

## 1. Quick Deploy via Netlify Dashboard (Git / GitHub)

1. **Push your code** to GitHub or GitLab.
2. Log in to [Netlify](https://app.netlify.com/) and click **"Add new site" > "Import an existing project"**.
3. Select your repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Base directory:** (leave empty / root)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. Click **"Deploy site"**.

---

## 2. Deploy via Netlify CLI

If you prefer deploying from your terminal:

```bash
# 1. Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# 2. Log in to Netlify
netlify login

# 3. Initialize or link your site
netlify init

# 4. Build and deploy to production
netlify deploy --prod --build
```

---

## 3. Architecture on Netlify

| Component | Path / Configuration | Description |
|---|---|---|
| **Build Configuration** | `netlify.toml` | Defines build command (`npm run build`), publish directory (`dist`), Node 20, and redirect rules. |
| **SPA Redirects** | `public/_redirects` | Fallback rule `/* -> /index.html 200` to prevent 404 errors on page refreshes. |
| **API Serverless Function** | `netlify/functions/api.ts` | Wraps the Express REST API via `serverless-http` to handle all `/api/*` endpoints serverlessly. |
| **API Redirect** | `netlify.toml` | Forwards `/api/*` requests to `/.netlify/functions/api/:splat`. |
| **Database Storage** | `data_connectly_db.json` / `/tmp` | In serverless environments, writable storage is mounted to `/tmp` with instant hydration from seed data. |

---

## 4. Local Development with Netlify CLI

You can also run Netlify's local emulation server:

```bash
netlify dev
```

This will run Vite for the frontend and simulate Netlify Functions locally on port 8888.
