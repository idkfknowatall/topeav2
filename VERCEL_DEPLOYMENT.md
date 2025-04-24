# Deploying Topea Website to Vercel

This guide provides instructions for deploying the Topea website to Vercel.

## Prerequisites

- GitHub account connected to Vercel
- Access to the GitHub repository

## Deployment Steps

### 1. Push Changes to GitHub

Ensure all changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Your commit message"
git push
```

### 2. Deploy from Vercel Dashboard

1. Go to [Vercel's New Project page](https://vercel.com/new)
2. Select the GitHub repository (topea.me)
3. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default for Vite)
   - Install Command: `npm install` (default)
4. Add Environment Variables:
   - `EMAIL_PASSWORD`: Your email password for the contact form
5. Click "Deploy"

### 3. Custom Domain Setup (Optional)

1. In your project dashboard, go to "Settings" > "Domains"
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS settings

### 4. Continuous Deployment

- Vercel automatically deploys when changes are pushed to the main branch
- Preview deployments are created for pull requests

## Troubleshooting

### Build Failures

If the build fails, check:
1. Build logs in the Vercel dashboard
2. Ensure all dependencies are correctly installed
3. Verify environment variables are set correctly

### Contact Form Issues

If the contact form doesn't work:
1. Check that the `EMAIL_PASSWORD` environment variable is set
2. Verify the email configuration in `server/server.ts`

## Maintenance

### Updating the Website

1. Make changes locally
2. Test locally with `npm run dev`
3. Commit and push to GitHub
4. Vercel will automatically deploy the changes

### Monitoring

- Use Vercel Analytics to monitor website performance
- Check deployment logs for any issues

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
