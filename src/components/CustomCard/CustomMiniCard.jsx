import React from "react";
import { Card, Col, ProgressBar, Row } from "react-bootstrap";

class CustomMiniCard extends React.Component {
    render() {
        const { name, type, value, max, icon, color } = this.props || null;
        const iconX = `nc-icon ${icon} ${color}`;
        let Content = null;
        let percent = 0;
        if (type == 'progress') {
            if (value && max) {
                percent = (value / max) * 100;
            }

            Content = (
                <>
                    <Col sm="auto" className="d-flex align-items-center justify-content-center">
                        <h5 className="text-center m-0 font-weight-bold">{percent}%</h5>
                    </Col>
                    <Col sm="6" className="d-flex align-items-center justify-content-center">
                        <ProgressBar className="w-100" now={percent} />
                    </Col>
                    <Col sm="2" className="align-items-center justify-content-center d-flex">
                        <i className={iconX} style={{ fontSize: "3em" }}></i>
                    </Col>
                </>
            )
        } else if (type == 'text') {
            Content = (
                <>
                    <Col sm="8" className="d-flex align-items-center">
                        <h5 className="m-0 font-weight-bold">{value}</h5>
                    </Col>
                    <Col sm="2" className="align-items-center justify-content-center d-flex">
                        <i className={iconX} style={{ fontSize: "3em" }}></i>
                    </Col>
                </>
            )
        }

        return (
            <Col xl="3" md="6">
                <Card className="shadow">
                    <Card.Body>
                        <Row>
                            <Col>
                                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">{name}</div>
                            </Col>
                        </Row>
                        <Row className="py-2">
                            {Content}
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        )
    }
}
export default CustomMiniCard;