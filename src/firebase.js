import firebase from "firebase";
import axios from "axios";
import config from "./constants/config";
import store from "./store";
import {GLOBAL_MESSAGE_SHOW} from "./reducers/globalMessages";
import {notifSend} from "redux-notifications/src/actions";

const FIREBASE_TOKEN_SENT = "firebase_token_sent_to_server";

export function initFirebase() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../firebase-messaging-sw.js')
            .then(function(registration) {
                console.log('Registration successful, scope is:', registration.scope);
            }).catch(function(err) {
            console.log('Service worker registration failed, error:', err);
        });
    }

    firebase.initializeApp(config.firebase);
}

export function registerFirebase() {
    const messaging = firebase.messaging();

    messaging.requestPermission().then(function () {
        return messaging.getToken();
    }).catch(function (err) {
        console.log('Unable to get permission to notify.', err);
    }).then(function (currentToken) {
        if (currentToken) {
            if (currentToken !== localStorage.getItem(FIREBASE_TOKEN_SENT)) {
                localStorage.setItem(FIREBASE_TOKEN_SENT, currentToken);
                sendTokenToServer(currentToken);
            }
        } else {
            console.log('Unable to get fcm token')
        }
    }).catch(function (err) {
        console.log('Unable to get fcm token')
    });

    messaging.onTokenRefresh(function () {
        messaging.getToken().then(function (refreshedToken) {
            if (refreshedToken) {
                if (refreshedToken !== localStorage.getItem(FIREBASE_TOKEN_SENT)) {
                    localStorage.setItem(FIREBASE_TOKEN_SENT, refreshedToken);
                    refreshTokenInServer(refreshedToken);
                }
            } else {
                console.log('Unable to get fcm refresh token');
            }
        }).catch(function (err) {
            console.log('Unable to retrieve refreshed token ', err);
        });
    });

    messaging.onMessage(function (payload) {
        console.log('Message received. ', payload);
        store.dispatch(notifSend({
            message: payload.notification.title,
            kind: 'info',
            dismissAfter: 5000
        }));
    });
}

function sendTokenToServer(token) {
    console.log("sending token to server...", token);
    const body = {
        token: token,
    }
    axios.post(config.notificationServiceAddress + 'register', body, {
    }).then(response => {
        console.log(response)
    }).catch(error => console.log(error));
}

function refreshTokenInServer(token) {
    console.log("refreshing token in server...", token);
    const body = {
        token: token,
    }
    axios.put(config.notificationServiceAddress + 'refresh', body).then(response => {
        console.log(response)
    }).catch(error => console.log(error));
}