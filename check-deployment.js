#!/usr/bin/env node

/**
 * Simple Pro-Tasker Deployment Check (No external dependencies)
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Pro-Tasker Deployment Check\n');
console.log('=' .repeat(40));

// Check 1: File Structure
console.log('\n📁 CHECKING CRITICAL FILES:');
console.log('---------------------------');

const criticalFiles = [
  { path: './backend/package.json', required: true },
  { path: './backend/server.js', required: true },
  { path: './backend/.env', required: true },
  { path: './backend/config/db.js', required: true },
  { path: './frontend-protasker/package.json', required: true },
  { path: './frontend-protasker/src/App.jsx', required: true },
  { path: './frontend-protasker/.env', required: false }
];

let missingFiles = [];

criticalFiles.forEach(file => {
  if (fs.existsSync(file.path)) {
    console.log(`✅ ${file.path}`);
  } else {
    console.log(`${file.required ? '❌' : '⚠️'} ${file.path} - ${file.required ? 'MISSING (REQUIRED)' : 'Missing (optional)'}`);
    if (file.required) missingFiles.push(file.path);
  }
});

// Check 2: Backend Package.json
console.log('\n📦 BACKEND PACKAGE.JSON:');
console.log('------------------------');

try {
  const backendPkg = JSON.parse(fs.readFileSync('./backend/package.json', 'utf8'));
  
  // Check scripts
  if (backendPkg.scripts?.start) {
    console.log(`✅ start script: "${backendPkg.scripts.start}"`);
  } else {
    console.log('❌ start script: MISSING - Add "start": "node server.js"');
  }
  
  if (backendPkg.scripts?.dev) {
    console.log(`✅ dev script: "${backendPkg.scripts.dev}"`);
  }
  
  // Check type
  if (backendPkg.type === 'module') {
    console.log('✅ type: "module"');
  } else {
    console.log('❌ type: should be "module"');
  }
  
  // Check main dependencies
  const requiredDeps = ['express', 'mongoose', 'dotenv', 'cors', 'bcrypt', 'jsonwebtoken'];
  console.log('\nDependencies:');
  requiredDeps.forEach(dep => {
    if (backendPkg.dependencies?.[dep]) {
      console.log(`✅ ${dep}: ${backendPkg.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep}: MISSING`);
    }
  });
  
} catch (error) {
  console.log('❌ Error reading backend package.json:', error.message);
}

// Check 3: Frontend Package.json
console.log('\n🌐 FRONTEND PACKAGE.JSON:');
console.log('-------------------------');

try {
  const frontendPkg = JSON.parse(fs.readFileSync('./frontend-protasker/package.json', 'utf8'));
  
  if (frontendPkg.scripts?.build) {
    console.log(`✅ build script: "${frontendPkg.scripts.build}"`);
  } else {
    console.log('❌ build script: MISSING');
  }
  
  if (frontendPkg.scripts?.dev) {
    console.log(`✅ dev script: "${frontendPkg.scripts.dev}"`);
  }
  
  // Check if it's a Vite project
  if (frontendPkg.devDependencies?.vite || frontendPkg.dependencies?.vite) {
    console.log('✅ Vite detected');
  }
  
} catch (error) {
  console.log('❌ Error reading frontend package.json:', error.message);
}

// Check 4: Environment Files
console.log('\n🔧 ENVIRONMENT CONFIGURATION:');
console.log('-----------------------------');

// Backend .env
if (fs.existsSync('./backend/.env')) {
  try {
    const envContent = fs.readFileSync('./backend/.env', 'utf8');
    const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    console.log('Backend .env variables:');
    const requiredVars = ['MONGO_URI', 'JWT_SECRET'];
    
    requiredVars.forEach(varName => {
      const hasVar = envLines.some(line => line.startsWith(`${varName}=`));
      if (hasVar) {
        console.log(`✅ ${varName}: Set`);
      } else {
        console.log(`❌ ${varName}: NOT SET`);
      }
    });
    
    // Check for PORT
    const hasPort = envLines.some(line => line.startsWith('PORT='));
    if (hasPort) {
      console.log('✅ PORT: Set');
    } else {
      console.log('⚠️ PORT: Not set (will use default)');
    }
    
  } catch (error) {
    console.log('❌ Error reading backend .env:', error.message);
  }
} else {
  console.log('❌ Backend .env: MISSING');
}

// Frontend .env
if (fs.existsSync('./frontend-protasker/.env')) {
  try {
    const envContent = fs.readFileSync('./frontend-protasker/.env', 'utf8');
    const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    console.log('\nFrontend .env variables:');
    const hasBackendUrl = envLines.some(line => line.startsWith('VITE_BACKEND_URL='));
    if (hasBackendUrl) {
      const backendUrlLine = envLines.find(line => line.startsWith('VITE_BACKEND_URL='));
      console.log(`✅ VITE_BACKEND_URL: ${backendUrlLine.split('=')[1]}`);
    } else {
      console.log('❌ VITE_BACKEND_URL: NOT SET');
    }
    
  } catch (error) {
    console.log('❌ Error reading frontend .env:', error.message);
  }
} else {
  console.log('⚠️ Frontend .env: Missing (create for deployment)');
}

// Check 5: Build Directory
console.log('\n🏗️ BUILD STATUS:');
console.log('---------------');

const distPath = './frontend-protasker/dist';
if (fs.existsSync(distPath)) {
  console.log('✅ Frontend build directory exists');
  
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html found in build');
  } else {
    console.log('❌ index.html missing from build');
  }
} else {
  console.log('⚠️ No build directory - run "npm run build" in frontend-protasker/');
}

// Summary
console.log('\n📋 DEPLOYMENT READINESS:');
console.log('=======================');

if (missingFiles.length === 0) {
  console.log('✅ All critical files present');
} else {
  console.log('❌ Missing critical files:', missingFiles.join(', '));
}

console.log('\n🚀 COMMON DEPLOYMENT ISSUES:');
console.log('============================');
console.log('1. ❌ Missing start script in backend package.json');
console.log('2. ❌ MONGO_URI not set or incorrect');
console.log('3. ❌ JWT_SECRET not set');
console.log('4. ❌ VITE_BACKEND_URL pointing to wrong URL');
console.log('5. ❌ CORS issues between frontend and backend');
console.log('6. ❌ MongoDB Atlas network access not configured');

console.log('\n💡 NEXT STEPS:');
console.log('=============');
console.log('1. Fix any ❌ issues above');
console.log('2. Set up MongoDB Atlas with proper network access');
console.log('3. Create Render account and deploy backend');
console.log('4. Create Netlify account and deploy frontend');
console.log('5. Update VITE_BACKEND_URL to point to your Render URL');

console.log('\n📖 See DEPLOYMENT_GUIDE.md for step-by-step instructions');
