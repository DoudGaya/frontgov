export const LoginDetailsReducer = (state = [], action) => {
    switch (action.type) {
        case `SET_ETRACK_LOGIN_DETAILS`:
            return action.payload
        default:
            return state
    }
}

export const GeneralDetailsReducer = (state = {}, action) => {
    switch (action.type) {
        case `SET_ETRACK_GENERAL_DETAILS`:
            return action.payload;
        default:
            return state;
    }
};
