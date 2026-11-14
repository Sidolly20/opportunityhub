# SETUP (do these in order, one at a time)

## 1. Supabase (new project)
Supabase website -> New project. Then open "SQL Editor", paste the whole file `supabase.sql`, press Run.
Then go to Project Settings -> API. You need two things: the Project URL and the service_role key.
(Keep the key secret. Never put it in GitHub.)

## 2. Gemini key
Google AI Studio -> Get API key (free).

## 3. GitHub (new repo)
Make a new empty repo. Upload ALL files from this zip (not the zip itself).
Command Prompt (black), inside the project folder:
  git init
  git add .
  git commit -m "first version"
  git branch -M main
  git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
  git push -u origin main

## 4. Render (new Web Service)
New -> Web Service -> pick the repo.
  Build Command:  npm install && npm run build
  Start Command:  npm start
  Instance type:  Free
Environment variables (type them in Render, never in GitHub):
  GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_WHATSAPP_URL (optional), NEXT_PUBLIC_NEWSLETTER_ACTION (optional), SPONSOR_EMAIL

## 5. Daily update (free, on GitHub)
GitHub repo -> Settings -> Secrets and variables -> Actions -> New secret. Add 3 secrets:
  GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
Then Actions tab -> "Daily update" -> Run workflow, to fill the site the first time.
After that it runs by itself every day at 06:00 UTC.

## 6. Domain
Buy the domain, then Render -> Settings -> Custom Domains -> add it.
Set NEXT_PUBLIC_SITE_URL to the new address and redeploy.
Then add the site in Google Search Console and submit /sitemap.xml.

## Files YOU must edit (this is what makes Google trust it)
- lib/guides.ts      : add your own real experience, names, screenshots. Update the "updated" date.
- lib/affiliates.ts  : your real affiliate links.
- lib/site.ts        : tagline and description.
- lib/fetcher.ts     : NICHE and QUERIES at the top.
Test edit
