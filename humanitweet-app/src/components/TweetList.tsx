import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import HumanitweetService from "../services/HumanitweetService";
import SupportTweetDialog from "./SupportTweetDialog";
import TweetDisplay from "./TweetDisplay";
import contractProvider from "../services/ContractProvider";
import { printIntrospectionSchema } from "graphql";
import { Container, Row, Col } from "react-bootstrap";

interface ITweetListProps extends IBaseHumanitweetProps {}

interface ITweetListState {
  tweets: IHumanitweetNft[];
  isLoading: boolean;
  supportTweetDialogVisible: boolean;
  supportTweetTokenId: number;
}

export default function TweetList(props: ITweetListProps) {
  const [supportTweetDialogOpts, setsupportTweetDialogOpts] = useState({
    show: false,
    tweetTokenId: "",
  });
  const [tweets, setTweets] = useState([] as IHumanitweetNft[]);
  const context = useWeb3React<Web3Provider>();

  useEffect(() => {
    async function getLatestTweets() {
      try {
        const tweetList = await HumanitweetService.getLatestTweets(
          10,
          contractProvider.getEthersProviderFromWeb3Provider(
            context.library?.provider!
          )
        );
        setTweets(tweetList);
      } catch (error) {
        console.error(error.message);
        console.error(error.stack);
      }
    }

    if (context.library) getLatestTweets();
  }, [context.library]);

  const handleBurnUBIsClicked = async (tokenId: string) => {

    setsupportTweetDialogOpts({
      show: true,
      tweetTokenId: tokenId,
    });
  };

  console.log("PROPS", props);

  return (
    <>
      <SupportTweetDialog
        show={supportTweetDialogOpts.show}
        tweetTokenId={supportTweetDialogOpts.tweetTokenId}
        onClose={() =>
          setsupportTweetDialogOpts({
            show: false,
            tweetTokenId: "",
          })
        }
        human={props.human}
      />{" "}
      <Container>
        {tweets.map((humanitweetNft, index) => (
          <Row key={index} className="justify-content-center">
            <Col>
              <TweetDisplay
                onBurnUBIsClicked={() =>
                  handleBurnUBIsClicked(humanitweetNft.tokenId)
                }
                humanitweetNft={humanitweetNft}
                {...props}
              />
              <hr />
            </Col>
          </Row>
        ))}
      </Container>
    </>
  );
}

class TweetListClass extends React.Component<ITweetListProps, ITweetListState> {
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
  }

  refreshTweets = async () => {
    this.setState({ isLoading: true });
    //HumanitweetService.getLatestTweets(10, nl)

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
  }
}
