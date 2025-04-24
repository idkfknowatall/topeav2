# Topea Website Deployment Guide

This guide provides step-by-step instructions for deploying the Topea website to different environments.

## Table of Contents

- [Deploying to Vercel (Recommended)](#deploying-to-vercel-recommended)
- [Deploying to a Traditional Server](#deploying-to-a-traditional-server)
- [Updating the Website](#updating-the-website)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)

## Deploying to Vercel (Recommended)

### Prerequisites

- GitHub account connected to Vercel
- Access to the GitHub repository

### Deployment Steps

1. **Push Changes to GitHub**

   Ensure all changes are committed and pushed to GitHub:

   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. **Deploy from Vercel Dashboard**

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

3. **Custom Domain Setup (Optional)**

   1. In your project dashboard, go to "Settings" > "Domains"
   2. Add your custom domain
   3. Follow Vercel's instructions to configure DNS settings

4. **Continuous Deployment**

   - Vercel automatically deploys when changes are pushed to the main branch
   - Preview deployments are created for pull requests

## Deploying to a Traditional Server

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- PM2 (for process management)
- A server with SSH access (e.g., DigitalOcean, AWS, etc.)

### Deployment Steps

1. **Initial Server Setup**

   ```bash
   # Install Node.js and npm (if not already installed)
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 globally
   sudo npm install -g pm2

   # Create a directory for the application
   mkdir -p /var/www/topea
   cd /var/www/topea
   ```

2. **Clone the Repository**

   ```bash
   # Clone the repository
   git clone https://github.com/idkfknowatall/topea.me.git .

   # Install dependencies
   npm install
   cd server
   npm install
   cd ..
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory:

   ```bash
   # Create .env file
   cat > .env << EOL
   EMAIL_PASSWORD=your_email_password
   PORT=3001
   NODE_ENV=production
   EOL
   ```

4. **Build the Application**

   ```bash
   # Build both frontend and server
   npm run build:all
   ```

5. **Start the Application with PM2**

   ```bash
   # Set up logs directory and start with PM2
   npm run deploy:setup
   npm run deploy:start
   ```

6. **Configure Nginx (Optional but Recommended)**

   If you're using Nginx as a reverse proxy:

   ```bash
   # Install Nginx
   sudo apt-get install -y nginx

   # Create Nginx configuration
   sudo nano /etc/nginx/sites-available/topea
   ```

   Add the following configuration:

   ```nginx
   server {
       listen 80;
       server_name topea.me www.topea.me;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   Enable the site and restart Nginx:

   ```bash
   sudo ln -s /etc/nginx/sites-available/topea /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Set Up SSL with Let's Encrypt**

   ```bash
   # Install Certbot
   sudo apt-get install -y certbot python3-certbot-nginx

   # Obtain SSL certificate
   sudo certbot --nginx -d topea.me -d www.topea.me
   ```

8. **Useful Commands**

   ```bash
   # View application status
   npm run deploy:status

   # Restart the application
   npm run deploy:restart

   # Stop the application
   npm run deploy:stop

   # View logs
   pm2 logs topea-website

   # Monitor the application
   pm2 monit
   ```

## Updating the Website

### When Using Vercel

1. Make changes locally
2. Test locally with `npm run dev`
3. Commit and push to GitHub
4. Vercel will automatically deploy the changes

### When Using a Traditional Server

To update the website with new changes:

```bash
# Pull the latest changes
git pull

# Install any new dependencies
npm install
cd server
npm install
cd ..

# Rebuild the application
npm run build:all

# Restart the application
npm run deploy:restart
```

## Troubleshooting

### Vercel Deployment Issues

If the build fails, check:
1. Build logs in the Vercel dashboard
2. Ensure all dependencies are correctly installed
3. Verify environment variables are set correctly

### Traditional Server Issues

#### Application Not Starting

Check the logs:

```bash
pm2 logs topea-website
```

#### Email Not Working

Verify the email credentials in the `.env` file:

```bash
nano .env
```

#### Server Errors

Check the server logs:

```bash
cat logs/error.log
```

## Security Considerations

- Keep your server and Node.js updated
- Use a firewall (e.g., ufw)
- Set up fail2ban to prevent brute force attacks
- Regularly check for and install security updates
- Use environment variables for sensitive information
- Implement rate limiting for API endpoints
- Use HTTPS for all connections

## Backup Strategy

It's recommended to set up regular backups of your application:

```bash
# Create a backup script
cat > backup.sh << EOL
#!/bin/bash
BACKUP_DIR="/var/backups/topea"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
tar -czf $BACKUP_DIR/topea_$TIMESTAMP.tar.gz /var/www/topea
find $BACKUP_DIR -type f -mtime +30 -delete
EOL

# Make the script executable
chmod +x backup.sh

# Set up a cron job to run daily
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/topea/backup.sh") | crontab -
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
