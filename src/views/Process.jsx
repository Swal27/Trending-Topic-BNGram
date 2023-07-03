import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";
import { DataAction } from "Stores/DataReducer";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Result } from "Global/FetchPath";

const Processing = () => {
    const [dataTable, setDataTable] = useState();
    const notificationAlertRef = React.useRef(null);
    const dispatch = useDispatch();
    const { isProcessed } = useSelector((state) => state.perform);
    const [loader, setLoader] = useState(false);

    //get main data
    const getData = () => {
        setDataTable([]);
        setLoader(true);
        dispatch(DataAction.nProcessed());
        // fetch when have service worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                action: 'fetchProcess', data: {
                    url: Result().ExecuteProcess, //neeed to be change
                    headerMethodBody: {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        mode: 'cors'
                    }
                }
            });
            notify('info', notificationAlertRef, 'Starting Process', 4);
        } else {
            // fetch when not have service worker
            notify('info', notificationAlertRef, 'Starting Process', 4);
            fetch(Result().ExecuteProcess, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            }).then((response) => response.json()).then((result) => {
                if (result.ok == true) {
                    dispatch(DataAction.yProcessed());
                    notify('success', notificationAlertRef, 'Process Finished');
                    GetDataProcess();
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
    const GetDataProcess = () => {
        fetch(Result().GetAll, {
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
        });
    }

    const ProcessColumns = [
        {
            name: 'No',
            selector: (row) => row.row_number
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

    const customStyles = {
        headCells: {
            style: {
                fontSize: '20px'
            },
        }
    };

    useEffect(() => {
        if (isProcessed) {
            GetDataProcess();
            setLoader(false);
        }
        navigator.serviceWorker.addEventListener('message', (event) => {
            // if service worker availabel and recive data after fetch
            if (event.data && event.data.action === 'ProcessFetched') {
                GetDataProcess();
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
                    <Button onClick={getData}>Start Processing</Button>
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
                                columns={ProcessColumns}
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

export default Processing;