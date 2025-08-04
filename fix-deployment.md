# 🚨 URGENT: Fix Pro-Tasker Deployment Issues

## **Issue Summary:**
Your app can't login/register/create tasks because:
1. **JWT_SECRET is missing on Render** - This breaks all authentication
2. **Sensitive credentials are exposed in Git** - Security risk
3. **Environment variables not properly configured**

---

## **🔧 IMMEDIATE FIXES (Do these NOW):**

### **Step 1: Fix Render Environment Variables**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Find your service: `perscholascapstoneprotaskerbackend`
3. Click on it → Go to **Environment** tab
4. Add these environment variables:

```
JWT_SECRET=my-secret-word-yo-production-2024
MONGO_URI=mongodb+srv://roninmars:NEW_PASSWORD@perscholas.mvyr4mx.mongodb.net/protasker?retryWrites=true&w=majority&appName=PerScholas
NODE_ENV=production
PORT=10000
```

### **Step 2: 🔐 SECURITY FIX - Change MongoDB Password**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Database Access → Find user `roninmars`
3. Click **Edit** → **Edit Password**
4. Generate new password and **SAVE IT**
5. Update the `MONGO_URI` in Render with the new password

### **Step 3: Fix GitHub OAuth (if using)**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Find your OAuth App
3. Generate new Client Secret
4. Add to Render environment variables:
```
GITHUB_CLIENT_ID=Ov23lietewdOatFIFbxY
GITHUB_CLIENT_SECRET=NEW_SECRET_HERE
GITHUB_CALLBACK_URL=https://perscholascapstoneprotaskerbackend.onrender.com/api/users/auth/github/callback
```

### **Step 4: Remove Sensitive Files from Git**
Run these commands:
```bash
# Remove .env files from Git tracking
git rm --cached backend/.env frontend-protasker/.env frontend-protasker/.env.production

# Commit the fix
git add .
git commit -m "🔒 Security fix: Remove .env files and update .gitignore"
git push origin main
```

---

## **🧪 Test After Fixes:**

### Test 1: Backend Health
```bash
curl https://perscholascapstoneprotaskerbackend.onrender.com/health
```
Should return: `{"message":"API is healthy"}`

### Test 2: Registration
```bash
curl -X POST https://perscholascapstoneprotaskerbackend.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"testpass123"}'
```
Should return user data with token (not JWT_SECRET error)

---

## **📱 Frontend Issues to Check:**

1. **Make sure your frontend is deployed to Netlify**
2. **Verify the build uses the production environment variables**
3. **Check that CORS is properly configured**

---

## **🚀 After All Fixes:**
1. Your Render service should restart automatically
2. Test registration/login on your live site
3. Try creating a task
4. All functionality should work

**Need help?** Run the troubleshooting script after fixes:
```bash
node deployment-troubleshoot.js
```
