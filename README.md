# Topea - Professional Web Development & Design

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. This website showcases professional web development and design services with a clean, elegant interface.

![Topea Website](public/images/hero-bg-768.webp)

## 🚀 Technologies Used

- **React 18**: For building the user interface
- **TypeScript**: For type-safe code
- **Vite**: For fast development and optimized builds
- **Tailwind CSS**: For utility-first styling
- **React Icons**: For high-quality icons
- **Responsive Design**: Mobile-first approach for all screen sizes

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
├── index.html            # HTML template
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
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

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev -- --host
   # or
   yarn dev --host
   ```

4. Open your browser and navigate to:
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
- Contact form
- Social media links
- Location information

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
npm run build
```

This creates a production-ready build in the `dist` directory.

### Deploying to a Web Server

Upload the contents of the `dist` directory to your web server.

### Deploying to GitHub Pages

1. Install the gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add these scripts to package.json:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### Deploying to Netlify/Vercel

1. Connect your GitHub repository to Netlify or Vercel
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy

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
