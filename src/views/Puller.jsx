import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";
import { DataAction } from "Stores/DataReducer";
import { Tweet } from "Global/FetchPath";

const Puller = () => {
    const dispatch = useDispatch();
    const notificationAlertRef = useRef(null);
    const [dataTable, setDataTable] = useState();
    const { isPulled } = useSelector((state) => state.perform);
    const [loader, setLoader] = useState(false);

    const [inputState, setInputState] = useState({
        fData: '',
    });

    //handle when input change
    const handleChange = (event) => {
        setInputState((prevInputState) => ({
            ...prevInputState,
            [event.target.name]: event.target.value,
        }));
    };

    // get data for table
    const GetDataPull = () => {
        fetch(Tweet().GetPull, {
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

    //get main data
    const FormSubmited = (event) => {
        event.preventDefault();
        if (inputState.fData != '') {
            setDataTable([]);
            dispatch(DataAction.nPulled());
            setLoader(true);
            notify('info', notificationAlertRef, 'Starting Puller', 4);

            fetch(Tweet().ExecuteProcess, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputState)
            }).then((response) => response.json()).then((result) => {
                if (result.ok == true) {
                    dispatch(DataAction.yPulled());
                    notify('success', notificationAlertRef, 'Pull Finished');
                    GetDataPull();
                    setLoader(false);

                }
            }).catch((error) => {
                console.log(error);
                notify('danger', notificationAlertRef, 'Perform Failed');
                setLoader(false);
            });
        }
    }

    const columns = [
        {
            name: 'No',
            selector: (row) => row.row_number,
            width: '80px'
        },
        {
            name: 'Text',
            selector: (row) => row.text_raw
        },
        {
            name: 'Time Slot',
            selector: (row) => row.time_slot,
            width: '120px'
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
        if (isPulled) {
            GetDataPull();
            setLoader(false);
        } else {
            fetch(Tweet().IsPulled, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((result) => {
                if (result.ok == true) {
                    dispatch(DataAction.yPulled());
                    GetDataPull();
                }
            }).catch((error) => {
                console.log(error);
                notify('danger', notificationAlertRef, 'Perform Failed');
            });
        }
    }, []);

    return (
        <>
            <div className="rna-container">
                <NotificationAlert ref={notificationAlertRef} />
            </div>
            <Container fluid>
                <Row className="my-2">
                    <Col>
                        <Form onSubmit={FormSubmited} className="w-100">
                            <FormLabel>Search</FormLabel>
                            <FormGroup className="d-flex">
                                <FormControl type="text" className="mr-1" name="fData" onChange={handleChange} size="md" placeholder="Search" required />
                                <Button className="ml-1" type="submit">Pull!</Button>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
                <Row className="my-2">
                    <Col>
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">Pull Table</Card.Title>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">

                                <DataTable
                                    columns={columns}
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

export default Puller;