import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const EmptyFooter = () => {
  return (
    <div className="footer-sec">
      <Container>
        <Row className="align-items-center">
          <Col md={12}>
            <p className="text-center mb-0">NFT Avatar</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EmptyFooter;
