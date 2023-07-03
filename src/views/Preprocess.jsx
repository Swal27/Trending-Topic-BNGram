import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
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
    const [loader, setLoader] = useState(false);

    //get main data
    const getData = () => {
        setDataTable([]);
        dispatch(DataAction.nPreProcessed());
        setLoader(true);
        // fetch when have service worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                action: 'fetchPreprocess', data: {
                    url: Tweet().ExecutePreProcess, //neeed to be change
                    headerMethodBody: {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                }
            });
            notify('info', notificationAlertRef, 'Starting Pre-Process', 4);
        } else {
            // fetch when not have service worker
            notify('info', notificationAlertRef, 'Starting Pre-Process', 4);
            fetch(Tweet().ExecutePreProcess, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((result) => {
                if (result.ok == true) {
                    dispatch(DataAction.yPreProcessed());
                    notify('success', notificationAlertRef, 'Preprocess Finished');
                    GetDataPreProcess();
                    setLoader(false);

                }
            }).catch((error) => {
                console.log(error);
                notify('danger', notificationAlertRef, 'Perform Failed');
                setLoader(false);
            });
        }
    }

    // get data for table
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
            setLoader(false);
        }
        navigator.serviceWorker.addEventListener('message', (event) => {
            // if service worker availabel and recive data after fetch
            if (event.data && event.data.action === 'PreprocessFetched') {
                GetDataPreProcess();
                setLoader(false);
            }
            // if fetch error
            if (event.data && event.data.action === 'actionFailed') {
                setLoader(false);
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
                                progressComponent={<Spinner animation="border" size="xl" className="myLoading text-primary" />}
                                progressPending={loader}
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