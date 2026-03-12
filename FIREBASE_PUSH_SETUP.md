# Firebase Push Notifications Setup Guide

## Issue Fixed
The **500 Internal Server Error** was happening because the app was sending a fake token instead of a real Firebase Cloud Messaging (FCM) token. The backend's `subscribeTokenToTopic` function requires a valid FCM token from Firebase.

## What's Been Implemented

### 1. Firebase Package Installed ✅
- Installed `firebase` npm package

### 2. Firebase Configuration Created ✅
- **File**: `src/config/firebase.js`
- Initializes Firebase app and messaging
- Exports `requestFCMToken()` to get real FCM tokens
- Exports `onMessageListener()` to listen for foreground messages

### 3. Service Worker Created ✅
- **File**: `public/firebase-messaging-sw.js`
- Handles background notifications when app is not in focus
- Shows browser notifications automatically

### 4. Push Notifications API Updated ✅
- **File**: `src/api/pushNotifications.js`
- Added `getFCMToken()` method that gets real FCM tokens from Firebase
- Improved error handling with specific messages

### 5. Refreshment Component Updated ✅
- **File**: `src/components/Refreshment.jsx`
- Now uses real FCM tokens instead of fake tokens
- Better error messages for Firebase configuration issues
- Changed topic from `'refreshment-orders'` to `'cafeteria_admin'` (as required by backend)

---

## 🔧 Configuration Required

To make push notifications work, you need to configure Firebase:

### Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the **Settings gear icon** > **Project Settings**
4. Scroll to **"Your apps"** section
5. If you don't have a web app, click **"Add app"** > select **Web** > give it a name
6. Copy your Firebase configuration values

### Step 2: Get VAPID Key (for Web Push)

1. In Firebase Console > **Project Settings**
2. Go to **Cloud Messaging** tab
3. Scroll to **"Web Push certificates"** section
4. Click **"Generate key pair"** if you don't have one
5. Copy the **Key pair** value (this is your VAPID key)

### Step 3: Create `.env` File

1. Copy [.env.example](.env.example) to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in `.env`:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
   REACT_APP_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxx
   REACT_APP_FIREBASE_VAPID_KEY=BNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Step 4: Update Service Worker

1. Open `public/firebase-messaging-sw.js`
2. Replace the placeholder values with your Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:xxxxxxxxxxxx",
   };
   ```

### Step 5: Restart Development Server

```bash
npm start
```

---

## 🧪 Testing

1. Open the app in your browser
2. Navigate to the Refreshment page
3. Click the notification bell icon
4. Grant notification permission when prompted
5. You should see: **"✅ Push notifications enabled! You will receive refreshment order updates."**

---

## 📋 Backend Requirements

The backend requires that push topics be one of:
- `'admins'` - All admins
- `'cafeteria_admin'` - Cafeteria/Refreshment admins ✅ **(Currently using this)**
- `'admin_${userId}'` - Specific admin by ID

---

## 🐛 Troubleshooting

### Error: "Firebase is not configured"
- Make sure you created the `.env` file with valid Firebase credentials
- Restart your development server after creating `.env`

### Error: 403 Forbidden
- The topic you're subscribing to is not allowed by the backend
- Currently using `'cafeteria_admin'` which is allowed

### Error: 500 Internal Server Error
- This was the original issue - now fixed by using real FCM tokens
- If still occurring, check that Firebase credentials are correct
- Verify that the VAPID key is correctly set

### Notifications not showing up
- Check browser notification permissions (allow notifications)
- Check browser console for errors
- Verify Firebase Cloud Messaging is enabled in Firebase Console

---

## 📝 Files Modified/Created

| File | Status | Description |
|------|--------|-------------|
| `src/config/firebase.js` | ✅ Created | Firebase initialization and FCM token management |
| `public/firebase-messaging-sw.js` | ✅ Created | Service worker for background notifications |
| `src/api/pushNotifications.js` | ✅ Updated | Added getFCMToken() method |
| `src/components/Refreshment.jsx` | ✅ Updated | Uses real FCM tokens, changed topic to 'cafeteria_admin' |
| `.env.example` | ✅ Created | Template for environment variables |
| `package.json` | ✅ Updated | Added firebase dependency |

---

## 🎯 Next Steps

1. **Get Firebase credentials** from Firebase Console
2. **Create `.env` file** with your credentials
3. **Update service worker** with your Firebase config
4. **Restart the app** and test!

Once configured, push notifications will work seamlessly with the backend API! 🚀
