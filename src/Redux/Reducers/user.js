import { UPDATE_USER } from "../Constants/actionTypes";

const initialState = {
  username: ''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}
