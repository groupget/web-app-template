import globalMessages from "./globalMessages";
import {combineReducers} from "redux";
import logged from "./logged";
import {reducer as notifReducer} from 'redux-notifications';

const appReducer = combineReducers({
    globalMessages, logged, notifs: notifReducer
});

const rootReducer = (state, action) => {
    return appReducer(state, action)
};

export default rootReducer;
