# Pro-Tasker Deployment Guide

## 🚀 Deploying to Render (Backend) + Netlify (Frontend)

### 📋 Prerequisites
- MongoDB Atlas account (for cloud database)
- Render account (for backend deployment)
- Netlify account (for frontend deployment)
- GitHub repository with your code

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up or log in

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select a cloud provider and region
   - Name your cluster (e.g., "pro-tasker-cluster")

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `protasker-user` (or your choice)
   - Generate a secure password and **SAVE IT**
   - Database User Privileges: "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0)
   - This allows Render to connect to your database

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://protasker-user:YOUR_PASSWORD@pro-tasker-cluster.abc123.mongodb.net/protasker?retryWrites=true&w=majority`

---

## 🖥️ Step 2: Deploy Backend to Render

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `pro-tasker` repository

4. **Configure Build Settings**
   - **Name**: `pro-tasker-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Set Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   
   ```
   NODE_ENV = production
   MONGO_URI = mongodb+srv://protasker-user:YOUR_PASSWORD@pro-tasker-cluster.abc123.mongodb.net/protasker?retryWrites=true&w=majority
   JWT_SECRET = your-super-secret-jwt-key-here-make-it-long-and-random
   PORT = 10000
   ```

   **⚠️ Important**: Replace `YOUR_PASSWORD` with your actual MongoDB password!

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend will be available at: `https://pro-tasker-backend.onrender.com`

---

## 🌐 Step 3: Deploy Frontend to Netlify

1. **Update Frontend Environment**
   Create/update `frontend-protasker/.env`:
   ```
   VITE_BACKEND_URL=https://pro-tasker-backend.onrender.com
   ```

2. **Build Frontend Locally (Test)**
   ```bash
   cd frontend-protasker
   npm run build
   ```

3. **Create Netlify Account**
   - Go to [Netlify](https://netlify.com)
   - Sign up with GitHub

4. **Deploy to Netlify**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Configure build settings:
     - **Base directory**: `frontend-protasker`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend-protasker/dist`

5. **Set Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add: `VITE_BACKEND_URL = https://pro-tasker-backend.onrender.com`

6. **Deploy**
   - Click "Deploy site"
   - Your frontend will be available at: `https://amazing-name-123456.netlify.app`

---

## 🔧 Step 4: Test Your Deployment

1. **Check Backend Health**
   - Visit: `https://pro-tasker-backend.onrender.com/health`
   - Should return: `{"status": "OK", "message": "Server is running"}`

2. **Check Database Connection**
   - Look at Render logs for "✅ MongoDB connected successfully"

3. **Test Frontend**
   - Visit your Netlify URL
   - Try registering a new user
   - Create a project and tasks

---

## 🚨 Common Issues & Solutions

### Backend Issues:

**"MONGO_URI environment variable is not set"**
- Check Render environment variables
- Make sure MONGO_URI is exactly as shown above

**"MongoServerError: bad auth"**
- Double-check your MongoDB username/password
- Ensure the user has "Read and write" permissions

**"Connection timed out"**
- Check MongoDB Network Access settings
- Make sure 0.0.0.0/0 is allowed

### Frontend Issues:

**"Cannot connect to server"**
- Check if VITE_BACKEND_URL is set correctly
- Make sure backend is deployed and running

**CORS Errors**
- Backend should already have CORS configured
- If issues persist, check backend logs

---

## 📝 Environment Variables Summary

### Backend (.env on Render):
```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
PORT=10000
```

### Frontend (.env for Netlify):
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

---

## 🎉 You're Done!

Your Pro-Tasker app should now be fully deployed and accessible worldwide!

- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-backend.onrender.com
- **Database**: MongoDB Atlas (cloud)

## 🔄 For Future Updates:

1. Make changes to your code
2. Push to GitHub: `git push origin main`
3. Both Render and Netlify will auto-deploy!

---

## 🆘 Need Help?

If you encounter issues:
1. Check the deployment logs on Render/Netlify
2. Verify all environment variables are set correctly
3. Test your MongoDB connection string locally first
4. Make sure your GitHub repository is up to date

Good luck with your deployment! 🚀
