<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

To deploy this app, connect the GitHub repository to Cloudflare Pages. Set the framework to None, the build command to npm run build, and the output directory to dist.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5a706207-5787-4b30-aef9-0a7200a10287

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
