import { Contract, ethers } from "ethers";
import configService from "./configService";

const DummyPOHContract = require('../contracts/DummyProofOfHumanity.json');
const HumanitweetContract = require('../contracts/Humanitweet.json');

export type EthersProviders = ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc;


const contractProvider = {
    
    /**
     * Returns an instance of the ethers provider from a wallet provider
     * @param provider The wallet provider
     * @returns 
     */
    getEthersProviderFromWeb3Provider(provider: EthersProviders) {
        return new ethers.providers.Web3Provider(provider);
    },
    /**
     * Returns an instance of a contract for read only
     * @param contractAddress The address of the contract
     * @param abi Contract's ABI
     * @param ethersProvider Web3Provider
     * @returns 
     */
    async getContractForRead(contractAddress: string, abi: any, ethersProvider: ethers.providers.Web3Provider) : Promise<Contract>  {
        const contract = new Contract(contractAddress, abi, ethersProvider);
        return contract.connect(ethersProvider)
    },

    /**
     * Returns an instance of a contract for executing write operations
     * @param contractAddress 
     * @param abi 
     * @param fromAddress 
     * @param ethersProvider 
     * @returns 
     */
    async getContractForWrite(contractAddress: string, abi: any, fromAddress: string, ethersProvider: ethers.providers.Web3Provider) : Promise<Contract>  {
        const signer = ethersProvider.getSigner(fromAddress);
        const contract = new Contract(contractAddress, abi, signer);
        return contract.connect(signer);
    },

    async getDummyPOHContractForWrite(fromAddress: string, provider: ethers.providers.Web3Provider) : Promise<Contract>  {
        const network = await provider.getNetwork();
        const config = configService.getConfig(network.chainId);
        return await this.getContractForWrite(config.POHAddress, DummyPOHContract.abi, fromAddress, provider);
    },

    async getHumanitweetContractForWrite(fromAddress: string, provider: ethers.providers.Web3Provider) : Promise<Contract>  {
        const network = await provider.getNetwork();
        const config = configService.getConfig(network.chainId);
        return await this.getContractForWrite(config.HumanitweetAddress, HumanitweetContract.abi, fromAddress, provider);
    },

    /**
     * Returns an instance of the HumanitweetContract to execute read operations.
     * @param provider Web3Provider
     * @returns 
     */
    async getHumanitweetContractForRead(provider: ethers.providers.Web3Provider) : Promise<Contract> {
        const network = await provider.getNetwork();
        const config = configService.getConfig(network.chainId);
        return await this.getContractForRead(config.HumanitweetAddress, HumanitweetContract.abi, provider);
    }
}

export default contractProvider;