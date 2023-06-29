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

    const ProcessColumns = [
        {
            name: 'No',
            selector: (row) => row.number
        },
        {
            name: 'Bigram',
            selector: (row) => row.bigram
        },
        {
            name: 'Df (angka)',
            selector: (row) => row.df
        },
        {
            name: 'Idf (angka)',
            selector: (row) => row.idf
        },
        {
            name: 'DfIdf (float)',
            selector: (row) => row.dfidf
        }
    ]
    const PreprocessColumns = [
        {
            name: 'No',
            selector: (row) => row.number
        },
        {
            name: 'Username',
            selector: (row) => row.username
        },
        {
            name: 'Text',
            selector: (row) => row.text_raw
        },
        {
            name: 'Text Process',
            selector: (row) => row.text_process
        },
    ]

    const Processdata = [
        {
            number: 1,
            bigram: 'Example Bigram 1',
            df: 'Example df 1',
            idf: 'Example idf 1',
            dfidf: 'Example dfidf 1'
        },
        {
            number: 2,
            bigram: 'Example Bigram 2',
            df: 'Example df 2',
            idf: 'Example idf 2',
            dfidf: 'Example dfidf 2'
        },
    ]
    const Preprocessdata = [
        {
            number: 1,
            username: 'Example Username 1',
            text_raw: 'Example Text 1',
            text_process: 'Example Text Process 1',
        },
        {
            number: 2,
            username: 'Example Username 2',
            text_raw: 'Example Text 2',
            text_process: 'Example Text Process 2',
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
                            <Card.Title as="h4">Pre-process Table</Card.Title>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive px-0">

                            <DataTable
                                columns={ProcessColumns}
                                pagination={true}
                                striped={true}
                                responsive={true}
                                paginationPerPage={10}
                                data={Processdata}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="my-2">
                <Col>
                    <Card className="strpied-tabled-with-hover">
                        <Card.Header>
                            <Card.Title as="h4">Process Table</Card.Title>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive px-0">

                            <DataTable
                                columns={PreprocessColumns}
                                pagination={true}
                                striped={true}
                                responsive={true}
                                paginationPerPage={10}
                                data={Preprocessdata}
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