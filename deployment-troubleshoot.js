#!/usr/bin/env node

/**
 * Pro-Tasker Deployment Troubleshooting Script
 * Run this to diagnose deployment issues
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: './backend/.env' });

console.log('🔍 Pro-Tasker Deployment Diagnostics\n');
console.log('=' .repeat(50));

// Check 1: Environment Variables
console.log('\n📋 1. CHECKING ENVIRONMENT VARIABLES:');
console.log('-----------------------------------');

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const envStatus = {};

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  envStatus[varName] = !!value;
  
  if (value) {
    if (varName === 'MONGO_URI') {
      // Hide credentials but show structure
      const maskedUri = value.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
      console.log(`✅ ${varName}: ${maskedUri}`);
    } else {
      console.log(`✅ ${varName}: Set (${value.length} characters)`);
    }
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

// Check 2: File Structure
console.log('\n📁 2. CHECKING FILE STRUCTURE:');
console.log('-----------------------------');

const criticalFiles = [
  './backend/package.json',
  './backend/server.js',
  './backend/config/db.js',
  './frontend-protasker/package.json',
  './frontend-protasker/src/App.jsx'
];

criticalFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${filePath}`);
  } else {
    console.log(`❌ ${filePath} - MISSING`);
  }
});

// Check 3: Package.json Scripts
console.log('\n📦 3. CHECKING PACKAGE.JSON SCRIPTS:');
console.log('-----------------------------------');

try {
  const backendPkg = JSON.parse(fs.readFileSync('./backend/package.json', 'utf8'));
  console.log('Backend scripts:');
  if (backendPkg.scripts?.start) {
    console.log(`✅ start: ${backendPkg.scripts.start}`);
  } else {
    console.log('❌ start script: MISSING');
  }
  
  if (backendPkg.type === 'module') {
    console.log('✅ type: module');
  } else {
    console.log('❌ type: should be "module"');
  }
} catch (error) {
  console.log('❌ Error reading backend package.json:', error.message);
}

try {
  const frontendPkg = JSON.parse(fs.readFileSync('./frontend-protasker/package.json', 'utf8'));
  console.log('\nFrontend scripts:');
  if (frontendPkg.scripts?.build) {
    console.log(`✅ build: ${frontendPkg.scripts.build}`);
  } else {
    console.log('❌ build script: MISSING');
  }
} catch (error) {
  console.log('❌ Error reading frontend package.json:', error.message);
}

// Check 4: MongoDB Connection Test
console.log('\n🗄️ 4. TESTING MONGODB CONNECTION:');
console.log('--------------------------------');

if (process.env.MONGO_URI) {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000 // 10 second timeout
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log(`📊 Database: ${connection.connection.db.databaseName}`);
    console.log(`🌐 Host: ${connection.connection.host}:${connection.connection.port}`);
    
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected cleanly');
    
  } catch (error) {
    console.log('❌ MongoDB connection failed:');
    console.log(`   Error: ${error.message}`);
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 Check your username/password in MONGO_URI');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Check your cluster URL in MONGO_URI');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Check your network access settings in MongoDB Atlas');
    }
  }
} else {
  console.log('❌ Cannot test - MONGO_URI not set');
}

// Check 5: Build Test
console.log('\n🏗️ 5. TESTING FRONTEND BUILD:');
console.log('-----------------------------');

try {
  // Check if dist folder exists (previous build)
  const distPath = './frontend-protasker/dist';
  if (fs.existsSync(distPath)) {
    console.log('✅ Previous build found in dist/');
    
    // Check for key files
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✅ index.html exists in build');
    } else {
      console.log('❌ index.html missing from build');
    }
  } else {
    console.log('⚠️ No previous build found - run "npm run build" in frontend-protasker/');
  }
} catch (error) {
  console.log('❌ Error checking build:', error.message);
}

// Summary
console.log('\n📋 DEPLOYMENT READINESS SUMMARY:');
console.log('===============================');

const allEnvVarsSet = requiredEnvVars.every(varName => envStatus[varName]);
const hasStartScript = fs.existsSync('./backend/package.json');

if (allEnvVarsSet) {
  console.log('✅ Environment variables: Ready');
} else {
  console.log('❌ Environment variables: Issues found');
}

if (hasStartScript) {
  console.log('✅ Backend configuration: Ready');
} else {
  console.log('❌ Backend configuration: Issues found');
}

console.log('\n🚀 NEXT STEPS:');
console.log('=============');
console.log('1. Fix any ❌ issues shown above');
console.log('2. Test locally: npm start (backend) + npm run dev (frontend)');
console.log('3. Push to GitHub: git add . && git commit -m "Fix deployment" && git push');
console.log('4. Deploy to Render (backend) and Netlify (frontend)');
console.log('\n📖 See DEPLOYMENT_GUIDE.md for detailed instructions');

process.exit(0);
