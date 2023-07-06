import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
const PageNotFound = () => {
    return (
        <div className="d-flex flex-row align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col md={12} className="text-center">
                        <span className="display-1 d-block">404</span>
                        <div className="mb-4 lead">The page you are looking for was not found.</div>
                        <Link to="/puller" className="btn btn-link">Back to Puller</Link>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default PageNotFound;