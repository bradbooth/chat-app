import React from 'react';
import { connect } from "react-redux";
import { Container, Row, Col } from 'react-bootstrap'

import './Chat.css'; 


export class Chat extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: ''
        }
    }

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
              textAlign: "right"
            }
          }
          return <h5 style={style} key={key}>{msg.value}</h5>
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