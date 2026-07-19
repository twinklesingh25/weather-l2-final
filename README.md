## Deployment Instructions

This application was generated using Google AI Studio and deployed via Cloudflare Pages.

### 1. Exporting from Google AI Studio to GitHub
* Developed the application using the Google AI Studio App Build environment.
* Used the **Sync to GitHub** panel within AI Studio to automatically stage and push the generated `src` folder, `package.json`, and configuration files directly into this GitHub repository.

### 2. Deploying to Cloudflare Pages
To host the application live on the web, the following Cloudflare Pages configuration was used:
* **Source:** Connected Cloudflare Pages directly to this GitHub repository.
* **Framework Preset:** `None`
* **Build Command:** `npm run build`
* **Build Output Directory:** `dist`

Once configured, Cloudflare automatically builds the Vite/React app and deploys the generated `dist` folder to a live `.pages.dev` URL upon every new commit.
