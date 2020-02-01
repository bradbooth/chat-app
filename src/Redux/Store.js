import { createStore, combineReducers } from "redux";
import authentication from "./Reducers/auth"
import user from "./Reducers/user"

export default createStore(
    combineReducers({
        user,
        authentication
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);