import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';

class Home extends Component {

  render() {
    return (
      <Container>
          <Row>
              <Col>
                <h1>EECS4481 - Chat App</h1>
                <h4>Akbar Khan</h4>
                <h4>Bradley Booth</h4>
                <h4>Danilo Torres</h4>
                <h4>Zaeem Israr</h4>
              </Col>
          </Row>
          <Row>
              <Col>
                <p>To begin, use the links at the top of the page
                    in order to sign up for a help desk agent account,
                    login to an existing help desk agent account,
                    or begin chatting anonymously via the Chat option.

                    To transfer a user as a help desk agent, right click
                    your assigned user and select the help desk agent to
                    transfer the user to.
                </p>
              </Col>
          </Row>
      </Container>
    )
  }
}
export default Home;