import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle, drizzleReducers, IDrizzleOptions } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import "./App.css";
import Container from "react-bootstrap/Container";
import TweetEditor from "./components/TweetEditor";
import TweetList from "./components/TweetList";
import PohAPI from "./DAL/PohAPI";
import DummyPOHController from "./DummyPOHController";

const drizzle = new Drizzle(drizzleOptions as IDrizzleOptions);

interface AppProps {
  drizzleContext: any;
}
class App extends React.Component<AppProps, AppState> {
  private _pendingTransactionStacks: number[] = [];

  constructor(props: AppProps) {
    super(props);
    this.state = {
      account: "",
    };
  }

  async setAccount(account: string) {
    if (account !== this.state.account) {
      const registration = await PohAPI.profiles.getByAddress(account);

      if (registration && registration.registered) {
        this.setState({ account: account, userProfile: registration });
      }
    }
  }

  componentDidMount() {
    const self = this;
    ((window as any).ethereum as any).on(
      "accountsChanged",
      function (accounts: string[]) {
        self.setAccount(accounts[0]);
      }
    );

    if (!this.state.account && this.props.drizzleContext) {
      this.setAccount(this.props.drizzleContext.drizzleState.accounts[0]);
    }
  }

  componentDidUpdate() {
    console.log("UPDATED");
  }

  updateData = () => {
    //this.loadLatestTweets();
  };

  // loadLatestTweets = async () => {
  //   // Get drizzle state
  //   const { drizzleState } = this.props.drizzleContext;

  //   const contract = drizzleState.contracts["Humanitweet"];

  //   // Get the number of minted tokens
  //   const counter = await contract.methods.tokenCounter().call();
  //   const tweetNFTs: IHumanitweetNft[] = [];

  //   // Loop from the last to the first
  //   for (let tokenId = counter - 1; tokenId >= 0; tokenId--) {
  //     // Get NFT data from the contract and add it to the collection of tweets
  //     const humanitweetNft = await contract.methods
  //       .getHumanitweet(tokenId)
  //       .call();

  //     // Add the NFT to the list of nfts
  //     tweetNFTs.push({
  //       tokenId: tokenId,
  //       tokenURI: humanitweetNft.tokenURI,
  //       creationDate: new Date(parseInt(humanitweetNft.date, 10) * 1000),
  //     });
  //   }

  //   this.setState({ tweets: tweetNFTs });
  // };

  onNewTweetSent = (stackId: number) => {
    this._pendingTransactionStacks.push(stackId);
    //this.processPendingTxs();
  };

  render() {
    const { drizzle, drizzleState, initialized } = this.props.drizzleContext;
    console.log(this.props.drizzleContext);
    return (
      <Container className="p-3">
        <h1>Humanitweet</h1>
        <TweetEditor
          onNewTweetSent={this.onNewTweetSent}
          appState={this.state}
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
        <hr />
        <TweetList
          appState={this.state}
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
        <DummyPOHController
          appState={this.state}
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
      </Container>
    );
  }
}

export default class DrizzleApp extends React.Component<any, any> {
  render() {
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {(drizzleContext: any) => {
            const { drizzleState, initialized } = drizzleContext;
            if (!initialized || drizzleState.accounts.length === 0) {
              return "Loading...";
            }

            return <App drizzleContext={drizzleContext} />;
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    );
  }
}
