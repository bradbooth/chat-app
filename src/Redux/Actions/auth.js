import { 
    UPDATE_TOKEN,
    SET_AUTHENTICATED
} from "../Constants/actionTypes";

export function updateToken(payload) {
    return { 
        type: UPDATE_TOKEN, 
        payload 
    }
};

export function setAuthenticated(payload) {
    return { 
        type: SET_AUTHENTICATED, 
        payload 
    }
};
