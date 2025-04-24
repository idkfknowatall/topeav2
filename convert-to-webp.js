import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to images directory
const imagesDir = path.join(__dirname, 'public', 'images');

// Function to convert an image to WebP format
async function convertToWebP(inputPath, outputPath, quality = 80) {
  try {
    console.log(`Converting ${inputPath} to WebP...`);
    
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    console.log(`Converted to ${outputPath}`);
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(2);
    
    console.log(`Original: ${(originalSize / 1024).toFixed(2)} KB, WebP: ${(webpSize / 1024).toFixed(2)} KB, Savings: ${savings}%`);
  } catch (error) {
    console.error(`Error converting ${inputPath} to WebP: ${error.message}`);
  }
}

// Function to create responsive images
async function createResponsiveImages(inputPath, baseName, sizes = [2048, 1024, 640, 320]) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    for (const width of sizes) {
      // Skip if requested width is larger than original
      if (width > metadata.width) continue;
      
      const outputPath = path.join(imagesDir, `${baseName}-${width}.webp`);
      
      console.log(`Creating ${width}px wide version of ${inputPath}...`);
      
      await sharp(inputPath)
        .resize(width)
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      console.log(`Created ${outputPath}`);
    }
  } catch (error) {
    console.error(`Error creating responsive images for ${inputPath}: ${error.message}`);
  }
}

// Process all images in the directory
async function processImages() {
  try {
    const files = fs.readdirSync(imagesDir);
    
    for (const file of files) {
      if (!file.endsWith('.jpg') && !file.endsWith('.jpeg') && !file.endsWith('.png')) {
        continue;
      }
      
      const inputPath = path.join(imagesDir, file);
      const baseName = path.basename(file, path.extname(file));
      const outputPath = path.join(imagesDir, `${baseName}.webp`);
      
      // Convert to WebP
      await convertToWebP(inputPath, outputPath);
      
      // Create responsive images for portfolio items
      if (file.startsWith('portfolio-')) {
        await createResponsiveImages(inputPath, baseName);
      }
      
      // Create responsive images for hero background
      if (file === 'hero-bg.jpg') {
        await createResponsiveImages(inputPath, baseName, [2048, 1536, 1024, 768]);
      }
    }
    
    console.log('All images processed successfully!');
  } catch (error) {
    console.error(`Error processing images: ${error.message}`);
  }
}

// Start processing images
processImages();
