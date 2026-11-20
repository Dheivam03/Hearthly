// Placeholder for server-sent FCM push (needs Cloud Functions, see README). Local reminders are handled by service-worker.js.
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:"AIzaSyDS-bR7uwH__6_c4SKxnIr8YeKx8Nptt-c",projectId:"hearthly-1f66b",messagingSenderId:"309430199155",appId:"1:309430199155:web:8e0a14944c70675cf91b06"});
firebase.messaging().onBackgroundMessage(p=>self.registration.showNotification(p.notification?.title||'Hearthly',{body:p.notification?.body,icon:'assets/logo/logo.svg'}));
