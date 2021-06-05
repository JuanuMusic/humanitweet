import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import IPFSStorageService from "../services/IPFSStorageService";
import HumanitweetService from "../services/HumanitweetOnChainService";

interface ITweetEditorState {
  text: string;
}

interface ITweetEditorProps extends IBaseHumanitweetProps {
  disabled?: boolean;
  onNewTweetSent(stackId: number): void;
}

export default class TweetEditor extends React.Component<
  ITweetEditorProps,
  ITweetEditorState
> {
  constructor(props: ITweetEditorProps) {
    super(props);

    this.state = {
      text: "",
    };
  }

  isDisabled() {
    return (
      !this.props.appState ||
      !this.props.appState.userProfile ||
      !this.props.appState.userProfile.registered
    );
  }

  /**
   * Handler for when user clicks on the "Send tweet" button.
   */
  handleSendTweet = async () => {

    // Generate the tweet data with the content and the author address
    const tweetData: ITweetData = {
      text: this.state.text,
      author: this.props.appState.account,
    };

    // Publish the tyweet through the Humanitweet Service
    await HumanitweetService.publishTweet(tweetData, this.props.drizzle);

    this.setState({ text: "" });
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
                value={this.state.text}
                onChange={(e) => this.setState({ text: e.target.value })}
                disabled={this.isDisabled()}
              ></FormControl>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="d-flex justify-content-end">
            <Button disabled={this.isDisabled()} onClick={this.handleSendTweet}>
              Tweet
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
