interface IHumanitweetNft {
    tokenId: string;
    tokenURI: string;
    creationDate: Date;
    supportGiven: BigNumber;
    supportCount: BigNumber;
}

interface ITweetData {
    author: string;
    text: string;
}
