import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Result } from "Global/FetchPath";

const Results = () => {
    const notificationAlertRef = useRef(null);
    const { isVisual } = useSelector((state) => state.perform);
    const [theData, setTheData] = useState([]);

    //get main data
    const getResults = () => {
        fetch(Result().GetTopResult, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json()).then((result) => {
            if (result.ok == true) {
                setTheData(result.data['Cluster Rankings']);
            }
        }).catch((error) => {
            console.log(error);
            notify('danger', notificationAlertRef, 'Failed to Load Data');
        });
    }

    const ProcessColumns = [
        {
            name: 'Bigram',
            selector: (row) => row.Bigram,
            width: '250px'
        },
        {
            name: 'DF-IDF Score',
            selector: (row) => row['DF-IDF Score'],
            width: '170px'
        },
        {
            name: 'Raw Text Tweet',
            selector: (row) => row['raw_tweet']
        },
        {
            name: 'Headline News',
            selector: (row) => row['Headline']
        }
    ]

    const ExpandedComponent = ({ data }) => {
        return (
            <Container fluid>
                <Row>
                    <Col md={2}>
                        Raw Text Tweet :
                    </Col>
                    <Col>{data.raw_tweet}</Col>
                </Row>
                <Row>
                    <Col md={2}>
                        Headline News :
                    </Col>
                    <Col>{data.Headline}</Col>
                </Row>
            </Container>
        )
    }

    const customStyles = {
        headCells: {
            style: {
                fontSize: '20px',
            },
        }

    };

    useEffect(() => {
        if (isVisual) {
            getResults();
        }
    }, []);

    return (<>
        <div className="rna-container">
            <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Container fluid>
            {theData != '' ? (
                <>
                    {theData.map((Data, index) => (<>
                        <h1 key={index} className="mb-0">{Data.Cluster}</h1>
                        <h2 key={index} className="mt-0">Score {Data['Max DF-IDF Score']}</h2>
                        <Row key={index} className="my-4">
                            <Col>
                                <Card className="strpied-tabled-with-hover">
                                    <Card.Header>
                                        <Card.Title as="h4">Bigrams Table</Card.Title>
                                    </Card.Header>
                                    <Card.Body className="table-full-width table-responsive px-0">

                                        <DataTable
                                            columns={ProcessColumns}
                                            striped={true}
                                            responsive={true}
                                            data={Data.Bigrams.sort((a, b) => b["DF-IDF Score"] - a["DF-IDF Score"]).slice(0, 3)}
                                            customStyles={customStyles}
                                            expandableRows
                                            expandOnRowClicked
                                            expandableRowsComponent={ExpandedComponent}

                                        />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>))}
                </>

            ) : (
                <h1>No Data Loaded</h1>
            )
            }
        </Container>
    </>
    );
};

export default Results;