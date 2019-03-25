importScripts('https://www.gstatic.com/firebasejs/5.0.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.0.4/firebase-messaging.js');

// data from config.firebase
const firebaseConfig = {
    apiKey: "AIzaSyAcj4G8Stypgbux1ODHLkLyfVnXKdiwnrE",
    messagingSenderId: "226004036218"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
 
self.addEventListener('notificationclick', function (event) {
    const clickedNotification = event.notification;
    clickedNotification.close();
    const promiseChain = clients.openWindow(url);
    event.waitUntil(promiseChain);
});
 
messaging.setBackgroundMessageHandler(async (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
 
    const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    });
 
    for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage({ payload: payload, fromBackground: true });
    }
 
    return self.registration.showNotification(notificationTitle, notificationOptions);
});