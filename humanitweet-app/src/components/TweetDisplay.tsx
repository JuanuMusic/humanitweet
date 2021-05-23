import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

interface ITweetDisplayProps {
    tweet: ITweetData
}


export default class TweetDisplay extends React.Component<ITweetDisplayProps, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Container className="my-4 mx-1">
                <Row>
                    <Col>{this.props.tweet.author}</Col>
                </Row>
                <Row>
                    <Col>{this.props.tweet.text}</Col>
                </Row>
            </Container>
        )
    }
}