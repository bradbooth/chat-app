class Chat {

    constructor( to, from ){
        this.to = to
        this.from = from
        this.history = []
    }

    getHistory(){
        return this.history
    }

    addMessage( chatMessage ){
        this.history.push(chatMessage)
    }

}