import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Image, ProgressBar, Row, Table } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";
import CustomMiniCard from "components/CustomCard/CustomMiniCard";
import { useDispatch, useSelector } from "react-redux";
import { DataAction } from "Stores/DataReducer";
import { Result } from "Global/FetchPath";

const Visual = () => {
    const notificationAlertRef = React.useRef(null);
    const dispatch = useDispatch();
    const [bImage, setBImage] = useState('https://media.tenor.com/DHkIdy0a-UkAAAAC/loading-cat.gif');
    const { isVisual } = useSelector((state) => state.perform);
    const [totalCluster, setTotalCluster] = useState('0 Cluster');
    const [topCluster, setTopCluster] = useState('Cluster');

    const getData = () => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            setBImage('https://media.tenor.com/DHkIdy0a-UkAAAAC/loading-cat.gif');
            setTopCluster('Cluster');
            setTotalCluster('0 Cluster');
            dispatch(DataAction.nVisual());
            const URL = Result().ExecuteCluster; //nedd to add
            navigator.serviceWorker.controller.postMessage({
                action: 'fetchVisual', data: {
                    url: 'http://localhost:3000/test', //neeed to be change
                    headerMethodBody: {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                }
            });
            notify('info', notificationAlertRef, 'Starting Visual', 4);
        } else {
            setBImage('https://media.tenor.com/DHkIdy0a-UkAAAAC/loading-cat.gif');
            setTopCluster('Cluster');
            setTotalCluster('0 Cluster');
            dispatch(DataAction.nVisual());
            const URL = Result().ExecuteCluster; //nedd to add
            notify('info', notificationAlertRef, 'Starting Visual', 4);
            fetch('http://localhost:3000/test', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((result) => {
                if (result.ok == true) {
                    dispatch(DataAction.nVisual());
                    notify('success', notificationAlertRef, 'Visual Finished');
                    setBImage(Result('dendrogram.png').GetImage);
                    TotalnResult();

                }
            }).catch((error) => {
                console.log(error);
                notify('danger', notificationAlertRef, 'Perform Failed');
            });
        }
    }

    const TotalnResult = () => {
        fetch(Result().GetTotalandTop, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json()).then((result) => {
            if (result.ok == true) {
                setTotalCluster(`${result.data.totalCluster} Cluster`);
                setTopCluster(result.data.topCluster);
            }
        }).catch((error) => {
            console.log(error);
            notify('danger', notificationAlertRef, 'Failed to Load Data');
        });
    }

    useEffect(() => {
        if (isVisual) {
            setBImage(Result('dendrogram.png').GetImage);
            TotalnResult();
        }
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.action === 'VisualFetched') {
                setBImage(Result('dendrogram.png').GetImage);
                TotalnResult();
            }
        });
    }, []);

    return (<>
        <div className="rna-container">
            <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Container fluid>
            <Row>
                <Col sm="3">
                    <h1 className="text-uppercase">Cluster Candidate</h1>
                    <Button onClick={getData}>Get New Visual</Button>
                </Col>
                <Col sm="9">
                    <div className="m-3">

                        <Image src={bImage} className="w-100 shadow"></Image>
                    </div>
                </Col>
            </Row>
            <h2 className="text-center">Cluster Info</h2>
            <Row className="justify-content-center">
                <CustomMiniCard name="Top Cluster" type="text" icon="nc-chart-pie-36" value={topCluster} />
                <CustomMiniCard name="Total Cluster" type="text" icon="nc-chart-pie-35" value={totalCluster} />
            </Row>
        </Container>
    </>
    );
};

export default Visual;