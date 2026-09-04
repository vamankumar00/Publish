import firebase from "firebase/app";
import "firebase/messaging";

// See: https://github.com/microsoft/TypeScript/issues/14877
/** @type {ServiceWorkerGlobalScope} */
let self;

function initInSw() {
    // [START messaging_init_in_sw]
    // Give the service worker access to Firebase Messaging.
    // Note that you can only use Firebase Messaging here. Other Firebase libraries
    // are not available in the service worker.
    importScripts('https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js');


    // Initialize the Firebase app in the service worker by passing in
    // your app's Firebase config object.
    // https://firebase.google.com/docs/web/setup#config-object

    //firebase.initializeApp({
    //    apiKey: "AIzaSyAvgBCG4XHU-0LHWlkamGuStKiob0LdT0M",
    //    authDomain: "mvcwithandroid.firebaseapp.com",
    //    projectId: "mvcwithandroid",
    //    storageBucket: "mvcwithandroid.appspot.com",
    //    messagingSenderId: "211019319524",
    //    appId: "1:211019319524:web:ee83f718742db68460c4f1",
    //measurementId: 'G-measurement-id',
    //});
    firebase.initializeApp({
        apiKey: "AIzaSyCFsw_k-e4T2wt1Deewq2zuGiyeemS5mxg",
        authDomain: "rapiido-3ba11.firebaseapp.com",
        projectId: "rapiido-3ba11",
        storageBucket: "rapiido-3ba11.appspot.com",
        messagingSenderId: "640585084960",
        appId: "1:640585084960:web:6aa15d2bc197b1b862cc45",
        measurementId: "G-QM01D1Y6M8"
    });

    // Retrieve an instance of Firebase Messaging so that it can handle background
    // messages.
    const messaging = firebase.messaging();
    // [END messaging_init_in_sw]
}

function onBackgroundMessage() {
    const messaging = firebase.messaging();

    // [START messaging_on_background_message]
    messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const notificationTitle = 'Background Message Title1';
        //const notificationTitle = payload.name;
        const notificationOptions = {
            body: 'Background Message body.',
            icon: '/firebase-logo.png'
        };

        self.registration.showNotification(notificationTitle,
            notificationOptions);

        //self.registration.showNotification('ABC',
        //    notificationOptions);
    });
    // [END messaging_on_background_message]
}
