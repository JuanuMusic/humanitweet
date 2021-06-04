const Humanitweet = artifacts.require("Humanitweet");
const DummyProofOfHumanity = artifacts.require("DummyProofOfHumanity");


module.exports = async function(deployer) {
  console.log("STARTING MIGRATION...")
  await deployer.deploy(DummyProofOfHumanity, "0x2ad91063e489CC4009DF7feE45C25c8BE684Cf6a");
  await deployer.deploy(Humanitweet,DummyProofOfHumanity.address);
  console.log("...COMPLETED MIGRATION")
  console.log("Dummy POH", DummyProofOfHumanity.address);
  console.log("Humanitweet", Humanitweet.address);
}
