import React, { useEffect, useReducer, useState } from "react";
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from "@web3-react/core";
import drizzleOptions from "./drizzleOptions";
import "./App.css";
import Container from "react-bootstrap/Container";
import TweetEditor from "./components/TweetEditor";
import TweetList from "./components/TweetList";
import PohAPI from "./DAL/PohAPI";
import DummyPOHController from "./DummyPOHController";
//import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";
//import useEagerConnect from "./hooks/useEagerConnect";
import useHuman from "./hooks/useHuman";
import { Button, Col, Row } from "react-bootstrap";
import ConnectWalletDialog from "./components/ConnectWalletDialog";
import { convertToObject } from "typescript";
import configService, { IConfiguration } from "./services/configService";

//const drizzle = new Drizzle(drizzleOptions as IDrizzleOptions);

interface IAppProps {}

interface IAppState {
  config: IConfiguration | undefined;
}

function appReducer(state: IAppState, action: any) {}

export default function App(props: IAppProps) {
  const [appState, dispatch] = useReducer<any, IAppState>(
    appReducer,
    {} as IAppState,
    (s: IAppState) => {}
  );

  const [isConnectDialogVisible, setIsConnectDialogVisible] = useState(false);
  const human = useHuman();
  const _pendingTransactionStacks: number[] = [];
  const context = useWeb3React<Web3Provider>();

  // CONFIG 
  // useEffect(() => {
  //   if(context.chainId && context.library.provider && context.libr)
  //   const config = configService.getConfig();
  //   dispatch({ con });
  // }, []);

  const onNewTweetSent = (stackId: number) => {
    _pendingTransactionStacks.push(stackId);
    //this.processPendingTxs();
  };

  console.log("HUMAN", human);
  return (
    <Container className="p-3">
      <Row>
        <Col>
          <h1>Humanitweet</h1>
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <Button className="" onClick={() => setIsConnectDialogVisible(true)}>
            {context.active
              ? context.account?.substring(0, 4) +
                "..." +
                context.account?.substring(context.account.length - 4)
              : "Connect"}
          </Button>
        </Col>
      </Row>
      <TweetEditor onNewTweetSent={onNewTweetSent} human={human} />
      <hr />
      <TweetList human={human} />
      <DummyPOHController human={human} />
      <ConnectWalletDialog
        show={isConnectDialogVisible}
        onHide={() => setIsConnectDialogVisible(false)}
      />
    </Container>
  );
}
