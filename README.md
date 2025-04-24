# Topea - Professional Web Development & Design

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. This website showcases professional web development and design services with a clean, elegant interface.

![Topea Website](public/images/hero-bg-768.webp)

## 🚀 Technologies Used

### Frontend
- **React 18**: For building the user interface
- **TypeScript**: For type-safe code
- **Vite**: For fast development and optimized builds
- **Tailwind CSS**: For utility-first styling
- **React Icons**: For high-quality icons
- **Responsive Design**: Mobile-first approach for all screen sizes

### Backend
- **Express**: For the API server
- **Nodemailer**: For sending emails
- **CORS**: For secure cross-origin requests
- **Dotenv**: For environment variable management
- **TypeScript**: For type-safe server code

## 📁 Project Structure

```
topea.me/
├── public/               # Static assets
│   ├── images/           # Image files
│   ├── favicon.ico       # Favicon
│   └── site.webmanifest  # Web app manifest
├── src/                  # Source code
│   ├── components/       # React components
│   │   ├── Contact.tsx   # Contact form component
│   │   ├── Footer.tsx    # Footer component
│   │   ├── Header.tsx    # Header/navigation component
│   │   ├── Hero.tsx      # Hero section component
│   │   ├── Portfolio.tsx # Portfolio section component
│   │   ├── Services.tsx  # Services section component
│   │   └── ...           # Other components
│   ├── App.tsx           # Main App component
│   ├── main.tsx          # Entry point
│   ├── types.ts          # TypeScript type definitions
│   └── index.css         # Global styles
├── server/               # Server-side code
│   ├── server.ts         # Express server for handling form submissions
│   ├── package.json      # Server dependencies
│   └── tsconfig.json     # TypeScript configuration for server
├── index.html            # HTML template
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── .env                  # Environment variables (not in git)
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables
└── package.json          # Project dependencies and scripts
```

## 🛠️ Installation and Setup

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/idkfknowatall/topea.me.git
   cd topea.me
   ```

2. Install dependencies for both frontend and server:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory with your email credentials:
   ```
   EMAIL_PASSWORD=your_email_password
   PORT=3001
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev -- --host
   ```

5. In a separate terminal, start the API server:
   ```bash
   npm run server:dev
   ```

6. Open your browser and navigate to:
   - Local: http://localhost:5173/
   - Network: http://[your-ip-address]:5173/ (for testing on other devices)

## 💻 Development Workflow

### Running the Development Server

```bash
npm run dev -- --host
```

This starts the development server with hot module replacement, allowing you to see changes in real-time. The `--host` flag makes the server accessible from other devices on your network.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Previewing the Production Build

```bash
npm run preview
```

This serves the production build locally for testing before deployment.

## 🧩 Components and Features

### Header Component

The header includes:
- Logo with animated code icon
- Navigation menu
- Mobile-responsive hamburger menu
- Scroll-based styling changes

### Hero Section

The hero section features:
- Full-width background image
- Animated text and buttons
- Responsive design for all screen sizes
- Optimized image loading with WebP format

### Portfolio Section

The portfolio section includes:
- Filterable project cards
- Hover effects with project details
- Responsive grid layout
- Optimized image loading

### Services Section

The services section showcases:
- Service cards with icons
- Pricing information (optional)
- Call-to-action buttons

### Contact Section

The contact section provides:
- Fully functional contact form with email sending capability
- Social media links
- Location information

The contact form uses a secure server-side implementation with:
- SMTP email sending via Nodemailer
- Form validation and sanitization
- Honeypot spam protection
- Rate limiting to prevent abuse

### Footer Component

The footer includes:
- Copyright information
- Scroll to top button
- Responsive layout

## 🎨 Customization Guide

### Changing Colors

The color scheme is defined in `tailwind.config.js`:

```js
colors: {
  primary: {
    // Blue shades
    50: '#eef3fb',
    // ...
    900: '#0f1e3e',
  },
  secondary: {
    // Gold/amber shades
    50: '#fdf8ed',
    // ...
    900: '#4a3409',
  },
  // ...
}
```

To change the color scheme, modify these values in the configuration file.

### Adding New Projects

To add a new project to the portfolio:

1. Add the project images to the `public/images/` directory
2. Update the project data in the `Portfolio.tsx` component:

```tsx
const projects: Project[] = [
  {
    id: 'project-7', // Add a unique ID
    title: 'New Project Name',
    category: 'web-design', // Choose from existing categories
    description: 'Description of the new project',
    image: '/images/new-project.jpg',
    srcSet: '/images/new-project.webp',
  },
  // ...existing projects
];
```

### Modifying Services

To update the services offered:

1. Edit the services data in the `Services.tsx` component:

```tsx
const services: Service[] = [
  {
    id: 'service-5', // Add a unique ID
    title: 'New Service',
    description: 'Description of the new service',
    icon: <FaNewIcon />, // Import the icon from react-icons
    price: '$XXX', // Optional
  },
  // ...existing services
];
```

## 📱 Responsive Design

The website is built with a mobile-first approach and is fully responsive across all device sizes:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

Responsive features include:
- Flexible grid layouts
- Responsive typography
- Optimized images for different screen sizes
- Mobile navigation menu
- Touch-friendly interactive elements

## ⚡ Performance Optimization

### Image Optimization

- WebP format for modern browsers
- Multiple image sizes for different devices
- Lazy loading for off-screen images
- Proper image dimensions and aspect ratios

### Code Optimization

- Code splitting for faster initial load
- Tree shaking to eliminate unused code
- Minification of CSS and JavaScript
- Deferred loading of non-critical resources

### Lighthouse Scores

The website is optimized to achieve high Lighthouse scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 🌐 Browser Compatibility

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Android Chrome

## 🔄 Updating the Website

### Content Updates

1. Identify the component that contains the content you want to update
2. Make your changes to the component
3. Test the changes locally
4. Build and deploy the updated website

### Adding New Features

1. Create new components in the `src/components/` directory
2. Import and use these components in the appropriate sections
3. Update types in `types.ts` if necessary
4. Test thoroughly before deployment

## 📦 Deployment

### Building for Production

```bash
# Build the frontend
npm run build

# Build the server
npm run server:build
```

This creates a production-ready build in the `dist` directory for the frontend and in `server/dist` for the server.

### Deploying to a Web Server

1. Upload the contents of the `dist` directory to your web server
2. Upload the contents of the `server` directory to your server
3. Install server dependencies:
   ```bash
   cd server
   npm install --production
   ```
4. Set up environment variables on your server:
   ```
   EMAIL_PASSWORD=your_email_password
   PORT=3001
   NODE_ENV=production
   ```
5. Start the server:
   ```bash
   npm start
   ```

### Deploying to a VPS or Dedicated Server

1. Clone the repository on your server
2. Build both frontend and server:
   ```bash
   npm install
   npm run build
   cd server
   npm install
   npm run build
   ```
3. Set up environment variables
4. Use PM2 or similar to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start server/dist/server.js
   ```

### Deploying to Netlify/Vercel with Serverless Functions

For platforms like Netlify or Vercel, you'll need to adapt the server code to use serverless functions:

1. Create a serverless function for the contact form API
2. Update the API URL in the frontend code
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set up environment variables in the platform's dashboard

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

Created with ❤️ by Topea
