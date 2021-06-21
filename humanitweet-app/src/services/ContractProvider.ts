import { Contract, ethers } from "ethers";
import configService from "./configService";

const POH = require('../contracts/DummyProofOfHumanity.json');
const Humanitweet = require('../contracts/Humanitweet.json');

type EthersProviders = ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc;
function getEthersProvider(provider: EthersProviders) {
    return new ethers.providers.Web3Provider(provider);
}

const contractProvider = {
    async getContractForWrite(contractAddress: string, abi: any, fromAddress: string, ethersProvider: ethers.providers.Web3Provider) {
        // console.log("HUMANITWEET CONTRACT", Humanitweet);
        const signer = ethersProvider.getSigner(fromAddress);
        const pohWrapper = new Contract(contractAddress, abi, signer);
        return pohWrapper.connect(signer);
    },

    async getPOHContractForWrite(fromAddress: string, provider: EthersProviders) {
        const ethersProvider = getEthersProvider(provider);
        const network = await ethersProvider.getNetwork();
        const config = configService.getConfig(network.chainId);
        return await this.getContractForWrite(config.POHAddress, POH.abi, fromAddress, ethersProvider);
    },

    async getHumanitweetContractForWrite(fromAddress: string, provider: EthersProviders) {
        const ethersProvider = getEthersProvider(provider);
        const network = await ethersProvider.getNetwork();
        const config = configService.getConfig(network.chainId);
        return await this.getContractForWrite(config.HumanitweetAddress, Humanitweet.abi, fromAddress, ethersProvider);
    }
}

export default contractProvider;