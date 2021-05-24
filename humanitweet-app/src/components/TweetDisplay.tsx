import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import StorageService from "../services/StorageService";

interface ITweetDisplayProps extends IBaseHumanitweetProps {
  humanitweetNft: IHumanitweetNft;
}

interface ITweetDisplayState {
    author: string;
    text: string;
}

export default class TweetDisplay extends React.Component<
  ITweetDisplayProps,
  ITweetDisplayState
> {
  constructor(props: ITweetDisplayProps) {
    super(props);
    this.state = {
        author: "Loading...",
        text: "Loading..."
    };
  }

  componentDidMount() {
    this.loadHumanitweet();
  }

  async loadHumanitweet() {
    const tweetFile = await fetch(this.props.humanitweetNft.tokenURI);
    const data: ITweetData = await tweetFile.json();
    this.setState({author: data.author, text: data.text});
  }

  render() {
    return (
      <Container className="my-4 mx-1">
        <Row>
          <Col><strong>{this.state.author}</strong></Col>
        </Row>
        <Row>
          <Col>{this.state.text}</Col>
        </Row>
      </Container>
    );
  }
}
