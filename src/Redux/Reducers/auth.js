import { 
    UPDATE_TOKEN,
    SET_AUTHENTICATED
} from "../Constants/actionTypes";

const initialState = {
  jwtToken: '',
  isAuthenticated: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TOKEN:
            return {
                ...state,
                jwtToken: action.payload
            }
        case SET_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: action.payload
            }
        default:
            return state
    }
}
