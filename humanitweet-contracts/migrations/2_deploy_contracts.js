const Humanitweet = artifacts.require("Humanitweet");
const DummyProofOfHumanity = artifacts.require("DummyProofOfHumanity");


const DEPLOYER_ACCOUNT = "0x356BD7DA64E00FB8a1D4DC85eA26756bd13c9c90";
module.exports = async function(deployer) {
  console.log("STARTING MIGRATION...")
  await deployer.deploy(DummyProofOfHumanity, {from: DEPLOYER_ACCOUNT});
  await deployer.deploy(Humanitweet,DummyProofOfHumanity.address, {from: DEPLOYER_ACCOUNT});
  console.log("...COMPLETED MIGRATION")
  console.log("Dummy POH", DummyProofOfHumanity.address);
  console.log("Humanitweet", Humanitweet.address);
}
