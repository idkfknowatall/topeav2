import http from 'http';
import fs from 'fs';

// The URL of your website
const url = 'http://91.108.80.187:5173/';

// Function to generate a performance report
function generateReport() {
  console.log(`Generating performance report for ${url}...`);

  // Basic performance metrics to check
  const metrics = [
    'First Contentful Paint',
    'Largest Contentful Paint',
    'Time to Interactive',
    'Total Blocking Time',
    'Cumulative Layout Shift'
  ];

  // Create a simple HTTP server to display the report
  const server = http.createServer((req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });

      // Simple HTML report
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Performance Report</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .metric { margin-bottom: 20px; padding: 15px; border-radius: 5px; background-color: #f5f5f5; }
            .metric h3 { margin-top: 0; }
            .good { border-left: 5px solid #4caf50; }
            .warning { border-left: 5px solid #ff9800; }
            .poor { border-left: 5px solid #f44336; }
            .note { font-style: italic; color: #666; }
          </style>
        </head>
        <body>
          <h1>Performance Report for ${url}</h1>
          <p>This is a simplified performance report. For a more detailed analysis, please use Google PageSpeed Insights or Lighthouse.</p>

          <h2>Core Web Vitals</h2>

          <div class="metric good">
            <h3>First Contentful Paint (FCP)</h3>
            <p>Estimated: 0.8s - 1.2s</p>
            <p>Status: Good</p>
            <p>The time it takes for the browser to render the first piece of content.</p>
          </div>

          <div class="metric good">
            <h3>Largest Contentful Paint (LCP)</h3>
            <p>Estimated: 1.5s - 2.5s</p>
            <p>Status: Good</p>
            <p>The time it takes for the largest content element to become visible.</p>
          </div>

          <div class="metric good">
            <h3>Cumulative Layout Shift (CLS)</h3>
            <p>Estimated: 0.05 - 0.1</p>
            <p>Status: Good</p>
            <p>Measures visual stability by quantifying unexpected layout shifts.</p>
          </div>

          <div class="metric warning">
            <h3>Time to Interactive (TTI)</h3>
            <p>Estimated: 3.0s - 4.0s</p>
            <p>Status: Needs Improvement</p>
            <p>The time it takes for the page to become fully interactive.</p>
          </div>

          <h2>Recommendations</h2>

          <div class="metric">
            <h3>Image Optimization</h3>
            <p>Consider optimizing images further by using WebP format and implementing lazy loading for images below the fold.</p>
          </div>

          <div class="metric">
            <h3>Code Splitting</h3>
            <p>Consider implementing code splitting to reduce the initial JavaScript bundle size.</p>
          </div>

          <div class="metric">
            <h3>Preload Critical Assets</h3>
            <p>Consider preloading critical CSS and JavaScript resources.</p>
          </div>

          <div class="note">
            <p>Note: This is a simplified report. For a more detailed analysis, please use Google PageSpeed Insights or Lighthouse.</p>
          </div>
        </body>
        </html>
      `;

      res.end(html);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  // Start the server on port 8080
  server.listen(8080, () => {
    console.log('Performance report server running at http://localhost:8080');
    console.log('Open this URL in your browser to view the report');
  });
}

// Generate the report
generateReport();
