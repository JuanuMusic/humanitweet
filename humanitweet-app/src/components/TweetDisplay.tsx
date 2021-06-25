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

import { FaFire, FaUsers } from "react-icons/fa";
import HumanitweetService from "../services/HumanitweetService";
import { ethers } from "ethers";

interface ITweetDisplayProps extends IBaseHumanitweetProps {
  humanitweetNft: IHumanitweetNft;
  onBurnUBIsClicked(tokenId: number): any;
}

interface ITweetDisplayState {
  tokenID: number;
  authorImage: string | undefined;
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
interface IGiveSupportButtonProps {
  onClick(e: any): void;
  supportGiven: string;
  className?: string;
}

/**
 * The button used to give support to a tweet.
 * @param props A
 * @returns
 */
function GiveSupportButton(props: IGiveSupportButtonProps) {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id="immortalize_tooltip">
          Immortalize this tweet by burning some UBIs!
        </Tooltip>
      }
    >
      <div className={props.className}>
        <Button variant="outline-danger" onClick={props.onClick}>
          <div className="d-flex justify-content-cente align-items-center">
            <FaFire />
            <span>{props.supportGiven}</span>
          </div>
        </Button>
      </div>
    </OverlayTrigger>
  );
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
    HumanitweetService.loadHumanitweetFromNFT(this.props.humanitweetNft);
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
            <Row>
              <Col className="d-flex align-items-start">
                <GiveSupportButton
                  className="align-self-center"
                  onClick={this.handleBurnUBIsClicked}
                  supportGiven={
                    this.props.humanitweetNft.supportGiven &&
                    ethers.utils.formatEther(
                      this.props.humanitweetNft.supportGiven
                    )
                  }
                />

                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id="supporters_hint">
                        Number of humans that gave support to this humanitweet.
                      </Tooltip>
                    }
                  >
                    <div className="d-inline-flex text-dark align-self-center justify-content-center px-2 mx-2">
                      <FaUsers />
                      <span>
                        {(this.props.humanitweetNft.supportCount &&
                          this.props.humanitweetNft.supportCount.toString()) ||
                          "0"}{" "}
                        supporters
                      </span>
                    </div>
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
