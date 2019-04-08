import axios from "axios";
import {LOGOUT, REFRESH} from "./reducers/logged";
import {HIDE_LOADING_BLOCKER} from "./reducers/globalMessages";
import {notifSend} from "redux-notifications/src/actions";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import config from "./constants/config";

export default function createAxiosInterceptor(store) {
    axios.interceptors.request.use(request => {
        store.dispatch({ type: REFRESH });
        request.headers = {'Authorization': 'Bearer ' + localStorage.getItem("jwt")};
        request.timeout = 5000;
        // request.withCredentials = true
        return request
    }, error => {
        //todo: redirect to login page
        return Promise.reject(error)
    });

    axios.interceptors.response.use(response => {
        return response
    }, error => {
        store.dispatch({ type: HIDE_LOADING_BLOCKER});
        if (error != null && error.response != null && error.response.status === 403) {
            if (localStorage.getItem("logged")) {
                localStorage.clear();
                store.dispatch(notifSend({
                    message: "Your session has expired. Please log in again",
                    kind: 'warning',
                    dismissAfter: 5000
                }));
                store.dispatch({ type: LOGOUT });
            }
        } else if (error.response != null && error.response.data.message != null) {
            store.dispatch(notifSend({
                message: error.response.data.message,
                kind: 'danger',
                dismissAfter: 5000
            }));
        } else {
            store.dispatch(notifSend({
                message: error.toString(),
                kind: 'danger',
                dismissAfter: 5000
            }));
        }
        return Promise.reject(error);
    })
}