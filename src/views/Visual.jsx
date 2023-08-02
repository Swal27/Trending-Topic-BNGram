import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";
import CustomMiniCard from "components/CustomCard/CustomMiniCard";
import { useDispatch, useSelector } from "react-redux";
import { DataAction } from "Stores/DataReducer";
import { Result } from "Global/FetchPath";
import RefetchDataInBackground from "utils/ReFetch";
import { Tweet } from "Global/FetchPath";
import { disableSide } from "utils/DisablerSide";
import { enableSide } from "utils/DisablerSide";
import ImgNotAvailale from '../assets/img/no-image.jpg'

const Visual = () => {
    const notificationAlertRef = React.useRef(null);
    const dispatch = useDispatch();
    const [bImage, setBImage] = useState(ImgNotAvailale);
    const { isVisual } = useSelector((state) => state.perform);
    const [totalCluster, setTotalCluster] = useState('0 Cluster');
    const [topCluster, setTopCluster] = useState('Cluster');
    const [loader, setLoader] = useState('none');

    //get main data
    const getData = () => {
        setBImage(ImgNotAvailale);
        setTopCluster('Cluster');
        setTotalCluster('0 Cluster');
        setLoader('flex');
        dispatch(DataAction.nVisual());
        disableSide();
        notify('info', notificationAlertRef, 'Starting Visualization', 4);

        fetch(Result().ExecuteCluster, {
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
                    dispatch(DataAction.yVisual());
                    notify('success', notificationAlertRef, 'Visual Finished');
                    setBImage(Result('dendrogram.png').GetImage);
                    TotalnResult();
                    setLoader('none');
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

    // get data for cluster
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
            setLoader('none');
        }
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
                    <h2 className="text-center">Cluster Info</h2>
                    <Row className="justify-content-center">
                        <CustomMiniCard name="Top Cluster" type="text" icon="nc-chart-pie-36" value={topCluster} />
                    </Row>
                    <Row>
                        <CustomMiniCard name="Total Cluster" type="text" icon="nc-chart-pie-35" value={totalCluster} />
                    </Row>

                </Col>
                <Col sm="9">
                    <div className="m-3 d-flex justify-content-right">
                        {loader == 'flex' ? (<div className="loading-wrapper" style={{ display: loader }}>
                            <Spinner animation="border" size="xl" className="myLoading text-primary" />
                        </div>) : (<Image src={bImage} className="w-100 shadow"></Image>)}

                    </div>
                </Col>
            </Row>
        </Container>
    </>
    );
};

export default Visual;