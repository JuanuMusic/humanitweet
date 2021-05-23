import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

interface ITweetEditorState {
  text: string;
}

interface ITweetEditorProps {
  disabled?: boolean;
  drizzle: any;
  drizzleState: any;
}

export default class TweetEditor extends React.Component<
  ITweetEditorProps,
  ITweetEditorState
> {
  constructor(props: ITweetEditorProps) {
    super(props);
  }

  handleSendTweet = () => {
    //const contract = this.props.drizzle.contracts["Humanitweet"]
    console.log("Sending text", this.state.text);
    //contract.methods.sendTweet(this.state.text);
  };

  render() {
    return (
      <Container>
        <Row>
          <Col xs={12}>
            <FormGroup controlId="formTweetEditor">
              <FormControl
                as="textarea"
                placeholder="What's happening?"
                rows={3}
                onChange={(e) => this.setState({ text: e.target.value })}
                disabled={this.props.disabled}
              ></FormControl>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="d-flex justify-content-end">
            <Button
              disabled={this.props.disabled}
              onClick={this.handleSendTweet}
            >
              Tweet
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
