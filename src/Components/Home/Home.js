import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';

class Home extends Component {

  render() {
    return (
      <Container>
          <Row>
              <Col>
                <h1>EECS4481 - Chat App</h1>
                <h4>Team</h4>
                <ul>
                  <li>Akbar Khan</li>
                  <li>Bradley Booth</li>
                  <li>Danilo Torres</li>
                  <li>Zaeem Israr</li>
                </ul>

              </Col>
          </Row>
          <Row>
              <Col>
                <h4>Instructions</h4>
                <p>
                    To begin, use the links at the top of the page
                    in order to sign up for a help desk agent account,
                    login to an existing help desk agent account,
                    or begin chatting anonymously via the Chat option.
                </p>
                <p>
                    To transfer a user as a help desk agent, right click
                    your assigned user and select the help desk agent to
                    transfer the user to.
                </p>
                <p>
                    To upload a file, ensure you are connected with 
                    an agent or user succesfully and use the upload
                    button. Max file size is 10 mb.
                </p>
          
              </Col>
          </Row>
      </Container>
    )
  }
}
export default Home;