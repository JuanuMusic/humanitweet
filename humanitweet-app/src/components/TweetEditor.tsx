import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import StorageService from "../services/StorageService";

interface ITweetEditorState {
  text: string;
  isHuman: boolean
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

    this.state = {
      isHuman: false,
      text: ""
    };
  }

  componentDidMount() {
    this.initialize();
  }

  initialize = async () => {
    const pohContract = this.props.drizzle.contracts["DummyProofOfHumanity"];
    const isHuman = await pohContract.methods.isRegistered(this.props.drizzleState.accounts[0]).call();
    console.log("Is human?",isHuman);  
    this.setState({isHuman: isHuman});
  }

  handleSendTweet = async () => {

    const tweetData : ITweetData = {
      text: this.state.text,
      author: this.props.drizzleState.accounts[0] as string
    }
    const storage = new StorageService();

    const result = await storage.uploadTweet(tweetData);
    console.log("TODO: store humanitweet on contract with url",`http://127.0.0.1:8080/ipfs/${result.path}`);
    console.log(this.props.drizzle.contracts);
    const tweetContract = this.props.drizzle.contracts["Humanitweet"];
    
    const callResponse = await tweetContract.methods.publishHumanitweet(`http://127.0.0.1:8080/ipfs/${result.path}`).send({from: this.props.drizzleState.accounts[0]});;
    console.log(callResponse);
    
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
                disabled={this.props.disabled || !this.state.isHuman}
              ></FormControl>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="d-flex justify-content-end">
            <Button
              disabled={this.props.disabled || !this.state.isHuman}
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
