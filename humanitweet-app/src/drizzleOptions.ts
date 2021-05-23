import { IContract } from "@drizzle/store/types/IContract";
import Web3 from "web3";
import ComplexStorage from "./contracts/ComplexStorage.json";
import SimpleStorage from "./contracts/SimpleStorage.json";
import TutorialToken from "./contracts/TutorialToken.json";

const options = {
  // web3: {
  //   block: true,
  //   customProvider: Web3.givenProvider,
  // },
  contracts: [SimpleStorage, ComplexStorage, TutorialToken] as unknown[],
  events: {
    SimpleStorage: ["StorageSet"],
  },
};

export default options;
