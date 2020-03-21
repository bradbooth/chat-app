import Axios from "axios";
import store from '../Redux/Store'
import { setAuthenticated } from '../Redux/Actions/auth'

class Auth {

    signOut(){
        localStorage.setItem('token', '')
        store.dispatch(setAuthenticated(false))
    }

    authenticate(error, result ){

        console.log("Checking Authorization...")

        this.authenticatedRequest('https://eecs-4481-chat-app.herokuapp.com/api/authenticated').then( ( res ) => {

        if (res.status === 200 ){
            store.dispatch(setAuthenticated(true))
            console.log('Authorization successful')
            result()
        } else {
            this.signOut()
            error()
        }
        }).catch( err => {
            console.error('err', err)
            this.signOut()
        })
    }

    authenticatedRequest(url){
        return Axios.get(url, {
            headers: {
                Authorization: "Bearer " + store.getState().authentication.jwtToken
                
                // Authorization: "Bearer " + localStorage.getItem('token')
            }
        })
    }
}


export default new Auth();