import React from "react";

// No me la
import Container from "react-bootstrap/Container";

import PohAPI from "../DAL/PohAPI";
import { Card } from "react-bootstrap";
import moment from "moment";

interface ITweetDisplayProps extends IBaseHumanitweetProps {
  humanitweetNft: IHumanitweetNft;
}

interface ITweetDisplayState {
  authorImage: string;
  authorDisplayName: string;
  authorFullName: string;
  text: string;
  date: string;
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
      authorImage: "",
      authorDisplayName: "Loading...",
      authorFullName: "Loading...",
      text: "Loading...",
      date: "Loading...",
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

  render() {
    return (
      <Card style={{ width: "100%" }}>
        {/* <Card.Img variant="bottom" src={this.state.authorImage} /> */}
        <Card.Body>
          <Container>
            <blockquote className="blockquote mb-0">
              <p> {this.state.text} </p>
              <footer className="blockquote-footer">
                {this.state.authorFullName} <br />
                <span className="fw-light">{this.state.date}</span>
              </footer>
            </blockquote>
          </Container>
          {/* <Button variant="primary">Go somewhere</Button> */}
        </Card.Body>
      </Card>
    );
  }
}
