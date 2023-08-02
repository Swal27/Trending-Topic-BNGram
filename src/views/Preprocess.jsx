import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";
import { DataAction } from "Stores/DataReducer";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Tweet } from "Global/FetchPath";
import RefetchDataInBackground from "utils/ReFetch";
import { enableSide } from "utils/DisablerSide";
import { disableSide } from "utils/DisablerSide";

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
        notify('info', notificationAlertRef, 'Starting Pre-Process', 4);
        disableSide();
        fetch(Tweet().ExecutePreProcess, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json()).then((result) => {
            if (result.ok == true) {
                RefetchDataInBackground({
                    url2: Tweet().ReProgress,
                    headerMethodBody2: {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'If-Modified-Since': undefined,
                            'If-None-Match': undefined
                        }
                    }
                }, result.data, 20).then(() => {
                    dispatch(DataAction.yPreProcessed());
                    notify('success', notificationAlertRef, 'Preprocess Finished');
                    GetDataPreProcess();
                    setLoader(false);
                    enableSide();
                }).catch((reject) => {
                    console.log(reject);
                    notify('danger', notificationAlertRef, 'Perform Failed');
                    setLoader(false);
                    enableSide();
                })

            }
        }).catch((error) => {
            console.log(error);
            notify('danger', notificationAlertRef, 'Perform Failed');
            setLoader(false);
            enableSide();
        });
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
        } else {
            fetch(Tweet().IsPreProcessed, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((result) => {
                if (result.ok == true) {
                    dispatch(DataAction.yPreProcessed());
                    GetDataPreProcess();
                }
            }).catch((error) => {
                console.log(error);
                notify('danger', notificationAlertRef, 'Perform Failed');
            });
        }
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