import React from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import DataTable from "react-data-table-component";

const Puller = () => {
    const FormSubmited = (event) => {
        event.preventDefault();
        alert('asdasd')
    }

    const columns = [
        {
            name: 'No',
            selector: (row) => row.number
        },
        {
            name: 'Text',
            selector: (row) => row.text
        },
        {
            name: 'Time Slot',
            selector: (row) => row.TimeSlot
        }
    ]

    const data = [
        {
            number: 1,
            text: 'Example Text 1',
            TimeSlot: 'Example TimeSlot 1',
        },
        {
            number: 2,
            text: 'Example Text 2',
            TimeSlot: 'Example TimeSlot 2',
        },
    ]
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

                            <DataTable
                                columns={columns}
                                pagination={true}
                                striped={true}
                                responsive={true}
                                paginationPerPage={10}
                                data={data}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Puller;