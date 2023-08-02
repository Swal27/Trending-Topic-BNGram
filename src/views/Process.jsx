import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";
import { DataAction } from "Stores/DataReducer";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Result } from "Global/FetchPath";
import RefetchDataInBackground from "utils/ReFetch";
import { Tweet } from "Global/FetchPath";
import { enableSide } from "utils/DisablerSide";

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
        notify('info', notificationAlertRef, 'Starting Process', 4);
        enableSide();
        fetch(Result().ExecuteProcess, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
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
                    dispatch(DataAction.yProcessed());
                    notify('success', notificationAlertRef, 'Process Finished');
                    GetDataProcess();
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
        } else {
            fetch(Result().IsProcessed, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((result) => {
                if (result.ok == true) {
                    dispatch(DataAction.yProcessed());
                    GetDataProcess();
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