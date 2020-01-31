import Axios from "axios";

class Auth {
    constructor(){
        this.authenticated = false
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

        Axios.get('/api/authenticated', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        }).then( ( res ) => {

        if (res.status === 200 ){
            this.authenticated = true;
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

    callbackTest(err, res){
        err()
        res()
    }
}


export default new Auth();