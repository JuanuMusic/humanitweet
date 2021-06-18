import { IContract } from "@drizzle/store/types/IContract";

const Humanitweet = require("./contracts/Humanitweet.json");
const ProofOfHumanity = require("./contracts/DummyProofOfHumanity.json");
const UBI = require("./contracts/DummyUBI.json");
// import ComplexStorage from "./contracts/ComplexStorage.json";
// import SimpleStorage from "./contracts/SimpleStorage.json";
// import TutorialToken from "./contracts/TutorialToken.json";

const options = {
  // web3: {
  //   block: true,
  //   customProvider: Web3.givenProvider,
  // },
  contracts: [Humanitweet, ProofOfHumanity, UBI] as IContract[],
  // events: {
  //   SimpleStorage: ["StorageSet"],
  // },
};

export default options;
