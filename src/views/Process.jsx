import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";

const Processing = () => {
    const [mydata, setMyData] = useState(null);
    const notificationAlertRef = React.useRef(null);

    const startProcess = () => {
        const url = 'http://localhost:3000/test';

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            // Mengirim pesan ke Service Worker
            navigator.serviceWorker.controller.postMessage({ action: 'fetchData' });
            notify('info', notificationAlertRef, 'Starting Process', 4);
        } else {
            alert('bamm!');
        }

    }

    return (<>
        <div className="rna-container">
            <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Container fluid>
            <Row className="my-2">
                <Col className="d-flex justify-content-center">
                    <Button onClick={startProcess}>Start Processing</Button>
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
    </>
    );
};

export default Processing;