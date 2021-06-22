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
import HumanitweetService from "../services/HumanitweetService";

interface ITweetDisplayProps extends IBaseHumanitweetProps {
  humanitweetNft: IHumanitweetNft;
  onBurnUBIsClicked(tokenId: number): any;
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
      authorImage:
        "https://demos.creative-tim.com/argon-dashboard-pro/assets/img/theme/team-4.jpg",
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
      const tweetFile = await fetch(
        `http://127.0.0.1:8080/ipfs/${this.props.humanitweetNft.tokenURI.replace(
          "ipfs://",
          ""
        )}`
      );
      const data: ITweetData = await tweetFile.json();

      const userRegistration =
        (await PohAPI.profiles.getByAddress(data.author)) ||
        ({} as POHProfileModel);
      this.setState({
        authorDisplayName: userRegistration.display_name || data.author,
        authorFullName: `${userRegistration.first_name} ${userRegistration.last_name}`,
        authorImage:
          userRegistration.photo ||
          "https://demos.creative-tim.com/argon-dashboard-pro/assets/img/theme/team-4.jpg",
        text: data.text,

        date:
          this.props.humanitweetNft.creationDate &&
          moment(this.props.humanitweetNft.creationDate).format("MMM DD, Y"),
      });
    } catch (error) {
      console.error("ERRRR", error);
    }
  }

  handleBurnUBIsClicked = async () => {
    this.props.onBurnUBIsClicked &&
      this.props.onBurnUBIsClicked(this.state.tokenID);
  };

  render() {
    return (
      <Card style={{ width: "100%", maxWidth: "700px" }} className="mx-auto">
        <Card.Body className="px-1 py-2">
          <Container>
            <Row>
              <Col className="d-flex">
                <img className="avatar mr-2" src={this.state.authorImage} />
                <div>
                  <span className="text-dark">
                    <strong>{this.state.authorDisplayName}</strong>
                  </span>{" "}
                  <br />
                  <blockquote className="blockquote mb-0">
                    <p className="humanitweet-text text-dark">
                      {" "}
                      {this.state.text}{" "}
                    </p>
                    <footer className="blockquote-footer">
                      <span className="fw-light">{this.state.date}</span>
                    </footer>
                  </blockquote>
                </div>
              </Col>
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
                    <Gem />{" "}
                    <span>
                      {this.props.humanitweetNft.supportGiven.toString()}
                    </span>
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
