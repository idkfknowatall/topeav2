#!/usr/bin/env node

/**
 * Bundle analyzer script to monitor bundle size and optimization
 * Run with: npm run analyze-bundle
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const BUNDLE_SIZE_LIMITS = {
  // Maximum bundle sizes in KB
  main: 500,        // Main application bundle
  vendor: 300,      // React and other vendors
  icons: 20,        // Icon bundle (after optimization)
  total: 1000,      // Total bundle size
};

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function colorize(text, color) {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundleSize() {
  console.log(colorize('\n🔍 Analyzing bundle size...', 'cyan'));
  
  try {
    // Build the project
    console.log(colorize('Building project...', 'blue'));
    execSync('npm run build', { stdio: 'inherit' });
    
    // Check if dist directory exists
    const distPath = join(process.cwd(), 'dist');
    if (!existsSync(distPath)) {
      throw new Error('Build failed - dist directory not found');
    }
    
    // Analyze bundle files
    const assetsPath = join(distPath, 'assets');
    if (!existsSync(assetsPath)) {
      throw new Error('Assets directory not found in dist');
    }
    
    // Get all JS files
    const { readdirSync, statSync } = await import('fs');
    const files = readdirSync(assetsPath)
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = join(assetsPath, file);
        const stats = statSync(filePath);
        return {
          name: file,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
        };
      })
      .sort((a, b) => b.size - a.size);
    
    console.log(colorize('\n📊 Bundle Analysis Results:', 'magenta'));
    console.log('='.repeat(60));
    
    let totalSize = 0;
    let hasWarnings = false;
    
    files.forEach(file => {
      totalSize += file.size;
      const sizeKB = file.size / 1024;
      
      // Determine file type and check limits
      let fileType = 'other';
      let limit = null;
      
      if (file.name.includes('vendor') || file.name.includes('react')) {
        fileType = 'vendor';
        limit = BUNDLE_SIZE_LIMITS.vendor;
      } else if (file.name.includes('icon')) {
        fileType = 'icons';
        limit = BUNDLE_SIZE_LIMITS.icons;
      } else if (file.name.includes('index') || file.name.includes('main')) {
        fileType = 'main';
        limit = BUNDLE_SIZE_LIMITS.main;
      }
      
      // Color code based on size
      let color = 'green';
      let status = '✅';
      
      if (limit && sizeKB > limit) {
        color = 'red';
        status = '❌';
        hasWarnings = true;
      } else if (limit && sizeKB > limit * 0.8) {
        color = 'yellow';
        status = '⚠️';
      }
      
      console.log(
        `${status} ${colorize(file.name.padEnd(40), color)} ${colorize(file.sizeFormatted.padStart(10), color)} ${limit ? `(limit: ${limit}KB)` : ''}`
      );
    });
    
    console.log('='.repeat(60));
    
    // Total size analysis
    const totalSizeKB = totalSize / 1024;
    const totalColor = totalSizeKB > BUNDLE_SIZE_LIMITS.total ? 'red' : 
                      totalSizeKB > BUNDLE_SIZE_LIMITS.total * 0.8 ? 'yellow' : 'green';
    
    console.log(
      `📦 Total Bundle Size: ${colorize(formatBytes(totalSize), totalColor)} (${totalSizeKB.toFixed(2)} KB)`
    );
    
    // Performance recommendations
    console.log(colorize('\n💡 Performance Recommendations:', 'cyan'));
    
    if (hasWarnings) {
      console.log(colorize('⚠️  Some bundles exceed size limits!', 'red'));
      console.log('   Consider:');
      console.log('   - Code splitting for large components');
      console.log('   - Lazy loading for non-critical features');
      console.log('   - Tree shaking optimization');
      console.log('   - Removing unused dependencies');
    } else {
      console.log(colorize('✅ All bundles are within size limits!', 'green'));
    }
    
    // Icon optimization status
    const iconFiles = files.filter(f => f.name.includes('icon'));
    if (iconFiles.length > 0) {
      const iconSize = iconFiles.reduce((sum, f) => sum + f.size, 0) / 1024;
      if (iconSize < BUNDLE_SIZE_LIMITS.icons) {
        console.log(colorize('✅ Icon optimization successful!', 'green'));
        console.log(`   Icon bundle size: ${iconSize.toFixed(2)} KB (target: <${BUNDLE_SIZE_LIMITS.icons} KB)`);
      }
    }
    
    // Bundle composition
    console.log(colorize('\n📈 Bundle Composition:', 'cyan'));
    const composition = files.reduce((acc, file) => {
      const sizeKB = file.size / 1024;
      const percentage = (file.size / totalSize * 100).toFixed(1);
      acc.push({ name: file.name, sizeKB: sizeKB.toFixed(2), percentage });
      return acc;
    }, []);
    
    composition.forEach(item => {
      const bar = '█'.repeat(Math.round(item.percentage / 2));
      console.log(`${item.name.substring(0, 30).padEnd(30)} ${item.sizeKB.padStart(8)} KB ${item.percentage.padStart(5)}% ${colorize(bar, 'blue')}`);
    });
    
    console.log(colorize('\n🎉 Bundle analysis complete!', 'green'));
    
    // Exit with error code if warnings
    if (hasWarnings) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error(colorize(`❌ Bundle analysis failed: ${error.message}`, 'red'));
    process.exit(1);
  }
}

// Run the analysis
analyzeBundleSize();
