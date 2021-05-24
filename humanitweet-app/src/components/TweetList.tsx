import React from "react";
import TweetDisplay from "./TweetDisplay";

interface ITweetListState {
  tweets: IHumanitweetNft[];
}

interface ITweetEditorProps extends IBaseHumanitweetProps{}

export default class TweetList extends React.Component<
  ITweetEditorProps,
  ITweetListState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      tweets: [],
    };
  }

  componentDidMount() {
    this.refreshTweets();
  }

  refreshTweets = async () => {
    const contract = this.props.drizzle.contracts["Humanitweet"];

    const counter = await contract.methods.tokenCounter().call();
    const tweets: IHumanitweetNft[] = [];
    for (let tokenId = counter - 1; tokenId >= 0; tokenId--) {
      const tokenURI = await contract.methods.tokenURI(tokenId).call();
      tweets.push({ tokenId: tokenId, tokenURI: tokenURI });
    }

    this.setState({ tweets: tweets });
  };

  render() {
    return this.state.tweets.map((humanitweetNft, index) => (
      <div key={index}>
        <TweetDisplay drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} humanitweetNft={humanitweetNft} />
        <hr />
      </div>
    ));
  }
}
