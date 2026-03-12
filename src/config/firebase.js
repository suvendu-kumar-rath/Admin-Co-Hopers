// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// // TODO: Replace with your Firebase project configuration
// // Get these values from: Firebase Console > Project Settings > General > Your apps > Web app
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDj6mXioT1Zge9llZhFz9LXqQU-MyziRFc",
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "cohoper-pushnotification.firebaseapp.com",
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "cohoper-pushnotification",
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "cohoper-pushnotification.firebasestorage.app",
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "189321344339",
//   appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:189321344339:web:2f75385d202c3ed5a6dda6",
// };

// // VAPID key for push notifications
// // Get this from: Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
// const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY || "BHIH5Bbk_jggMubpGoev8L2IUrpY6dVycSw_EgLnT4r9QQiNRN2TDNu1DCBT2FbCzXGqpDTBeYnFtNKOkJds8kU";

// let app;
// let messaging;

// try {
//   app = initializeApp(firebaseConfig);
//   messaging = getMessaging(app);
// } catch (error) {
//   console.warn('Firebase initialization failed:', error);
// }

// /**
//  * Request permission and get FCM token
//  * @returns {Promise<string|null>} FCM token or null if failed
//  */
// export const requestFCMToken = async () => {
//   try {
//     if (!messaging) {
//       console.warn('Firebase messaging is not initialized');
//       return null;
//     }

//     // Request notification permission
//     const permission = await Notification.requestPermission();
//     if (permission !== 'granted') {
//       console.log('Notification permission denied');
//       return null;
//     }

//     // Get FCM token
//     const token = await getToken(messaging, {
//       vapidKey: VAPID_KEY,
//     });

//     if (token) {
//       console.log('✅ FCM Token obtained:', token);
//       return token;
//     } else {
//       console.warn('No FCM registration token available');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error getting FCM token:', error);
//     return null;
//   }
// };


// /**
//  * Listen for foreground messages
//  * @param {Function} callback - Callback function to handle incoming messages
//  */
// export const onMessageListener = (callback) => {
//   if (!messaging) {
//     console.warn('Firebase messaging is not initialized');
//     return () => {};
//   }

//   return onMessage(messaging, (payload) => {
//     console.log('Message received in foreground:', payload);
//     if (callback) callback(payload);
//   });
// };

// export { messaging };
// export default app;
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDj6mXioT1Zge9llZhFz9LXqQU-MyziRFc",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "cohoper-pushnotification.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "cohoper-pushnotification",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "cohoper-pushnotification.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "189321344339",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:189321344339:web:2b9bea03b2f46886a6dda6",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-MGHYBCJJ2J",
};

const VAPID_KEY =
  process.env.REACT_APP_FIREBASE_VAPID_KEY ||"BCMzVJJC2qiMGxramQ4wdS56vA5-nRwh-kdilmpYbMBKaXtcsv7cd0Ehjq3KBzLmsHED6Y9TRvYdj6OzywZTl38";

let app;
let messaging;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
  analytics = getAnalytics(app);
} catch (error) {
  console.warn("Firebase initialization failed:", error);
}

/**
 * Request notification permission and get FCM token
 */
export const requestFCMToken = async () => {
  try {
    if (!messaging) {
      console.warn("Firebase messaging not initialized");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    }

    console.warn("No FCM token available");
    return null;
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
};

/**
 * Listen for foreground notifications
 */
export const onMessageListener = (callback) => {
  if (!messaging) {
    console.warn("Firebase messaging not initialized");
    return () => {};
  }

  console.log("🎧 onMessageListener called, setting up listener...");
  
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("🔔 ========== MESSAGE RECEIVED ==========");
    console.log("Payload:", JSON.stringify(payload, null, 2));
    console.log("========================================");

    if (callback) {
      callback(payload);
    }
  });
  
  console.log("✅ Message listener is now active");
  return unsubscribe;
};

export { messaging, analytics };
export default app;