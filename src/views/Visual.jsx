import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Image, ProgressBar, Row, Table } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";
import CustomMiniCard from "components/CustomCard/CustomMiniCard";

const Visual = () => {
    const notificationAlertRef = React.useRef(null);

    return (<>
        <div className="rna-container">
            <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Container fluid>
            <Row>
                <Col sm="3">
                    <h1 className="text-uppercase">Cluster Candidate</h1>
                </Col>
                <Col sm="9">
                    <div className="m-3">

                        <Image src="https://media.distractify.com/brand-img/zcK7q9G7D/0x0/yazawa-nico-1626369451106.png" className="w-100"></Image>
                    </div>
                </Col>
            </Row>
            <h2 className="text-center">Cluster Info</h2>
            <Row className="justify-content-center">
                <CustomMiniCard name="Top Cluster" type="progress" icon="nc-chart-pie-36" value="455" max="1300" />
                <CustomMiniCard name="Total Cluster" type="text" icon="nc-chart-pie-35" value="1300 Cluster" />
            </Row>
        </Container>
    </>
    );
};

export default Visual;