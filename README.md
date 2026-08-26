# SplitMate - Smart Student Expense & Group Bill Splitter

SplitMate is an expense tracker, multimodal OCR receipt parser, group bill splitter, and UPI settlement tool designed for college students, flatmates, and hostel groups.

---

## 🚀 Deploying to GitHub Pages

This repository is pre-configured to build and deploy to GitHub Pages without white screen errors:

### Method 1: Automated GitHub Actions (Recommended)
1. Push this repository to GitHub (`main` or `master` branch).
2. On GitHub, go to your repository **Settings** → **Pages** (in the left sidebar).
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build the app and deploy it to `https://<your-username>.github.io/<repo-name>/`.

---

### Method 2: Manual Deploy via `gh-pages` Branch
1. Run the build locally:
   ```bash
   npm install
   npm run build
   ```
2. Deploy the `dist` folder to your `gh-pages` branch using git or the `gh-pages` package:
   ```bash
   npx gh-pages -d dist
   ```
3. In repository **Settings** → **Pages**, set **Source** to **Deploy from a branch**, select `gh-pages` branch and `/ (root)` folder, then click **Save**.

---

## 🛠️ Key Fixes Included for GitHub Pages
- **Relative Base Path (`base: './'`)**: Assets (`.js`, `.css`) are loaded relatively so subpath repository URLs load correctly.
- **`.nojekyll` Included**: Prevents GitHub Pages Jekyll engine from ignoring asset folders.
- **`404.html` SPA Handling**: Handles direct navigation and page reloads gracefully.
- **Client-Side Fallback & LocalStorage Persistence**: Fully functional offline and on static hosts without requiring a live Node.js server.
