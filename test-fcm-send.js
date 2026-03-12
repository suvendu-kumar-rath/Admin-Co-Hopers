/**
 * TEST SCRIPT: Send a Firebase Cloud Messaging notification
 * 
 * This script proves the frontend FCM listener works by sending a real push notification.
 * It also shows your backend team EXACTLY what code they need to add when an order is placed.
 * 
 * SETUP:
 * 1. Go to Firebase Console > Project Settings > Service Accounts
 * 2. Click "Generate new private key" → downloads a JSON file
 * 3. Save that file as "serviceAccountKey.json" in this same folder
 * 4. Run: node test-fcm-send.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Load service account key
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'cohoper-pushnotification',
  });
  
  console.log('✅ Firebase Admin SDK initialized');
} catch (err) {
  console.error('❌ Could not load serviceAccountKey.json');
  console.error('');
  console.error('To fix this:');
  console.error('1. Go to: https://console.firebase.google.com/project/cohoper-pushnotification/settings/serviceaccounts/adminsdk');
  console.error('2. Click "Generate new private key"');
  console.error('3. Save the downloaded JSON file as:');
  console.error(`   ${serviceAccountPath}`);
  console.error('4. Run this script again: node test-fcm-send.js');
  process.exit(1);
}

// ============================================================
// THIS IS THE EXACT CODE YOUR BACKEND NEEDS TO ADD
// when a cafeteria order is placed
// ============================================================

async function sendOrderNotification(orderDetails) {
  const message = {
    topic: 'cafeteria_admin', // The topic your admin dashboard is subscribed to
    notification: {
      title: `🔔 New Order from ${orderDetails.username}`,
      body: `${orderDetails.username} ordered ${orderDetails.itemName} (₹${orderDetails.amount})`,
    },
    data: {
      // All values must be strings
      orderId: String(orderDetails.orderId),
      username: String(orderDetails.username),
      itemName: String(orderDetails.itemName),
      amount: String(orderDetails.amount),
      type: 'cafeteria_order',
      timestamp: new Date().toISOString(),
    },
    webpush: {
      notification: {
        icon: '/logo192.png',
        badge: '/logo192.png',
        requireInteraction: true,
        vibrate: [200, 100, 200],
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ FCM message sent successfully!');
    console.log('   Message ID:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending FCM message:', error.message);
    throw error;
  }
}

// Send a test notification
async function main() {
  console.log('');
  console.log('📤 Sending test FCM notification to topic: cafeteria_admin');
  console.log('   Make sure your admin dashboard is open at http://localhost:3000');
  console.log('   and you are on the Refreshment page...');
  console.log('');

  await sendOrderNotification({
    orderId: 'test-' + Date.now(),
    username: 'Suvendu',
    itemName: 'Cappuccino',
    amount: 150,
  });

  console.log('');
  console.log('🎉 Done! Check your browser — you should see a notification popup.');
  console.log('');
  console.log('================================================');
  console.log('TO YOUR BACKEND DEVELOPER:');
  console.log('Add the sendOrderNotification() function above');
  console.log('to your order creation API endpoint.');
  console.log('Call it after saving the order to the database.');
  console.log('================================================');
}

main().catch(console.error);
