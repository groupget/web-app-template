export const LOGIN = '@logged/LOGIN'
export const LOGOUT = '@logged/LOGOUT'

const initialState = {
    logged: localStorage.getItem("logged")
}

export default (state = initialState, action) => {

    switch (action.type) {

        case LOGIN:
            return {
                ...state,
                logged: true,
            };

        case LOGOUT:
            return {
                ...state,
                logged: false,
            };

        default:
            return state
    }
}

export const loginSuccess = token => dispatch => {
    localStorage.setItem("logged", true);
    localStorage.setItem("jwt", token);
    dispatch({ type: LOGIN })
}

export const logout = () => dispatch => {
    localStorage.clear()
    dispatch({ type: LOGOUT })
}