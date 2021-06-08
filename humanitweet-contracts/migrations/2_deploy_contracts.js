const Humanitweet = artifacts.require("Humanitweet");
const DummyProofOfHumanity = artifacts.require("DummyProofOfHumanity");
const DummyUBI = artifacts.require("DummyUBI");


module.exports = async function (deployer) {
  console.log("STARTING MIGRATION...")
  await deployer.deploy(DummyUBI);
  await deployer.deploy(DummyProofOfHumanity, "0x2ad91063e489CC4009DF7feE45C25c8BE684Cf6a", DummyUBI.address);
  await deployer.deploy(Humanitweet, DummyProofOfHumanity.address, DummyUBI.address);
  console.log("...COMPLETED MIGRATION")
  console.log("Dummy POH", DummyProofOfHumanity.address);
  console.log("Humanitweet", Humanitweet.address);
}
