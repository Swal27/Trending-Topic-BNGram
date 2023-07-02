import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Result } from "Global/FetchPath";

const Results = () => {
    const notificationAlertRef = useRef(null);
    const { isVisual } = useSelector((state) => state.perform);
    const [cluster, setCluster] = useState('Cluster');
    const [score, setScore] = useState(0);
    const [sentence, setSentence] = useState('...');
    const [dataTable, setDataTable] = useState([]);

    const getResults = () => {
        fetch(Result().GetTopResult, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json()).then((result) => {
            if (result.ok == true) {
                setCluster(result.data['Cluster Ranking'].Cluster);
                setScore(result.data['Cluster Ranking']['DF-IDF Score']);
                setSentence(result.data['Joined Sentence']);
                setDataTable(result.data['Cluster Ranking'].Bigrams);
            }
        }).catch((error) => {
            console.log(error);
            notify('danger', notificationAlertRef, 'Failed to Load Data');
        });
    }

    const ProcessColumns = [
        {
            name: 'Bigram',
            selector: (row) => row.Bigram
        },
        {
            name: 'DF-IDF Score',
            selector: (row) => row['DF-IDF Score']
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
        if (isVisual) {
            getResults();
        }
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.action === 'VisualFetched') {
                getResults();
            }
        });
    }, []);

    return (<>
        <div className="rna-container">
            <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Container fluid>
            <h1 className="text-center">{cluster}</h1>
            <h2 className="text-center">Score {score}</h2>
            <h4 className="text-center">Trend Topic</h4>
            <h4 className="text-center">{sentence}</h4>

            <Row className="my-4">
                <Col>
                    <Card className="strpied-tabled-with-hover">
                        <Card.Header>
                            <Card.Title as="h4">Bigrams Table</Card.Title>
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

                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </Container>
    </>
    );
};

export default Results;