import React from 'react';
import { connect } from "react-redux";
import { Container, Row, Col, Spinner } from 'react-bootstrap'

import './Chat.css'; 


export class Chat extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            inProgress: false
        }
    }

    componentDidMount() {
        this.props.siofu
            .listenOnSubmit(this.refs.upload, this.refs.upload_input);

        this.props.siofu
            .addEventListener("progress", this.uploadProgress);

        this.props.siofu
            .addEventListener("complete", this.uploadComplete);
    }
    
    upload = (e) => {
        console.log(e)
        console.log(e.target.files)
    }

    uploadProgress = () => ( this.setState({
        inProgress: true,
        complete: false
    }))

    uploadComplete = () => ( this.setState({
        inProgress: false,
        complete: true
    }))

    setMessage = (e) => {
        this.setState({
            value: e.target.value
        })
    }


    getChat = () => {
        // Only show messages relating to currently selected recipent
        let messages = this.props.chat

        return messages.map( (msg, key) => {
            let style = {
            textAlign: "left"
          }
  
          if ( msg.from === this.props.from ){
            style = {
              textAlign: "right",
            }
          }
          return <span 
                    style={style} 
                    key={key}
                 >
                    <div className="chat-item-value">{msg.value}</div>
                    <div className="chat-item-from">
                        {msg.from === this.props.from ? "You" : msg.from }
                    </div>
                 </span>
        })
      }

    sendMessage = (e) => {
        if ( e.key === 'Enter'){

            const message = {
                to: this.props.to,
                from: this.props.from,
                value: this.state.value
            }

            console.log('Sending message:', message)
            this.props.sendMessage(message)
            this.setState({
                value: ''
            })
        }
    }
  
    render() {
        return (
            <Container >
            <Row className="chat-messages-container">
                <Col className="chat-messages">
                    { this.getChat() }
                </Col>
            </Row>
            <Row className="chat-input-container">
                <Col xs={12}>
                    <input
                        className="chat-input"
                        type="text"
                        placeholder="Press enter to send message..."
                        value={ this.state.value }
                        onChange={ this.setMessage }
                        onKeyDown={ this.sendMessage }
                        disabled={ this.props.to === ''}
                    />

                    <button ref="upload" id="upload-button">Upload</button>
                    <input
                        type="file"
                        onChange={this.upload}
                        ref="upload_input"
                        id="siofu_input"/>

                    { this.state.inProgress && <Spinner animation="border"/>}
                    { this.state.complete && <span>Upload Complete</span>}
                </Col>
            </Row>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = (dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat)