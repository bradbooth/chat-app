import { UPDATE_USER } from "../Constants/actionTypes";

export function updateUser(payload) {
    return { 
        type: UPDATE_USER, 
        payload 
    }
};
