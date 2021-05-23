import React from "react";
import TweetDisplay from "./TweetDisplay";

interface ITweetListState {
    tweets: ITweetData[]
}

export default class TweetList extends React.Component<any, ITweetListState> {
    constructor(props: any) {
        super(props);

        this.state = {
            tweets: []
        };
    }

    componentDidMount() {
        this.refreshTweets();
    }

    refreshTweets = async () => {
        const loadedTweets: ITweetData[] = [
            {text: "Test hardcoded Tweet", author: "juanumusic"},
            {text: "Another hardcoded tweet", author: "another_user"},
        ]
        this.setState({tweets: loadedTweets});
    }

    render() {
        return(
            this.state.tweets.map(tweet => <div><TweetDisplay tweet={tweet} /><hr /></div>)
        )
    }
}