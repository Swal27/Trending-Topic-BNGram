import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, Table } from "react-bootstrap";
import notify from "components/Notification/Notification";
import NotificationAlert from "react-notification-alert";

const Result = () => {
    const notificationAlertRef = React.useRef(null);

    const startProcess = () => {
        const url = 'http://localhost:3000/test';

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            // Mengirim pesan ke Service Worker
            navigator.serviceWorker.controller.postMessage({ action: 'fetchData' });
            notify('info', notificationAlertRef, 'Starting Process', 4);
        } else {
            alert('bamm!');
        }

    }

    return (<>
        <div className="rna-container">
            <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Container fluid>
            <h1 className="text-center">Cluster 1</h1>
            <h3 className="text-center">Trend Topic</h3>
            <p className="text-center">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium</p>

        </Container>
    </>
    );
};

export default Result;