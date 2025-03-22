# Deployment Guide

This document provides instructions for deploying the CV Web Application in both development and production environments.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Git
- Vercel CLI (for frontend deployment)
- Heroku CLI (for backend deployment)
- PostgreSQL database

## Environment Variables

### Frontend Environment Variables

Create a `.env.local` file in the frontend root directory with the following variables:

```env
# API URLs
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Analytics
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
NEXT_PUBLIC_IPINFO_TOKEN=your_ipinfo_token

# Contact
NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com
```

### Backend Environment Variables

Create a `.env` file in the backend root directory with these variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/cv_app_db

# Authentication
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://your-domain.com

# Email (optional, for contact form)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your_email_password
```

## Local Development Setup

### Frontend (Next.js)

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/cvcrfe.git
   cd cvcrfe
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. The application will be available at `http://localhost:3000`

### Backend (NestJS)

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/cvcrbe.git
   cd cvcrbe
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Set up the database:

   ```bash
   npx prisma migrate dev
   # or
   yarn prisma migrate dev
   ```

4. Start the development server:

   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

5. The API will be available at `http://localhost:3001`

## Production Deployment

### Frontend Deployment (Vercel)

1. Install Vercel CLI if not already installed:

   ```bash
   npm i -g vercel
   # or
   yarn global add vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Deploy from your project directory:

   ```bash
   vercel --prod
   ```

4. Follow the prompts to configure your deployment.

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments.

### Backend Deployment (Heroku)

1. Install Heroku CLI if not already installed:

   ```bash
   npm i -g heroku
   # or
   yarn global add heroku
   ```

2. Login to Heroku:

   ```bash
   heroku login
   ```

3. Create a new Heroku app:

   ```bash
   heroku create cv-api-production
   ```

4. Add a PostgreSQL database:

   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. Set environment variables:

   ```bash
   heroku config:set JWT_SECRET=your_secure_jwt_secret_key
   heroku config:set JWT_EXPIRES_IN=1d
   heroku config:set JWT_REFRESH_EXPIRES_IN=7d
   heroku config:set FRONTEND_URL=https://your-domain.com
   # Add other environment variables as needed
   ```

6. Deploy to Heroku:

   ```bash
   git push heroku main
   ```

7. Run migrations:
   ```bash
   heroku run npm run prisma:migrate:deploy
   # or
   heroku run yarn prisma:migrate:deploy
   ```

## Custom Domain Setup

### Vercel Custom Domain

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `fernandoantezana.com`)
4. Follow the DNS configuration instructions provided by Vercel

### Heroku Custom Domain

1. Purchase a domain name from a domain registrar
2. Add your custom domain to your Heroku app:
   ```bash
   heroku domains:add api.fernandoantezana.com
   ```
3. Follow the DNS configuration instructions provided by Heroku

## SSL Configuration

Vercel and Heroku both provide automatic SSL certificates. No additional configuration is required.

## Continuous Deployment

### Vercel GitHub Integration

1. Connect your GitHub repository to Vercel
2. Configure automatic deployments for the `main` branch
3. Set up a production branch for stable releases

### Heroku GitHub Integration

1. Connect your GitHub repository to Heroku
2. Enable automatic deployments for the `main` branch
3. Enable review apps for pull requests (optional)

## Monitoring and Analytics

- Set up Vercel Analytics for frontend monitoring
- Configure Sentry for error tracking (frontend and backend)
- Set up a monitoring solution like UptimeRobot to ping your API endpoints

## Backup Strategy

- Set up automatic database backups with Heroku PostgreSQL
- Export and backup your database periodically

## Security Considerations

- Enable rate limiting on API endpoints
- Implement proper CORS configuration
- Regularly update dependencies
- Use environment variables for all sensitive information
- Run security audits regularly:
  ```bash
  npm audit
  # or
  yarn audit
  ```

## Performance Optimization

- Enable caching for static assets
- Use a CDN for media files
- Optimize images and assets
- Enable gzip compression on the server
