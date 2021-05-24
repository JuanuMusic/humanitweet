import React, { useState } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle, drizzleReducers, IDrizzleOptions } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import "./App.css";
import Container from "react-bootstrap/Container";
import TweetEditor from "./components/TweetEditor";
import TweetList from "./components/TweetList";
import WalletConnector from "./components/WalletConnector";

interface IAppState {
  isUserConnected?: boolean;
}

const drizzle = new Drizzle(drizzleOptions as IDrizzleOptions);

export default function App() {
  // const [isUserConnected, setIsUserConnected] = useState(false);

  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext: any) => {
          const { drizzle, drizzleState, initialized } = drizzleContext;
          console.log("Drizzle", drizzle);
          console.log("Drizzle State:", drizzleState);
          if (!initialized || drizzleState.accounts.length === 0) {
            return "Loading...";
          }

          return (
            <Container className="p-3">
              <h1>Humanitweet</h1>
              <TweetEditor drizzle={drizzle} drizzleState={drizzleState} disabled={drizzleState.accounts.length === 0} />
              <hr />
              <TweetList drizzle={drizzle} drizzleState={drizzleState} />
              {/* <MyComponent drizzle={drizzle} drizzleState={drizzleState} /> */}
            </Container>
          );
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}
