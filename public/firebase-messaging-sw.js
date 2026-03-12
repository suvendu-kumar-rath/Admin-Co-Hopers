// firebase-messaging-sw.js
// Service worker for Firebase Cloud Messaging

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Firebase project configuration
// These values match your .env file configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj6mXioT1Zge9llZhFz9LXqQU-MyziRFc",
  authDomain: "cohoper-pushnotification.firebaseapp.com",
  projectId: "cohoper-pushnotification",
  storageBucket: "cohoper-pushnotification.firebasestorage.app",
  messagingSenderId: "189321344339",
  appId: "1:189321344339:web:2b9bea03b2f46886a6dda6",
  measurementId: "G-MGHYBCJJ2J",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] ========================================');
  console.log('[SW] 🔔 Background message received!');
  console.log('[SW] Full payload:', JSON.stringify(payload, null, 2));
  console.log('[SW] ========================================');
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'New Notification';
  const notificationBody = payload.notification?.body || payload.data?.body || 'You have a new message';
  
  const notificationOptions = {
    body: notificationBody,
    icon: payload.notification?.icon || '/logo192.png',
    badge: '/logo192.png',
    data: payload.data,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    tag: 'cafeteria-order'
  };

  console.log('[SW] Showing notification:', notificationTitle, notificationOptions);
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received:', event);
  
  event.notification.close();
  
  // Open the app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
