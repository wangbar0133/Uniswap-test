// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function dev() {
  const [owner, victim, player] = await ethers.getSigners();

  const USDC = await hre.ethers.getContractFactory("USDC");
  const usdc = await USDC.deploy();
  await usdc.deployed();
  await usdc.mint(owner.address, 100000100000);
  

  const USDT = await hre.ethers.getContractFactory("USDT");
  const usdt = await USDT.deploy();
  await usdt.deployed();
  await usdt.mint(owner.address, 100000100000);
  

  const WETH = await hre.ethers.getContractFactory("WETH");
  const weth = await WETH.deploy();
  await weth.deployed();
  await weth.mint(owner.address, 20000000);
  
  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(owner.address);
  await factory.deployed();
  
  await factory.createPair(usdt.address, usdc.address);
  const usdcUsdtPair = await factory.callStatic.getPair(usdc.address, usdt.address);

  await factory.createPair(weth.address, usdc.address);
  const wethUsdcPair = await factory.callStatic.getPair(weth.address, usdc.address);

  await factory.createPair(weth.address, usdt.address);
  const wethUsdtPair = await factory.callStatic.getPair(weth.address, usdt.address);

  const Router = await hre.ethers.getContractFactory("UniswapV2Router");
  const router = await Router.deploy(factory.address, owner.address, owner.address);
  await router.deployed();

  await usdc.approve(router.address, 9999999999999);
  await usdt.approve(router.address, 9999999999999);
  await weth.approve(router.address, 9999999999999);

  await router.addLiquidity(
    usdc.address,
    usdt.address,
    100000,
    100000,
    0,
    0,
    owner.address,
    1768095287
  );

  await router.addLiquidity(
    weth.address,
    usdt.address,
    100000,
    100000000,
    0,
    0,
    owner.address,
    1768095287
  );

  await router.addLiquidity(
    weth.address,
    usdc.address,
    100000,
    100000000,
    0,
    0,
    owner.address,
    1768095287
  );
  // Victims have 900000 wei usdc

  await usdc.mint(victim.address, 900000);
  await usdc.connect(victim).approve(router.address, 9999999999999);
  await router.connect(victim).swapExactTokensForTokens(
    900000,
    0,
    [usdc.address, usdt.address],
    victim.address,
    1768095287
  );

  await usdc.mint(player.address, 90000);

  console.log(`usdt: ${usdt.address}`);
  console.log(`weth: ${weth.address}`);
  console.log(`factory: ${factory.address}`);
  console.log(`usdcUsdtPair: ${usdcUsdtPair}`);
  console.log(`wethUsdcPair: ${wethUsdcPair}`);  
  console.log(`wethUsdtPair: ${wethUsdtPair}`);
  console.log(`router: ${router.address}`);
  console.log(`usdc: ${usdc.address}`);
}

async function main() {
    console.log(`\nStart deployment contract`);
    console.log(`Please wait...\n`)
    await dev();
}
  
// npx hardhat run --network localhost scripts/deploy.js
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
