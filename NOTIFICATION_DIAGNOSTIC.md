# Push Notification Diagnostic Guide

## 🔍 Step-by-Step Diagnostic

### Step 1: Check if Notifications are Enabled

1. **Open the app** in your browser
2. **Open browser console** (F12 → Console tab)
3. Look for this message:
   ```
   🔔 Notification Listener Status: { enabled: true, hasToken: true }
   ```

**Expected Results:**
- ✅ `enabled: true` and `hasToken: true` = Good! Listener is active
- ❌ `enabled: false` or `hasToken: false` = **Go to Refreshment page and click "Enable Notifications"**

---

### Step 2: Check Service Worker Registration

In browser console, run:
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
  if (regs.length > 0) {
    console.log('✅ Service worker registered');
  } else {
    console.log('❌ No service worker registered');
  }
});
```

**Expected:** Should show `firebase-messaging-sw.js` registered

---

### Step 3: Check Browser Notification Permission

In browser console, run:
```javascript
console.log('Notification permission:', Notification.permission);
```

**Expected:** Should show `"granted"`

---

### Step 4: Test Manual Notification (Frontend Working?)

In browser console, run this to test if frontend can show notifications:
```javascript
// Test in-app notification
const testPayload = {
  notification: {
    title: 'Test Order',
    body: 'This is a test notification from console'
  }
};

// Manually trigger the notification
new Notification('Test Order', {
  body: 'This is a test notification',
  icon: '/logo192.png'
});
```

**If this works:** Frontend is working! Problem is backend not sending.
**If this doesn't work:** Frontend setup issue.

---

### Step 5: Check if Backend is Sending Notifications

**The MOST COMMON issue is that the backend doesn't send push notifications when orders are created.**

#### Backend needs to have this code when order is created:

```javascript
// Backend: When a new refreshment order is created
const { sendPushToTopic } = require('./utils/notifications');

// After order is saved to database
const order = await Order.create(orderData);

// Send push notification to cafeteria admins
await sendPushToTopic('cafeteria_admin', {
  notification: {
    title: 'New Refreshment Order',
    body: `${order.username} ordered ${order.items} - ₹${order.amount}`
  },
  data: {
    orderId: order.id.toString(),
    type: 'new_order',
    amount: order.amount.toString()
  }
});
```

**Ask your backend developer:**
1. ✅ Is `sendPushToTopic` called when a new order is created?
2. ✅ Is the backend Firebase Admin SDK initialized? (Service account file added and server restarted?)
3. ✅ Are there any errors in backend console when order is created?

---

### Step 6: Backend Logs to Check

When a new order is created, the **backend console** should show:
```
✅ Order created: [order details]
📤 Sending push notification to topic: cafeteria_admin
✅ Push notification sent successfully
```

**If you see errors like:**
- ❌ `"The default Firebase app does not exist"` → Backend Firebase not initialized
- ❌ `"Topic not allowed"` → Using wrong topic name
- ❌ `"Invalid FCM token"` → Token format issue

---

## 🎯 Most Likely Issues:

| Symptom | Cause | Solution |
|---------|-------|----------|
| No notification at all | Backend not calling `sendPushToTopic` | Backend needs to add push notification code when order is created |
| Error: "Firebase app does not exist" | Backend Firebase Admin not initialized | Add service account JSON and restart backend |
| Notifications work after refresh but not real-time | Backend not sending push | Backend needs to trigger push on order creation |
| Console shows "enabled: false" | You didn't enable notifications | Go to Refreshment page → Click "Enable Notifications" |

---

## ✅ Quick Test Checklist:

### Frontend (Your Responsibility):
- [ ] Notifications enabled in Refreshment page
- [ ] Browser permission granted
- [ ] Service worker registered
- [ ] Console shows: `✅ Setting up foreground message listener...`

### Backend (Backend Developer's Responsibility):
- [ ] `config/firebase-service-account.json` file exists
- [ ] Backend server restarted after adding service account
- [ ] `sendPushToTopic` is called when new order is created
- [ ] Backend console shows no Firebase errors

---

## 🧪 To Test Backend Manually:

Ask backend developer to run this test in backend console:

```javascript
// Backend test code
const { sendPushToTopic } = require('./utils/notifications');

// Send test notification
sendPushToTopic('cafeteria_admin', {
  notification: {
    title: 'Test Notification',
    body: 'This is a test from backend'
  }
}).then(() => {
  console.log('✅ Test notification sent');
}).catch(err => {
  console.error('❌ Test notification failed:', err);
});
```

**If this works:** Backend can send notifications! Just need to add it to order creation code.
**If this fails:** Backend Firebase Admin SDK issue.

---

## 📞 Next Steps:

1. **Run the diagnostic steps above**
2. **Check which step fails**
3. **Report back which error you see**

Most likely, the backend is **not calling `sendPushToTopic()` when orders are created**. This is the #1 reason notifications don't show up in real-time!
