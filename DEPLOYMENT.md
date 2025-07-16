# Deployment Guide

## GitHub Pages Deployment

This project is configured to deploy to GitHub Pages using the `gh-pages` package.

### Prerequisites

1. Ensure you have a GitHub repository set up
2. Make sure the repository name matches the `base` path in `vite.config.js` (currently `/choggers.com/`)

### Deployment Steps

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Build and deploy**:
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages**:
   - Go to your repository settings on GitHub
   - Navigate to "Pages" in the sidebar
   - Set the source to "Deploy from a branch"
   - Select the `gh-pages` branch
   - Set the folder to `/ (root)`
   - Click "Save"

### Local Development

- **Development server**: `npm run dev`
- **Preview build**: `npm run preview`
- **Build for production**: `npm run build`

### Troubleshooting

- If the base path doesn't match your repository name, update `vite.config.js`
- Ensure all dependencies are installed before building
- Check that the `gh-pages` package is installed as a dev dependency

### Custom Domain (Optional)

If you have a custom domain:

1. Add a `CNAME` file to the `public` directory with your domain
2. Update the `base` path in `vite.config.js` to `/` instead of `/choggers.com/`
3. Configure your domain in GitHub Pages settings 