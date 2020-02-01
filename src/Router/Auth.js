import Axios from "axios";
import store from '../Redux/Store'
import { setAuthenticated } from '../Redux/Actions/auth'

class Auth {
    constructor(){
        this.authenticated = false
    }

    setAuthenticated(val){
        this.authenticated = val
    }

    isAuthenticated(){
        this.authenticate(() => {
            // Do nothing
        }, () => {
            // Do nothing
        })
        return this.authenticated === true
    }

    authenticate(error, result ){

        console.log("Authenticating...")

        this.authenticatedRequest('/api/authenticated').then( ( res ) => {

        if (res.status === 200 ){
            this.authenticated = true;
            store.dispatch(setAuthenticated(true))
            console.log('Authorization successful')
            result()
        } else {
            this.authenticated = false
            localStorage.setItem('token', '')
            error()
        }
        }).catch( err => {
            console.error('err', err)
            this.authenticated = false
            localStorage.setItem('token', '')
        })
    }

    authenticatedRequest(url){
        return Axios.get(url, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        })
    }
}


export default new Auth();