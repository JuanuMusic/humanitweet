import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import IPFSStorageService from "../services/IPFSStorageService";
import HumanitweetService from "../services/HumanitweetService";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers'
interface ITweetEditorState {
  text: string;
}

interface ITweetEditorProps extends IBaseHumanitweetProps {
  disabled?: boolean;
  onNewTweetSent(stackId: number): void;
}

export default function TweetEditor(props: ITweetEditorProps) {
  const [tweetText, setTweetText] = useState("");
  const [isEditorEnabled, setIsEditorEnabled] = useState(false);
  const [isSendButtonEnabled, setIsSendButtonEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { chainId, library } = useWeb3React();
  const context = useWeb3React<Web3Provider>()

  useEffect(() => {
    setIsEditorEnabled(
      props.human &&
        props.human.profile &&
        props.human.profile.registered &&
        !isLoading
    );
  }, [props.human, props.human.profile, props.human.profile.registered, isLoading]);

  useEffect(() => {
    setIsSendButtonEnabled(
      props.human &&
        props.human.profile &&
        props.human.profile.registered &&
        typeof tweetText === "string" && 
        tweetText !== "" &&
        !isLoading
    );
  }, [props.human, isLoading, tweetText]);

  const handleSendTweet = async () => {
    // Generate the tweet data with the content and the author address
    const tweetData: ITweetData = {
      text: tweetText,
      author: props.human.address,
    };

    setIsLoading(true);
    // Publish the tyweet through the Humanitweet Service
    // console.log("CONTEXT", context);
    // const provider = await context.connector?.getProvider();
    // console.log("PROVIDER", provider);
    await HumanitweetService.publishTweet(tweetData, new Web3Provider(await context.library?.provider!));

    setTweetText("");
    setIsLoading(false);
  };

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <FormGroup controlId="formTweetEditor">
            <FormControl
              as="textarea"
              placeholder="What's happening?"
              rows={3}
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              disabled={!isEditorEnabled}
            ></FormControl>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="d-flex justify-content-end">
          <Button disabled={!isSendButtonEnabled} onClick={handleSendTweet}>
            Tweet
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
