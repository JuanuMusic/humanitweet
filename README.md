# Humanitweet 🐤
A twitter-like social network for Human Beings only!

## Preface  (Why Humanitweet)?
**Social Networks**🌎 are a great evolution of Human Society to socialize through the internet. One of the fundamental problems of the current state, is that they are fully centralized. All the data and content generated through them, is collected and managed by the owners of the service.

Another problem is the amount of fake profiles that can be generated 🦹‍♂️, making social networks untrustworthy about the authors of the content.

Humanitweet is a twitter clone that runs on the Ethereum Blockchain ⛓️, and makes it a *MUST* that the user participating on it, is a Human being.

To achieve this, a user must be a registered and approved Human under the [Proof of Humanity registry](https://www.proofofhumanity.id/) to be able to generate a Humanitweet.

## How it works?
The Humanitweet is an ERC721. Everytime an address tries to create a new Humanitweet, the contract validates that the creator address is registered on the [Proof of Humanity registry](https://www.proofofhumanity.id/).

If the addres is an actual Human, a new NFT with symbol "HTWT" is minted and sent to the Human that created it, and a JSON file is generated with the tweet and the author, and uploaded to a decentralized storage system.

### Storage system
The storage system is still to be defined. A potential candidate for this could be [ARweave](https://www.arweave.org/) since it has the potential to store data for a long time (200 years) as opposed to [FileCoin](https://filecoin.io/) which requires monthly payments. **Other solutions suggestions are welcomed !🙌**

This part is important since it would mean that the HUman would need to pay for the storage of the NFT, so it must be thought pretty smartly 🧠.

###  Notice
This is a work in progress to learn about building a fully functioning Decentralized app.
PRs will be accepted to help improving the architecture.

### How to run it:
- Install truffle
- Deploy the contracts either to a local ethereum blockchain or to a test network (check `./humanitweet-contracts/truffle-config.js`)
- Run the react app inside the directory (`./humanitweet-app`) using `npm start`.

## How can I help?
This is still a Work in Progress so any kind of improvement is valid(architecture, protocol, contracts, frontend app, suggestions, ideas, etc).

- If you have a question, suggestion or idea, please, submit an Issude
- If you have an code improvement, fork the repository and sned a PR so that we can review it, discuss it, and potentially merge it.
