import React from "react";
import SupportTweetDialog from "./SupportTweetDialog";
import TweetDisplay from "./TweetDisplay";

interface ITweetListProps extends IBaseHumanitweetProps {}

interface ITweetListState {
  tweets: IHumanitweetNft[];
  isLoading: boolean;
  supportTweetDialogVisible: boolean;
  supportTweetTokenId: number;
}

export default class TweetList extends React.Component<
  ITweetListProps,
  ITweetListState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      supportTweetDialogVisible: false,
      supportTweetTokenId: -1,
      tweets: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.refreshTweets();
    this.subscribeTransferEvent();
  }

  subscribeTransferEvent() {
    // const drizzle = this.props.drizzle;
    // drizzle.contracts.Humanitweet.events.Transfer(
    //   (to: string, amount: number) => {
    //     this.refreshTweets();
    //   }
    // );
  }

  refreshTweets = async () => {
    this.setState({ isLoading: true });
    // const contract = this.props.drizzle.contracts["Humanitweet"];

    // // Get the number of minted tokens
    // const counter = await contract.methods.tokenCounter().call();
    // console.log("TOTAL TOKENS", counter);
    // const tweetNFTs: IHumanitweetNft[] = [];

    // // Loop from the last
    // for (let tokenId = counter - 1; tokenId >= 0; tokenId--) {
    //   // Get NFT data from the contract and add it to the collection of tweets
    //   const humanitweetNft = await contract.methods
    //     .getHumanitweet(tokenId)
    //     .call();

    //     console.log(humanitweetNft);

    //   // Add the NFT to the list of nfts
    //   tweetNFTs.push({
    //     tokenId: tokenId,
    //     tokenURI: humanitweetNft.tokenURI,
    //     creationDate: new Date(parseInt(humanitweetNft.date, 10) * 1000),
    //     supportGiven: humanitweetNft.supportGiven,
    //     supportCount: humanitweetNft.supportCount
    //   });
    //}

    //this.setState({ tweets: tweetNFTs, isLoading: false });
  };

  handleBurnUBIsClicked = async (tokenId: number) => {
        this.setState({
      supportTweetDialogVisible: true,
      supportTweetTokenId: tokenId,
    });
  };

  render() {
    if (this.state.isLoading) {
      return "Loading...";
    }
    return (
      <>
        <SupportTweetDialog
          show={this.state.supportTweetDialogVisible}
          tweetTokenId={this.state.supportTweetTokenId}
          onClose={() =>
            this.setState({
              supportTweetDialogVisible: false,
              supportTweetTokenId: -1,
            })
          }
          {...this.props}
        />
        {this.state.tweets.map((humanitweetNft, index) => (
          <div key={index}>
            {/* <TweetDisplay
              onBurnUBIsClicked={() => this.handleBurnUBIsClicked(humanitweetNft.tokenId)}
              appState={this.props.appState}
              drizzle={this.props.drizzle}
              drizzleState={this.props.drizzleState}
              humanitweetNft={humanitweetNft}
            /> */}
            <hr />
          </div>
        ))}
      </>
    );
  }
}
