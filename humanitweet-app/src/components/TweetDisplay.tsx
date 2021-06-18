import React from "react";

// No me la
import Container from "react-bootstrap/Container";

import PohAPI from "../DAL/PohAPI";
import {
  Button,
  Card,
  Col,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import moment from "moment";
import { Gem } from "react-bootstrap-icons";
import HumanitweetService from "../services/HumanitweetOnChainService";

interface ITweetDisplayProps extends IBaseHumanitweetProps {
  humanitweetNft: IHumanitweetNft;
  onBurnUBIsClicked(tokenId: number) : any;
}

interface ITweetDisplayState {
  tokenID: number;
  authorImage: string;
  authorDisplayName: string;
  authorFullName: string;
  text: string;
  date: string;
  supportGiven: number;
}

interface IEvidence {
  fileURI: string;
  name: string;
}

interface IRegistration {
  name: string;
  firstName: string;
  lastName: string;
  bio: string;
  photo: string;
  video: string;
}

export default class TweetDisplay extends React.Component<
  ITweetDisplayProps,
  ITweetDisplayState
> {

  constructor(props: ITweetDisplayProps) {
    super(props);
    this.state = {
      tokenID: -1,
      authorImage: "",
      authorDisplayName: "Loading...",
      authorFullName: "Loading...",
      text: "Loading...",
      date: "Loading...",
      supportGiven: 0,
    };
  }

  componentDidMount() {
    this.loadHumanitweet();
  }

  async getEvidence(uri: string) {
    const request = await fetch(uri);
    const registrationFile: IEvidence = await request.json();
    return registrationFile;
  }

  async getFromEvidence<TDestination>(evidence: IEvidence) {
    const request = await fetch(evidence.fileURI);
    const dest: TDestination = await request.json();
    return dest;
  }

  async getRegistration(uri: string) {
    const evidence = await this.getEvidence(uri);
    return await this.getFromEvidence<IRegistration>(evidence);
  }

  async loadHumanitweet() {
    try {
      const tweetFile = await fetch(this.props.humanitweetNft.tokenURI);
      const data: ITweetData = await tweetFile.json();

      const userRegistration = await PohAPI.profiles.getByAddress(data.author);

      if (!userRegistration) return;

      this.setState({
        authorDisplayName: userRegistration.display_name,
        authorFullName: `${userRegistration.first_name} ${userRegistration.last_name}`,
        authorImage: userRegistration.photo,
        text: data.text,
        
        date:
          this.props.humanitweetNft.creationDate &&
          moment(this.props.humanitweetNft.creationDate).format("MMM DD, Y"),
      });
    } catch (error) {
      console.error("ERRRR", error);
    }
    // const submission = await PohOnChainDAL.getSubmissionRegistration(
    //   data.author
    // );

    // if (
    //   submission.requests &&
    //   submission.requests.length > 0 &&
    //   submission.requests[0].evidence &&
    //   submission.requests[0].evidence.length > 0
    // ) {

    //   const registration = await this.getRegistration(
    //     submission.requests[0].evidence[0].URI
    //   );
    //   this.setState({ author: registration.name, text: data.text });
    // }
  }

  handleBurnUBIsClicked = async () => {
    this.props.onBurnUBIsClicked && this.props.onBurnUBIsClicked(this.state.tokenID);
  }

  render() {
    return (
      <Card style={{ width: "100%" }}>
        {/* <Card.Img variant="bottom" src={this.state.authorImage} /> */}
        <Card.Body>
          <Container>
            <Row>
              <blockquote className="blockquote mb-0">
                <p> {this.state.text} </p>
                <footer className="blockquote-footer">
                  {this.state.authorFullName} <br />
                  <span className="fw-light">{this.state.date}</span>
                </footer>
              </blockquote>
            </Row>
            <Row className="align-items-center">
              <Col>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="immortalize_tooltip">
                      Immortalize this tweet by burning some UBIs!
                    </Tooltip>
                  }
                >
                  <Button onClick={this.handleBurnUBIsClicked}>
                    <Gem /> <span>{this.props.humanitweetNft.supportGiven}</span>
                  </Button>
                </OverlayTrigger>
              </Col>
            </Row>
          </Container>
          {/* <Button variant="primary">Go somewhere</Button> */}
        </Card.Body>
      </Card>
    );
  }
}
