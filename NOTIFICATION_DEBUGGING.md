# 🔔 Push Notification Debugging Guide

## ❌ Notifications Not Showing? Follow This Checklist

### 1. ✅ CHECK: Notifications Enabled in App

**Open browser console (F12) and look for:**
```
📊 Current Status: {
  enabled: true,          ← Must be true
  hasToken: true,         ← Must be true
  permission: "granted",  ← Must be "granted"
  token: "ey9qhlqQVBwwQR..." 
}
```

**If `enabled: false`:**
- Click "Enable Notifications" button on any page
- Grant permission when browser asks

---

### 2. ✅ CHECK: Service Worker Registered

**In console, run:**
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
  regs.forEach(reg => console.log('Active:', reg.active?.state, 'Scope:', reg.scope));
});
```

**Expected output:**
```
Service Workers: [ServiceWorkerRegistration]
Active: "activated" Scope: "http://localhost:3001/"
```

**If no service workers:**
1. Open DevTools → Application → Service Workers
2. Check if `firebase-messaging-sw.js` is listed
3. If not, hard refresh (Ctrl+Shift+R)

---

### 3. ✅ CHECK: Notification Permission

**In console, run:**
```javascript
console.log('Permission:', Notification.permission);
```

**Must show:** `Permission: "granted"`

**If "denied" or "default":**
1. Click browser address bar padlock icon
2. Find Notifications permission
3. Change to "Allow"
4. Refresh page

---

### 4. ✅ CHECK: FCM Token Generated

**In console, run:**
```javascript
const token = localStorage.getItem('pushToken');
console.log('FCM Token:', token);
console.log('Token Length:', token?.length);
```

**Expected:**
```
FCM Token: ey9qhlqQVBwwQROE3z57fy:APA91b...
Token Length: 152 (approximately)
```

**If null or undefined:**
- Re-enable notifications from the app
- Check console for FCM token generation errors

---

### 5. ✅ CHECK: Subscribed to Correct Topic

**In console, run:**
```javascript
const topics = localStorage.getItem('subscribedTopics');
console.log('Subscribed Topics:', JSON.parse(topics));
```

**Expected for Refreshment page:**
```
Subscribed Topics: ["cafeteria_admin"]
```

**If empty or wrong topic:**
- Disable and re-enable notifications
- Ensure you're on the correct page

---

### 6. ✅ CHECK: Listener Active

**When page loads, console should show:**
```
🎬 App mounted, setting up notification listener...
🎧 onMessageListener called, setting up listener...
✅ Message listener is now active
```

**If you don't see this:**
- Refresh the page
- Check for JavaScript errors

---

### 7. ✅ CHECK: Backend Sending Correct Payload

**Ask backend developer to send test notification like this:**

```json
{
  "notification": {
    "title": "Test Order",
    "body": "This is a test notification"
  },
  "data": {
    "type": "cafeteria_order",
    "orderId": "test123"
  },
  "topic": "cafeteria_admin"
}
```

**Important:**
- Must include both `notification` AND `data` objects
- Topic must match your subscription: `cafeteria_admin`
- Use Firebase Admin SDK or REST API

---

### 8. ✅ CHECK: When Backend Sends Notification...

**You should see in console:**

**If app is open (foreground):**
```
🔔 ========== NOTIFICATION RECEIVED IN APP ==========
Full payload: { notification: {...}, data: {...} }
Extracted notification: { title: "...", body: "..." }
🔊 Notification sound played
✅ In-app snackbar notification set
✅ Browser notification shown with sound
====================================================
```

**If app is closed/minimized (background):**
Service worker console should show:
```
[SW] ========================================
[SW] 🔔 Background message received!
[SW] Full payload: {...}
[SW] Showing notification: ...
[SW] ========================================
```

---

## 🔧 Common Issues & Solutions

### Issue: "Permission denied"
**Solution:**
- Go to browser settings → Site settings
- Find localhost:3001 (or your domain)
- Set Notifications to "Allow"

### Issue: "No FCM token"
**Possible causes:**
1. VAPID key mismatch
2. Firebase config incorrect
3. Service worker not registered

**Solution:**
1. Verify VAPID key matches Firebase Console
2. Check .env file has correct config
3. Clear cache and reload

### Issue: "Token generated but no notifications"
**Possible causes:**
1. Backend not sending to correct topic
2. Backend using wrong Firebase project
3. Token not registered with backend

**Solution:**
1. Check backend logs for FCM send status
2. Verify backend uses same Firebase project
3. Check backend database for your FCM token

### Issue: "Notifications work sometimes, not always"
**Possible causes:**
1. Browser tab backgrounded (different code path)
2. Service worker sleeping
3. Network issues

**Solution:**
1. Test with tab both active and backgrounded
2. Check service worker console separately
3. Check network connection

### Issue: "Sound not playing"
**Possible causes:**
1. Browser muted
2. System volume off
3. Browser audio policy blocking

**Solution:**
1. Unmute browser tab
2. Check system volume
3. User must interact with page first (click anywhere)

---

## 🎯 Quick Test: Send Test Notification

**1. From Browser Console:**
```javascript
// Simulate incoming notification
const testPayload = {
  notification: {
    title: "Test Order #123",
    body: "New cafeteria order received"
  },
  data: {
    type: "cafeteria_order",
    orderId: "123"
  }
};

// This won't actually trigger FCM, just tests the handler
console.log('Testing notification display...');
```

**2. Ask Backend to Send Real Test:**
Backend should use Firebase Admin SDK:
```javascript
admin.messaging().send({
  topic: 'cafeteria_admin',
  notification: {
    title: 'Test Order #999',
    body: 'This is a test from backend'
  },
  data: {
    type: 'cafeteria_order',
    orderId: '999'
  }
});
```

---

## 📞 Still Not Working? Check These:

### Browser Compatibility
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support  
- ❌ Safari: Limited support (macOS Big Sur+ only)

### Windows Settings
- Check "Focus Assist" is OFF
- Check Windows Notifications are enabled
- Check browser has notification permission in Windows

### Network Issues
- Check firewall not blocking FCM
- Check corporate proxy settings
- Try on different network

### Firebase Console
1. Go to Cloud Messaging tab
2. Check if web app is listed
3. Verify VAPID key exists
4. Try regenerating VAPID key if all else fails

---

## 💡 Pro Tips

1. **Always check console logs first** - they tell you exactly what's happening
2. **Test in Incognito mode** - rules out extension conflicts
3. **Check both tabs:** Application console AND Service Worker console
4. **Backend logs are crucial** - verify FCM is actually being sent
5. **Token expires** - if notifications stop working, re-enable them

---

## ✅ Success Checklist

When everything works, you should see:

**On page load:**
- ✅ Green "Auto-refresh: ON" badge
- ✅ Last updated time showing
- ✅ Console: "Message listener is now active"

**When order placed:**
- ✅ Browser notification popup
- ✅ Notification sound plays
- ✅ Snackbar appears in app
- ✅ Refreshment page auto-refreshes
- ✅ New order appears in table

---

## 📝 Current Configuration

**Firebase Web App ID:** `1:189321344339:web:2b9bea03b2f46886a6dda6`  
**Measurement ID:** `G-MGHYBCJJ2J`  
**VAPID Key:** `BCMzVJJC2qiMGxramQ4wdS56vA5-nRwh-kdilmpYbMBKaXtcsv7cd0Ehjq3KBzLmsHED6Y9TRvYdj6OzywZTl38`  
**Topics:** 
- Refreshment: `cafeteria_admin`
- Inventory: `inventory-updates`
- Spaces: `space-bookings`
- Meeting Rooms: `meeting-room-bookings`
- KYC: `kyc-approval-updates`

---

**Need more help?** Share your console logs and we'll debug together! 🚀
