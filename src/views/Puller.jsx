import React from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Table } from "react-bootstrap";

const Puller = () => {
    const FormSubmited = (event) => {
        event.preventDefault();
        alert('asdasd')
    }
    return (
        <Container fluid>
            <Row className="my-2">
                <Col>
                    <Form onSubmit={FormSubmited} className="w-100">
                        <FormLabel>Search</FormLabel>
                        <FormGroup className="d-flex">
                            <FormControl type="text" className="mr-1" size="md" placeholder="Search" />
                            <Button className="ml-1" type="submit">Pull!</Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
            <Row className="my-2">
                <Col>
                    <Card className="strpied-tabled-with-hover">
                        <Card.Header>
                            <Card.Title as="h4">Title</Card.Title>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive px-0">
                            <Table className="table-hover table-striped">
                                <thead>
                                    <tr>
                                        <th className="border-0">No</th>
                                        <th className="border-0">Text</th>
                                        <th className="border-0">Time Slot</th>
                                    </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>null</td>
                                    <td>null</td>
                                    <td>null</td>
                                  </tr>
                                  <tr>
                                    <td>null</td>
                                    <td>null</td>
                                    <td>null</td>
                                  </tr>
                                  <tr>
                                    <td>null</td>
                                    <td>null</td>
                                    <td>null</td>
                                  </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Puller;