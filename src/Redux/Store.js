import { createStore, combineReducers } from "redux";
import authentication from "./Reducers/auth"

export default createStore(
    combineReducers({
        authentication
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);