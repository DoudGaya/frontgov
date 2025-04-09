export const setLoginDetails = (p) => {
    return {
        type: `SET_ETRACK_LOGIN_DETAILS`,
        payload: p
    }
}

export const setGeneralDetails = (p) => {
    return {
        type: `SET_ETRACK_GENERAL_DETAILS`,
        payload: p,
    };
};
