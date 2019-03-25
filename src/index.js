import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { BrowserRouter as Router } from "react-router-dom";
import Amplify from "aws-amplify";
import config from "./constants/config";
import createAxiosInterceptor from "./axiosInterceptor";
import {initFirebase} from "./firebase";
import {Provider} from "react-redux";
import store, {history} from "./store";
import { ConnectedRouter } from 'connected-react-router';
import firebase from "firebase";

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    }
});

initFirebase();
createAxiosInterceptor(store);

const root = document.querySelector("#root");

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    root
);