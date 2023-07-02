import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";
import { DataAction } from "Stores/DataReducer";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Tweet } from "Global/FetchPath";

const Preprocessing = () => {
    const notificationAlertRef = useRef(null);
    const dispatch = useDispatch();
    const [dataTable, setDataTable] = useState();
    const { isPreProcessed } = useSelector((state) => state.perform);

    const getData = () => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            setDataTable([]);
            dispatch(DataAction.nPreProcessed());
            const URL = Tweet().ExecutePreProcess; //nedd to add
            navigator.serviceWorker.controller.postMessage({
                action: 'fetchPreprocess', data: {
                    url: 'http://localhost:3000/test', //neeed to be change
                    headerMethodBody: {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                }
            });
            notify('info', notificationAlertRef, 'Starting Pre-Process', 4);
        } else {
            setDataTable([]);
            dispatch(DataAction.nPreProcessed());
            const URL = Tweet().ExecutePreProcess; //nedd to add
            notify('info', notificationAlertRef, 'Starting Pre-Process', 4);
            fetch('http://localhost:3000/test', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((result) => {
                if (result.ok == true) {
                    dispatch(DataAction.yPreProcessed());
                    notify('success', notificationAlertRef, 'Preprocess Finished');
                    GetDataPreProcess();

                }
            }).catch((error) => {
                console.log(error);
                notify('danger', notificationAlertRef, 'Perform Failed');
            });
        }
    }

    const GetDataPreProcess = () => {
        fetch(Tweet().GetPreProcess, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json()).then((result) => {
            if (result.ok == true) {
                setDataTable(result.data);
            }
        }).catch((error) => {
            console.log(error);
            notify('danger', notificationAlertRef, 'Failed to Load Data');
        })
    }

    const PreprocessColumns = [
        {
            name: 'No',
            selector: (row) => row.row_number,
            width: '80px'
        },
        {
            name: 'Username',
            selector: (row) => row.username,
            width: '150px'
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
    const customStyles = {
        headCells: {
            style: {
                fontSize: '20px'
            },
        }
    };

    useEffect(() => {
        if (isPreProcessed) {
            GetDataPreProcess();
        }
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.action === 'PreprocessFetched') {
                GetDataPreProcess();
            }
        });
    }, []);

    return (<>
        <div className="rna-container">
            <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Container fluid>
            <Row className="my-2">
                <Col className="d-flex justify-content-center">
                    <Button onClick={getData}>Start Pre-Processing</Button>
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
                                columns={PreprocessColumns}
                                pagination={true}
                                striped={true}
                                responsive={true}
                                paginationPerPage={10}
                                data={dataTable}
                                customStyles={customStyles}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>
    );
};

export default Preprocessing;