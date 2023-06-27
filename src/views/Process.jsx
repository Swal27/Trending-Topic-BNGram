import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";
import { processAction } from "Stores/ProcessReducer";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";

const Processing = () => {
    const [mydata, setMyData] = useState(null);
    const notificationAlertRef = React.useRef(null);
    const dispatch = useDispatch();

    const startProcess = () => {
        const url = 'http://localhost:3000/test';

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            // Mengirim pesan ke Service Worker
            dispatch(processAction.nProcessed());
            navigator.serviceWorker.controller.postMessage({ action: 'fetchData' });
            notify('info', notificationAlertRef, 'Starting Process', 4);
        } else {
            alert('bamm!');
        }

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
            text: 'Beetlejuice',
            TimeSlot: '1988',
        },
        {
            number: 2,
            text: 'Ghostbusters',
            TimeSlot: '1984',
        },
    ]

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

                            <DataTable
                                columns={columns}
                                pagination={true}
                                paginationPerPage={10}
                                data={data}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>
    );
};

export default Processing;