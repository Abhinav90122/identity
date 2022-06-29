const NFTArt = artifacts.require('NFTArt');

module.exports = async function (deployer) {
  await deployer.deploy(
    NFTArt,
    'NFT ART',
    'NArt',
    '0x2E9e13eD6875fB0C449CC822836Bca788af06F37'
  );
  await NFTArt.deployed();
};
