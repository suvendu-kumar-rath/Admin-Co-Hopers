# 🔔 Push Notification Troubleshooting Guide

## Current Issue: Notifications Not Showing

### Step 1: Get New VAPID Key from Firebase Console

Since you created a NEW Firebase web app, you need to get the VAPID key for IT:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **cohoper-pushnotification**
3. Click **Project Settings** (gear icon) → **Cloud Messaging** tab
4. Scroll to **Web Push certificates** section
5. Find the web app with ID: `1:189321344339:web:844f9c6e7acd8357a6dda6`
6. If no VAPID key exists for this app, click **"Generate Key Pair"**
7. **Copy the new VAPID key** (starts with `B...`)

### Step 2: Update Your .env File

Replace the VAPID key in `.env`:

```env
REACT_APP_FIREBASE_VAPID_KEY=YOUR_NEW_VAPID_KEY_HERE
```

### Step 3: Clear Browser Cache & Service Worker

**In Chrome DevTools (F12):**
1. Go to **Application** tab
2. Click **Service Workers** (left sidebar)
3. Click **Unregister** for firebase-messaging-sw.js
4. Click **Storage** → **Clear site data**
5. Close DevTools and **refresh page** (Ctrl+Shift+R)

### Step 4: Enable Notifications Properly

1. Go to any page in your admin app (Refreshment, Inventory, etc.)
2. Click **"Enable Notifications"** button
3. When browser prompts, click **"Allow"**
4. Check console for these logs:
   - ✅ `FCM Token: ...` (should show a long token)
   - ✅ `Push token registered successfully`
   - ✅ `Subscribed to push topic`

### Step 5: Test Notification Reception

**Check Browser Console (F12) for:**
- `🎧 onMessageListener called, setting up listener...`
- `✅ Message listener is now active`

**When notification is sent from backend, you should see:**
- `🔔 ========== NOTIFICATION RECEIVED IN APP ==========`
- A popup notification in browser
- A snackbar notification in the app

---

## 🔍 Diagnostic Checklist

Run these checks in browser console (F12):

```javascript
// Check 1: Notification Permission
console.log('Notification Permission:', Notification.permission);
// Should be: "granted"

// Check 2: Service Worker Status
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
  registrations.forEach(reg => {
    console.log('SW Scope:', reg.scope);
    console.log('SW Active:', reg.active?.state);
  });
});

// Check 3: Push Token Stored
console.log('Push Token:', localStorage.getItem('pushToken'));
console.log('Notifications Enabled:', localStorage.getItem('pushNotificationsEnabled'));
console.log('Subscribed Topics:', localStorage.getItem('subscribedTopics'));

// Check 4: Firebase Messaging Status
// Should not see any errors about Firebase initialization
```

---

## 🚨 Common Issues & Solutions

### Issue: "Permission denied"
**Solution:** Go to browser settings → Site settings → Notifications → Allow for localhost

### Issue: "No FCM token available"
**Solution:** 
1. Check VAPID key is correct for the new app
2. Ensure service worker is registered
3. Clear cache and try again

### Issue: "404 Not Found" for web config
**Solution:** 
- This happened because .env had old app ID
- We already fixed this - server restart required

### Issue: Notifications work in console but don't show popup
**Solution:**
1. Check `Notification.permission === 'granted'`
2. Ensure you're not in "Do Not Disturb" mode (Windows Focus Assist)
3. Check Windows notification settings

### Issue: Service worker not registering
**Solution:**
- Must be served over HTTPS or localhost
- Check browser console for SW errors
- Ensure `/firebase-messaging-sw.js` is at root of `public/` folder

---

## 📊 Expected Console Output (Success)

When everything works correctly:

```
🎬 App mounted, setting up notification listener...
🎧 onMessageListener called, setting up listener...
✅ Message listener is now active
📊 Current Status: { enabled: true, hasToken: true, permission: "granted" }

[When notification arrives]
🔔 ========== NOTIFICATION RECEIVED IN APP ==========
Full payload: { notification: { title: "...", body: "..." } }
Showing notification: { title: "...", body: "..." }
✅ Browser notification shown
====================================================
```

---

## 🔄 Quick Reset (If All Else Fails)

1. **Clear ALL notification data:**
   ```javascript
   localStorage.removeItem('pushToken');
   localStorage.removeItem('pushNotificationsEnabled');
   localStorage.removeItem('subscribedTopics');
   ```

2. **Unregister service workers:**
   ```javascript
   navigator.serviceWorker.getRegistrations().then(registrations => {
     registrations.forEach(reg => reg.unregister());
   });
   ```

3. **Restart dev server** (important after .env changes!)

4. **Enable notifications again** from the app UI

---

## 📞 Backend Verification

Since you said backend is correct, verify:

1. Backend is sending to correct FCM topic (e.g., `cafeteria_admin`)
2. Notification payload includes both `notification` and `data` objects:
   ```json
   {
     "notification": {
       "title": "New Order",
       "body": "Order #123 received"
     },
     "data": {
       "orderId": "123",
       "type": "new_order"
     },
     "topic": "cafeteria_admin"
   }
   ```
3. Backend is using the same Firebase project credentials

---

## Next Steps

1. **Get new VAPID key** for the new web app
2. **Update .env** with new VAPID key  
3. **Restart server** (required for .env changes)
4. **Clear service worker** in DevTools
5. **Enable notifications** in app
6. **Test** by sending notification from backend

If still not working, share:
- Console logs when enabling notifications
- Console logs when backend sends notification
- Any error messages
